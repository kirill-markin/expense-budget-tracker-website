---
title: Política de privacidad
description: Política de privacidad de Expense Budget Tracker.
slug: privacy
sections:
  - type: legal_page
    lastUpdated: Agosto de 2026
---
## Qué recopilamos

Cuando usas la versión en la nube, almacenamos los datos financieros que introduces (transacciones, presupuestos y nombres de cuentas) y tu dirección de correo electrónico para la autenticación. Las instalaciones autoalojadas no nos envían ningún dato.

## Operador

El servicio alojado de Expense Budget Tracker está operado por SAMO DANNI EOOD (VAT: BG207395566). Expense Budget Tracker fue creado por Kirill Markin y [kirill-markin.com](https://kirill-markin.com/) es el sitio personal relacionado dentro del mismo ecosistema de creador y producto.

Esta política se aplica al sitio web, la aplicación, la API y el servicio MCP remoto alojados que operamos. Las instancias autoalojadas permanecen bajo el control de sus operadores.

## Cómo usamos tus datos

Tus datos financieros se utilizan únicamente para prestar el servicio. No vendemos ni usamos tus datos con fines publicitarios. Cada espacio de trabajo queda aislado mediante la seguridad a nivel de fila de Postgres.

## Clientes externos de IA

Cuando conectas un cliente externo de IA al servicio MCP alojado mediante OAuth, tú eliges el cliente y autorizas el acceso que recibe. Los datos financieros que pidas a ese cliente consultar o modificar también son tratados por el cliente y su proveedor de IA o de modelos conforme a sus propias condiciones y políticas de privacidad. No controlamos ese tratamiento independiente.

## Almacenamiento de datos

Los datos de la nube se almacenan en AWS RDS (Postgres), en la región `eu-central-1`, con copias de seguridad automáticas diarias. Los datos están cifrados en reposo y en tránsito.

## Cookies

Usamos una cookie `session` para la autenticación (HttpOnly, Secure, SameSite=Lax). No usamos cookies de seguimiento ni analítica de terceros.

## Eliminación de datos

Puedes eliminar tu cuenta y todos los datos asociados en cualquier momento desde Configuración en la aplicación. En las instalaciones autoalojadas, controlas directamente la base de datos.

## Código abierto

Todo el código fuente está disponible como código abierto. Puedes auditar exactamente qué hace la aplicación con tus datos.
