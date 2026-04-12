---
title: "Cómo configurar un rastreador de gastos con IA para Claude Code, Codex y OpenClaw"
description: "Cómo conectar Claude Code, Codex u OpenClaw a un rastreador de gastos de código abierto. Comparte una sola URL de descubrimiento, confirma el código recibido por correo, guarda el ApiKey devuelto y deja que el agente empiece a trabajar."
date: "2026-03-10"
keywords:
  - "rastreador de gastos con IA"
  - "configurar Claude Code para finanzas personales"
  - "configurar Codex con Expense Budget Tracker"
  - "OpenClaw rastreador de gastos"
  - "agente de IA para seguimiento de gastos"
  - "Expense Budget Tracker API"
  - "configuración de agente con ApiKey"
  - "endpoint de descubrimiento para agentes"
---

Si quiere usar un agente de inteligencia artificial para llevar sus gastos, la parte molesta casi siempre es la configuración.

El flujo habitual suele ser este:

1. Abrir la aplicación
2. Crear una API key
3. Copiar la clave
4. Pegarla en el agente de terminal
5. Explicarle qué endpoint debe llamar
6. Confiar en que use el workspace correcto

Eso funciona, pero no está pensado de forma nativa para agentes.

[Expense Budget Tracker](https://expense-budget-tracker.com/es/) ahora expone un endpoint público de descubrimiento para agentes de terminal como [Claude Code](https://docs.anthropic.com/en/docs/claude-code), OpenAI Codex u OpenClaw:

`https://api.expense-budget-tracker.com/v1/`

El usuario le da al agente ese único enlace y luego responde dos preguntas:

- ¿Qué correo debe usarse para iniciar sesión?
- ¿Cuál es el código de 8 dígitos que acaba de llegar al correo?

Después de eso, el agente aprovisiona su propio `ApiKey`, lo guarda fuera de la memoria del chat, carga la cuenta, lista los workspaces, guarda uno como predeterminado para esa clave y ya puede empezar a importar o consultar transacciones.

El proyecto es de código abierto y está en GitHub:

- [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)
- [Implementación de la Machine API](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/sql-api/src/machineApi.ts)
- [Ruta del agente para enviar el código](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentSendCode.ts)
- [Ruta del agente para verificar el código](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentVerifyCode.ts)

## El único enlace que debe darle a su agente

Esta es la URL exacta:

```text
https://api.expense-budget-tracker.com/v1/
```

Ese endpoint devuelve un documento de descubrimiento legible por máquinas. El agente puede leer:

- dónde empieza el flujo de autenticación
- qué acción debe llamar primero
- qué cabecera de autenticación tendrá que usar después
- qué pasos siguen para configurar el workspace y acceder a SQL

Esa es la idea central: en lugar de meter las instrucciones de conexión dentro del prompt, es el propio producto quien le dice al agente cómo conectarse.

## Prompt de ejemplo para Claude Code

```text
Conéctate a Expense Budget Tracker usando https://api.expense-budget-tracker.com/v1/.
Pídeme el correo de la cuenta, espera el código de 8 dígitos que llegará a mi bandeja de entrada, termina la configuración,
guarda el ApiKey devuelto fuera de la memoria del chat y luego importa las transacciones desde ~/Downloads/chase-march-2026.csv y verifica el saldo final.
```

## Prompt de ejemplo para Codex

```text
Usa https://api.expense-budget-tracker.com/v1/ para conectarte a mi cuenta de Expense Budget Tracker.
Cuando necesites los datos de acceso, pídeme primero el correo y después el código de 8 dígitos.
Después de la configuración, guarda la clave, revisa /schema y muéstrame mis últimas 20 transacciones y el gasto total en supermercado de este mes.
```

## Prompt de ejemplo para OpenClaw

```text
Conéctate a Expense Budget Tracker mediante https://api.expense-budget-tracker.com/v1/.
Después de iniciar sesión, guarda mi workspace personal como predeterminado para esta clave e importa el archivo CSV que he subido.
Usa las categorías existentes siempre que sea posible y avísame si algún saldo no coincide.
```

## Cómo funciona la configuración del rastreador de gastos con IA

Este es el flujo HTTP completo que hay detrás de esa configuración.

### 1. Leer el endpoint de descubrimiento

El agente empieza aquí:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

La respuesta le indica que debe empezar con `send_code`, incluye la URL de arranque en el dominio de autenticación y apunta a los endpoints publicados de OpenAPI y del esquema.

### 2. Enviar el correo del usuario

El agente envía la dirección de correo al servicio de autenticación:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

Si la solicitud sale bien, la respuesta contiene un `otpSessionToken` e instrucciones para llamar a `verify_code`.

### 3. Pedir al usuario el código de correo de 8 dígitos

El usuario revisa la bandeja de entrada y le devuelve el código al agente.

### 4. Verificar el código y obtener un ApiKey

Después el agente llama a:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "code":"12345678",
    "otpSessionToken":"opaque-token-from-send-code",
    "label":"Claude Code on macbook"
  }'
```

La respuesta incluye un nuevo `ApiKey`. Esa clave solo se muestra una vez y el agente debería guardarla para solicitudes posteriores, idealmente como `EXPENSE_BUDGET_TRACKER_API_KEY`.

Esa es la mejora principal frente al flujo manual anterior: el usuario no tiene que crear una clave en Settings ni copiarla al terminal.

### 5. Cargar el contexto de cuenta y workspace

Después de la verificación, el agente usa `Authorization: ApiKey <key>` y carga la cuenta:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

Luego lista los workspaces:

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

Si hace falta, puede crear un workspace nuevo o guardar explícitamente uno existente con `POST /v1/workspaces/{workspaceId}/select`.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace_123/select \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

### 6. Ejecutar SQL a través de la API para agentes

Después de eso, el trabajo normal con los datos sucede a través del dominio de la aplicación:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ" \
  -H "X-Workspace-Id: workspace_123" \
  -H "Content-Type: application/json" \
  -d '{
    "sql":"SELECT ts, category, counterparty, amount, currency FROM ledger_entries ORDER BY ts DESC LIMIT 20"
  }'
```

La solicitud debe incluir ambos:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` solo cuando quiera sobrescribir el workspace guardado o antes de que se haya guardado uno

La selección del workspace es explícita y el servidor guarda esa selección por API key después de `POST /v1/workspaces/{workspaceId}/select`. Si el usuario tiene exactamente un workspace, la API lo guarda automáticamente y lo usa para una clave nueva.

## Qué puede hacer su agente después de la configuración

Una vez conectado, el agente puede encargarse del trabajo financiero aburrido que no debería exigir horas de clics:

1. Analizar exportaciones bancarias en CSV, PDF o capturas de pantalla
2. Insertar transacciones en el libro mayor
3. Comprobar saldos contra lo que muestra el banco
4. Consultar gasto por categoría, comercio o período
5. Actualizar líneas presupuestarias para el mes siguiente

Aquí tiene un ejemplo práctico para importar un extracto:

```text
Importa ~/Downloads/revolut-february-2026.csv en mi cuenta en EUR.
Antes de escribir nada, consulta mis categorías actuales y las transacciones de los últimos 30 días para evitar duplicados.
Después de la importación, compara el saldo resultante de la cuenta con el saldo de cierre que aparece en el CSV.
```

Y aquí tiene un ejemplo de análisis:

```text
Muéstrame mis 10 categorías de gasto principales de los últimos 90 días y compáralas con los 90 días anteriores.
Incluye también las transacciones más grandes en las categorías donde el gasto haya aumentado.
```

## Por qué esto es mejor que configurar una API key manualmente

El nuevo flujo es más simple tanto para el usuario como para el agente:

- el usuario no tiene que copiar manualmente una clave de larga duración
- el agente descubre el protocolo desde el propio producto
- la autenticación queda claramente separada del acceso a los datos
- cada solicitud SQL queda acotada a un workspace seleccionado
- la conexión puede revocarse más tarde desde la aplicación

Si está montando un flujo de seguimiento de gastos con IA, eso importa. Elimina mucho texto repetitivo en los prompts y muchos errores de configuración.

## Rastreador de gastos de código abierto con configuración para agentes

Expense Budget Tracker tiene licencia MIT y es completamente de código abierto:

- [Sitio web del proyecto](https://expense-budget-tracker.com/es/)
- [Repositorio de GitHub](https://github.com/kirill-markin/expense-budget-tracker)
- [README en GitHub](https://github.com/kirill-markin/expense-budget-tracker/blob/main/README.md)
- [Documentación de configuración para agentes de IA](https://expense-budget-tracker.com/es/docs/agent-setup/)
- [Referencia de la API](https://expense-budget-tracker.com/es/docs/api/)

Si quiere autoalojarlo, empiece por aquí:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

Si quiere usar la versión alojada, dele a su agente esta URL:

```text
https://api.expense-budget-tracker.com/v1/
```

Eso basta para que Claude Code, Codex u OpenClaw inicien por su cuenta el flujo de inicio de sesión.
