---
title: "Guía de autoalojamiento"
description: "Ejecuta Expense Budget Tracker en tu propio servidor con Docker Compose y Postgres."
---

## Requisitos

- Docker y Docker Compose
- Postgres 18 (incluido en el archivo de Docker Compose)

## Inicio rápido

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Esto inicia Postgres, ejecuta las migraciones y pone en marcha:

- la aplicación web en `http://localhost:3000`
- el servicio de autenticación en `http://localhost:8081`
- el proceso de tipos de cambio en Docker Compose

## Configuración

Copia `.env.example` a `.env` y ajusta:

- `MIGRATION_DATABASE_URL`: rol propietario que usan las migraciones
- `DATABASE_URL`: rol de la aplicación para el proceso web
- `AUTH_DATABASE_URL`: rol del esquema de autenticación para el servicio de autenticación
- `AUTH_MODE`: `none` para uso local, `cognito` para entornos con OTP por correo electrónico
- `AUTH_DOMAIN`, `COOKIE_DOMAIN` y `ALLOWED_REDIRECT_URIS`: enrutamiento de autenticación y cookies

Cuando `AUTH_MODE=cognito`, también necesitas la configuración de Cognito y `SESSION_ENCRYPTION_KEY` de `.env.example`.

## Cómo actualizar

```bash
git pull
make up
```

Docker Compose reconstruye los servicios y vuelve a ejecutar las migraciones a través del contenedor `migrate`.

## Despliegue en AWS

Para un despliegue de producción en AWS (ECS Fargate + RDS + ALB + Cognito), consulta la [guía de AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws).
