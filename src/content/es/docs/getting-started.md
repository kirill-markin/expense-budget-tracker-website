---
title: "Primeros pasos"
description: "Regístrate para usar la versión alojada en la nube o configura tu propia instancia en cuestión de minutos."
---

## Versión en la nube

La forma más rápida de empezar es usar la versión alojada en la nube:

1. Ve a [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. Regístrate con tu correo electrónico (OTP sin contraseña)
3. Empieza a registrar tus gastos en la aplicación web
4. Si quieres conectar Claude Code, Codex u OpenClaw, indícale al agente `https://api.expense-budget-tracker.com/v1/`

No necesitas instalar nada ni configurar servidores. Tus datos quedan aislados por espacio de trabajo mediante la seguridad a nivel de fila de Postgres.

## Acceso para agentes y programas

Con la misma cuenta de la versión alojada puedes usar:

- la interfaz web en `https://app.expense-budget-tracker.com`
- el acceso desde agentes mediante `GET https://api.expense-budget-tracker.com/v1/`
- clientes HTTP directos mediante `Authorization: ApiKey <key>`

## Autoalojamiento

Si prefieres ejecutar tu propia instancia, consulta la [guía de autoalojamiento](/es/docs/self-hosting/).

## Modo de demostración

La aplicación incluye un modo de demostración integrado. Usa el selector Todo/Demostración del encabezado para recorrer la interfaz con datos de ejemplo, sin necesidad de configurar una base de datos.
