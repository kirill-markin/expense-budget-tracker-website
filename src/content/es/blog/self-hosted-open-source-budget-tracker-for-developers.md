---
title: "Gestor de presupuesto autoalojado: código abierto, Docker y Postgres"
description: "Ejecuta en local un gestor de gastos y presupuestos de código abierto con Docker y Postgres, y entiende cómo gestionar las copias de seguridad, cuáles son los límites de privacidad y cuándo conviene el acceso alojado."
date: "2026-03-05"
updated: "2026-09-03"
image: "/blog/self-hosted-open-source-budget-tracker-for-developers-v2.png"
keywords:
  - "gestor de presupuesto autoalojado"
  - "gestor de presupuesto de código abierto"
  - "gestor de gastos autoalojado"
  - "gestor de gastos con Docker"
  - "aplicación de presupuesto con Postgres"
  - "finanzas personales para desarrolladores"
---

La configuración actual de Docker Compose exige que elijas un modo de autenticación. Para una instalación local sin inicio de sesión, el comando correcto debe indicarlo de forma explícita:

```bash
AUTH_MODE=none make up
```

Ese pequeño detalle dice mucho sobre lo que supone autoalojar software de finanzas personales. Ejecutar los contenedores es fácil. El verdadero trabajo consiste en decidir quién puede acceder a ellos, dónde residirán las copias de seguridad y qué servicios opcionales pueden recibir datos financieros.

[Expense Budget Tracker](https://github.com/kirill-markin/expense-budget-tracker) es un gestor de presupuestos de código abierto con licencia MIT, construido con Next.js y Postgres. Esta guía refleja el funcionamiento actual del repositorio: un despliegue local con Docker para un solo usuario técnico, una vía documentada para producción con AWS/CDK y endpoints gestionados independientes para la interfaz alojada, MCP y Agent API.

![Persona que revisa un sistema autónomo de recogida de agua de lluvia junto a un depósito de reserva y una manguera desconectada](/blog/self-hosted-open-source-budget-tracker-for-developers-v2.png)

## Primero, elige el perímetro que realmente quieres

«Autoalojado» puede describir configuraciones muy distintas. No conviene tratarlas como si fueran intercambiables.

| Configuración | Dónde residen los datos financieros | Qué administras | Para quién encaja mejor |
| --- | --- | --- | --- |
| Docker Compose local | Postgres en un volumen de Docker en tu máquina | Contenedores, actualizaciones, acceso local y copias de seguridad | Un usuario técnico que quiere principalmente la interfaz web en una sola máquina |
| Tu cuenta de AWS con la pila CDK documentada | RDS y los servicios de la aplicación en tu cuenta de AWS | AWS, Cloudflare, dominios, certificados, entrega de correo, secretos, monitorización y copias de seguridad | Un despliegue público o multiusuario en el que aceptas el trabajo de infraestructura |
| Aplicación web gestionada | El entorno alojado de Expense Budget Tracker | Tu cuenta y tu flujo de introducción de datos | Quien quiere la interfaz sin administrar servidores |
| Conector MCP alojado | El espacio de trabajo alojado, al que se accede mediante el servicio MCP | El consentimiento OAuth y la conexión del cliente | Un agente compatible con MCP que necesita acceso de lectura o escritura con permisos limitados |
| Agent API alojada | El espacio de trabajo alojado, al que se accede mediante el servicio API | Una ApiKey de larga duración, la selección del espacio de trabajo y sentencias SQL revisadas | Scripts y agentes de terminal que pueden hacer llamadas HTTP directamente |

El comando local de Compose **no** crea `api.your-domain.com` ni `mcp.your-domain.com`. Esas interfaces de acceso automatizado pertenecen a la arquitectura de AWS y al servicio gestionado. Conectar un cliente a `https://mcp.expense-budget-tracker.com/mcp` significa usar el espacio de trabajo alojado, no acceder al contenedor de Postgres de tu portátil.

Esta distinción es la primera decisión que debes tomar con cualquier gestor de presupuesto autoalojado: ¿quieres control local sobre la aplicación web y la base de datos, o integraciones remotas que requieren un despliegue más amplio?

## Ejecuta localmente el gestor de gastos con Docker

Necesitas Git, Docker y Docker Compose. Clona el repositorio e inicia el conjunto de servicios desde el directorio raíz:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
AUTH_MODE=none make up
```

Después abre [http://localhost:3000](http://localhost:3000).

`AUTH_MODE` es una variable obligatoria de Compose. Si no has copiado `.env.example` a `.env`, repite el prefijo en cada comando de Compose. Los comandos siguientes lo hacen de forma deliberada.

`make up` es un alias corto de:

```bash
AUTH_MODE=none docker compose -f infra/docker/compose.yml up -d
```

El [archivo actual de Compose](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/docker/compose.yml) define Postgres 18, un servicio de migración que se ejecuta una sola vez, la aplicación web con Next.js, el servicio de autenticación y el worker de tipos de cambio. Con `AUTH_MODE=none`, la aplicación web usa la identidad local en lugar de exigir el inicio de sesión con Cognito. Trata este modo como acceso para desarrollo local, nunca como sistema de autenticación para un servidor público.

Puedes consultar el estado de los contenedores y seguir los registros de la aplicación con comandos normales de Compose:

```bash
AUTH_MODE=none docker compose -f infra/docker/compose.yml ps
AUTH_MODE=none docker compose -f infra/docker/compose.yml logs -f web
```

Detén la pila con:

```bash
AUTH_MODE=none make down
```

El [Makefile](https://github.com/kirill-markin/expense-budget-tracker/blob/main/Makefile) asigna ese comando a `docker compose down` sin `-v`. Tus datos de Postgres permanecen en el volumen con nombre `pgdata` y se reutilizan la próxima vez que se inicia la pila.

Esa persistencia es útil, pero no es una copia de seguridad. Un fallo del host, daños en el disco, la eliminación accidental del volumen o un `docker compose down -v` explícito aún pueden borrar la única copia.

### Mantén esta configuración en local

La configuración de Compose publica la aplicación web en el puerto `3000` del host, Postgres en el `5432` y el servicio de autenticación en el `8081`. También contiene credenciales de desarrollo para la base de datos. No instales esta configuración en un host expuesto a internet dando por hecho que Docker la ha hecho privada.

Para una instalación en una estación de trabajo:

- usa el firewall de la máquina para limitar el acceso de red;
- no redirijas desde el router los puertos `3000`, `5432` o `8081`;
- no expongas `AUTH_MODE=none` mediante un proxy inverso público;
- mantén el repositorio, los archivos `.env` y los volcados de la base de datos fuera de carpetas públicas o compartidas con muchas personas.

El repositorio documenta AWS/CDK como vía de despliegue en producción. No ofrece un procedimiento de seguridad reforzado para cada VPS, NAS, clúster de Kubernetes o servidor doméstico, aunque un operador con experiencia podría adaptar el código.

## Qué se ejecuta y qué permanece en Postgres

La arquitectura local es lo bastante pequeña como para inspeccionarla:

- **Aplicación web con Next.js:** ofrece las interfaces de presupuesto, transacciones, saldos, panel de control, demostración y chat.
- **Postgres:** almacena el libro mayor, los planes presupuestarios, la configuración del espacio de trabajo, los metadatos de las cuentas y el estado de la aplicación.
- **Contenedor de migración:** aplica las migraciones SQL del repositorio antes de que se inicie el servicio web.
- **Worker de tipos de cambio:** obtiene datos públicos de tipos de cambio y los escribe mediante un rol restringido de la base de datos.
- **Servicio de autenticación:** permite la arquitectura de despliegue autenticada; el uso local de la aplicación web omite Cognito cuando `AUTH_MODE=none`.

Postgres es la fuente de verdad. Por eso resulta una aplicación práctica para gestionar presupuestos con Postgres: como desarrollador, puedes inspeccionar las migraciones, entender las relaciones entre los datos, consultar tu propia base de datos y exportarla con las herramientas estándar de Postgres. La seguridad a nivel de fila y los distintos roles de la aplicación siguen siendo importantes dentro del sistema, pero no sustituyen la seguridad del host ni las copias de seguridad.

El worker de tipos de cambio hace solicitudes salientes para obtener esos datos. No necesita enviar las filas de tu libro mayor para consultar los tipos públicos. Las funciones opcionales de IA tienen un perímetro de confianza distinto que merece una revisión aparte.

## Haz una copia de seguridad real antes de considerar seguros los datos

Para la base de datos local predeterminada de Compose, este comando crea un volcado comprimido de Postgres en el host:

```bash
AUTH_MODE=none docker compose -f infra/docker/compose.yml exec -T postgres \
  pg_dump -U tracker -d tracker --format=custom \
  > expense-budget-tracker.dump
```

Trata ese archivo como un extracto bancario. Puede contener descripciones de transacciones, saldos, categorías, notas y otros datos identificativos.

Una rutina de copias de seguridad eficaz exige tomar cuatro decisiones:

1. **Frecuencia:** decide cuánto trabajo reciente aceptarías perder.
2. **Segunda ubicación:** copia el volcado fuera del host de Docker para que un único fallo de disco no pueda eliminar ambas copias.
3. **Cifrado y acceso:** protege el archivo en reposo y limita quién puede leerlo.
4. **Pruebas de restauración:** restáuralo periódicamente en otra instancia compatible de Postgres y verifica las transacciones, los presupuestos y los saldos.

Antes de actualizar la aplicación, crea un volcado nuevo. Después descarga el código actualizado, reconstruye las imágenes e inicia de nuevo la pila:

```bash
git pull
AUTH_MODE=none make build
AUTH_MODE=none make up
```

El contenedor de migración se ejecuta durante el inicio. Revisa los cambios de la versión antes de actualizar y conserva el volcado previo hasta que hayas comprobado la aplicación y completado una restauración de prueba.

## El autoalojamiento no garantiza que todos los datos permanezcan en local

La interfaz local principal y la base de datos Postgres pueden ejecutarse en tu máquina. Los datos salen de ese perímetro cuando eliges una función o un endpoint que los envía a otro lugar.

### Chat de IA integrado

El chat integrado usa una `OPENAI_API_KEY`. Cuando lo utilizas, los prompts, el contenido adjunto o extraído y el contexto financiero necesarios para las llamadas al modelo pueden enviarse a OpenAI. Las solicitudes actuales se envían con `store: false`, pero el proveedor aun así debe procesarlas, y los demás controles de retención dependen de la configuración de tu organización en la API. Revisa los [controles actuales de datos de la API de OpenAI](https://developers.openai.com/api/docs/guides/your-data) antes de enviar extractos bancarios o detalles del libro mayor.

El trazado con Langfuse es opcional. Solo se activa cuando sus valores de conexión y el valor de la versión están configurados conjuntamente. Cuando está habilitado, las trazas del chat se exportan a la `LANGFUSE_BASE_URL` que hayas elegido. Una URL de Langfuse Cloud introduce otro servicio externo que procesa datos; un despliegue autoalojado de Langfuse traslada ese destino a una infraestructura que administras tú.

Si tu requisito es que «las filas financieras nunca lleguen a un proveedor de LLM», no configures la integración de IA ni uses el chat. Alojar tú mismo la base de datos no impide el envío de datos en una solicitud al modelo que hayas habilitado deliberadamente.

### Tu propio despliegue en AWS

El [despliegue documentado en AWS](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) sitúa los servicios de la aplicación y RDS en tu cuenta de AWS. También añade más sistemas y relaciones de confianza: Cloudflare para el DNS y el tráfico en el perímetro de la red, Cognito para la autenticación, Resend para los correos de inicio de sesión, certificados para los dominios públicos, Secrets Manager, monitorización y conexiones opcionales con OpenAI y Langfuse.

La pila CDK incluye infraestructura gestionada para las copias de seguridad de la base de datos. Aun así, debes decidir si su política de retención cumple tus necesidades, vigilar los fallos, probar las restauraciones, rotar secretos, aplicar actualizaciones y responder a incidentes. «Mi cuenta de AWS» constituye un perímetro de control útil, pero no equivale a «sin terceros».

### Interfaz gestionada, MCP alojado y Agent API alojada

La interfaz gestionada empieza en [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com). Es la opción que exige menos trabajo operativo, pero el operador del servicio y los proveedores de alojamiento forman parte del perímetro de confianza de tus datos. Lee la [política de privacidad](/es/privacy/) antes de introducir allí datos financieros reales.

Un cliente compatible con MCP puede conectarse a:

```text
https://mcp.expense-budget-tracker.com/mcp
```

El conector MCP alojado usa OAuth en el navegador. El ámbito obligatorio `expenses:read` permite descubrir espacios de trabajo, inspeccionar el esquema y ejecutar consultas de lectura. `expenses:write` es independiente y se necesita para `sql_execute`. Empieza con acceso de solo lectura, a menos que el cliente necesite realmente crear, cambiar o eliminar registros financieros. El cliente MCP también puede recibir los datos que devuelven las herramientas, por lo que su propia política de privacidad importa. Consulta la [guía del conector MCP](/es/docs/mcp-connector/) para ver el proceso completo.

La Agent API alojada es una interfaz distinta con una credencial diferente. Empieza en:

```bash
curl --fail --silent --show-error \
  https://api.expense-budget-tracker.com/v1/
```

Después de que el flujo de alta mediante un código enviado por correo devuelva una clave de larga duración, las solicitudes directas usan:

```text
Authorization: ApiKey <key>
```

Los endpoints SQL principales separan deliberadamente una consulta de lectura de una operación de escritura aprobada:

- `POST /v1/sql/query` acepta una única sentencia restringida `SELECT` o `WITH ... SELECT`.
- `POST /v1/sql/execute` acepta una única sentencia aprobada `INSERT`, `UPDATE` o `DELETE`.

El servidor aplica la selección del espacio de trabajo y la seguridad a nivel de fila de Postgres. Eso no convierte una solicitud al servicio alojado en una solicitud autoalojada, y el endpoint MCP basado en OAuth no acepta la ApiKey. La [referencia de la API](/es/docs/api/) documenta el descubrimiento, la selección del espacio de trabajo, la inspección del esquema, los límites de las solicitudes y la política SQL exacta. La [guía de la API de seguimiento de gastos](/es/blog/expense-tracking-api/) explica con más detalle la aprobación y la conciliación.

## Qué responsabilidades asumes al alojar el sistema por tu cuenta

Desde el punto de vista de la aplicación, las finanzas personales para desarrolladores pueden parecer muy sencillas: un repositorio, un comando de Compose y una base de datos. El trabajo operativo continúa después de que la primera página se cargue correctamente.

Con Docker en local, te encargas de:

- las actualizaciones de Docker y del sistema operativo del host;
- las actualizaciones de la aplicación y la revisión de migraciones;
- los volcados de la base de datos, las copias cifradas fuera de la máquina, la retención y las pruebas de restauración;
- la capacidad del disco y el estado de los contenedores;
- las reglas del firewall y el acceso físico a la máquina;
- la protección de los archivos `.env`, las claves de API, las claves de modelos y las copias de seguridad.

Para un despliegue público, añade:

- un dominio y la configuración de DNS;
- certificados TLS y sus mecanismos de renovación;
- acceso autenticado en lugar de `AUTH_MODE=none`;
- entrega de correos OTP y sus credenciales;
- monitorización de la base de datos y los servicios;
- gestión de alertas, respuesta a incidentes y recuperación;
- costes de la nube y seguridad de las cuentas de proveedores.

La [guía de autoalojamiento](/es/docs/self-hosting/) es la referencia breve de configuración. La documentación de despliegue del repositorio del código fuente es la referencia principal para la arquitectura de AWS que admite el proyecto.

## Lista práctica para tomar una decisión

Un gestor de gastos autoalojado encaja bien cuando se cumplen la mayoría de estas condiciones:

- Te resulta cómodo ocuparte de Docker y Postgres, en lugar de limitarte a usarlos una vez.
- Automatizarás las copias de seguridad y probarás una restauración, en vez de limitarte a confiar en el volumen.
- Quieres acceso directo a una base de datos estándar y al código fuente para poder auditarlo o modificarlo.
- Te basta con acceder desde el navegador local, o estás preparado para administrar la pila de AWS documentada.
- Puedes mantener `AUTH_MODE=none` fuera de las redes públicas.
- Revisarás cada canal opcional de salida de datos, especialmente el chat de IA y la telemetría.

Usa la aplicación gestionada u otra opción alojada si estas situaciones describen mejor lo que necesitas:

- Quieres introducir y revisar tus finanzas sin mantener ni aplicar parches a la infraestructura.
- Necesitas acceso remoto fiable, pero no quieres gestionar dominios, TLS, autenticación, correo, secretos y monitorización.
- Es poco probable que detectes una copia de seguridad fallida o una actualización de seguridad retrasada.
- El acceso MCP con ámbitos OAuth o la Agent API alojada resuelven la integración sin que tengas que mantener toda la pila.

También hay una opción intermedia útil: ejecuta el sistema en local sin claves de IA, mantenlo fuera de internet y exporta copias de seguridad cifradas de Postgres a un almacenamiento que controles. Obtienes la principal ventaja de un gestor de presupuesto autoalojado sin dar por sentado que un archivo de Compose en un portátil constituye una plataforma de producción.

Empieza con `AUTH_MODE=none make up`, introduce unas cuantas transacciones de prueba sin datos sensibles, detén y reinicia la pila, y después crea y verifica un volcado de la base de datos. Si ese pequeño ciclo operativo te resulta razonable, incorpora datos reales. Si ya te parece una tarea engorrosa, la [configuración gestionada](/es/docs/getting-started/) probablemente sea la opción más realista.
