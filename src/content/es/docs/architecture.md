---
title: "Arquitectura"
description: "Descripción general del sistema, modelo de datos, diseño multidivisa y modelo de autenticación."
---

## Descripción general del sistema

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

Cinco componentes, una base de datos:

1. **web**: aplicación Next.js con paneles de interfaz de usuario y rutas API
2. **auth**: envíe por correo electrónico el inicio de sesión de OTP y el arranque del agente en el dominio de autenticación.
3. **sql-api** — AWS Lambda detrás de API Gateway para clientes de máquinas
4. **trabajador**: obtiene tipos de cambio diarios del BCE, CBR y NBS
5. **Postgres**: fuente única de verdad con seguridad a nivel de fila

## Modelo de datos

- **ledger_entries** — Una fila por movimiento de cuenta (ingresos, gastos, transferencias)
- **budget_lines**: celdas de presupuesto de solo agregar con victorias de última escritura
- **budget_comments**: notas adjuntas únicamente a las celdas del presupuesto
- **workspace_settings**: moneda de informes y configuración a nivel de espacio de trabajo
- **account_metadata** — Metadatos por cuenta, como la clasificación de liquidez
- **exchange_rates**: tipos de cambio diarios utilizados para la conversión en el momento de la consulta
- **workspaces** / **workspace_members** — Aislamiento multiinquilino
- **cuentas** — Vista derivada de asientos contables

## Multidivisa

Todos los montos almacenados en moneda nativa. La conversión a la moneda de informe se produce en el momento de la lectura a través de combinaciones SQL con `exchange_rates`. Sin preconversión con pérdidas.

## autenticación

Dos modos a través de `AUTH_MODE` env var:

- `none`: sin autenticación, espacio de trabajo local único
- `cognito` — Correo electrónico sin contraseña OTP a través de AWS Cognito, registro abierto

Para clientes de máquinas, el punto de entrada de descubrimiento público es `GET /v1/`. La incorporación del agente utiliza el correo electrónico OTP en el dominio de autenticación, devuelve un ApiKey de larga duración y luego ejecuta SQL a través de la API de la máquina API Gateway.

Cada usuario obtiene un espacio de trabajo aislado. Las políticas RLS verifican la membresía en cada consulta, incluidas las solicitudes SQL orientadas a la máquina.
