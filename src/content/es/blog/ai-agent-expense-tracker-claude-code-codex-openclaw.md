---
title: "Configuración del rastreador de gastos de IA para Claude Code, Codex y OpenClaw"
description: "Cómo conectar Claude Code, Codex o OpenClaw a un rastreador de gastos de código abierto. Comparta una URL de descubrimiento, confirme el código de correo electrónico, guarde el ApiKey devuelto y deje que el agente comience a trabajar."
date: "2026-03-10"
---

Si desea utilizar un agente de inteligencia artificial para el seguimiento de gastos, la parte molesta suele ser la configuración.

El flujo habitual se ve así:

1. Abre la aplicación
2. Cree una clave API
3. Copia la clave
4. Pégalo en tu agente terminal
5. Explique a qué punto final llamar
6. Espero que el agente utilice el espacio de trabajo adecuado

Eso es viable, pero no es nativo del agente.

[Expense Budget Tracker](https://expense-budget-tracker.com/es/) ahora expone un punto final de descubrimiento público para agentes terminales como [Claude Code](https://docs.anthropic.com/en/docs/claude-code), OpenAI Codex o OpenClaw:

`https://api.expense-budget-tracker.com/v1/`

El usuario le da al agente ese enlace y luego responde dos preguntas:

- ¿Qué correo electrónico se debe utilizar para iniciar sesión?
- ¿Cuál es el código de 8 dígitos que acaba de llegar a la bandeja de entrada?

Después de eso, el agente aprovisiona su propio `ApiKey`, lo guarda fuera de la memoria del chat, carga la cuenta, enumera los espacios de trabajo, guarda uno como predeterminado para esa clave y puede comenzar a importar o consultar transacciones.

El proyecto es de código abierto en GitHub:

- [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)
- [Implementación de API de máquina](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/sql-api/src/machineApi.ts)
- [Ruta del código de envío del agente](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentSendCode.ts)
- [Ruta del código de verificación del agente](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentVerifyCode.ts)

## El único enlace para darle a su agente

Esta es la URL exacta:

```text
https://api.expense-budget-tracker.com/v1/
```

Ese punto final devuelve un documento de descubrimiento legible por máquina. El agente puede leer:

- donde vive el arranque de autenticación
- qué acción llamar primero
- qué encabezado de autenticación usar más tarde
- qué pasos siguen para la configuración del espacio de trabajo y el acceso a SQL

Esta es la idea central: en lugar de codificar las instrucciones de incorporación en un mensaje, el producto le dice al agente cómo conectarse.

## Ejemplo de mensaje para Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Ask me for the account email, wait for the 8-digit code from my inbox, finish the setup,
save the returned ApiKey outside chat memory, then import transactions from ~/Downloads/chase-march-2026.csv and verify the final balance.
```

## Ejemplo de mensaje para Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
When you need login information, ask me for the email and then the 8-digit code.
After setup, save the key, inspect /schema, and show me my latest 20 transactions and total grocery spend this month.
```

## Ejemplo de mensaje para OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, save my personal workspace as the default for this key and import the CSV file I uploaded.
Use existing categories when possible, and tell me if any balance does not match.
```

## Cómo funciona la configuración del rastreador de gastos de IA

Aquí está el flujo HTTP completo detrás de esa configuración.

### 1. Leer el punto final de descubrimiento

El agente comienza aquí:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

La respuesta le indica que comience con `send_code`, incluye la URL de arranque en el dominio de autenticación y apunta al OpenAPI publicado y a los puntos finales del esquema.

### 2. Enviar el correo electrónico del usuario

El agente envía la dirección de correo electrónico al servicio de autenticación:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

Si la solicitud tiene éxito, la respuesta contiene un `otpSessionToken` e instrucciones para llamar a `verify_code`.

### 3. Solicite al usuario el código de correo electrónico de 8 dígitos

El usuario revisa la bandeja de entrada y envía el código al agente.

### 4. Verifique el código y obtenga un ApiKey

Luego el agente llama:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "code":"12345678",
    "otpSessionToken":"opaque-token-from-send-code",
    "label":"Claude Code on macbook"
  }'
```

La respuesta incluye un nuevo `ApiKey`. Esa clave se muestra una vez y el agente debe almacenarla para solicitudes posteriores, idealmente como `EXPENSE_BUDGET_TRACKER_API_KEY`.

Esta es la principal mejora con respecto al antiguo flujo manual: el usuario no necesita crear una clave en Configuración y copiarla en el terminal.

### 5. Cargar contexto de cuenta y espacio de trabajo

Después de la verificación, el agente usa `Authorization: ApiKey <key>` y carga la cuenta:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

Luego enumera los espacios de trabajo:

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

Si es necesario, puede crear un nuevo espacio de trabajo o guardar explícitamente uno existente con `POST /v1/workspaces/{workspaceId}/select`.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace_123/select \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

### 6. Ejecute SQL a través de la API del agente

Después de eso, el trabajo normal con los datos se realiza a través del dominio de la aplicación:

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
- `X-Workspace-Id: <workspaceId>` solo cuando desea anular el espacio de trabajo guardado o antes de guardar uno

La selección del espacio de trabajo es explícita y el servidor guarda esa selección por clave API después de `POST /v1/workspaces/{workspaceId}/select`. Si el usuario tiene exactamente un espacio de trabajo, la API lo guarda automáticamente y lo usa para una nueva clave.

## Qué puede hacer su agente después de la configuración

Una vez conectado, el agente puede encargarse del aburrido trabajo financiero que no debería requerir horas de clic:

1. Analizar CSV, PDF o exportaciones de capturas de pantalla del banco.
2. Insertar transacciones en el libro mayor.
3. Verifique los saldos con lo que muestra el banco.
4. Consultar gasto por categoría, comerciante o período
5. Actualizar las líneas presupuestarias para el próximo mes.

A continuación se muestra un ejemplo práctico para importar una declaración:

```text
Import ~/Downloads/revolut-february-2026.csv into my EUR account.
Before writing anything, query my existing categories and the last 30 days of transactions to avoid duplicates.
After import, compare the resulting account balance with the closing balance in the CSV.
```

Y aquí hay un ejemplo para el análisis:

```text
Show me my top 10 spending categories in the last 90 days, then compare them with the previous 90-day period.
Also list the largest transactions in categories where spending increased.
```

## Por qué esto es mejor que la configuración manual de la clave API

El nuevo flujo es más sencillo tanto para el usuario como para el agente:

- el usuario no tiene que copiar manualmente una clave de larga duración
- el agente descubre el protocolo a partir del propio producto
- la autenticación está separada limpiamente del acceso a los datos
- cada solicitud SQL tiene como alcance un espacio de trabajo seleccionado
- la conexión se puede revocar más tarde desde la aplicación

Si está creando un flujo de trabajo de seguimiento de gastos con IA, eso es importante. Elimina muchos errores de configuración y texto repetitivo.

## Rastreador de gastos de código abierto con configuración de agente

Expense Budget Tracker tiene licencia del MIT y es de código totalmente abierto:

- [Sitio web del proyecto](https://expense-budget-tracker.com/es/)
- [repositorio GitHub](https://github.com/kirill-markin/expense-budget-tracker)
- [README en GitHub](https://github.com/kirill-markin/expense-budget-tracker/blob/main/README.md)
- [Documentos de configuración del agente AI](https://expense-budget-tracker.com/es/docs/agent-setup/)
- [Referencia API](https://expense-budget-tracker.com/es/docs/api/)

Si desea autoalojarlo, comience con:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

Si desea utilizar la versión alojada, proporcione a su agente esta URL:

```text
https://api.expense-budget-tracker.com/v1/
```

Esto es suficiente para que Claude Code, Codex o OpenClaw inicien el flujo de inicio de sesión por sí solos.
