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

## Cómo usamos tus datos

Tus datos financieros se utilizan únicamente para prestar el servicio. No los vendemos ni los usamos con fines publicitarios. Solo los comunicamos a un cliente de terceros cuando indicas al servicio que lo haga, por ejemplo al autorizar una conexión MCP. Cada espacio de trabajo queda aislado mediante la seguridad a nivel de fila de Postgres.

## MCP y clientes de IA de terceros

Cuando conectas un cliente de IA al servicio MCP alojado, Expense Budget Tracker procesa la solicitud de autorización OAuth, la herramienta solicitada y sus argumentos, el espacio de trabajo elegido y los registros financieros necesarios para responder a una consulta de lectura o aplicar una escritura aprobada. Los cambios realizados mediante MCP pasan a formar parte de los mismos datos financieros alojados que los cambios hechos en la aplicación web.

El servicio almacena el nombre y las URL de redirección del cliente registrado, los metadatos de la conexión y sus permisos, las fechas de creación, actividad y revocación, y hashes unidireccionales de códigos de autorización y tokens OAuth de acceso y actualización. No almacena los tokens OAuth originales. El servicio MCP no guarda la conversación del cliente de IA como una conversación del producto, aunque recibe cada solicitud de herramienta y devuelve el resultado solicitado.

El cliente de IA es un tercero independiente y puede procesar o conservar prompts, argumentos de herramientas y datos financieros devueltos conforme a sus propias condiciones y política de privacidad. Revisa su política antes de conectarlo. Puedes revocar una conexión MCP en cualquier momento desde **Ajustes > Acceso de agentes**. Puedes eliminar tu cuenta y los datos alojados asociados desde Configuración, como se explica más abajo.

## Almacenamiento de datos

Los datos de la nube se almacenan en AWS RDS (Postgres), en la región `eu-central-1`, con copias de seguridad automáticas diarias. Los datos están cifrados en reposo y en tránsito.

## Cookies

Usamos una cookie `session` para la autenticación (HttpOnly, Secure, SameSite=Lax). No usamos cookies de seguimiento ni analítica de terceros.

## Eliminación de datos

Puedes eliminar tu cuenta y todos los datos asociados en cualquier momento desde Configuración en la aplicación. En las instalaciones autoalojadas, controlas directamente la base de datos.

## Código abierto

Todo el código fuente está disponible como código abierto. Puedes auditar exactamente qué hace la aplicación con tus datos.
