---
title: Guía de MCP
description: Conecta un cliente de IA compatible al servidor MCP remoto de Expense Budget Tracker y conoce sus permisos OAuth, herramientas y límites de datos.
---

Expense Budget Tracker ofrece un único endpoint MCP remoto alojado:

```text
https://mcp.expense-budget-tracker.com/mcp
```

Usa esta misma URL en cualquier cliente compatible. El servidor alojado utiliza Streamable HTTP y OAuth 2.1; este endpoint no acepta claves de API.

## Clientes compatibles

El endpoint funciona con ChatGPT y otros clientes MCP que admitan todo lo siguiente:

- servidores MCP remotos mediante Streamable HTTP;
- el flujo de código de autorización de OAuth 2.1 con PKCE; y
- el Registro Dinámico de Clientes de OAuth.

Claude, Codex, OpenClaw y otros clientes pueden usar el mismo endpoint cuando su versión actual admite ese transporte remoto y flujo de autenticación. Un cliente que solo admite servidores locales por `stdio` no puede conectarse directamente al endpoint alojado.

## Conexión y autorización

1. Añade `https://mcp.expense-budget-tracker.com/mcp` como servidor MCP remoto personalizado en tu cliente.
2. El cliente descubre el recurso protegido y el servidor de autorización, y registra su nombre y las URL de redirección mediante Registro Dinámico de Clientes.
3. El navegador abre el inicio de sesión y el consentimiento de Expense Budget Tracker. Inicia sesión, revisa el nombre del cliente y los permisos solicitados, y aprueba solo el acceso que quieras conceder.
4. El cliente intercambia el código de autorización mediante PKCE y se conecta con credenciales de acceso de corta duración. No tienes que copiar ningún token al cliente.
5. Pide al cliente que llame a `list_workspaces` antes de leer o cambiar datos financieros.

El servidor de autorización puede conceder estos permisos:

| Permiso | Acceso |
| --- | --- |
| `expenses:read` | Enumerar espacios de trabajo, inspeccionar el esquema permitido y consultar datos financieros. |
| `expenses:write` | Ejecutar un `INSERT`, `UPDATE` o `DELETE` permitido mediante `sql_execute`. El acceso de escritura es independiente del de lectura. |

Una conexión de solo lectura recibe `expenses:read`. Una conexión con escritura recibe tanto `expenses:read` como `expenses:write`.

## Herramientas

| Herramienta | Propósito | Límite |
| --- | --- | --- |
| `list_workspaces` | Enumera todos los espacios de trabajo disponibles para la persona autenticada. | Solo lectura; requiere `expenses:read`. |
| `get_schema` | Devuelve relaciones, columnas, restricciones, límites e indicaciones permitidas para un espacio de trabajo. | Solo lectura; requiere `expenses:read`. |
| `sql_query` | Ejecuta exactamente un `SELECT` o `WITH ... SELECT` aprobado por la política. | Transacción de solo lectura con un rol restringido; requiere `expenses:read`. |
| `sql_execute` | Ejecuta exactamente un `INSERT`, `UPDATE` o `DELETE` aprobado por la política. | Cambia datos financieros y no es idempotente; requiere `expenses:write`. |

Las herramientas operan únicamente sobre datos de Expense Budget Tracker. No pueden navegar por Internet, acceder a otro servicio, ejecutar DDL ni saltarse las relaciones y columnas devueltas por `get_schema`.

## Selección del espacio de trabajo

Llama primero a `list_workspaces`. Si devuelve exactamente un espacio, puedes omitir `workspaceId` en las demás llamadas. Si hay más de uno, elige uno de los identificadores devueltos y pasa ese `workspaceId` de forma explícita en cada llamada a `get_schema`, `sql_query` y `sql_execute`. El servidor rechaza un espacio ambiguo o inaccesible en lugar de adivinar.

Después de elegir el espacio y antes de escribir SQL, llama a `get_schema`. La [referencia de API](/es/docs/api/) contiene el contrato detallado de relaciones y SQL; esta guía se limita a la conexión MCP y su modelo de seguridad.

## Límites de lectura y escritura

Usa `sql_query` para consultar y generar informes. Usa `sql_execute` solo cuando el cambio solicitado esté claro y la persona lo haya aprobado. Como las mutaciones no son idempotentes, no repitas a ciegas una escritura incierta: consulta primero el estado resultante y repite solo si confirmas que el cambio no se aplicó.

El aislamiento entre espacios de trabajo se aplica en el servidor mediante seguridad a nivel de fila de Postgres y roles de base de datos restringidos. El servicio aplica los permisos OAuth, la pertenencia al espacio, la política SQL, los límites de tiempo y el máximo de filas de respuesta.

## Privacidad, revocación y ayuda

El cliente de IA es un tercero independiente. Puede procesar o conservar prompts y resultados de herramientas según sus propias condiciones y política de privacidad. Revisa esa política antes de conectar datos financieros. La [política de privacidad](/es/privacy/) explica qué procesa y almacena el servicio alojado.

Revoca un cliente MCP conectado desde **Ajustes > Acceso de agentes** en la aplicación alojada. La revocación invalida las credenciales de acceso y actualización de esa conexión. Si tienes problemas de conexión, consulta la [página de soporte](/es/support/).

## Recursos relacionados

- [Referencia de API](/es/docs/api/)
- [Política de privacidad](/es/privacy/)
- [Términos del servicio](/es/terms/)
- [Soporte](/es/support/)
- [Guía de autoalojamiento](/es/docs/self-hosting/)
- [Código fuente](https://github.com/kirill-markin/expense-budget-tracker)
