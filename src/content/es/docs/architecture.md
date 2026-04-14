---
title: Arquitectura
description: Panorámica del sistema, modelo de datos, diseño multidivisa y modelo de autenticación.
---

## Visión general del sistema

```
Interfaz del navegador  -->  Aplicación web Next.js  -->  Postgres (RLS)
                                 |                             ^
                                 v                             |
                  Servicio de autenticación -------------------+
                                 ^
                                 |
          Clientes automatizados a través de API Gateway
                                 ^
                                 |
             Worker (recopiladores de tipos de cambio) -------
```

Cinco componentes y una sola base de datos:

1. **web** — aplicación web Next.js con paneles y rutas de API
2. **auth** — inicio de sesión con OTP por correo electrónico y alta inicial de agentes en el dominio de autenticación
3. **sql-api** — AWS Lambda detrás de API Gateway para clientes automatizados
4. **worker** — obtiene a diario tipos de cambio del BCE, el CBR y el NBS
5. **Postgres** — fuente única de verdad con seguridad a nivel de fila

## Modelo de datos

- **ledger_entries** — una fila por cada movimiento de cuenta (ingreso, gasto o transferencia)
- **budget_lines** — celdas de presupuesto de solo anexado en las que prevalece la última escritura
- **budget_comments** — notas de solo anexado asociadas a celdas de presupuesto
- **workspace_settings** — moneda de referencia para informes y configuración del espacio de trabajo
- **account_metadata** — metadatos por cuenta, como la clasificación de liquidez
- **exchange_rates** — tipos de cambio diarios usados para convertir importes en tiempo de consulta
- **workspaces** / **workspace_members** — aislamiento entre espacios de trabajo
- **accounts** — vista derivada de `ledger_entries`

## Multidivisa

Todos los importes se almacenan en su moneda nativa. La conversión a la moneda de referencia para informes se hace en tiempo de lectura mediante uniones SQL con `exchange_rates`. No se realiza ninguna preconversión con pérdida de precisión.

## Autenticación

Hay dos modos controlados por la variable de entorno `AUTH_MODE`:

- `none` — sin autenticación; un único espacio de trabajo local
- `cognito` — acceso sin contraseña con OTP por correo electrónico mediante AWS Cognito y registro abierto

Para los clientes automatizados, el punto de entrada público de descubrimiento es `GET /v1/`. La incorporación de agentes usa OTP por correo electrónico en el dominio de autenticación, devuelve una `ApiKey` de larga duración y, a partir de ahí, ejecuta SQL mediante la API para máquinas expuesta a través de API Gateway.

Cada usuario recibe un espacio de trabajo aislado. Las políticas de RLS comprueban la pertenencia en cada consulta, incluidas las solicitudes SQL que llegan desde clientes automatizados.
