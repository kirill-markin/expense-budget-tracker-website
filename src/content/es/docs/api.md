---
title: "Referencia de API"
description: "Guía de configuración para agentes y referencia de la API SQL para acceder por programación a tus datos financieros."
---

## Descripción general

Expense Budget Tracker expone una API pública en:

`https://api.expense-budget-tracker.com/v1/`

Puedes acceder a esta misma API de dos maneras:

1. **Configuración nativa para agentes** a partir de `GET /v1/`
2. **Uso directo por HTTP** con una `ApiKey` de larga duración que ya exista

Todas las solicitudes se someten a la misma seguridad a nivel de fila de Postgres que usa la aplicación web.

## Descubrimiento y especificaciones publicadas

Empieza aquí:

`https://api.expense-budget-tracker.com/v1/`

La respuesta de descubrimiento indica a los agentes cómo iniciar la autenticación y qué llamadas hacer a continuación. Esta misma API también publica:

- `GET /v1/openapi.json`
- `GET /v1/swagger.json`
- `GET /v1/schema`

Usa `schema` cuando necesites la lista exacta de relaciones y columnas permitidas que expone `/v1/sql`.

## Configuración nativa para agentes

Si quieres que Claude Code, Codex, OpenClaw u otro agente se conecte por sí solo, empieza por el punto de descubrimiento y sigue las acciones que devuelve el servidor.

### Flujo de autenticación

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Lee la acción `send_code` que devuelve la respuesta y `bootstrapUrl`
3. Haz `POST` con el correo electrónico del usuario a `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. Recibe `otpSessionToken`
5. Pide al usuario el código de 8 dígitos que ha recibido por correo electrónico
6. Haz `POST` con `code`, `otpSessionToken` y `label` a `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Recibe una `ApiKey` de larga duración
8. Guarda esa clave fuera de la memoria del chat
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Opcionalmente, haz `POST https://api.expense-budget-tracker.com/v1/workspaces` para crear un espacio de trabajo
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. Ejecuta SQL con `POST https://api.expense-budget-tracker.com/v1/sql`

### Cabecera de autenticación

- `Authorization: ApiKey <key>`

### Gestión del espacio de trabajo

- `POST /v1/workspaces/{workspaceId}/select` guarda el espacio de trabajo predeterminado para esa clave de API
- después de guardar un espacio de trabajo, `/v1/sql` puede omitir `X-Workspace-Id`
- `X-Workspace-Id: <workspaceId>` sigue siendo compatible si quieres usar, en una sola solicitud, un espacio de trabajo distinto del que quedó guardado
- si el usuario tiene exactamente un espacio de trabajo y la clave todavía no tiene ninguno guardado, la API lo guarda automáticamente y lo usa

Si quieres una guía paso a paso para personas, consulta [Configuración de agentes de IA](/es/docs/agent-setup/).

## Uso directo por HTTP con una clave existente

Los scripts, las tareas cron, los paneles y las aplicaciones personalizadas pueden llamar directamente a esta misma API una vez que ya disponen de una `ApiKey` de larga duración.

### Autenticación

Pasa la clave en una cabecera de autenticación `ApiKey`:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` solo es necesario si la clave todavía no tiene guardado un espacio de trabajo predeterminado, o si quieres usar otro distinto para esa solicitud.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` cuando sea necesario

## Resumen de rutas

- `GET /v1/` — documento público de descubrimiento
- `GET /v1/openapi.json` y `GET /v1/swagger.json` — especificaciones publicadas de la API
- `GET /v1/me` — contexto de la cuenta autenticada
- `GET /v1/workspaces` — lista los espacios de trabajo disponibles para el propietario de la clave
- `POST /v1/workspaces` — crea un espacio de trabajo
- `POST /v1/workspaces/{workspaceId}/select` — guarda el espacio de trabajo predeterminado para esta clave
- `GET /v1/schema` — muestra las relaciones y columnas permitidas para SQL
- `POST /v1/sql` — ejecuta una única instrucción SQL restringida

## Política SQL

`POST /v1/sql` acepta exactamente una instrucción SQL por solicitud.

Tipos de instrucciones permitidos:

- `SELECT`
- `WITH`
- `INSERT`
- `UPDATE`
- `DELETE`

Patrones bloqueados o rechazados:

- varias instrucciones en la misma solicitud
- DDL como `CREATE`, `DROP` y `ALTER`
- envoltorios de transacción como `BEGIN`, `COMMIT` y `ROLLBACK`
- `set_config()`
- comentarios SQL
- identificadores entrecomillados
- cadenas delimitadas con comillas de dólar

El servidor también restringe qué relaciones se pueden consultar. Usa `/v1/schema` para revisar las relaciones y columnas expuestas antes de generar SQL.

Relaciones actualmente expuestas:

- `ledger_entries`
- `accounts`
- `budget_lines`
- `budget_comments`
- `workspace_settings`
- `account_metadata`
- `exchange_rates`

## Límites

- 100 filas por respuesta
- tiempo máximo de ejecución de 30 segundos por instrucción
- 10 solicitudes por segundo y 10.000 solicitudes por día para cada clave

## Seguridad

- Las claves de API se almacenan como hashes SHA-256; la clave en texto plano nunca se guarda
- RLS aplica el aislamiento por espacio de trabajo a nivel de base de datos
- Las claves se pueden revocar desde el producto en cualquier momento
- Al eliminar a un miembro de un espacio de trabajo, se revocan automáticamente todas sus claves
