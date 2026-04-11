---
title: "Guía de autoalojamiento"
description: "Ejecute Expense Budget Tracker en su propio servidor con Docker Compose y Postgres."
---

## Requisitos

- Docker y Docker Compose
- Postgres 18 (incluido en el archivo Redactar)

## Inicio rápido

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Esto inicia Postgres, ejecuta migraciones y lanza:

- la aplicación web en `http://localhost:3000`
- el servicio de autenticación en `http://localhost:8081`
- el trabajador de FX en Docker Compose

## Configuración

Copie `.env.example` a `.env` y ajuste:

- `MIGRATION_DATABASE_URL`: rol de propietario utilizado por las migraciones
- `DATABASE_URL`: rol de aplicación para el proceso web
- `AUTH_DATABASE_URL`: función del esquema de autenticación para el servicio de autenticación.
- `AUTH_MODE` — `none` para uso local, `cognito` para entornos de correo electrónico OTP
- `AUTH_DOMAIN`, `COOKIE_DOMAIN` y `ALLOWED_REDIRECT_URIS`: enrutamiento de autenticación y cookies

Cuando `AUTH_MODE=cognito`, también necesita la configuración de Cognito y `SESSION_ENCRYPTION_KEY` de `.env.example`.

## Actualizando

```bash
git pull
make up
```

Docker Compose reconstruye los servicios y vuelve a ejecutar las migraciones a través del contenedor `migrate`.

## Implementación AWS

Para la implementación de producción en AWS (ECS Fargate + RDS + ALB + Cognito), consulte la [guía CDK AWS](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws).
