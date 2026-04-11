---
title: "Cómo realizar un seguimiento de los gastos y administrar su presupuesto con Claude Code"
description: "Configure Claude Code como su asistente de finanzas personales. Déle una URL de descubrimiento, déjelo completar el flujo de correo electrónico OTP, guarde el ApiKey devuelto y podrá analizar extractos, verificar saldos y administrar su presupuesto desde la terminal."
date: "2026-03-05"
---

Claude Code es el agente de inteligencia artificial de Anthropic que se ejecuta en su terminal. Puede leer archivos, escribir código, ejecutar comandos y realizar solicitudes HTTP. La mayoría de la gente utiliza Claude Code para el desarrollo de software. Pero también funciona muy bien para las finanzas personales cuando lo conectas a un rastreador de gastos con una API de máquina limpia.

La configuración: conecte Claude Code a un rastreador de gastos de código abierto a través de la API de su máquina y se convertirá en un asistente de finanzas personales que vivirá en su terminal. Envíe un extracto bancario, solicite a Claude Code que registre las transacciones, verifique sus saldos, actualice su presupuesto, todo a través de una conversación natural. Sin hacer clic en las pantallas de la interfaz de usuario ni ingresar datos manualmente.

## Por qué Claude Code funciona bien para el seguimiento de gastos

Claude Code se diferencia de ChatGPT o de la aplicación web Claude en algunos aspectos importantes que son importantes para las finanzas personales:

**Se ejecuta localmente y puede leer sus archivos.** Cuando descarga un extracto bancario como CSV o PDF, Claude Code puede leerlo directamente desde su sistema de archivos. Sin cargar, sin copiar y pegar, sin capturas de pantalla. Dice "analizar el extracto bancario en ~/Downloads/chase-march-2026.csv" y Claude Code lee el archivo.

**Puede ejecutar código y solicitudes HTTP.** Claude Code no solo sugiere un comando curl: lo ejecuta. Cuando necesita insertar 50 transacciones en su base de datos de gastos, escribe SQL, envía la solicitud HTTP y confirma el resultado. Todo el flujo ocurre dentro de una sola conversación.

**Recuerda su configuración entre sesiones.** Una vez que el ApiKey devuelto se almacena fuera de la memoria del chat, Claude Code puede reutilizar la misma conexión en sesiones posteriores en lugar de repetir el flujo de código de correo electrónico cada vez.

**Funciona sin conexión con archivos locales.** Si desea preprocesar extractos bancarios, limpiar formatos CSV o escribir scripts de importación, Claude Code hace todo eso localmente antes de que nada toque la API.

## Configurar Claude Code para finanzas personales

Necesita dos cosas: un rastreador de gastos con una API de máquina y un lugar para conservar la clave de larga duración que recibe Claude Code después de iniciar sesión.

[Expense Budget Tracker](https://expense-budget-tracker.com/es/) es un sistema de finanzas personales de código abierto construido sobre Postgres. Su punto final de descubrimiento canónico es `GET https://api.expense-budget-tracker.com/v1/`. Regístrese en la versión alojada o [autoalójelo](https://github.com/kirill-markin/expense-budget-tracker) en su propio servidor.

### Paso 1: proporcione a Claude Code la URL de descubrimiento

Dígale a Claude Code que se conecte usando:

```text
https://api.expense-budget-tracker.com/v1/
```

Claude Code debería comenzar leyendo la respuesta de descubrimiento y luego solicitar:

- el correo electrónico de tu cuenta
- el código de 8 dígitos enviado a tu bandeja de entrada

Cuando verifica el código, el servicio devuelve una clave de larga duración en el formato API real, por ejemplo `ebta_...`.

### Paso 2: guarde la clave devuelta fuera de la memoria del chat

El flujo de autenticación es conveniente, pero la clave aún debe almacenarse en un lugar duradero. El backend les dice explícitamente a los agentes que no confíen únicamente en el historial de chat.

Un patrón simple es:

```bash
export EXPENSE_BUDGET_TRACKER_API_KEY="ebta_your_key_here"
```

Si desea que Claude Code lo persista en un archivo `.env` local, apruebelo explícitamente. De lo contrario, guárdelo en el shell para la sesión actual y guárdelo en algún lugar persistente.

### Paso 3: Guarde su espacio de trabajo una vez

Después de que Claude Code verifique el código, debería cargar su cuenta y sus espacios de trabajo:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

Luego guarde el espacio de trabajo predeterminado para esa clave una vez:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace-id/select \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

Después de eso, `/v1/sql` puede omitir `X-Workspace-Id`. Si su cuenta tiene exactamente un espacio de trabajo, la API lo guarda automáticamente y lo usa la primera vez.

### Paso 4: agregue un archivo de instrucciones local para sus propias convenciones

Claude Code aún funciona mejor cuando le proporcionas tus categorías, cuentas y reglas de flujo de trabajo. Un `CLAUDE.md` local es útil para esa parte:

```markdown
# Personal Finance

## Expense Tracker API

- Endpoint: https://api.expense-budget-tracker.com/v1/sql
- Auth: ApiKey in Authorization header
- API key is in the EXPENSE_BUDGET_TRACKER_API_KEY environment variable
- Default workspace is already saved for this key
- Request: POST with JSON body {"sql": "your query"}
- Response: {"rows": [...], "rowCount": N}

## My expense categories

Income: salary, freelance, side-projects
Fixed: rent, utilities, insurance, subscriptions
Daily: groceries, dining-out, transport, coffee
Lifestyle: clothing, entertainment, healthcare, travel
Planning: taxes, big-purchases, savings, emergency-fund

## My accounts

- chase-checking (USD) — main checking account
- wise-eur (EUR) — European account
- cash-usd (USD) — cash

## Rules

- Always check existing categories before inserting transactions
- After importing, verify account balances match the bank
- Use the exact category names listed above
- Store transactions in their original currency
```

### Paso 5: Abra Claude Code y comience a trabajar

```bash
cd ~/finances
claude
```

Claude Code lee sus instrucciones locales, reutiliza el ApiKey guardado y puede comenzar a trabajar de inmediato.

## Analizando extractos bancarios con Claude Code

Aquí es donde brilla Claude Code. Descarga tu extracto bancario y dile a Claude Code que lo procese:

```
> I downloaded my Chase statement to ~/Downloads/chase-march-2026.csv.
> Parse it and record all transactions to my chase-checking account.
```

Claude Code:
1. Lea el archivo CSV de su sistema de archivos
2. Analice cada fila: fecha, monto, descripción
3. Haga coincidir cada transacción con una de sus categorías de gastos (de `CLAUDE.md`)
4. Cree declaraciones INSERT para la tabla `ledger_entries`
5. Envía cada uno a través de la API SQL
6. Informe lo que registró.

Revisa el resultado, le dice a Claude Code que corrija cualquier transacción mal categorizada y listo. Las transacciones bancarias de un mes, procesadas en unos minutos.

Para extractos PDF o capturas de pantalla de su aplicación bancaria, funciona el mismo enfoque. Claude Code puede leer imágenes y PDF, extraer los datos de la transacción y registrar todo de la misma manera.

## Verificar saldos y detectar errores

Después de importar transacciones, siempre verifique que los números sumen:

```
> Check my account balances and compare them to what I see in the bank:
> chase-checking should be $4,230.15
> wise-eur should be €1,847.50
```

Claude Code consulta la vista `accounts` a través de la API SQL, compara los saldos y señala cualquier discrepancia. Si su cheque de seguimiento muestra $4180,15 en lugar de $4230,15, Claude Code puede ayudarle a encontrar los $50 que faltan, tal vez una transacción que se omitió o se contó dos veces.

Esta verificación de saldo semanal es uno de los hábitos más importantes en las finanzas personales. Kirill Markin, quien creó Expense Budget Tracker y ha estado categorizando cada transacción personal durante más de cinco años, realiza esta verificación todas las semanas. Es lo que mantiene la confianza de los datos a lo largo del tiempo.

## Hacer preguntas sobre sus gastos

Una vez que sus datos de gastos estén en la base de datos, Claude Code puede responder cualquier pregunta sobre sus finanzas escribiendo consultas SQL:

```
> How much did I spend on dining out in the last 3 months?
```

```
> What are my top 5 expense categories this month?
```

```
> Show me all transactions over $100 from last week.
```

```
> What's my average monthly grocery spending over the past 6 months?
```

Claude Code escribe SQL, lo ejecuta en la API y le brinda la respuesta en lenguaje sencillo. No es necesario que conozca SQL, pero siempre puede pedirle a Claude Code que muestre la consulta que ejecutó, verifique que tenga sentido o la modifique.

## Gestionar la previsión de tu presupuesto

El seguimiento de gastos registra lo que ya sucedió. Hacer un presupuesto es planificar lo que viene después. Ambos viven en la misma base de datos.

La tabla `budget_lines` almacena su pronóstico mensual: ingresos esperados y gastos planificados para cada categoría, para cada mes. Puedes gestionar esto a través de Claude Code:

```
> Set my budget for April 2026:
> - groceries: $400
> - dining-out: $200
> - rent: $2,100
> - salary income: $8,500
> Copy everything else from March's budget.
```

Claude Code lee las entradas del presupuesto de marzo, crea entradas de abril con sus actualizaciones y las escribe a través de la API SQL. Ahora tiene un pronóstico continuo de 12 meses por el que puede desplazarse en la interfaz de usuario web.

Una buena rutina mensual: al final de cada mes, abre Claude Code y di algo como:

```
> Compare my actual spending this month against the budget.
> For any category where I spent more than 20% over budget,
> adjust next month's forecast to be more realistic.
```

Claude Code lee los datos reales de `ledger_entries`, los compara con el plan en `budget_lines` y actualiza el pronóstico. Este es el tipo de análisis que lleva 30 minutos manualmente y 2 minutos con Claude Code.

## Trabajar con múltiples monedas

Si tiene cuentas en diferentes monedas, Claude Code se encarga de esto de forma natural. El rastreador de gastos almacena cada transacción en su moneda original y obtiene los tipos de cambio diariamente del BCE, CBR y NBS.

```
> I received €2,500 freelance payment into wise-eur yesterday.
> Record it as income, category: freelance.
```

Claude Code escribe el INSERT con `currency: 'EUR'` y la cantidad correcta. Cuando luego pregunta "¿cuál es mi ingreso total este mes en USD?", la base de datos realiza la conversión de moneda en el momento de la consulta utilizando los últimos tipos de cambio. Claude Code simplemente informa el resultado.

## Qué puede hacer Claude Code que las UI web no pueden hacer

El poder de Claude Code para las finanzas personales proviene de combinar el acceso a archivos, las solicitudes HTTP y la conversación en una sola herramienta:

**Procesamiento por lotes.** Coloque cinco extractos bancarios de diferentes cuentas en una carpeta y dígale a Claude Code que los procese todos. Lee cada archivo, inserta transacciones en las cuentas correctas y verifica los saldos al final. Hacer esto en una interfaz de usuario web tomaría una hora de hacer clic.

**Análisis personalizado.** "¿Qué meses del último año tuvieron el mayor gasto en entretenimiento y cuáles fueron las transacciones más importantes?" Ninguna aplicación de presupuesto tiene un botón para eso. Claude Code escribe la consulta SQL, la ejecuta y explica los resultados.

**Conversión de formato.** ¿Su banco exporta un formato extraño CSV con columnas fusionadas y formato de fecha europeo? Dile a Claude Code que lo limpie primero. Reescribe el archivo localmente y luego importa la versión limpia.

**Secuencias de comandos.** Pídale a Claude Code que escriba una secuencia de comandos Python que pueda reutilizar: "Escriba una secuencia de comandos que importe un CSV de Chase y registre todas las transacciones. Guárdelo en ~/finances/import-chase.py". La próxima vez, simplemente ejecute el script directamente, con o sin Claude Code.

## El esquema de base de datos con el que trabaja Claude Code

La API de la máquina Expense Budget Tracker expone un pequeño conjunto de relaciones con las que los agentes de IA pueden trabajar fácilmente. El conjunto permitido lo publica `GET /v1/schema`.

|Mesa|lo que almacena|
|---|---|
|`ledger_entries`|Cada transacción de ingresos y gastos|
|`budget_lines`|Plan presupuestario: importes por categoría por mes|
|`budget_comments`|Notas sobre celdas presupuestarias específicas|
|`exchange_rates`|Tasas de cambio diarias (obtenidas automáticamente)|
|`workspace_settings`|Preferencia de moneda de informes|
|`account_metadata`|Clasificación de liquidez de la cuenta|
|`accounts`|VER: saldos corrientes por cuenta|

La tabla `ledger_entries` tiene columnas claras: `event_id`, `ts`, `account_id`, `amount`, `currency`, `kind`, `category`, `counterparty`, `note`. Claude Code puede escribir declaraciones INSERT correctas en el primer intento porque los nombres de las columnas describen exactamente lo que contienen.

## Seguridad y control de acceso

Dar acceso a Claude Code a su base de datos de gastos es seguro dentro de las limitaciones de la API SQL:

Cada consulta se ejecuta a través de la seguridad de nivel de fila Postgres. La clave API está vinculada a su usuario y SQL se ejecuta solo en el espacio de trabajo seleccionado: Claude Code solo puede ver sus datos, incluso en una base de datos compartida.

Sólo se permite una declaración por solicitud. Los tipos de declaraciones admitidos son `SELECT`, `WITH`, `INSERT`, `UPDATE` y `DELETE`. Claude Code no puede crear ni eliminar tablas, no puede utilizar contenedores de transacciones, no puede llamar a `set_config()` y no puede enviar comentarios o identificadores entre comillas a SQL. La API SQL aplica este lado del servidor, independientemente de lo que Claude Code intente enviar.

Las claves API se almacenan como hashes SHA-256: el texto sin formato nunca está en la base de datos. Las claves se pueden revocar más tarde desde el producto. Los límites de velocidad limitan el uso a 10 solicitudes/segundo y 10 000 por día, con un tiempo de espera de 30 segundos y un límite de 100 filas por respuesta.

La clave API permanece en su variable de entorno local. Claude Code lo lee de `$EXPENSE_BUDGET_TRACKER_API_KEY` cuando realiza solicitudes; nunca es necesario comprometerlo con su proyecto.

## Alternativa avanzada: HTTP directo sin inicio de sesión nativo del agente

Si ya tiene un Expense Budget Tracker ApiKey de larga duración, Claude Code puede omitir la configuración del correo electrónico OTP y simplemente usar esa clave existente. En ese modo, todavía llamas a los mismos puntos finales:

- `GET /v1/openapi.json` para la especificación legible por máquina publicada
- `GET /v1/schema` para las relaciones permitidas
- `POST /v1/sql` para las consultas reales

Esto es útil para scripts estables y entornos preconfigurados, pero para la mayoría de las personas, la URL de descubrimiento más el flujo OTP es la configuración más sencilla.

## Un flujo de trabajo real: seguimiento de gastos semanales en 10 minutos

Kirill Markin ha estado ejecutando exactamente este flujo de trabajo durante años, y todo se reduce a una sesión semanal que se parece más o menos a esto:

1. Descargue extractos bancarios de todas las cuentas (2 minutos)
2. Abra Claude Code, dígale que procese los archivos (3 minutos: Claude Code hace el trabajo, ya mira)
3. Revise lo que registró Claude Code, corrija las categorías incorrectas (3 minutos)
4. Solicite a Claude Code que verifique que todos los saldos de las cuentas coincidan con el banco (1 minuto)
5. Si es fin de mes, solicite a Claude Code que compare los datos reales con el presupuesto y actualice el pronóstico (2 minutos)

Son 10 minutos para obtener una imagen completa de sus finanzas: cada transacción categorizada, cada saldo verificado y presupuesto actualizado. El sistema funciona porque las partes aburridas (analizar, categorizar, insertar, calcular) son exactamente en lo que Claude Code es bueno, y las partes de juicio (revisar categorías, decidir ajustes presupuestarios) se quedan con usted.

## Comenzando con Claude Code y Expense Budget Tracker

1. [Instala Claude Code](https://docs.anthropic.com/en/docs/claude-code) si aún no lo has hecho
2. Regístrese en [expense-budget-tracker.com](https://expense-budget-tracker.com/es/) o [self-host](https://github.com/kirill-markin/expense-budget-tracker) la aplicación
3. Dar Claude Code `https://api.expense-budget-tracker.com/v1/`
4. Complete el flujo de correo electrónico OTP y guarde la clave devuelta como `EXPENSE_BUDGET_TRACKER_API_KEY`.
5. Guarde un espacio de trabajo predeterminado para esa clave.
6. Agregue un `CLAUDE.md` local con sus categorías, cuentas y reglas de flujo de trabajo.
7. Abra Claude Code en su directorio de finanzas e ingrese su primer extracto bancario.

Claude Code inspeccionará el esquema, hará coincidir sus categorías y comenzará a registrar transacciones. Revise los resultados, corrija cualquier cosa que parezca mal y tendrá una configuración de seguimiento de gastos impulsada por IA ejecutándose desde su terminal.

El rastreador de gastos tiene licencia del MIT y es de código abierto en [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker). Claude Code está disponible en [docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code). Para empezar, ambas herramientas son gratuitas.
