---
title: "Configuración del agente de IA"
description: "Comparte una URL de descubrimiento con Claude Code, Codex u OpenClaw. El agente sigue la respuesta de descubrimiento, verifica el código de 8 dígitos, guarda su ApiKey de larga duración y empieza a trabajar con tu espacio de trabajo."
---

## El enlace que debes dar a tu agente

Comparte esta URL exacta:

`https://api.expense-budget-tracker.com/v1/`

Ese endpoint es el documento público de descubrimiento canónico para agentes de IA. Le indica al agente cómo iniciar la autenticación, qué endpoints debe llamar después, qué esquema de autenticación debe usar a continuación y dónde encontrar la especificación publicada de la API.

## Qué hace el usuario

1. Abre Claude Code, Codex, OpenClaw u otro agente que pueda hacer solicitudes HTTP.
2. Indícale al agente que se conecte a Expense Budget Tracker usando `https://api.expense-budget-tracker.com/v1/`.
3. Cuando el agente te pida una dirección de correo electrónico, dale la que usas en Expense Budget Tracker.
4. Revisa tu bandeja de entrada para obtener el código de 8 dígitos.
5. Envíale ese código al agente.
6. Deja que el agente guarde la ApiKey recibida fuera de la memoria del chat y luego continúe con tu tarea de importación, consulta o presupuesto.

No hay que copiar ni pegar claves manualmente durante el flujo de inicio de sesión. El agente establece su propia conexión después de verificar el código enviado por correo.

## Qué hace el agente

La secuencia completa es la siguiente:

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Leer la respuesta de descubrimiento y seguir las acciones devueltas en lugar de codificar manualmente los pasos siguientes
3. Enviar por `POST` el correo del usuario al `bootstrapUrl` devuelto
4. Recibir `otpSessionToken` y la acción `verify_code`
5. Pedirle al usuario el código de 8 dígitos recibido por correo
6. Enviar por `POST` `code`, `otpSessionToken` y una `label` de conexión a `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Recibir una nueva `ApiKey`
8. Guardar esa clave fuera de la memoria del chat, preferiblemente como `EXPENSE_BUDGET_TRACKER_API_KEY`
9. `GET https://api.expense-budget-tracker.com/v1/me` con `Authorization: ApiKey <key>`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Si hace falta, crear un espacio de trabajo con `POST /v1/workspaces`
12. Guardar un espacio de trabajo predeterminado con `POST /v1/workspaces/{workspaceId}/select`
13. Inspeccionar las relaciones permitidas con `GET https://api.expense-budget-tracker.com/v1/schema`
14. Ejecutar SQL mediante `POST https://api.expense-budget-tracker.com/v1/sql`

La selección del espacio de trabajo es explícita, pero el sistema conserva estado. El espacio de trabajo seleccionado se guarda para esa clave después de `POST /v1/workspaces/{workspaceId}/select`, así que las llamadas posteriores a `/v1/sql` pueden omitir `X-Workspace-Id`. Aun así, puedes enviar `X-Workspace-Id` para anular el espacio de trabajo guardado en una solicitud concreta.

Si el usuario tiene exactamente un espacio de trabajo y la clave todavía no tiene una selección guardada, el backend guarda y usa automáticamente ese espacio de trabajo.

## Qué debe guardar el agente

La clave que devuelve `verify-code` es de larga duración. No confíes solo en la memoria del chat.

- Guárdala en un archivo `.env` local como `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` si el usuario aprueba escribir en archivos
- Si no, expórtala en la shell actual como `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` y pídele al usuario que la guarde en un lugar persistente

Las solicitudes autenticadas usan:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` solo cuando quieras anular el espacio de trabajo guardado o antes de que se haya guardado uno

## Si eres un agente de IA

Empieza con:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

Después, sigue las acciones que devuelva el servidor. No des por hecho pasos codificados manualmente si el documento de descubrimiento ya los proporciona.

Después de `verify-code`, guarda de forma segura la `ApiKey` devuelta. Luego carga:

- `/v1/me` para obtener el contexto de la cuenta
- `/v1/workspaces` para ver los espacios de trabajo disponibles
- `/v1/schema` para consultar las relaciones y columnas SQL permitidas
- `/v1/openapi.json` o `/v1/swagger.json` para acceder a la especificación publicada de la API legible por máquina

## Ejemplos de prompts para personas

### Claude Code

```text
Conéctate a Expense Budget Tracker usando https://api.expense-budget-tracker.com/v1/.
Usa el correo de mi cuenta cuando haga falta, pídeme el código de 8 dígitos, guarda la ApiKey recibida fuera de la memoria del chat y luego importa mi último extracto bancario desde ~/Downloads.
```

### Codex

```text
Usa https://api.expense-budget-tracker.com/v1/ para conectarte a mi cuenta de Expense Budget Tracker.
Pídeme mi correo, espera el código enviado por correo, guarda la clave, inspecciona /schema y después muéstrame mis transacciones más recientes.
```

### OpenClaw

```text
Conéctate a Expense Budget Tracker mediante https://api.expense-budget-tracker.com/v1/.
Después de iniciar sesión, enumera mis espacios de trabajo, guarda uno como predeterminado para esta clave e importa el nuevo CSV que he subido.
```

## Qué puedes hacer después de la configuración

- Importar extractos bancarios o exportaciones de tarjetas
- Categorizar transacciones usando tus categorías existentes
- Verificar saldos de cuentas frente al banco
- Consultar gastos por categoría, periodo, comercio o cuenta
- Actualizar partidas presupuestarias para el mes siguiente

Para ver los endpoints de más bajo nivel y los detalles de autenticación, consulta la [Referencia de la API](/es/docs/api/).
