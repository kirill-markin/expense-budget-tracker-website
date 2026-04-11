---
title: "Primeros pasos"
description: "Regístrese para obtener la versión en la nube o configure su propia instancia en minutos."
---

## Versión en la nube

La forma más rápida de empezar es la versión cloud administrada:

1. Vaya a [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. Regístrate con tu correo electrónico (OTP sin contraseña)
3. Comience a realizar un seguimiento de los gastos en la aplicación web.
4. Si desea conectar Claude Code, Codex o OpenClaw, proporcione al agente `https://api.expense-budget-tracker.com/v1/`

Sin instalación, sin configuración del servidor. Sus datos están aislados mediante seguridad de nivel de fila a nivel de espacio de trabajo en Postgres.

## Acceso al agente y al programa

La misma cuenta alojada funciona para:

- la interfaz de usuario web en `https://app.expense-budget-tracker.com`
- acceso para agentes en `GET https://api.expense-budget-tracker.com/v1/`
- clientes HTTP directos usando `Authorization: ApiKey <key>`

## Autoalojado

Si prefiere ejecutar su propia instancia, consulte la [Guía de autoalojamiento](/es/docs/self-hosting/).

## Modo de demostración

La aplicación incluye un modo de demostración incorporado. Cambie el botón Todo/Demostración en el encabezado para explorar la interfaz con datos de muestra, sin necesidad de base de datos.
