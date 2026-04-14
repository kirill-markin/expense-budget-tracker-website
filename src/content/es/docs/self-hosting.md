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

Con esto se inicia Postgres, se ejecutan las migraciones y se ponen en marcha:

- la aplicación web en `http://localhost:3000`
- el servicio de autenticación en `http://localhost:8081`
- el proceso de tipos de cambio en Docker Compose

## Configuración

Copia `.env.example` a `.env` y revisa estos valores:

- `MIGRATION_DATABASE_URL`: URL de conexión con el rol propietario que usan las migraciones
- `DATABASE_URL`: URL de conexión con el rol de la aplicación que usa el proceso web
- `AUTH_DATABASE_URL`: URL de conexión con el rol del esquema de autenticación que usa el servicio de autenticación
- `AUTH_MODE`: `none` para uso local; `cognito` para entornos con códigos OTP por correo electrónico
- `AUTH_DOMAIN`, `COOKIE_DOMAIN` y `ALLOWED_REDIRECT_URIS`: dominios, cookies y redirecciones permitidas para la autenticación

Si `AUTH_MODE=cognito`, también debes configurar los valores de Cognito y `SESSION_ENCRYPTION_KEY` indicados en `.env.example`.

## Cómo actualizar

```bash
git pull
make up
```

Al hacerlo, Docker Compose reconstruye los servicios y vuelve a ejecutar las migraciones a través del contenedor `migrate`.

## Despliegue en AWS

Para desplegar en producción en AWS (ECS Fargate + RDS + ALB + Cognito), consulta la [guía de AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws).
