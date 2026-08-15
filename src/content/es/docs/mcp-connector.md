---
title: "Conector MCP"
description: "Conecta un cliente MCP a Expense Budget Tracker con OAuth para consultar o actualizar tus datos financieros de forma segura."
---

## Descripción general

Expense Budget Tracker ofrece un conector alojado para Model Context Protocol (MCP) en:

`https://mcp.expense-budget-tracker.com/mcp`

El punto de conexión usa Streamable HTTP y OAuth. Introduce esta URL en un cliente MCP que admita servidores Streamable HTTP remotos y el descubrimiento de OAuth. El flujo de autorización abre el navegador para que inicies sesión y apruebes el acceso.

El conector no usa claves de API. Sus credenciales son los tokens de acceso y actualización de OAuth. La `ApiKey` de larga duración descrita en la [referencia de la API para agentes](/es/docs/api/) pertenece a otra integración HTTP directa y el punto de conexión MCP no la acepta.

## Descubrimiento de OAuth y conexión

El conector alojado publica los metadatos del recurso protegido en:

`https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`

Esos metadatos remiten al cliente al servidor de autorización, cuyos metadatos están disponibles en:

`https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`

Un cliente compatible sigue este flujo:

1. Se conecta a `https://mcp.expense-budget-tracker.com/mcp` y descubre los metadatos del recurso protegido.
2. Se registra dinámicamente como cliente OAuth público. No se usa ningún secreto de cliente.
3. Inicia el flujo Authorization Code y abre la URL de autorización en el navegador del usuario.
4. Usa PKCE en cada solicitud de autorización. El único método de desafío de código admitido es `S256`.
5. Solicita `expenses:read`. Añade `expenses:write` solo si necesita llamar a `sql_execute`.
6. Intercambia el código de autorización por tokens de acceso y actualización, y después renueva el acceso cuando sea necesario.

No copies tokens en prompts, conversaciones, archivos de código fuente ni registros. Guárdalos únicamente en el almacén de credenciales del cliente MCP.

## Ámbitos

- `expenses:read` es obligatorio. Permite descubrir espacios de trabajo, consultar el esquema y ejecutar consultas de solo lectura.
- `expenses:write` es opcional. Habilita por separado la herramienta destructiva `sql_execute`.

Usa el conjunto mínimo de ámbitos que requiera la tarea. Un cliente que solo analiza datos o genera informes debe solicitar `expenses:read` sin `expenses:write`.

## Herramientas

### `list_workspaces`

Enumera los espacios de trabajo disponibles para el usuario que ha iniciado sesión. Usa el identificador devuelto para definir claramente el destino antes de leer o cambiar datos.

### `get_schema`

Devuelve las relaciones y columnas que MCP expone en el espacio de trabajo elegido. Llámala antes de escribir SQL en lugar de dar por supuestos los nombres de tablas o columnas.

### `sql_query`

Ejecuta una consulta SQL restringida y de solo lectura en el espacio de trabajo elegido. Una separación de solo lectura en la base de datos también protege esta ruta. Los resultados se limitan a 100 filas y la ejecución tiene un plazo máximo de 20 segundos.

### `sql_execute`

Ejecuta SQL restringido que modifica datos en el espacio de trabajo elegido. Esta herramienta es destructiva y requiere el ámbito independiente `expenses:write`. Confirma el espacio de trabajo y revisa la instrucción exacta antes de aprobar una llamada.

El servidor MCP completo no es de solo lectura porque expone `sql_execute`. Las garantías de solo lectura se aplican específicamente a `sql_query` y a su separación en la base de datos.

## Uso seguro

1. Llama a `list_workspaces` y confirma con el usuario el espacio de trabajo correcto.
2. Llama a `get_schema` antes de generar SQL.
3. Usa `sql_query` para inspecciones, totales, conciliaciones e informes.
4. Solicita `expenses:write` solo cuando la tarea deba modificar datos.
5. Antes de usar `sql_execute`, muestra la instrucción exacta y el efecto esperado; después vuelve a confirmar el espacio de trabajo.
6. Tras una escritura, usa `sql_query` para verificar el resultado.

El servidor restringe la superficie SQL y las relaciones expuestas. Estos controles complementan la revisión cuidadosa del SQL generado, pero no la sustituyen.

## Límites

- 100 filas como máximo en los resultados SQL
- plazo de ejecución de 20 segundos
- acceso limitado a los espacios de trabajo disponibles para el usuario que ha iniciado sesión
- `sql_query` usa una superficie SQL restringida y una separación de solo lectura en la base de datos
- `sql_execute` requiere `expenses:write` además del ámbito de lectura obligatorio

## Privacidad y autoalojamiento

Un cliente MCP autorizado puede leer datos financieros y, con `expenses:write`, modificarlos. Revisa la [Política de privacidad](/es/privacy/) y la política de tratamiento de datos del cliente antes de conectarlo.

Las URL alojadas anteriores solo se aplican al servicio gestionado de Expense Budget Tracker. Para tu propio despliegue, empieza por la [guía de autoalojamiento](/es/docs/self-hosting/) y configura el punto de conexión MCP y los metadatos de OAuth para tus dominios. La implementación está disponible en el [repositorio de código fuente](https://github.com/kirill-markin/expense-budget-tracker).
