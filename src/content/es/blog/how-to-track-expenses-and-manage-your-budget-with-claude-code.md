---
title: "Control de gastos con Claude Code en 2026: importa, verifica y crea tu presupuesto"
description: "Conecta Claude Code con Expense Budget Tracker, revisa la importación de un extracto bancario, verifica los saldos y gestiona tu presupuesto con la Agent API vigente."
date: "2026-03-05"
updated: "2026-08-20"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code.png"
keywords:
  - "control de gastos con Claude Code"
  - "gestor de gastos para Claude"
  - "finanzas personales con Claude"
  - "presupuesto con Claude Code"
  - "gestor de gastos con IA"
  - "importar extracto bancario con Claude Code"
---

Un buen sistema de control de gastos con Claude Code debería empezar con una lectura, no con una escritura. Antes de que una sola transacción bancaria entre en el registro contable, Claude Code puede identificar el espacio de trabajo, consultar el esquema activo, comprobar la cuenta y el intervalo de fechas previstos y mostrarte qué cambios piensa hacer.

Ese punto de revisión es la razón para usar un agente de terminal en esta tarea. Claude Code puede encargarse del archivo y de las solicitudes HTTP, mientras tú mantienes el criterio financiero: cuál es la cuenta correcta, si una fila representa una transferencia, qué categoría corresponde y si el cambio propuesto debe ejecutarse.

Así funciona como un gestor de gastos con IA y un punto de aprobación visible, no como un chatbot financiero de propósito general.

Expense Budget Tracker permite seguir este flujo mediante su Agent API directa. El punto de partida es una URL pública de descubrimiento:

```text
https://api.expense-budget-tracker.com/v1/
```

A partir de ahí, Claude Code puede completar la configuración inicial mediante un código de un solo uso enviado por correo, guardar fuera de la memoria del chat la `ApiKey` de larga duración que recibe, consultar el esquema permitido y usar endpoints distintos para las lecturas y las escrituras aprobadas.

![Un sastre y una clienta revisan un patrón de papel y una pieza de prueba antes de cortar toda la tela](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code.png)

## Qué hace esta configuración y adónde van los datos

Claude Code se ejecuta en tu terminal y puede trabajar con un archivo de extracto bancario que pongas a su disposición en tu ordenador. Eso no convierte todo el flujo en un proceso sin conexión ni hace que los datos permanezcan únicamente en tu equipo.

Los [requisitos actuales de Claude Code de Anthropic](https://docs.anthropic.com/en/docs/claude-code/getting-started) especifican que hace falta conexión a Internet. La autenticación y el procesamiento con IA usan Anthropic o el proveedor de modelos configurado en tu instalación de Claude Code. Por tanto, las partes pertinentes del extracto, los prompts y los resultados de la API pueden procesarse fuera de tu ordenador conforme a las condiciones de ese proveedor.

El resto del recorrido está separado:

| Parte del flujo | Qué ocurre ahí |
|---|---|
| Tu ordenador | El extracto de origen comienza como un archivo local. Claude Code solo obtiene el acceso a archivos que tú le permitas. |
| Claude Code y su proveedor de modelos | Claude Code interpreta el archivo, prepara consultas y explica los resultados. La autenticación y el procesamiento con IA requieren acceso a Internet. |
| Agent API directa | Claude Code envía las operaciones de lectura autenticadas y los cambios aprobados que requiere la tarea. La API no puede explorar archivos arbitrarios de tu ordenador. |
| Almacenamiento de Expense Budget Tracker | Los registros financieros aprobados se guardan en la base de datos alojada o en la infraestructura que controles si alojas la aplicación por tu cuenta. |

También es un flujo distinto al del conector MCP remoto para Claude y Claude Desktop. La API directa usa una `ApiKey` de larga duración y es la opción que se explica aquí. MCP usa OAuth en el navegador y una URL diferente; el hecho de conectarlo no le da acceso a los archivos locales.

Si lo que más te importa es evitar una conexión bancaria permanente, [Aplicación de presupuesto sin vincular el banco](/blog/budget-app-without-bank-linking/) explica con más detalle por dónde pasan los datos.

## Conecta Claude Code mediante la URL de descubrimiento

Instala y autentica Claude Code siguiendo la [guía oficial de configuración de Anthropic](https://docs.anthropic.com/en/docs/claude-code/getting-started). La [referencia de la CLI](https://docs.anthropic.com/en/docs/claude-code/cli-usage) explica cómo usar los comandos de forma interactiva y no interactiva.

Cuando `claude` funcione en tu terminal, ábrelo en un directorio donde guardes tus archivos financieros y dale este prompt:

```text
Conéctate a Expense Budget Tracker mediante https://api.expense-budget-tracker.com/v1/.
Sigue la respuesta de descubrimiento en lugar de dar por sentados los detalles de los endpoints.
Pídeme el correo electrónico de mi cuenta y después el código de 8 dígitos que recibiré
en mi bandeja de entrada.
Guarda la ApiKey devuelta fuera de la memoria del chat solo cuando apruebe dónde guardarla.

Después de iniciar sesión, llama a /me, lista mis espacios de trabajo, pídeme que
confirme el espacio de destino, guárdalo para esta clave y consulta /schema. No escribas
todavía ningún dato financiero.
```

La secuencia actual de configuración inicial es la siguiente:

1. Ejecuta `GET https://api.expense-budget-tracker.com/v1/` y sigue las acciones que indique la respuesta de descubrimiento.
2. Proporciona el correo electrónico de la cuenta cuando Claude Code lo pida.
3. Proporciona el código de 8 dígitos enviado por correo. Si la verificación se completa correctamente, recibirás una `ApiKey` de larga duración.
4. Guarda la clave fuera de la memoria del chat, preferiblemente como `EXPENSE_BUDGET_TRACKER_API_KEY` en una ubicación que hayas aprobado. No la incluyas en un commit ni la subas a un repositorio.
5. Llama a `/v1/me` y `/v1/workspaces` con `Authorization: ApiKey <key>`.
6. Selecciona el espacio de trabajo previsto con `POST /v1/workspaces/{workspaceId}/select`.
7. Llama a `/v1/schema` antes de generar SQL.

El espacio de trabajo seleccionado se guarda para esa clave. Las solicitudes SQL posteriores pueden omitir `X-Workspace-Id`, aunque Claude Code puede seguir enviando el encabezado si quieres usar otro espacio de trabajo en una solicitud concreta. Si la cuenta tiene exactamente un espacio de trabajo y la clave todavía no tiene ningún espacio seleccionado, la API puede guardarlo y usarlo automáticamente. Aun así, conviene nombrar el espacio de trabajo en cada revisión previa a una escritura.

El flujo de autenticación detallado y las recomendaciones de almacenamiento están en [Configuración del agente de IA](/docs/agent-setup/).

## Define una regla de revisión antes de la primera importación

Un archivo `CLAUDE.md` local puede conservar las reglas de funcionamiento de este directorio financiero sin guardar la propia clave. Mantén las instrucciones breves y específicas:

```markdown
# Flujo de trabajo de Expense Budget Tracker

- Empieza en https://api.expense-budget-tracker.com/v1/ y consulta /schema.
- Usa POST /v1/sql/query para todas las lecturas.
- Antes de escribir, muestra el espacio de trabajo de destino, el SQL exacto, el número
  esperado de filas afectadas, los totales de origen y los posibles duplicados. Espera mi
  aprobación explícita.
- Usa POST /v1/sql/execute solo para el INSERT, UPDATE o DELETE exacto que haya aprobado.
- Verifica cada escritura con una nueva solicitud a /v1/sql/query.
- Nunca inventes una transacción de ajuste ni cambies sin avisar una categoría dudosa.
- Mantén la ApiKey fuera de este archivo y de la memoria del chat.
```

Añade los nombres reales de tus cuentas, las convenciones de categorías, las reglas para transferencias y la moneda de los informes si son estables. No copies categorías de ejemplo en el gestor solo porque aparezcan en un artículo. Claude Code debe consultar tus datos existentes y usar el esquema activo.

## Importa un extracto bancario con Claude Code

La primera importación más segura es deliberadamente pequeña: una cuenta, una moneda, un extracto de un período ya cerrado y un archivo cuyas filas puedas revisar. Un CSV es un buen punto de partida porque su estructura es visible. Con otros formatos, debes comprobar la extracción para cada archivo concreto antes de confiar en las filas resultantes.

### 1. Delimita los datos de origen

Antes de que Claude Code analice nada, identifica:

- la cuenta bancaria y la cuenta correspondiente en el gestor
- la moneda de la cuenta
- la primera y la última fecha de contabilización del extracto
- el saldo inicial o el último saldo correcto conocido
- el saldo final del extracto
- si el archivo incluye transacciones pendientes

Usa las transacciones contabilizadas para la importación y la conciliación. Deja la actividad pendiente fuera del lote aprobado hasta que se contabilice.

### 2. Examina el destino antes de preparar las filas

Pide a Claude Code que use primero el endpoint de lectura:

```text
Quiero importar ~/finances/checking-2026-07.csv.

Usa únicamente /v1/sql/query. Confirma el espacio de trabajo seleccionado, consulta
/v1/schema, lista las cuentas disponibles e identifica la cuenta que corresponde a este
extracto. Consulta en ledger_entries el intervalo de fechas del extracto y busca
solapamientos. Muéstrame la cuenta, la moneda, el intervalo de fechas, el número de filas
existentes y cualquier posible duplicado. No escribas nada.
```

El endpoint principal de lectura es:

```text
POST https://api.expense-budget-tracker.com/v1/sql/query
```

Acepta una única consulta de solo lectura `SELECT` o `WITH ... SELECT`. El cuerpo de la solicitud debe contener SQL compatible con el esquema actual obtenido de `/schema`:

```json
{
  "sql": "SELECT * FROM accounts LIMIT 100"
}
```

Claude Code debe calcular los totales y los resultados agrupados en SQL en lugar de copiar todo el registro contable en la conversación. Los resultados de las consultas están limitados a 100 filas.

### 3. Revisa una vista previa, no una promesa

Pide a Claude Code que convierta el extracto en una tabla de vista previa antes de crear un `INSERT`. Como mínimo, debe incluir la fila de origen, la fecha, el importe, la moneda, la cuenta de destino, el tipo de transacción propuesto, la categoría propuesta y el estado de posible duplicado.

Revisa con especial atención estas filas:

- transferencias entre tus propias cuentas
- devoluciones y reembolsos
- retiradas de efectivo y comisiones bancarias
- contrapartes que no reconozcas
- transacciones en moneda extranjera
- filas cercanas al inicio y al final del período del extracto
- cualquier fila que se parezca a una entrada existente en el registro contable

Una fecha y un importe coincidentes pueden indicar un duplicado, pero no lo demuestran. Dos transacciones legítimas pueden compartir ambos datos. Si el origen incluye un identificador bancario estable, úsalo como indicio cuando el esquema activo tenga un campo adecuado; de lo contrario, consérvalo en la vista previa en vez de forzarlo en la base de datos.

Después, pide un resumen de aprobación breve:

```text
Prepara la vista previa de la importación sin escribir nada. Muestra:

1. el espacio de trabajo y la cuenta confirmados
2. el intervalo de fechas y la moneda del origen
3. el número de filas de origen y su total con signo
4. todas las filas propuestas para el registro contable
5. los posibles duplicados y las clasificaciones dudosas
6. la sentencia o las sentencias INSERT exactas que enviarías
7. el número esperado de filas afectadas

Detente y espera mi aprobación.
```

### 4. Envía únicamente el conjunto de cambios aprobado

El endpoint principal de escritura es:

```text
POST https://api.expense-budget-tracker.com/v1/sql/execute
```

Acepta un único `INSERT`, `UPDATE` o `DELETE` aprobado, incluidas las formas `WITH` compatibles. Está separado deliberadamente del endpoint de lectura.

Cada mutación está limitada a 100 filas afectadas. Para una importación larga, aprueba todo el conjunto de cambios propuesto antes de ejecutarlo. Claude Code debe enviar primero entre 1 y 3 filas representativas con la misma estructura SQL. Si esa prueba funciona, debe continuar de inmediato con las filas aprobadas restantes en lotes secuenciales de 100 como máximo. Debe llevar un registro de cada lote y verificarlo, pero no detenerse solo para pedirte que continúes o vuelvas a confirmar. Un cambio de alcance, una nueva ambigüedad o un error de ejecución crean un nuevo punto de revisión.

El SQL disponible no admite `ON CONFLICT`, así que la gestión de duplicados debe ser explícita y no quedar oculta tras un upsert.

`POST /v1/sql` sigue existiendo por compatibilidad y para scripts atómicos restringidos con varias sentencias. No es el endpoint habitual para leer extractos ni realizar escrituras rutinarias.

### 5. Vuelve a leer las filas

Una respuesta de éxito de la API no marca el final de la importación. Pide a Claude Code que vuelva a consultar la cuenta y el período afectados mediante `/v1/sql/query` y compare el resultado guardado con la vista previa aprobada:

- número de filas afectadas
- fechas e importes
- moneda original
- asignación de cuenta
- tipos de transacción y categorías
- número de duplicados

No pidas a Claude Code que «arregle cualquier cosa que parezca incorrecta». Si la verificación encuentra una diferencia, vuelve a un diagnóstico de solo lectura, prepara una corrección específica y apruébala por separado.

La [guía completa para importar extractos bancarios](/blog/how-to-import-bank-statements-into-an-expense-tracker/) explica las transferencias, los reembolsos, los períodos solapados y otras filas que pueden hacer engañosa una importación aparentemente correcta.

## Concilia una cuenta antes de importar otra

La conciliación demuestra que los movimientos del registro contable explican el extracto bancario. Compara una cuenta bancaria con su cuenta correspondiente en el gestor, en la misma moneda y durante el mismo intervalo de transacciones contabilizadas.

Para una cuenta de depósito normal, la comprobación básica es:

**saldo final esperado = saldo inicial + entradas contabilizadas − salidas contabilizadas**

Si el gestor usa movimientos con signo, el equivalente es:

**saldo final esperado = saldo inicial + suma de los movimientos contabilizados con signo**

Las cuentas de pasivo, como las tarjetas de crédito, pueden usar otras convenciones de signo. Haz que Claude Code indique qué convención ha encontrado antes de comparar las cifras.

Usa un prompt que mantenga el diagnóstico en modo de solo lectura:

```text
Usa únicamente /v1/sql/query. Concilia la cuenta corriente en la que se hizo la
importación con el saldo final del extracto de [importe y moneda]. Indica el punto
inicial de la comparación y la convención de signos. Si los saldos son distintos,
muestra la diferencia exacta y enumera las filas que podrían faltar, estar duplicadas
o tener el signo incorrecto. No insertes una entrada de ajuste ni cambies los datos
existentes.
```

Si la diferencia no es cero, examina el saldo inicial, las transacciones ausentes o duplicadas, las transferencias, las transacciones pendientes, los signos, las fechas y las monedas. Una entrada de ajuste sintética hace que la pantalla cuadre, pero oculta la causa.

Que la diferencia sea cero demuestra que los movimientos de la cuenta cuadran. No demuestra que las categorías sean correctas. Revisa por separado los totales de las categorías antes de pasar a la siguiente cuenta. La [guía de conciliación del presupuesto](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) profundiza en esta distinción.

## Analiza los gastos mediante el endpoint de lectura

Una vez verificada la importación, Claude Code puede usar `ledger_entries` para analizar los gastos en modo de solo lectura. Formula la pregunta con precisión y pide el SQL para poder revisar la definición en la que se basa la respuesta.

```text
Consulta /v1/schema y después usa /v1/sql/query para comparar los gastos por categoría
de los tres últimos meses naturales completos. Fija las fechas explícitas de inicio y
fin antes de escribir el SQL. Excluye las transferencias según el tipo de transacción
guardado. Calcula los agregados en SQL, muestra la consulta y explica las filas excluidas
o dudosas. No cambies ningún dato.
```

Esta precisión importa porque «gastos» no es una columna universal. Una respuesta útil depende del esquema actual, los tipos de transacción, la moneda de la cuenta, los reembolsos y el intervalo exacto de fechas. Claude Code puede escribir la consulta, pero tú debes poder ver qué ha contado.

Para un análisis puntual, formula preguntas concretas como estas:

- ¿Qué categorías cambiaron más entre dos meses completos?
- ¿Qué contrapartes forman el total de una categoría?
- ¿Hay posibles duplicados en el último período importado?
- ¿Qué categorías reales no tienen una partida presupuestaria correspondiente?

El límite de 100 filas en los resultados suele bastar cuando Claude Code agrupa y filtra en la base de datos.

## Actualiza tu presupuesto con Claude Code sin ceder la decisión

Los cambios en el presupuesto usan el mismo ciclo de revisión que las importaciones de extractos. Claude Code puede leer `budget_lines`, comparar el plan con la actividad real del registro contable y proponer un `INSERT`, `UPDATE` o `DELETE`. Tú decides si los nuevos importes reflejan tus planes.

```text
Usa /v1/sql/query para comparar los ingresos y gastos reales de este mes con budget_lines.
Después, prepara el presupuesto del mes siguiente usando las categorías existentes y el
esquema actual.

Muestra el importe actual, el importe propuesto, la diferencia y el motivo de cada línea
modificada. Muestra el SQL exacto y el número esperado de filas afectadas. No llames a
/v1/sql/execute hasta que apruebe líneas concretas. Después de ejecutar un cambio
aprobado, vuelve a consultar esas líneas para verificarlas.
```

No dejes que un mes de gasto elevado se convierta sin más en el nuevo plan. Un gasto grande puede ser excepcional, una categoría ausente puede ser un problema de datos y una transferencia puede estar mal clasificada. Claude Code puede señalar las diferencias, pero un presupuesto con Claude Code sigue necesitando tu criterio para decidir qué debería ocurrir después.

## Conoce el alcance actual de la Agent API

La API expone un pequeño conjunto de relaciones. Trata siempre `/v1/schema` como la fuente de información actual, pero la división vigente entre lectura y escritura es esta:

| Relación | Acceso |
|---|---|
| `ledger_entries` | Lectura y escritura aprobada |
| `budget_lines` | Lectura y escritura aprobada |
| `workspace_settings` | Lectura y escritura aprobada |
| `account_metadata` | Lectura y escritura aprobada |
| `accounts` | Solo lectura |
| `fx_rates_raw` | Solo lectura |
| `fx_rates_daily` | Solo lectura |

Los límites actuales de la Agent API son:

- 100 filas devueltas por consulta
- 100 filas afectadas como máximo por cada sentencia de mutación y por cada solicitud
- 25 segundos de plazo total por solicitud SQL
- 10 solicitudes por segundo y 10 000 solicitudes al día por cada clave

La política de SQL bloquea DDL como `CREATE`, `DROP` y `ALTER`, los bloques de transacción, los comentarios SQL, los identificadores entre comillas, las cadenas delimitadas por signos de dólar, `set_config()` y las funciones restringidas. Actualmente, las funciones permitidas son `SUM`, `COUNT`, `MIN`, `MAX`, `AVG` y `COALESCE`. Usa `ILIKE` en lugar de `LOWER(...)` para buscar texto sin distinguir entre mayúsculas y minúsculas, y rangos de fechas explícitos en lugar de `NOW()` o `DATE_TRUNC()`. Los endpoints principales aceptan una sentencia por solicitud. `ON CONFLICT` no es compatible.

Estos controles reducen la superficie SQL, pero no deciden si una categoría es correcta ni si una fila del extracto representa realmente una transferencia. Row Level Security aísla los espacios de trabajo en la base de datos. Las ApiKeys se almacenan como hashes SHA-256 y pueden revocarse desde el producto. Aun así, debes proteger la clave en texto plano en tu ordenador y revisar cada cambio en los datos financieros.

Consulta la [Referencia de la API](/docs/api/) para conocer el contrato y los límites actuales de los endpoints.

## La Agent API de Claude Code y Claude MCP son vías distintas

Las búsquedas de un gestor de gastos para Claude suelen mezclar el uso desde la terminal con los conectores de Claude o Claude Desktop. Expense Budget Tracker admite ambas opciones, pero ni la configuración ni las credenciales son intercambiables.

| | Claude Code con Agent API | Claude o Claude Desktop con MCP |
|---|---|---|
| Opción más adecuada | Archivos locales, flujos de terminal, scripts y HTTP directo | Conversaciones en un cliente de Claude compatible con MCP |
| Punto de partida | `https://api.expense-budget-tracker.com/v1/` | `https://mcp.expense-budget-tracker.com/mcp` |
| Autenticación | Código de un solo uso por correo y después una `ApiKey` de larga duración | OAuth en el navegador |
| Interfaz de lectura/escritura | `/v1/sql/query` y `/v1/sql/execute` | Herramientas `sql_query` y, de forma opcional, `sql_execute` |
| Acceso a archivos locales | Depende de los archivos y permisos disponibles para Claude Code | El propio conector remoto no lo proporciona |

Consulta la [documentación del conector MCP](/docs/mcp-connector/) o la [guía completa del gestor de gastos para Claude con MCP](/blog/claude-expense-tracker-mcp-connector/) si quieres conectar Claude o Claude Desktop. Sigue usando este flujo con la Agent API cuando la tarea comience con un extracto local y una terminal.

## Un prompt reutilizable para todo el flujo

Este prompt reúne el descubrimiento, la vista previa, la aprobación y la verificación en una sola secuencia:

```text
Conéctate a Expense Budget Tracker mediante https://api.expense-budget-tracker.com/v1/
y sigue la respuesta de descubrimiento. Usa la ApiKey guardada fuera de la memoria del chat.
Llama a /me, lista los espacios de trabajo, confirma conmigo el espacio de destino,
selecciónalo y consulta /schema.

Quiero importar [ruta del CSV local] en [cuenta] para el período cerrado
[intervalo de fechas], en [moneda]. Usa primero /v1/sql/query para consultar la cuenta,
las categorías existentes y las entradas del registro contable que se solapen. Analiza
el archivo y prepara una vista previa completa. Señala posibles duplicados, transferencias,
devoluciones, reembolsos,
comisiones, contrapartes inusuales y categorías dudosas.

Muestra los totales de origen, las filas propuestas, el SQL exacto y el número esperado
de filas afectadas. No escribas hasta que apruebe todo el conjunto de cambios. Usa
/v1/sql/execute solo para esa escritura aprobada. Para una importación larga, envía
primero una prueba representativa de entre 1 y 3 filas. Si funciona, continúa de inmediato
con las filas aprobadas restantes en lotes secuenciales de 100 como máximo. Verifica cada
lote mediante /v1/sql/query, pero no me pidas que vuelva a confirmar salvo que cambie el
alcance, aparezca una nueva ambigüedad o falle la ejecución.

Por último, concilia esta cuenta con el saldo final del extracto. Si no coincide, explica
la diferencia sin crear una transacción de ajuste ni cambiar los datos.
```

Empieza con una cuenta y un período cerrado. Si la vista previa se entiende, las filas aprobadas se leen correctamente después de guardarlas y el saldo final queda conciliado, tendrás un flujo revisable para gestionar tus finanzas personales con Claude, no un chatbot con un permiso genérico para cambiar tus cuentas.
