---
title: "Referencia de API"
description: "Incorporación de agentes y referencia de API SQL para acceso programático a sus datos financieros."
---

## Descripción general

Expense Budget Tracker expone una API de máquina pública en:

`https://api.expense-budget-tracker.com/v1/`

Puedes utilizar esa misma superficie de dos maneras:

1. **Incorporación nativa del agente** a partir de `GET /v1/`
2. **Uso HTTP directo** con un ApiKey de larga duración existente

Todas las solicitudes utilizan la misma aplicación de seguridad de nivel de fila Postgres que la aplicación web.

## Descubrimiento y especificaciones publicadas

Comience aquí:

`https://api.expense-budget-tracker.com/v1/`

La respuesta de descubrimiento les dice a los agentes cómo iniciar la autenticación y a qué llamar a continuación. La misma API también publica:

- `GET /v1/openapi.json`
- `GET /v1/swagger.json`
- `GET /v1/schema`

Utilice `schema` cuando necesite la lista exacta de relaciones y columnas permitidas expuestas por `/v1/sql`.

## Incorporación del agente nativo

Si desea que Claude Code, Codex, OpenClaw u otro agente se conecte, comience con el punto final de descubrimiento y siga las acciones devueltas por el servidor.

### Flujo de autenticación

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Lea la acción `send_code` devuelta y `bootstrapUrl`
3. `POST` el correo electrónico del usuario a `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. Reciba `otpSessionToken`
5. Solicite al usuario el código de 8 dígitos del correo electrónico.
6. `POST` `code`, `otpSessionToken` y `label` a `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Reciba un `ApiKey` de larga duración
8. Guarde esa clave fuera de la memoria del chat.
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Opcionalmente `POST https://api.expense-budget-tracker.com/v1/workspaces` para crear un espacio de trabajo.
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. Ejecute SQL con `POST https://api.expense-budget-tracker.com/v1/sql`

### Encabezado de autenticación

- `Authorization: ApiKey <key>`

### Manejo del espacio de trabajo

- `POST /v1/workspaces/{workspaceId}/select` guarda el espacio de trabajo predeterminado para esa clave API
- después de guardar un espacio de trabajo, `/v1/sql` puede omitir `X-Workspace-Id`
- `X-Workspace-Id: <workspaceId>` aún se admite cuando desea anular el espacio de trabajo guardado para una solicitud
- si el usuario tiene exactamente un espacio de trabajo y la clave aún no tiene una selección guardada, la API guarda automáticamente y usa ese espacio de trabajo

Para obtener una guía humana paso a paso, consulte [Configuración del agente de IA](/es/docs/agent-setup/).

## Uso directo de HTTP con una clave existente

Los scripts, trabajos cron, paneles y aplicaciones personalizadas pueden llamar a la misma API directamente una vez que ya tienen un ApiKey de larga duración.

### Autenticación

Pase la clave como encabezado de autenticación ApiKey:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` solo es necesario si la clave aún no tiene un espacio de trabajo predeterminado guardado o si desea anular el espacio de trabajo guardado para esa solicitud.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` cuando sea necesario

## Resumen de puntos finales

- `GET /v1/` — documento de descubrimiento público
- `GET /v1/openapi.json` y `GET /v1/swagger.json`: especificaciones API publicadas
- `GET /v1/me` — contexto de cuenta autenticada
- `GET /v1/workspaces`: enumera los espacios de trabajo disponibles para el propietario de la clave
- `POST /v1/workspaces`: crea un espacio de trabajo
- `POST /v1/workspaces/{workspaceId}/select`: guarda el espacio de trabajo predeterminado para esta clave
- `GET /v1/schema`: inspecciona las relaciones y columnas permitidas para SQL
- `POST /v1/sql`: ejecuta una instrucción SQL restringida

## Política SQL

`POST /v1/sql` acepta exactamente una declaración SQL por solicitud.

Tipos de declaraciones permitidos:

- `SELECT`
- `WITH`
- `INSERT`
- `UPDATE`
- `DELETE`

Patrones bloqueados o rechazados:

- múltiples declaraciones
- DDL como `CREATE`, `DROP` y `ALTER`
- contenedores de transacciones como `BEGIN`, `COMMIT` y `ROLLBACK`
- `set_config()`
- Comentarios de SQL
- identificadores citados
- cadenas cotizadas en dólares

El servidor también restringe qué relaciones se pueden consultar. Utilice `/v1/schema` para inspeccionar las relaciones y columnas expuestas antes de generar SQL.

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
- Tiempo de espera de declaración de 30 segundos
- 10 solicitudes/segundo, 10.000 solicitudes/día por clave

## Seguridad

- Las claves API se almacenan como hashes SHA-256 (el texto sin formato nunca persiste)
- RLS impone el aislamiento del espacio de trabajo en el nivel de la base de datos.
- Las claves se pueden revocar del producto en cualquier momento
- Al eliminar un miembro del espacio de trabajo se revocan automáticamente todas sus claves.
