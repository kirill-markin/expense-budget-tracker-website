---
title: "Rastreador de presupuesto de código abierto para desarrolladores: controla tus datos financieros"
description: "Por qué a los desarrolladores les conviene alojar su rastreador de gastos en su propia infraestructura. Despliega un rastreador de presupuesto de código abierto con API SQL, integración con agentes de IA y control total sobre tu base de datos Postgres."
date: "2026-03-05"
---

Si eres desarrollador, lo más probable es que tus datos financieros estén en servidores de terceros. Todas las aplicaciones de presupuesto y seguimiento de gastos, como Mint, YNAB, Copilot o Lunch Money, guardan tus transacciones, saldos y patrones de gasto en su nube. Confías en que no sufran una brecha de seguridad, en que no vendan tus datos y en que no desaparezcan de un día para otro (RIP Mint, 2024).

Si te manejas bien con Docker y Postgres, hay una alternativa mejor: alojar tú mismo un rastreador de presupuesto de código abierto y mantener todo dentro de tu propia infraestructura.

## Rastreador de gastos de código abierto que despliegas tú mismo

[Expense Budget Tracker](https://github.com/kirill-markin/expense-budget-tracker) es un sistema de seguimiento de gastos y presupuestos completamente de código abierto construido sobre Postgres. Clonas el repositorio, ejecutas `make up` y tienes una aplicación funcionando en `localhost:3000` con una base de datos real bajo tu control.

Sin crear cuentas, sin enviar datos fuera de tu máquina y sin cuotas de suscripción. Licencia MIT: puedes bifurcarlo, modificarlo y usarlo como quieras.

![Tabla de presupuesto con importes reales de meses anteriores, seguimiento del mes actual y previsión mensual futura por categoría](/blog/budget-view-example.jpg)

La pila es directa: Next.js para la interfaz web, Postgres 18 para el almacenamiento y un proceso en TypeScript que obtiene los tipos de cambio diarios. Todo se ejecuta en contenedores Docker a través de un único `docker-compose.yml`.

## Alojamiento propio con Docker o despliegue en AWS

El repositorio trae dos opciones de despliegue listas para usar:

**Docker Compose local**: con cuatro comandos ya lo tienes en marcha:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
open -a Docker   # start Docker if not running
make up          # Postgres + migrations + web + worker
```

Abre `http://localhost:3000` y empieza a introducir transacciones. Los datos de Postgres se conservan en un volumen de Docker. No hace falta nada más.

**AWS CDK**: un despliegue completo de producción con un solo script:

```bash
bash scripts/bootstrap.sh --region eu-central-1
```

Esto levanta ECS Fargate, RDS Postgres, un ALB con HTTPS, Cognito para autenticación, WAF, monitorización con CloudWatch, copias de seguridad automáticas y CI/CD con GitHub Actions. El coste estimado ronda los 50 dólares al mes, y a cambio obtienes una infraestructura de nivel empresarial que controlas por completo. La [guía de despliegue](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) explica todo el proceso, desde crear la cuenta de AWS hasta configurar el DNS en Cloudflare.

Como al final esto es Postgres + Docker, también puedes alojarlo en cualquier otro entorno. DigitalOcean, Hetzner, una Raspberry Pi en casa, el clúster de Kubernetes de tu empresa: si puede ejecutar Docker y Postgres, puede ejecutar esto.

## API SQL para acceso programático

La mayoría de las aplicaciones de presupuesto te ofrecen una interfaz web y poco más. Esta expone una **API de consultas SQL** por HTTP: un endpoint `POST /v1/sql` que acepta sentencias SQL en crudo y devuelve JSON.

```bash
curl -X POST https://api.your-domain.com/v1/sql \
  -H "Authorization: ApiKey ebta_a7Bk9mNp..." \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT category, SUM(amount) AS total FROM ledger_entries WHERE kind = '\''spend'\'' AND ts >= DATE_TRUNC('\''month'\'', CURRENT_DATE) GROUP BY category ORDER BY total"}'
```

Generas una clave API en Settings, eliges el ID del espacio de trabajo de destino y cualquier cliente HTTP puede consultar tus datos. Es un punto de acceso REST sencillo: sin GraphQL, sin abstracciones de ORM y sin SDK que aprender. Entra SQL, sale JSON.

El modelo de seguridad es estricto: las claves API se guardan como hashes SHA-256, así que el valor en texto plano nunca se persiste; las consultas están limitadas a SELECT/INSERT/UPDATE/DELETE, sin DDL; hay un límite de 30 segundos por sentencia, un máximo de 100 filas por respuesta y una limitación de 10 peticiones por segundo para cada clave. Todas las consultas pasan por Row Level Security de Postgres, el mismo aislamiento que usa la aplicación web, así que una clave API solo puede acceder a los datos del espacio de trabajo de su propietario.

## Diseñado para agentes de IA y LLM

La API SQL es lo que hace realmente práctica la integración con IA en finanzas personales: tu agente necesita acceso directo a la base de datos para leer y escribir información financiera.

Piensa en cómo usas hoy los asistentes de IA. Pegas una captura de pantalla de un extracto bancario en Claude o ChatGPT, le pides que clasifique los gastos y te devuelve un resumen bonito en texto. Después copias esos números a mano en la herramienta que uses. Ese es un flujo de trabajo propio de 2023.

Con una API SQL, tu agente de IA no se limita a analizar tus datos: también **escribe en tu base de datos**. El flujo pasa a ser este:

1. Arrastras un extracto bancario, ya sea CSV, PDF o una captura de pantalla, a un agente de IA.
2. El agente lee cada transacción, la asigna a tus categorías existentes y hace `INSERT` en `ledger_entries`.
3. El agente comprueba que el saldo de la cuenta coincide con la cifra del banco.
4. Tú dedicas 5 minutos a revisar en vez de una hora a introducir datos.

El esquema de la base de datos está pensado justo para esto. Son siete tablas planas, sin JSON anidado y sin uniones SQL complejas para las operaciones básicas. La tabla `ledger_entries` es deliberadamente simple: una fila por movimiento de cuenta y nombres de columna claros. Un LLM puede generar sentencias INSERT correctas al primer intento porque no hay nada confuso en el esquema.

Expense Budget Tracker también incluye un **chat de IA integrado** en la interfaz web. Conectas tu clave API de OpenAI o Anthropic y obtienes un asistente con la herramienta `query_database`, capaz de hacer SELECT, INSERT, UPDATE y DELETE directamente sobre tu Postgres. Subes una captura de pantalla de tu aplicación bancaria, la IA interpreta cada transacción, te pide confirmación y las inserta. Sigue un protocolo estricto: primero descubre tus categorías existentes, después busca duplicados, comprueba que los saldos cuadren y solo escribe cuando le das tu aprobación explícita.

El chat de IA es compatible con modelos Claude de Anthropic y GPT de OpenAI. Ambos usan la misma herramienta de base de datos y las mismas reglas de seguridad: listas blancas de palabras clave, límites de tiempo por sentencia y aplicación de RLS. También puedes usar la API SQL con cualquier agente externo: [Claude Code](https://docs.anthropic.com/en/docs/claude-code), OpenAI Codex, scripts a medida o webhooks de Zapier. Le das al agente tu clave API `ebt_`, le indicas tu endpoint y tendrá acceso de lectura y escritura limitado a tu espacio de trabajo.

## Funciones del rastreador de presupuesto

Esto no es un simple libro de gastos. Incluye las funciones que esperarías de un producto comercial:

- **Cuadrícula de presupuesto**: las filas son categorías y las columnas, meses. Los meses pasados muestran importes reales y los futuros, tu previsión. Puedes planificar con 12 meses de antelación y ver de un vistazo los saldos proyectados.
- **Soporte multidivisa**: cada transacción se guarda en su moneda original. Los tipos de cambio diarios del BCE, el CBR y el NBS se obtienen automáticamente. La conversión a tu moneda de referencia se hace en tiempo de consulta mediante uniones SQL, sin columnas precalculadas ni pérdida de precisión.
- **Saldos de cuentas**: puedes seguir cuentas corrientes, ahorros, tarjetas de crédito, efectivo e inversiones. Cada cuenta tiene un saldo acumulado derivado del libro mayor.
- **Transferencias**: mueve dinero entre tus propias cuentas, incluso entre distintas monedas. Son dos asientos en el libro mayor con el mismo `event_id`, uno negativo y otro positivo.
- **Categorización de transacciones**: tú defines libremente las categorías. No hay una taxonomía impuesta. La IA aprende tus categorías a partir de los datos existentes.
- **Interfaz multilingüe**: inglés, español, chino, árabe, hebreo, persa, ucraniano y ruso. Con soporte RTL completo.
- **Aislamiento por espacio de trabajo**: Row Level Security de Postgres garantiza que los datos de cada usuario estén completamente separados. Aunque varios usuarios compartan el mismo servidor de base de datos, no pueden ver los datos de los demás.
- **Modo demo**: puedes activar un botón en la interfaz para cambiar a datos de demostración en memoria. No hace falta una base de datos para explorar la aplicación.

## Esquema de Postgres pensado para desarrolladores

El esquema entero cabe en la cabeza:

- `ledger_entries` — una fila por movimiento de cuenta, la tabla principal
- `budget_lines` — plan presupuestario de solo inserción, donde en cada celda prevalece la última escritura
- `budget_comments` — notas sobre celdas del presupuesto
- `exchange_rates` — tipos de cambio diarios, globales y sin control de acceso
- `workspace_settings` — moneda de referencia por espacio de trabajo
- `account_metadata` — clasificación de liquidez
- `accounts` — una VIEW derivada de `ledger_entries`

Sin ORM. Sin framework de migraciones. Solo archivos SQL numerados en `db/migrations/`, aplicados mediante un script de shell. Puedes leer cada migración, entender cada tabla y escribir consultas directamente contra el esquema.

Los cambios del esquema pasan por migraciones. El rol de base de datos `app`, que usa la aplicación web, tiene privilegios limitados: no puede crear tablas ni modificar el esquema. El rol `tracker`, que solo utiliza el script de migración, se encarga del DDL. Es la clase de separación de responsabilidades que esperarías en un sistema de producción.

## Por qué los desarrolladores alojan sus datos financieros por su cuenta

Ya tienes las habilidades necesarias para ejecutar esto. Entiendes Docker, Postgres y AWS, o la nube que prefieras. La cuestión es si las ventajas compensan el esfuerzo.

**Control total sobre los datos**: tus datos de finanzas personales nunca salen de tu infraestructura. No te afecta ninguna brecha de un tercero. No hay políticas de privacidad interminables que leer. Nadie vende a anunciantes análisis sobre tus hábitos de gasto.

**Personalización**: puedes añadir columnas al esquema, crear informes con SQL puro y conectarlo a tus herramientas habituales. ¿Quieres un bot de Telegram que te informe del gasto diario? Escribes un script que llame a la API SQL. ¿Quieres visualizar los datos en Grafana? Apuntas a la base de datos Postgres. El código es tuyo y puedes modificarlo como quieras.

**Sin dependencia del proveedor**: si dejas de usar la interfaz web, tus datos siguen en una base de datos Postgres estándar. Puedes exportarlos con `pg_dump`, consultarlos desde cualquier cliente SQL o migrarlos a otra cosa cuando quieras.

**Aprendizaje**: la base de código es un ejemplo real de Next.js + Postgres + Docker + AWS CDK + Row Level Security + autenticación con claves API + integración de herramientas de IA. Si estás construyendo un producto SaaS, aquí hay patrones que merece la pena tomar prestados.

## Empieza con el rastreador de presupuesto de código abierto

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

Abre `http://localhost:3000`. Introduce tu primera transacción. Configura un presupuesto para el mes actual. Si quieres probarlo sin base de datos, haz clic en el botón Demo del encabezado para cambiar a datos de ejemplo en memoria.

Cuando quieras llevarlo a producción, sigue la [guía de despliegue en AWS](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) o adapta la configuración de Docker Compose a tu propia infraestructura.

El repositorio está en [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker). Puedes marcarlo con una estrella, bifurcarlo o simplemente leer el código. Tiene licencia MIT, así que úsalo como te convenga.

Si ya administras servidores y bases de datos en el trabajo, usar la misma pila para tus finanzas personales es un paso pequeño a cambio de obtener control total sobre tus datos.
