---
title: "Rastreador de presupuesto Open Source autoalojado para desarrolladores: sea dueño de sus datos financieros"
description: "Por qué los programadores deberían alojar su rastreador de gastos en su propio servidor. Implemente un rastreador de presupuesto de código abierto con API SQL, integración de agentes de IA y control total sobre su base de datos Postgres."
date: "2026-03-05"
---

Si es desarrollador, sus datos financieros probablemente residan en el servidor de otra persona. Cada aplicación de seguimiento de presupuestos y gastos (Mint, YNAB, Copilot, Lunch Money) almacena sus transacciones, saldos y patrones de gastos en su nube. Confías en que no serán vulnerados, que no venderán tus datos y que no cerrarán (RIP Mint, 2024).

Hay una mejor opción si se siente cómodo con Docker y Postgres: alojar usted mismo un rastreador de presupuesto de código abierto y mantener todo en su propia infraestructura.

## Rastreador de gastos de código abierto que usted mismo implementa

[Expense Budget Tracker](https://github.com/kirill-markin/expense-budget-tracker) es un sistema de seguimiento de gastos y presupuestos totalmente de código abierto creado en Postgres. Clona el repositorio, ejecuta `make up` y obtiene una aplicación que funciona en `localhost:3000` con una base de datos real que usted controla.

Sin creación de cuenta, sin salida de datos de su máquina y sin tarifas de suscripción. Licencia MIT: bifurca, modifícala, haz lo que quieras.

![Tabla de presupuesto que muestra datos reales pasados, seguimiento del mes actual y pronóstico mensual futuro por categoría](/blog/budget-view-example.jpg)

La pila es sencilla: Next.js para la interfaz de usuario web, Postgres 18 para almacenamiento y un trabajador TypeScript que recupera los tipos de cambio diarios. Todo se ejecuta en contenedores Docker a través de un único `docker-compose.yml`.

## Hospede automáticamente con Docker o implemente en AWS

El repositorio viene con dos opciones de implementación listas para usar:

**Docker Compose local**: cuatro comandos y estarás ejecutando:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
open -a Docker   # start Docker if not running
make up          # Postgres + migrations + web + worker
```

Abra `http://localhost:3000` y comience a ingresar transacciones. Los datos de Postgres persisten en un volumen Docker. Esa es toda la configuración.

**AWS CDK**: una implementación de producción completa con un script:

```bash
bash scripts/bootstrap.sh --region eu-central-1
```

Esto activa ECS Fargate, RDS Postgres, ALB con HTTPS, Cognito para autenticación, WAF, monitoreo de CloudWatch, copias de seguridad automatizadas y CI/CD a través de acciones GitHub. El costo estimado es de alrededor de $50 al mes y obtienes una infraestructura de nivel empresarial de tu entera propiedad. La [guía de implementación](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) explica cada paso, desde la creación de la cuenta AWS hasta la configuración de DNS de Cloudflare.

Dado que es solo Postgres + Docker, también puedes alojarlo tú mismo en cualquier otro lugar. DigitalOcean, Hetzner, una Raspberry Pi en su armario, el clúster Kubernetes de su empresa: si ejecuta Docker y Postgres, ejecuta esto.

## Punto final API SQL para acceso programático

La mayoría de las aplicaciones económicas te ofrecen una interfaz de usuario web y nada más. Este expone una **API de consulta SQL** a través de HTTP: un punto final `POST /v1/sql` que acepta declaraciones SQL sin procesar y devuelve JSON.

```bash
curl -X POST https://api.your-domain.com/v1/sql \
  -H "Authorization: ApiKey ebta_a7Bk9mNp..." \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT category, SUM(amount) AS total FROM ledger_entries WHERE kind = '\''spend'\'' AND ts >= DATE_TRUNC('\''month'\'', CURRENT_DATE) GROUP BY category ORDER BY total"}'
```

Usted genera una clave API en Configuración, elige el ID del espacio de trabajo de destino y cualquier cliente HTTP puede consultar sus datos. Este es un punto final REST simple: sin GraphQL, sin abstracciones ORM, sin SDK que aprender. Solo entra SQL, sale JSON.

El modelo de seguridad es estricto: las claves API se almacenan como hashes SHA-256 (el texto sin formato nunca persiste), las consultas están restringidas a SELECT/INSERT/UPDATE/DELETE (sin DDL), hay un tiempo de espera de declaración de 30 segundos, un límite de 100 filas por respuesta y una tasa por clave limitada a 10 solicitudes/segundo. Todas las consultas se ejecutan a través de Postgres Row Level Security (el mismo aislamiento utilizado por la aplicación web), por lo que una clave API solo puede acceder a los datos en el espacio de trabajo de su propietario.

## Creado para agentes de IA y LLM

La API SQL es lo que hace que la integración de la IA sea práctica para las finanzas personales: su agente de IA necesita acceso directo a la base de datos para leer y escribir datos financieros.

Piense en cómo interactúa hoy con los asistentes de IA. Pegas una captura de pantalla de un extracto bancario en Claude o ChatGPT, le pides que clasifique tus gastos y te proporciona un bonito resumen de texto. Luego copia manualmente esos números en cualquier herramienta que utilice. Ese es un flujo de trabajo a partir de 2023.

Con una API SQL, su agente de IA no solo analiza sus datos, sino que **escribe en su base de datos**. El flujo de trabajo se convierte en:

1. Introduzca un extracto bancario (CSV, PDF o captura de pantalla) en un agente de IA.
2. El agente lee cada transacción, relaciona las categorías con las existentes y `INSERT` las convierte en `ledger_entries`.
3. El agente verifica el saldo de su cuenta con el número del banco.
4. Pasas 5 minutos revisando en lugar de una hora ingresando datos

El esquema de la base de datos está diseñado para esto. Siete tablas planas, sin JSON anidado y sin necesidad de uniones complejas para operaciones básicas. La tabla `ledger_entries` es intencionalmente simple: una fila por movimiento de cuenta con nombres de columna claros. Un LLM puede escribir declaraciones INSERT correctas en el primer intento porque no hay nada de qué confundirse.

Expense Budget Tracker también incluye un **chat de IA integrado** en la interfaz de usuario web. Conecte su clave OpenAI o Anthropic API y obtendrá un asistente que tiene una herramienta `query_database`: puede SELECCIONAR, INSERTAR, ACTUALIZAR y ELIMINAR directamente en su Postgres. Cargue una captura de pantalla de su aplicación bancaria y la IA analizará cada transacción, le pedirá que la confirme y las insertará. Sigue un protocolo estricto: descubra primero sus categorías existentes, verifique si hay duplicados, verifique que los saldos coincidan y solo escriba después de su aprobación explícita.

El chat de IA admite los modelos Claude (Anthropic) y GPT (OpenAI). Ambos utilizan la misma herramienta de base de datos con las mismas reglas de seguridad: listas blancas de palabras clave, tiempos de espera de declaraciones y cumplimiento de RLS. También puede usar la API SQL con cualquier agente externo: [Claude Code](https://docs.anthropic.com/en/docs/claude-code), OpenAI Codex, scripts personalizados o webhooks Zapier. Proporcione al agente su clave API `ebt_`, apúntela a su punto final y tendrá acceso completo de lectura/escritura en su espacio de trabajo.

## Funciones del rastreador de presupuesto

Este no es un libro de gastos básico. Todas las características que esperarías de un producto comercial están ahí:

- **Cuadrícula de presupuesto**: las filas son categorías, las columnas son meses. Los meses pasados ​​muestran datos reales, los meses futuros muestran su pronóstico. Planifique con 12 meses de anticipación y vea los saldos proyectados de un vistazo
- **Soporte multidivisa**: almacene cada transacción en su moneda nativa. Los tipos de cambio diarios del BCE, CBR y NBS se obtienen automáticamente. La conversión a la moneda de sus informes se produce en el momento de la consulta a través de combinaciones SQL: sin columnas precalculadas ni pérdida de precisión.
- **Saldos de cuentas**: realice un seguimiento de cuentas corrientes, ahorros, tarjetas de crédito, efectivo e inversiones. Cada cuenta tiene un saldo corriente derivado del libro mayor.
- **Transferencias**: mueve dinero entre tus propias cuentas (incluso entre divisas). Dos asientos contables con el mismo `event_id`, uno negativo y otro positivo
- **Categorización de transacciones**: categorías de formato libre que usted define. Sin taxonomía forzada. La IA aprende sus categorías a partir de datos existentes
- **UI multilingüe**: inglés, español, chino, árabe, hebreo, farsi, ucraniano y ruso. Soporte completo RTL
- **Aislamiento del espacio de trabajo**: Postgres La seguridad de nivel de fila garantiza que los datos de cada usuario estén completamente aislados. Incluso si comparte el mismo servidor de base de datos, los usuarios no pueden ver los datos de los demás.
- **Modo de demostración**: alterna un botón en la interfaz de usuario para cambiar a los datos de demostración en la memoria. No se requiere base de datos para explorar la interfaz

## Esquema Postgres creado para desarrolladores

Todo el esquema cabe en tu cabeza:

- `ledger_entries`: una fila por movimiento de cuenta (la tabla principal)
- `budget_lines`: plan presupuestario de solo agregar (la última escritura gana por celda)
- `budget_comments` — notas sobre celdas de presupuesto
- `exchange_rates`: tipos de cambio diarios (globales, sin control de acceso)
- `workspace_settings`: moneda de informe por espacio de trabajo
- `account_metadata` — clasificación de liquidez
- `accounts`: una VISTA derivada de `ledger_entries`

Sin ORM. Sin marco de migración. Archivos SQL recién numerados en `db/migrations/` aplicados mediante un script de shell. Puede leer cada migración, comprender cada tabla y escribir consultas directamente en el esquema.

Los cambios de esquema pasan por migraciones. La función de base de datos `app` (utilizada por la aplicación web) tiene privilegios limitados: no puede crear tablas ni modificar esquemas. La función `tracker` (utilizada únicamente por el script de migración) maneja DDL. Este es el tipo de separación de preocupaciones que se esperaría en un sistema de producción.

## ¿Por qué los desarrolladores alojan ellos mismos sus datos financieros?

Ya tienes las habilidades para ejecutar esto. Entiendes Docker, Postgres y AWS (o cualquier nube que prefieras). La pregunta es si los beneficios justifican el esfuerzo.

**Propiedad total de los datos**: sus datos de finanzas personales nunca abandonan su infraestructura. Ningún incumplimiento de terceros le afecta. No hay políticas de privacidad para leer. No se venden análisis sobre sus hábitos de gasto a los anunciantes.

**Personalización**: agregue columnas al esquema, cree informes personalizados con SQL sin procesar y conéctelo a sus herramientas existentes. ¿Quieres un bot de Telegram que informe los gastos diarios? Escriba un script que llame a la API SQL. ¿Quieres visualizar datos en Grafana? Apunte a la base de datos Postgres. El código es tuyo para modificarlo.

**Sin dependencia del proveedor**: si deja de usar la interfaz de usuario web, sus datos seguirán en una base de datos estándar Postgres. Exportarlo con `pg_dump`, consultarlo desde cualquier cliente SQL o migrarlo a algo completamente distinto.

**Aprendizaje**: el código base es un ejemplo del mundo real de Next.js + Postgres + Docker + AWS CDK + Seguridad de nivel de fila + autenticación de clave API + integración de herramientas de IA. Si está creando un producto SaaS, encontrará patrones que vale la pena robar.

## Comience con el rastreador de presupuestos de código abierto

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

Abra `http://localhost:3000`. Ingrese su primera transacción. Configure un presupuesto para el mes actual. Si desea realizar la prueba sin una base de datos, haga clic en el botón Demostración en el encabezado para cambiar a datos de muestra en memoria.

Cuando esté listo para la producción, siga la [guía de implementación AWS](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) o adapte la configuración de Docker Compose para su propia infraestructura.

El repositorio está en [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker). Inicie, bifurque o simplemente lea el código. Tiene licencia del MIT; úselo como quiera.

Si ya administra servidores y bases de datos para el trabajo, ejecutar la misma pila para sus finanzas personales es un pequeño paso y obtendrá control total sobre los datos.
