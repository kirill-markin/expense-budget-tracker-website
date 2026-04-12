---
title: "Cómo llevar el control de tus gastos y gestionar tu presupuesto con Claude Code"
description: "Usa Claude Code como asistente de finanzas personales. Dale una URL de descubrimiento, deja que complete el flujo OTP por correo electrónico, guarda la ApiKey devuelta y podrás analizar extractos, comprobar saldos y gestionar tu presupuesto desde la terminal."
date: "2026-03-05"
keywords:
  - "Claude Code para finanzas personales"
  - "seguimiento de gastos con Claude Code"
  - "gestionar presupuesto con Claude Code"
  - "importar extractos bancarios con IA"
  - "presupuesto desde la terminal"
  - "Expense Budget Tracker"
  - "API de gastos personales"
---

Claude Code es el agente de IA de Anthropic que se ejecuta en tu terminal. Puede leer archivos, escribir código, ejecutar comandos y hacer peticiones HTTP. La mayoría de la gente lo usa para desarrollar software. Pero también encaja muy bien en finanzas personales cuando lo conectas a un rastreador de gastos con una API para agentes bien definida.

La idea es simple: conectas Claude Code a un rastreador de gastos de código abierto mediante su API para agentes y pasa a ser un asistente financiero que vive en la terminal. Sueltas un extracto bancario, le pides que registre las transacciones, que revise tus saldos, que actualice tu presupuesto, y todo ocurre dentro de una conversación natural. Sin ir saltando por pantallas de la interfaz ni meter datos a mano.

## Por qué Claude Code funciona bien para el seguimiento de gastos

Claude Code se diferencia de ChatGPT o de la aplicación web de Claude en varios puntos importantes para las finanzas personales:

**Se ejecuta en local y puede leer tus archivos.** Cuando descargas un extracto bancario en CSV o PDF, Claude Code puede leerlo directamente desde tu sistema de archivos. Sin subir archivos, sin copiar y pegar, sin capturas de pantalla. Le dices "analiza el extracto bancario de ~/Downloads/chase-march-2026.csv" y Claude Code lee el archivo.

**Puede ejecutar código y solicitudes HTTP.** Claude Code no se limita a sugerirte un comando `curl`: lo ejecuta. Si necesita insertar 50 transacciones en tu base de datos de gastos, escribe el SQL, envía la solicitud HTTP y comprueba el resultado. Todo el flujo ocurre dentro de una sola conversación.

**Recuerda la configuración entre sesiones.** Una vez que la ApiKey devuelta se guarda fuera de la memoria del chat, Claude Code puede reutilizar esa misma conexión en sesiones posteriores en vez de repetir cada vez el flujo del código enviado por correo.

**Trabaja con archivos locales aunque el preprocesado sea sin conexión.** Si quieres limpiar el formato de un CSV, preparar extractos bancarios o escribir scripts de importación, Claude Code puede hacer todo eso en local antes de tocar la API.

## Cómo configurar Claude Code para tus finanzas personales

Necesitas dos cosas: un rastreador de gastos con una API para agentes y un lugar donde guardar de forma persistente la clave de larga duración que Claude Code recibe al iniciar sesión.

[Expense Budget Tracker](https://expense-budget-tracker.com/es/) es un sistema de finanzas personales de código abierto basado en Postgres. Su URL canónica de descubrimiento es `GET https://api.expense-budget-tracker.com/v1/`. Puedes registrarte en la versión alojada o [autoalojarlo](https://github.com/kirill-markin/expense-budget-tracker) en tu propio servidor.

### Paso 1: Dale a Claude Code la URL de descubrimiento

Indica a Claude Code que se conecte usando:

```text
https://api.expense-budget-tracker.com/v1/
```

Claude Code debería empezar leyendo la respuesta de descubrimiento y después pedirte:

- el correo electrónico de tu cuenta
- el código de 8 dígitos enviado a tu bandeja de entrada

Cuando verifica ese código, el servicio devuelve una clave de larga duración en el formato real de la API, por ejemplo `ebta_...`.

### Paso 2: Guarda la clave devuelta fuera de la memoria del chat

El flujo de autenticación es cómodo, pero la clave sigue necesitando un lugar persistente. El backend indica explícitamente a los agentes que no deben depender solo del historial del chat.

Un patrón sencillo es este:

```bash
export EXPENSE_BUDGET_TRACKER_API_KEY="ebta_your_key_here"
```

Si quieres que Claude Code la guarde en un archivo `.env` local, apruébalo explícitamente. Si no, mantenla en la shell durante la sesión actual y guárdala tú en un lugar persistente.

### Paso 3: Guarda tu espacio de trabajo una sola vez

Después de verificar el código, Claude Code debería cargar tu cuenta y tus espacios de trabajo:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

Luego guarda una vez el espacio de trabajo predeterminado para esa clave:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace-id/select \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

Después de eso, `/v1/sql` ya puede omitir `X-Workspace-Id`. Si tu cuenta tiene exactamente un espacio de trabajo, la API lo guarda y lo usa automáticamente la primera vez.

### Paso 4: Añade un archivo local de instrucciones con tus convenciones

Claude Code funciona todavía mejor si le das tus categorías, tus cuentas y tus reglas de trabajo. Para eso va muy bien un `CLAUDE.md` local:

```markdown
# Finanzas personales

## API del rastreador de gastos

- Punto final: https://api.expense-budget-tracker.com/v1/sql
- Autenticación: ApiKey en la cabecera Authorization
- La clave API está en la variable de entorno EXPENSE_BUDGET_TRACKER_API_KEY
- Solicitud: POST con cuerpo JSON {"sql": "tu consulta"}
- Respuesta: {"rows": [...], "rowCount": N}

## Mis categorías de gastos

Ingresos: sueldo, freelance, proyectos-secundarios
Fijos: alquiler, suministros, seguros, suscripciones
Diario: supermercado, comer-fuera, transporte, café
Estilo-de-vida: ropa, ocio, salud, viajes
Planificación: impuestos, compras-grandes, ahorro, fondo-de-emergencia

## Mis cuentas

- chase-checking (USD) — cuenta corriente principal
- wise-eur (EUR) — cuenta europea
- cash-usd (USD) — efectivo

## Reglas

- Comprueba siempre las categorías existentes antes de insertar transacciones
- Después de importar, verifica que los saldos de las cuentas coincidan con el banco
- Usa exactamente los nombres de categoría indicados arriba
- Guarda las transacciones en su moneda original
```

### Paso 5: Abre Claude Code y ponte a trabajar

```bash
cd ~/finances
claude
```

Claude Code lee tus instrucciones locales, reutiliza la ApiKey guardada y puede empezar a trabajar de inmediato.

## Cómo analizar extractos bancarios con Claude Code

Aquí es donde Claude Code destaca de verdad. Descarga tu extracto bancario y pídele que lo procese:

```
> He descargado mi extracto de Chase en ~/Downloads/chase-march-2026.csv.
> Analízalo y registra todas las transacciones en mi cuenta chase-checking.
```

Claude Code hará lo siguiente:

1. Leer el archivo CSV desde tu sistema de archivos
2. Analizar cada fila: fecha, importe y descripción
3. Relacionar cada transacción con una de tus categorías de gasto definidas en `CLAUDE.md`
4. Construir sentencias `INSERT` para la tabla `ledger_entries`
5. Enviar cada una a través de la API SQL
6. Devolverte un resumen de lo que registró

Revisas el resultado, le dices a Claude Code que corrija cualquier transacción mal categorizada y listo. Las transacciones de un mes entero, procesadas en unos minutos.

El mismo enfoque también sirve para extractos en PDF o capturas de pantalla de tu app bancaria. Claude Code puede leer imágenes y PDF, extraer los datos de las transacciones y registrarlo todo del mismo modo.

## Cómo comprobar saldos y detectar errores

Después de importar transacciones, conviene verificar siempre que los números cuadren:

```
> Revisa los saldos de mis cuentas y compáralos con lo que veo en el banco:
> chase-checking debería tener $4,230.15
> wise-eur debería tener €1,847.50
```

Claude Code consulta la vista `accounts` a través de la API SQL, compara los saldos y marca cualquier discrepancia. Si `chase-checking` muestra $4,180.15 en lugar de $4,230.15, Claude Code puede ayudarte a encontrar esos $50 que faltan: quizá una transacción se omitió o se contó dos veces.

Esta comprobación semanal de saldos es uno de los hábitos más importantes en finanzas personales. Kirill Markin, creador de Expense Budget Tracker y alguien que lleva más de cinco años categorizando cada transacción personal, hace esta revisión todas las semanas. Es lo que mantiene los datos fiables con el paso del tiempo.

## Qué preguntas puedes hacer sobre tus gastos

Una vez que tus datos estén en la base de datos, Claude Code puede responder prácticamente cualquier pregunta financiera escribiendo consultas SQL:

```
> ¿Cuánto he gastado en comer-fuera en los últimos 3 meses?
```

```
> ¿Cuáles son mis 5 categorías de gasto principales de este mes?
```

```
> Enséñame todas las transacciones de más de $100 de la semana pasada.
```

```
> ¿Cuál es mi gasto medio mensual en supermercado en los últimos 6 meses?
```

Claude Code escribe el SQL, lo ejecuta contra la API y te da la respuesta en lenguaje natural. No necesitas saber SQL, aunque siempre puedes pedirle que te muestre la consulta, comprobar que tiene sentido o ajustarla.

## Cómo gestionar la previsión de tu presupuesto

El seguimiento de gastos registra lo que ya ha pasado. Presupuestar consiste en planificar lo que viene. Ambas cosas viven en la misma base de datos.

La tabla `budget_lines` almacena tu previsión mensual: ingresos esperados y gastos planificados por categoría y por mes. También puedes gestionarla con Claude Code:

```
> Define mi presupuesto de abril de 2026:
> - supermercado: $400
> - comer-fuera: $200
> - alquiler: $2,100
> - sueldo: $8,500
> Copia todo lo demás del presupuesto de marzo.
```

Claude Code lee las líneas presupuestarias de marzo, crea las de abril con tus cambios y las escribe a través de la API SQL. Así tienes una previsión continua de 12 meses que luego puedes revisar en la interfaz web.

Una buena rutina mensual es abrir Claude Code al final de cada mes y decir algo así:

```
> Compara mi gasto real de este mes con el presupuesto.
> En cualquier categoría en la que haya gastado más de un 20% por encima,
> ajusta la previsión del mes que viene para que sea más realista.
```

Claude Code lee los datos reales desde `ledger_entries`, los compara con el plan de `budget_lines` y actualiza la previsión. Es el tipo de análisis que a mano te llevaría 30 minutos y con Claude Code queda en 2.

## Cómo trabajar con varias monedas

Si tienes cuentas en distintas monedas, Claude Code también encaja bien aquí. El rastreador de gastos guarda cada transacción en su moneda original y obtiene tipos de cambio a diario desde ECB, CBR y NBS.

```
> Ayer recibí un pago freelance de €2,500 en wise-eur.
> Regístralo como ingreso, categoría: freelance.
```

Claude Code escribe el `INSERT` con `currency: 'EUR'` y el importe correcto. Cuando más tarde preguntas "¿cuáles fueron mis ingresos totales de este mes en USD?", la base de datos hace la conversión en el momento de la consulta usando los tipos de cambio más recientes. Claude Code solo te devuelve el resultado.

## Lo que Claude Code puede hacer y una interfaz web no puede

La fuerza de Claude Code para finanzas personales viene de combinar acceso a archivos, solicitudes HTTP y conversación en una sola herramienta:

**Procesamiento por lotes.** Deja cinco extractos bancarios de cuentas distintas en una carpeta y dile a Claude Code que los procese todos. Leerá cada archivo, insertará las transacciones en la cuenta correcta y verificará los saldos al final. Hacer eso en una interfaz web sería una hora de clics.

**Análisis a medida.** "¿Qué meses del último año tuvieron más gasto en ocio y cuáles fueron las transacciones más grandes?" Ninguna app de presupuestos tiene un botón para eso. Claude Code escribe la consulta SQL, la ejecuta y te explica el resultado.

**Conversión de formatos.** ¿Tu banco exporta un CSV raro, con columnas combinadas y fechas en formato europeo? Dile a Claude Code que lo limpie primero. Reescribe el archivo en local y luego importa la versión limpia.

**Automatización con scripts.** Puedes pedirle que escriba un script reutilizable: "Escribe un script en Python que importe un CSV de Chase y registre todas las transacciones. Guárdalo en ~/finances/import-chase.py". La próxima vez solo tendrás que ejecutar el script, con Claude Code o sin él.

## El esquema de base de datos con el que trabaja Claude Code

La API para agentes de Expense Budget Tracker expone un conjunto pequeño de relaciones con las que los agentes de IA pueden trabajar con facilidad. El conjunto permitido se publica en `GET /v1/schema`.

| Tabla | Qué almacena |
|---|---|
| `ledger_entries` | Cada transacción de ingresos y gastos |
| `budget_lines` | El plan presupuestario: importes por categoría y por mes |
| `budget_comments` | Notas sobre celdas concretas del presupuesto |
| `exchange_rates` | Tipos de cambio diarios, obtenidos automáticamente |
| `workspace_settings` | Preferencia de moneda para informes |
| `account_metadata` | Clasificación de liquidez de las cuentas |
| `accounts` | VISTA: saldos acumulados por cuenta |

La tabla `ledger_entries` tiene columnas muy claras: `event_id`, `ts`, `account_id`, `amount`, `currency`, `kind`, `category`, `counterparty`, `note`. Claude Code puede escribir sentencias `INSERT` correctas al primer intento porque los nombres de las columnas describen exactamente lo que contienen.

## Seguridad y control de acceso

Dar a Claude Code acceso a tu base de datos de gastos es razonable dentro de los límites de la API SQL:

Cada consulta se ejecuta con la seguridad a nivel de fila de Postgres. La clave API está vinculada a tu usuario y el SQL solo corre contra el espacio de trabajo seleccionado. Eso significa que Claude Code solo puede ver tus datos, incluso si la base de datos es compartida.

Solo se permite una sentencia por solicitud. Los tipos admitidos son `SELECT`, `WITH`, `INSERT`, `UPDATE` y `DELETE`. Claude Code no puede crear ni borrar tablas, no puede usar contenedores de transacción, no puede llamar a `set_config()` y no puede enviar comentarios SQL ni identificadores entrecomillados. La API SQL lo aplica en el servidor, independientemente de lo que Claude Code intente mandar.

Las claves API se almacenan como hashes SHA-256: el texto en claro nunca entra en la base de datos. Más adelante puedes revocarlas desde el producto. Los límites de uso fijan un máximo de 10 solicitudes por segundo y 10.000 al día, con un tiempo de espera de 30 segundos y un límite de 100 filas por respuesta.

La clave API permanece en tu variable de entorno local. Claude Code la lee desde `$EXPENSE_BUDGET_TRACKER_API_KEY` cuando hace solicitudes. No hace falta incluirla en el proyecto ni subirla al repositorio.
