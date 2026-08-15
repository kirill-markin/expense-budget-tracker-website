---
title: Soporte
description: Ayuda e indicaciones para informar de problemas de seguridad en Expense Budget Tracker, incluido el servicio MCP alojado.
slug: support
sections:
  - type: simple_markdown_page
---

## Soporte del servicio alojado y MCP

Para obtener ayuda con la aplicación alojada, una cuenta, la autorización OAuth o el servidor MCP público, escribe a [markinkirill@gmail.com](mailto:markinkirill@gmail.com). El soporte se presta en la medida de lo posible y no se garantizan plazos de respuesta.

Incluye solo los datos de diagnóstico necesarios para investigar:

- nombre y versión del cliente;
- fecha, hora y zona horaria del error;
- endpoint o página implicados;
- paso de OAuth o nombre de la herramienta MCP;
- error exacto ya depurado y el identificador de solicitud, si apareció; y
- qué esperabas y qué ocurrió realmente.

Nunca envíes contraseñas, cookies de sesión, códigos OAuth, tokens de acceso o actualización, claves de API, registros financieros sin ocultar ni el cuerpo completo de una solicitud.

## Informes de seguridad

No publiques una posible vulnerabilidad en un issue público de GitHub. Escribe a [markinkirill@gmail.com](mailto:markinkirill@gmail.com) con el asunto **Expense Budget Tracker security report** y una reproducción mínima y depurada. No incluyas credenciales activas ni datos financieros. Si el acceso puede haberse expuesto, revoca primero la conexión desde **Ajustes > Acceso de agentes** y rota cualquier otra credencial afectada.

## Errores, autoalojamiento y comunidad

Usa el [gestor de issues de GitHub](https://github.com/kirill-markin/expense-budget-tracker/issues) para errores reproducibles, preguntas de autoalojamiento y conversaciones de la comunidad que puedan ser públicas. Busca primero entre los issues existentes y elimina datos privados de registros y capturas. La [guía de autoalojamiento](/es/docs/self-hosting/) y el [repositorio fuente](https://github.com/kirill-markin/expense-budget-tracker) cubren el despliegue y el desarrollo.

## Antes de informar de un problema MCP

Confirma que tu cliente admite MCP remoto mediante Streamable HTTP, OAuth 2.1 con código de autorización y PKCE, y Registro Dinámico de Clientes. Usa exactamente el endpoint universal de la [guía de MCP](/es/docs/mcp-connector/) y vuelve a intentarlo una vez después de reconectar. Si el problema continúa, envía los datos depurados indicados arriba.
