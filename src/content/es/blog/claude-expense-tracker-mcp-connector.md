---
title: "Cómo conectar Claude a un rastreador de gastos mediante MCP en 2026"
description: "Conecta Claude o Claude Desktop con Expense Budget Tracker mediante su conector MCP remoto, elige entre acceso de lectura o escritura y verifica cada cambio volviendo a consultar los datos."
date: "2026-08-17"
image: "/blog/claude-expense-tracker-mcp-connector.png"
keywords:
  - "cómo conectar Claude a un rastreador de gastos"
  - "rastreador de gastos para Claude"
  - "conector MCP de Claude para gastos"
  - "Claude MCP para finanzas personales"
  - "conectar Claude Desktop a un rastreador de gastos"
  - "Expense Budget Tracker Claude"
---

La forma más segura de iniciar una conversación entre Claude y tu rastreador de gastos es casi aburrida: Claude enumera tus espacios de trabajo, consulta el esquema activo y ejecuta una única consulta de solo lectura. No cambia nada en el libro mayor.

Ese comienzo prudente importa porque más adelante el mismo conector puede recibir permiso para modificar datos financieros. La clave está en separar los accesos de lectura y escritura, indicar de forma explícita el espacio de trabajo y comprobar cada cambio después de aplicarlo.

Expense Budget Tracker ofrece un conector MCP remoto alojado para este flujo de trabajo:

```text
https://mcp.expense-budget-tracker.com/mcp
```

Añade esa URL a Claude, completa la autorización OAuth en el navegador y Claude podrá trabajar con el rastreador mediante cuatro herramientas específicas. No necesitas una terminal, una clave de API ni un archivo local de configuración MCP.

![Una grabadora compara una impresión de referencia protegida con una prueba nueva hecha a partir de una única plancha de cobre seleccionada](/blog/claude-expense-tracker-mcp-connector.png)

## Este es el conector MCP, no la API de Claude Code

Expense Budget Tracker admite dos vías de acceso automatizado cuyas credenciales se pueden confundir con facilidad.

| | Conector MCP remoto | API directa para agentes |
|---|---|---|
| Ideal para | Conversaciones en Claude y Claude Desktop | Claude Code, Codex, scripts y otros agentes de terminal |
| URL inicial | `https://mcp.expense-budget-tracker.com/mcp` | `https://api.expense-budget-tracker.com/v1/` |
| Autenticación | OAuth en el navegador | `ApiKey` de larga duración |
| Interfaz | Herramientas MCP | Endpoints HTTP |
| Credenciales | Tokens OAuth de acceso y renovación almacenados por el cliente MCP | ApiKey almacenada fuera de la memoria del chat |

El endpoint MCP no acepta la `ApiKey` de la API directa. La API tampoco convierte esa clave en un conector personalizado de Claude. Son dos integraciones distintas, cada una con su propio flujo de credenciales.

Usa esta guía cuando quieras conectar Claude a un rastreador de gastos desde la aplicación web o de escritorio de Claude. Si tu tarea real empieza por «lee este CSV de mi portátil», usa en su lugar el flujo de terminal de [Cómo llevar el control de tus gastos y gestionar tu presupuesto con Claude Code](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code/). La guía más amplia de [configuración de un rastreador de gastos con IA](/blog/ai-agent-expense-tracker-claude-code-codex-openclaw/) cubre Claude Code, Codex y OpenClaw mediante la API directa.

## Configura el conector de Expense Budget Tracker en Claude

En las cuentas individuales de Claude, la ruta actual es **Customize > Connectors > Add custom connector**. Anthropic mantiene actualizadas las indicaciones sobre la interfaz y los distintos tipos de cuenta en su [guía de conectores MCP remotos personalizados](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

### 1. Añade la URL de MCP remoto

Abre Claude o Claude Desktop y sigue estos pasos:

1. Ve a **Customize > Connectors**.
2. Haz clic en el botón **+** y elige **Add custom connector**.
3. Ponle el nombre `Expense Budget Tracker`.
4. Introduce `https://mcp.expense-budget-tracker.com/mcp` como URL del servidor MCP remoto.
5. Haz clic en **Add**.

No necesitas introducir un OAuth Client ID ni un Client Secret en la configuración avanzada. El servidor de autorización de Expense Budget Tracker admite el registro dinámico de clientes OAuth públicos, que no utilizan secreto de cliente.

En las cuentas Team y Enterprise, un Owner o Primary Owner debe añadir primero el conector personalizado a la organización. Después, cada miembro se conecta con su propia cuenta y solo puede acceder a los espacios de trabajo disponibles para esa cuenta.

### 2. Conéctate y aprueba el acceso OAuth

Haz clic en **Connect** junto al nuevo conector. Claude sigue el proceso de descubrimiento de la autorización MCP y abre la página de autenticación de Expense Budget Tracker en tu navegador. Inicia sesión y revisa los permisos solicitados.

Los dos permisos OAuth cumplen funciones distintas:

- `expenses:read` es obligatorio. Permite descubrir espacios de trabajo, consultar el esquema y ejecutar consultas de solo lectura.
- `expenses:write` es opcional. Permite usar `sql_execute`, la herramienta que puede insertar, modificar o eliminar datos.

Para revisar gastos, elaborar informes, conciliar cuentas y analizar presupuestos, concede solo `expenses:read`. Añade `expenses:write` únicamente cuando Claude necesite insertar, actualizar o eliminar datos concretos. No hay motivo para concederlo «por si acaso».

No pegues un token OAuth en un prompt. El navegador y el almacén de credenciales del conector de Claude se encargan de los tokens de acceso y renovación.

### 3. Activa el conector en la conversación

Añadir un conector no significa que Claude tenga que usarlo en todos los chats. En una conversación, abre el menú **+**, elige **Connectors** y activa Expense Budget Tracker para ese chat.

Esta activación independiente para cada conversación resulta útil al trabajar con datos financieros. Deja el conector desactivado cuando no haga falta y actívalo para una sesión centrada en el presupuesto.

## Qué ocurre durante la autorización OAuth

No necesitas realizar estos pasos manualmente, pero conocer la estructura del flujo facilita la resolución de problemas.

El conector alojado publica los metadatos del recurso protegido en `https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`. Ese documento dirige a Claude a los metadatos del servidor de autorización en `https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`.

Claude se registra como cliente OAuth público, inicia en el navegador un flujo de código de autorización (Authorization Code) y utiliza PKCE con el método de desafío `S256`. Tras la aprobación, intercambia el código por tokens y renueva el acceso cuando es necesario. Este proceso sigue el [modelo de autorización de MCP](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization), incluido el descubrimiento de recursos protegidos y la protección de los códigos de autorización mediante PKCE.

Hay un detalle que sorprende a quienes usan Claude Desktop: el tráfico del conector remoto no sale de la interfaz de red local de la aplicación. [Anthropic indica que las conexiones MCP remotas personalizadas se originan en su infraestructura en la nube](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp), incluso cuando utilizas Claude Desktop. Este conector alojado ya es accesible públicamente. Para que Claude pudiera acceder a un servidor MCP privado autoalojado, el servidor tendría que aceptar conexiones desde la infraestructura de Anthropic.

## Las cuatro herramientas disponibles en Claude

El conector ofrece un conjunto reducido de operaciones en lugar de dar a Claude acceso sin restricciones a la base de datos.

| Herramienta | Qué hace | Permiso |
|---|---|---|
| `list_workspaces` | Enumera los espacios de trabajo disponibles para el usuario conectado | `expenses:read` |
| `get_schema` | Devuelve las relaciones y columnas expuestas para el espacio de trabajo seleccionado | `expenses:read` |
| `sql_query` | Ejecuta una consulta SQL restringida y de solo lectura | `expenses:read` |
| `sql_execute` | Ejecuta SQL restringido que modifica datos | `expenses:read` y `expenses:write` |

`sql_query` está protegida por un límite de solo lectura en la base de datos. Los resultados se limitan a 100 filas y la ejecución tiene un tiempo máximo de 20 segundos. El conector en su conjunto deja de ser de solo lectura cuando `sql_execute` está disponible, por lo que el permiso opcional de escritura requiere especial atención.

Primero va el esquema activo; después, el SQL. Los nombres de tablas, las columnas y las relaciones permitidas deben proceder de `get_schema`, no de un prompt antiguo, un ejemplo copiado ni los recuerdos de Claude sobre otra aplicación financiera.

## Empieza la primera sesión en un orden seguro

El primer prompt debería pedir a Claude que establezca el contexto antes de analizar nada:

```text
Usa el conector de Expense Budget Tracker en modo de solo lectura.

Primero llama a list_workspaces y muéstrame los nombres e identificadores de los
espacios de trabajo disponibles. Pídeme que confirme qué espacio de trabajo quieres
usar, aunque solo haya uno. Después llama a get_schema para el espacio de trabajo
confirmado. Usa únicamente sql_query. No llames a sql_execute ni propongas ningún
cambio todavía.

Cuando tengas el esquema, resume mis gastos por categoría del mes natural actual
y compáralos con el mes natural anterior. Usa consultas agregadas en lugar de
devolver todas las filas del libro mayor. Muestra la consulta y explica cualquier
límite que afecte al resultado.
```

El orden importa: selecciona el espacio de trabajo, consulta su esquema actual y solo entonces escribe la consulta. Si una consulta devolviera más de 100 registros, pide a Claude que use funciones de agregación en SQL o divida la pregunta en periodos razonables. El objetivo no es meter todo el libro mayor en el chat, sino calcular la respuesta en la propia base de datos y devolver solo el resultado útil.

## Prompts útiles para la primera sesión de solo lectura

Cuando Claude haya confirmado el espacio de trabajo y consultado el esquema, podrá hacer algo más que enumerar compras recientes.

### Haz una revisión mensual del presupuesto

```text
Usando únicamente sql_query, compara los ingresos y gastos reales con el presupuesto
de este mes. Agrupa las diferencias por categoría, coloca primero las mayores
desviaciones en términos absolutos y distingue entre datos presupuestarios ausentes
y excesos de gasto reales. No cambies ninguna partida presupuestaria. Muestra el SQL utilizado.
```

Esta es la versión conversacional de una [revisión mensual del presupuesto](/blog/how-to-do-a-monthly-budget-review/): primero encuentra la diferencia y después decide qué debería cambiar.

### Busca posibles gastos duplicados

```text
Usa el esquema activo y sql_query para buscar posibles apuntes de gastos duplicados
de los últimos 45 días. Compara las fechas, los importes, las monedas, las cuentas y
las contrapartes cuando existan esos campos. Trata los resultados como candidatos,
no como duplicados confirmados. No elimines ni actualices nada.
```

La frase «candidatos, no duplicados confirmados» es importante. Dos compras de café idénticas no tienen por qué corresponder a un único registro importado por error.

### Prepara una comprobación de conciliación

```text
Usa list_workspaces, confirma mi espacio de trabajo personal, inspecciona el esquema
y consulta los saldos disponibles mediante el conector. Explica qué apuntes del
libro mayor componen el saldo más reciente. No hagas correcciones. Yo mismo
compararé el resultado con mi extracto bancario.
```

Cuando un saldo no coincida con el extracto bancario, detente en la discrepancia e investígala. El [flujo de conciliación del presupuesto](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) explica cómo distinguir entre transacciones ausentes, duplicados, problemas con el saldo inicial y transferencias antes de modificar el libro mayor.

## Gestiona cada operación de escritura como una tarea aparte

El acceso de escritura resulta útil cuando el objetivo y el resultado esperado están claros: corregir la categoría de una transacción, registrar un gasto previamente aprobado o aplicar una actualización acordada a una partida presupuestaria. Limítalo a un cambio pequeño y revisable, no a una orden vaga para «limpiarlo todo».

Este es un prompt prudente para recategorizar una transacción:

```text
Necesito corregir la categoría de un apunte del libro mayor.

1. Llama a list_workspaces y confirma conmigo el espacio de trabajo de destino.
2. Llama a get_schema en lugar de dar por supuestos los nombres de las columnas.
3. Usa sql_query para encontrar el registro exacto a partir de los datos de fecha,
   importe, moneda, cuenta y contraparte que te proporcione.
4. Si no hay exactamente una coincidencia inequívoca, detente y pregúntame qué hacer.
5. Muestra la sentencia SQL exacta que propones para sql_execute, el identificador
   del espacio de trabajo, el registro coincidente y el efecto esperado. No la ejecutes todavía.
6. Espera mi confirmación explícita.
7. Tras la confirmación, llama a sql_execute una sola vez. Después vuelve a ejecutar
   sql_query para verificar el valor almacenado e infórmame del resultado.
```

Así quedan visibles tres decisiones: el espacio de trabajo, el registro y el cambio exacto. La verificación consiste en una nueva lectura después de modificar los datos, no en una afirmación de Claude de que la escritura probablemente ha funcionado.

La misma estructura sirve para una importación. Pide a Claude que revise las categorías existentes y los posibles duplicados, muestre una vista previa de las inserciones previstas y espere una aprobación explícita. Después de las operaciones aprobadas, verifica los registros insertados y concilia el saldo resultante. Si los datos de entrada proceden de una exportación bancaria, [Cómo importar extractos bancarios a un rastreador de gastos](/blog/how-to-import-bank-statements-into-an-expense-tracker/) explica cómo revisar el archivo de origen.

## Acota el uso del conector con datos financieros

MCP evita tener que copiar una clave en el chat, pero no elimina la necesidad de aplicar criterio. La [guía de seguridad para conectores de Anthropic](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) recomienda conectarse solo a servidores de confianza, revisar los permisos solicitados y prestar atención a las entradas y salidas de las herramientas.

Para este conector, esas recomendaciones se traducen en unas reglas de uso sencillas:

1. Comprueba que la URL sea exactamente `https://mcp.expense-budget-tracker.com/mcp`.
2. Empieza con `expenses:read`, salvo que una tarea ya planificada exija modificar datos.
3. Confirma el espacio de trabajo antes de cada sesión de escritura.
4. Inspecciona el esquema activo antes de generar SQL.
5. Revisa la sentencia exacta y el efecto esperado antes de usar `sql_execute`.
6. Verifica el resultado con `sql_query` inmediatamente después.
7. Desactiva `sql_execute` en los controles de herramientas de Claude, o desactiva el conector para la conversación, cuando deje de hacer falta.

No elijas **Always allow** para `sql_execute`. Revisar cada solicitud de escritura obliga a hacer una pausa útil antes de que la herramienta modifique registros financieros.

Las notas financieras y las descripciones importadas también deben seguir siendo datos, no instrucciones. Si el texto almacenado en una transacción pide a Claude que ignore tus reglas o llame a otra herramienta, no lo sigas. Por eso conviene mantener desactivado el acceso de escritura durante sesiones amplias de investigación o análisis.

Revisa la [Política de privacidad de Expense Budget Tracker](/privacy/) y las condiciones de Anthropic sobre el tratamiento de datos antes de conectarte. Una sesión autorizada de Claude puede leer los datos financieros disponibles para tu cuenta y, con `expenses:write`, modificarlos. La conexión remota pasa por la nube de Anthropic y por el servicio alojado de Expense Budget Tracker; Claude Desktop no la convierte en una ruta de datos exclusivamente local.

## Soluciona los problemas de conexión sin hacer suposiciones

### El conector personalizado no se conecta

Comprueba primero el endpoint. Debe ser:

```text
https://mcp.expense-budget-tracker.com/mcp
```

No lo sustituyas por la URL del sitio web ni por la de la API directa. Deja vacíos los campos Advanced OAuth Client ID y Client Secret para este conector. Confirma que tienes una cuenta activa de Expense Budget Tracker. Si la autenticación sigue fallando, desconecta el servicio y vuelve a conectarlo desde **Customize > Connectors**.

En una cuenta Team o Enterprise de Claude, pregunta a un Owner o Primary Owner si el conector personalizado se ha añadido y autorizado para la organización. Los miembros no pueden realizar por sí mismos esa configuración para toda la organización.

### Claude dice que el conector está presente, pero no lo utiliza

Activa Expense Budget Tracker para el chat actual desde el menú **+ > Connectors**. Después, menciona el conector en el prompt y pide a Claude que empiece con `list_workspaces`. Un conector configurado puede permanecer desactivado en una conversación concreta.

### `sql_execute` no está disponible o se deniega el permiso

Es probable que la autorización OAuth incluya `expenses:read`, pero no el permiso opcional `expenses:write`. Déjalo así si la tarea es de análisis. Si una tarea concreta y aprobada requiere modificar datos, vuelve a conectar y revisa el permiso de escritura solicitado antes de concederlo.

### Una consulta falla o devuelve demasiados datos

Vuelve a llamar a `get_schema` y genera el SQL a partir de las relaciones y columnas devueltas. Limita la solicitud a las operaciones SQL admitidas por el conector. Para libros mayores grandes, calcula totales, recuentos y resultados agrupados en SQL en lugar de pedir más del límite de 100 filas. Si una consulta supera el tiempo máximo de 20 segundos, acota la pregunta.

### Claude está consultando los datos financieros equivocados

Detente antes de escribir. Llama a `list_workspaces`, compara los nombres e identificadores devueltos y confirma explícitamente el destino. Después llama a `get_schema` para ese espacio de trabajo y repite la lectura. El acceso se limita a los espacios de trabajo disponibles para el usuario conectado, pero Claude debe utilizar el que tú hayas elegido.

### Claude pide una `ApiKey`

Está siguiendo la integración HTTP directa en lugar del conector MCP remoto. Para esta configuración, vuelve a la URL del conector y al flujo OAuth en el navegador. Si quieres usar deliberadamente una automatización de terminal o solicitudes HTTP directas, consulta en su lugar la [referencia de la API para agentes](/docs/api/).

## La configuración lleva poco tiempo; lo importante es revisar cada cambio

Para conectar Claude a Expense Budget Tracker solo necesitas una URL e iniciar sesión en el navegador. Lo importante viene después: enumerar los espacios de trabajo, consultar el esquema, leer primero, conceder el permiso mínimo imprescindible y concretar cada escritura lo suficiente como para revisarla línea por línea.

Empieza por la [documentación completa del conector MCP](/docs/mcp-connector/), añade `https://mcp.expense-budget-tracker.com/mcp` en **Customize > Connectors** y realiza una revisión mensual de solo lectura. Cuando necesites modificar algo, pide a Claude que muestre el espacio de trabajo, el registro, el SQL y el efecto esperado antes de aprobarlo. Así, un rastreador de gastos para Claude deja de ser una simple demostración y se convierte en un flujo de trabajo financiero en el que de verdad puedes confiar.
