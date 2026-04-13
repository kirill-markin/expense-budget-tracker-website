---
title: "Primeros pasos"
description: "Regístrate para usar la versión en la nube o configura tu propia instancia en minutos."
---

## Versión en la nube

La forma más rápida de empezar es usar la versión en la nube gestionada:

1. Ve a [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. Regístrate con tu correo electrónico (OTP sin contraseña)
3. Empieza a registrar gastos en la aplicación web
4. Si quieres conectar Claude Code, Codex u OpenClaw, facilita al agente `https://api.expense-budget-tracker.com/v1/`

Sin instalación ni configuración del servidor. Tus datos quedan aislados por espacio de trabajo mediante la seguridad a nivel de fila de Postgres.

## Acceso para agentes y programas

La misma cuenta alojada funciona para:

- la interfaz de usuario web en `https://app.expense-budget-tracker.com`
- la configuración para agentes mediante `GET https://api.expense-budget-tracker.com/v1/`
- clientes HTTP directos usando `Authorization: ApiKey <key>`

## Autoalojamiento

Si prefieres ejecutar tu propia instancia, consulta la [Guía de autoalojamiento](/es/docs/self-hosting/).

## Modo de demostración

La aplicación incluye un modo de demostración integrado. Usa el selector Todo/Demostración del encabezado para explorar la interfaz con datos de ejemplo, sin necesidad de base de datos.
