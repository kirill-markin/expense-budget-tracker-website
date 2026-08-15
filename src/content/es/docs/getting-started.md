---
title: "Primeros pasos"
description: "Regístrate para usar la versión alojada en la nube o configura tu propia instancia en cuestión de minutos."
---

## Versión en la nube

La forma más rápida de empezar es usar la versión alojada en la nube:

1. Ve a [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. Regístrate con tu correo electrónico (OTP sin contraseña)
3. Empieza a registrar tus gastos en la aplicación web
4. Para un cliente compatible con MCP, añade `https://mcp.expense-budget-tracker.com/mcp` y autoriza el acceso en el navegador
5. Para un agente de terminal o un cliente HTTP directo, empieza por `GET https://api.expense-budget-tracker.com/v1/`

No necesitas instalar nada ni configurar servidores. Tus datos quedan aislados por espacio de trabajo mediante la seguridad a nivel de fila de Postgres.

## Acceso para agentes y programas

Con la misma cuenta de la versión alojada puedes usar:

- la interfaz web en `https://app.expense-budget-tracker.com`
- el [conector MCP](/es/docs/mcp-connector/) alojado en `https://mcp.expense-budget-tracker.com/mcp`, autorizado mediante OAuth en el navegador
- la [configuración de la API para agentes](/es/docs/agent-setup/) desde `GET https://api.expense-budget-tracker.com/v1/`, seguida de solicitudes HTTP directas con `Authorization: ApiKey <key>`

## Autoalojamiento

Si prefieres ejecutar tu propia instancia, consulta la [guía de autoalojamiento](/es/docs/self-hosting/).

## Modo de demostración

La aplicación incluye un modo de demostración integrado. Usa el selector Todo/Demostración del encabezado para recorrer la interfaz con datos de ejemplo, sin necesidad de configurar una base de datos.
