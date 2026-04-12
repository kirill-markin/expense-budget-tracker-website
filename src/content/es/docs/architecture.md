---
title: Arquitectura
description: Visión general del sistema, modelo de datos, diseño multidivisa y modelo de autenticación.
---

## Visión general del sistema

```
Browser UI  -->  Next.js web app  -->  Postgres (RLS)
                        |                  ^
                        v                  |
                 Auth service -------------+
                        ^
                        |
             Machine clients via API Gateway
                        ^
                        |
                Worker (FX fetchers) ------
```

Cinco componentes y una sola base de datos:

1. **web** — aplicación Next.js con paneles de interfaz y rutas API
2. **auth** — inicio de sesión mediante OTP por correo electrónico y aprovisionamiento inicial del agente en el dominio de autenticación
3. **sql-api** — AWS Lambda detrás de API Gateway para clientes automatizados
4. **worker** — obtiene tipos de cambio diarios del BCE, el CBR y el NBS
5. **Postgres** — fuente única de verdad con seguridad a nivel de fila

## Modelo de datos

- **ledger_entries** — una fila por cada movimiento de cuenta (ingreso, gasto o transferencia)
- **budget_lines** — celdas de presupuesto de solo anexado donde prevalece la última escritura
- **budget_comments** — notas de solo anexado asociadas a celdas de presupuesto
- **workspace_settings** — moneda de informe y configuración a nivel de espacio de trabajo
- **account_metadata** — metadatos por cuenta, como la clasificación de liquidez
- **exchange_rates** — tipos de cambio diarios usados para la conversión en tiempo de consulta
- **workspaces** / **workspace_members** — aislamiento multiinquilino
- **accounts** — vista derivada de `ledger_entries`

## Multidivisa

Todos los importes se almacenan en su moneda nativa. La conversión a la moneda de informe se realiza en el momento de la lectura mediante JOINs SQL sobre `exchange_rates`. No hay preconversión con pérdida de precisión.

## Autenticación

Dos modos mediante la variable de entorno `AUTH_MODE`:

- `none` — sin autenticación; un único espacio de trabajo local
- `cognito` — OTP por correo electrónico sin contraseña mediante AWS Cognito, con registro abierto

Para clientes automatizados, el punto de descubrimiento público es `GET /v1/`. El flujo de incorporación del agente usa OTP por correo electrónico en el dominio de autenticación, devuelve una `ApiKey` de larga duración y después ejecuta SQL a través de la API para máquinas detrás de API Gateway.

Cada usuario recibe un espacio de trabajo aislado. Las políticas de RLS verifican la pertenencia en cada consulta, incluidas las solicitudes SQL dirigidas a clientes automatizados.
