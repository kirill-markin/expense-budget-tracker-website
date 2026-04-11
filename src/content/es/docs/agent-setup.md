---
title: "Configuración del agente de IA"
description: "Comparta una URL de descubrimiento con Claude Code, Codex o OpenClaw. El agente sigue la respuesta de descubrimiento, verifica el código de 8 dígitos, almacena su ApiKey de larga duración y comienza a trabajar con su espacio de trabajo."
---

## El enlace para darle a tu agente

Comparte esta URL exacta:

`https://api.expense-budget-tracker.com/v1/`

Ese punto final es el documento canónico de descubrimiento público para los agentes de IA. Le indica al agente cómo iniciar la autenticación, qué puntos finales llamar a continuación, qué esquema de autenticación usar después y dónde encontrar la especificación de API publicada.

## Qué hace el usuario

1. Abra Claude Code, Codex, OpenClaw u otro agente que pueda realizar solicitudes HTTP.
2. Dígale al agente que se conecte a Expense Budget Tracker usando `https://api.expense-budget-tracker.com/v1/`.
3. Cuando el agente solicite una dirección de correo electrónico, proporcione el correo electrónico que utiliza para Expense Budget Tracker.
4. Revisa tu bandeja de entrada para ver el código de 8 dígitos.
5. Envíe ese código al agente.
6. Deje que el agente guarde el ApiKey devuelto fuera de la memoria del chat y luego continúe con su tarea de importación, consulta o elaboración de presupuestos.

No es necesario copiar y pegar claves manualmente durante el flujo de inicio de sesión. El agente proporciona su propia conexión después de verificar el código de correo electrónico.

## Qué hace el agente

La secuencia completa es:

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Lea la respuesta de descubrimiento y siga las acciones devueltas en lugar de codificar los siguientes pasos
3. `POST` el correo electrónico del usuario al `bootstrapUrl` devuelto
4. Reciba `otpSessionToken` y la acción `verify_code`
5. Solicite al usuario el código de correo electrónico de 8 dígitos.
6. `POST` `code`, `otpSessionToken` y una conexión de `label` a `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Reciba un nuevo `ApiKey`
8. Guarde esa clave fuera de la memoria del chat, preferiblemente como `EXPENSE_BUDGET_TRACKER_API_KEY`.
9. `GET https://api.expense-budget-tracker.com/v1/me` con `Authorization: ApiKey <key>`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Si es necesario, cree un espacio de trabajo con `POST /v1/workspaces`
12. Guarde un espacio de trabajo predeterminado con `POST /v1/workspaces/{workspaceId}/select`
13. Inspeccionar las relaciones permitidas con `GET https://api.expense-budget-tracker.com/v1/schema`
14. Ejecute SQL hasta `POST https://api.expense-budget-tracker.com/v1/sql`

La selección del espacio de trabajo es explícita, pero no sin estado. El espacio de trabajo seleccionado se guarda para esa clave API después de `POST /v1/workspaces/{workspaceId}/select`, por lo que las llamadas posteriores a `/v1/sql` pueden omitir `X-Workspace-Id`. Aún puedes enviar `X-Workspace-Id` para anular el espacio de trabajo guardado para una solicitud específica.

Si el usuario tiene exactamente un espacio de trabajo y la clave aún no tiene una selección guardada, el backend guarda automáticamente y usa ese espacio de trabajo.

## Qué debe almacenar el agente

La clave devuelta por `verify-code` es de larga duración. No confíe únicamente en la memoria del chat.

- Guárdelo en un archivo `.env` local como `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` si el usuario aprueba la escritura del archivo.
- De lo contrario, expórtelo en el shell actual como `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` y solicite al usuario que lo almacene en algún lugar persistente.

Las solicitudes autenticadas utilizan:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` solo cuando desea anular el espacio de trabajo guardado o antes de guardar uno

## Si eres un agente de IA

Comience con:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

Luego siga las acciones devueltas por el servidor. No asuma los próximos pasos codificados si el documento de descubrimiento ya los proporciona.

Después de `verify-code`, almacene de forma segura el `ApiKey` devuelto. Luego carga:

- `/v1/me` para contexto de cuenta
- `/v1/workspaces` para espacios de trabajo disponibles
- `/v1/schema` para las relaciones y columnas permitidas SQL
- `/v1/openapi.json` o `/v1/swagger.json` para la especificación API legible por máquina publicada

## Indicaciones de ejemplo para humanos

### Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Use my account email when needed, ask me for the 8-digit code, save the returned ApiKey outside chat memory, then import my latest bank statement from ~/Downloads.
```

### Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
Ask for my email, wait for the email code, save the key, inspect /schema, and then show my latest transactions.
```

### OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, list my workspaces, save one as the default for this key, and import the new CSV I uploaded.
```

## Qué puedes hacer después de la configuración

- Importar extractos bancarios o exportaciones de tarjetas.
- Categorizar transacciones utilizando sus categorías existentes
- Verificar saldos de cuentas contra el banco.
- Consultar gastos por categoría, período, comerciante o cuenta.
- Actualizar líneas presupuestarias para el próximo mes.

Para conocer los puntos finales de nivel inferior y los detalles de autenticación, consulte la [Referencia de API](/es/docs/api/).
