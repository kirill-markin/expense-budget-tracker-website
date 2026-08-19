---
title: "App de presupuesto sin vincular el banco en 2026: guía práctica para el registro manual y la importación de CSV"
description: "Usa una app de presupuesto sin vincular tu banco: compara el registro manual con la importación revisada de extractos, concilia los saldos y comprueba dónde terminan tus datos."
date: "2026-03-30"
updated: "2026-08-19"
image: "/blog/budget-app-without-bank-linking.png"
keywords:
  - "app de presupuesto sin conectar la cuenta bancaria"
  - "control de gastos sin cuenta bancaria"
  - "app de presupuesto sin vincular la cuenta bancaria"
  - "app de presupuesto sin Plaid"
  - "app para llevar el presupuesto manualmente"
  - "app de presupuesto para importar CSV"
  - "control de gastos sin sincronización bancaria"
---

Puedes exportar un extracto bancario de un mes ya cerrado sin crear una conexión para el siguiente. Tú decides cuándo sale el archivo del banco, qué periodo incluye y qué filas se incorporan a tu libro contable.

Ese es el atractivo práctico de una **app de presupuesto sin vincular el banco**. Renuncias a las actualizaciones automáticas, pero ganas un punto de revisión claro. El proceso es sencillo: registra las transacciones a mano o importa un extracto de forma deliberada y, después, comprueba que el saldo de cada cuenta coincida.

![Una persona encargada de la esclusa abre una compuerta cuando el nivel del agua coincide para dejar pasar una sola embarcación](/blog/budget-app-without-bank-linking.png)

## La respuesta breve: toma dos decisiones distintas

Cómo entran las transacciones en tu libro contable y dónde se almacenan tus datos son decisiones diferentes.

Primero, elige un método de registro:

| Método de registro | Cuándo encaja mejor | Recorrido de los datos | Principal inconveniente |
|---|---|---|---|
| Registro manual en la web | Pocas transacciones, pagos en efectivo, compras repartidas entre categorías o personas que no quieran usar IA | Introduces cada transacción directamente en la app | Es el método más deliberado, pero también el que exige más tecleo |
| Importación de extractos con revisión | Exportaciones periódicas en CSV, PDF u otros formatos que estés dispuesto a comprobar | Un agente de IA que se ejecuta desde la terminal lee el archivo local, propone cambios y envía los registros aprobados mediante la Agent API | Es más rápido, pero el cliente o proveedor de IA puede recibir datos del extracto |

Después, elige dónde se ejecutan la app y la base de datos:

| Almacenamiento | Qué significa | Qué no significa |
|---|---|---|
| Servicio alojado | Expense Budget Tracker almacena en AWS RDS (Postgres) los datos financieros que introduces | Aunque no vincules un banco, los datos introducidos manualmente siguen alojados en el servicio |
| Autoalojamiento | Tú gestionas la app y la base de datos Postgres en una infraestructura bajo tu control | Un cliente o proveedor de IA independiente no pasa a ejecutarse de forma local por ello |

También puedes combinar el autoalojamiento con el registro manual. Del mismo modo, utilizar un agente de IA externo es una decisión independiente de dónde se encuentre la base de datos de la aplicación. Esta distinción dice más que una afirmación genérica de que una configuración es simplemente «privada».

## La vinculación bancaria merece una explicación justa

La vinculación bancaria moderna no siempre consiste en que una app de presupuesto recopile la contraseña de tu banco. En muchos flujos OAuth, te identificas en el sitio web o la app del propio banco y autorizas un acceso específico a tus datos antes de regresar al producto. Plaid describe este modelo en su [guía oficial de OAuth](https://plaid.com/docs/link/oauth/). Los datos a los que Plaid puede acceder dependen del producto conectado y de los permisos concedidos, como explica en su [descripción del acceso a los datos de los consumidores](https://support-my.plaid.com/hc/en-us/articles/4410324477847-What-data-does-Plaid-access-from-my-financial-institution).

Esa comodidad resulta útil si necesitas actualizaciones automáticas. Una **app de presupuesto sin Plaid** plantea otro equilibrio: no existe una conexión permanente con un agregador financiero, así que eres tú quien incorpora las transacciones y las verifica.

No vincular el banco solo responde a una pregunta: cómo no llegan los datos. No explica qué ocurre después con los registros manuales, los archivos de extractos, los mensajes enviados a la IA, los resultados de la API, los registros de la base de datos o las copias de seguridad. Sigue el recorrido de cada elemento por separado.

## Empieza con una cuenta y un periodo cerrado

No migres años de historial la primera tarde. Una cuenta pequeña que cuadre es más útil que un libro contable extenso que solo parezca completo.

1. Elige una cuenta con un periodo de extracto bien definido.
2. Crea la cuenta correspondiente en la app, con la moneda correcta y un nombre fácil de reconocer.
3. Fija un límite exacto: una fecha de inicio y el saldo que muestra el extracto en ese momento.
4. Añade las categorías que ya conozcas. Si no identificas algún comercio, déjalo pendiente de revisión en vez de adivinar.
5. Registra o importa únicamente las transacciones contabilizadas dentro de ese periodo.
6. Compara el saldo de cierre de la app con el del extracto antes de añadir otro periodo u otra cuenta.

Si en tu hogar se utilizan varias monedas, conserva cada cuenta y cada transacción en su moneda original. Convierte los importes más adelante, al preparar los informes, en lugar de homogeneizar las cantidades originales durante el registro. La [guía para presupuestar con varias monedas](/blog/multi-currency-budgeting-for-expats/) explica esta configuración con más detalle.

## El registro manual funciona cuando importa más el contexto que el volumen

Una **app para llevar el presupuesto manualmente** encaja bien cuando el número de transacciones relevantes es manejable o cuando las descripciones sin procesar del banco necesitan contexto humano de todos modos.

Para cada movimiento contabilizado, registra:

- fecha e importe
- cuenta y moneda
- tipo de transacción, por ejemplo, gasto, ingreso o transferencia
- categoría
- contraparte o una nota breve si la descripción del banco no es clara

Registra las compras en efectivo, las facturas compartidas, los reembolsos de gastos y las compras repartidas entre varias categorías mientras todavía recuerdes qué ocurrió. La actividad habitual de la tarjeta puede esperar hasta la revisión periódica.

Tener que introducir cada movimiento también forma parte del control. Puedes reconocer que el pago de una tarjeta de crédito es una transferencia, no un gasto nuevo, o que el dinero recibido de un amigo salda un gasto compartido en vez de crear un ingreso. El coste también está claro: la app no puede detectar una transacción que nunca registras. Para que un libro contable manual sea fiable, debes cotejarlo periódicamente con el extracto bancario.

## La importación de un extracto debe empezar como borrador

Expense Budget Tracker no ofrece sincronización bancaria automática ni permite subir extractos desde el navegador. Las importaciones desde archivos utilizan un agente de IA que se ejecuta desde la terminal, con acceso explícito al archivo local del extracto y, por separado, la Agent API directa.

Una importación cuidadosa sigue estos pasos:

1. Exporta del banco un archivo CSV, PDF u otro tipo de extracto y guárdalo en tu equipo.
2. Conecta el agente de terminal empezando por `GET https://api.expense-budget-tracker.com/v1/` y sigue la guía de [Configuración del agente de IA](/docs/agent-setup/).
3. Completa el proceso de OTP por correo electrónico. Guarda la `ApiKey` de larga duración que recibas en un lugar seguro, fuera de la memoria del chat.
4. Pide al agente que inspeccione `/v1/schema`, seleccione el espacio de trabajo previsto y consulte los movimientos de esa misma cuenta en ese mismo intervalo de fechas antes de preparar los cambios.
5. Solicita un borrador que indique la cuenta de destino, la moneda, el periodo, el número de filas, las categorías y los posibles duplicados. Todavía no insertes nada.
6. Revisa el borrador, sobre todo las transferencias, devoluciones, reembolsos de gastos, comisiones, retiradas de efectivo y filas en moneda extranjera.
7. Aprueba solo las escrituras previstas mediante el endpoint restringido `/v1/sql/execute`.
8. Consulta el periodo guardado mediante `/v1/sql/query` y concilia el saldo de cierre.

La API separa las lecturas SQL restringidas de las escrituras aprobadas. Este límite reduce las consecuencias de un error, pero no garantiza que la interpretación del agente sea correcta. La revisión humana sigue siendo el paso que convierte un archivo procesado en una contabilidad fiable.

Un CSV suele ser más fácil de revisar que un PDF porque las filas ya están estructuradas. Aun así, aunque el formato esté ordenado, una **app de presupuesto para importar CSV** no puede saber por sí sola si un intervalo de fechas se solapa con una importación anterior, un cargo sigue pendiente o una transferencia está mal clasificada. La [guía para importar extractos](/blog/how-to-import-bank-statements-into-an-expense-tracker/) explica este proceso con más detalle.

### Comprueba cuatro aspectos antes de aprobar una escritura

1. **Origen:** confirma la cuenta, la moneda y las fechas del extracto, y comprueba que el archivo contenga transacciones contabilizadas del periodo previsto.
2. **Solapamiento:** consulta primero esa cuenta y ese intervalo de fechas. Los identificadores, importes, fechas y contrapartes coincidentes son señales de posibles duplicados; no bastan para decidir automáticamente.
3. **Clasificación:** revisa todos los comercios que no reconozcas, además de cada transferencia, devolución, reembolso de gastos, comisión, retirada de efectivo y fila en moneda extranjera.
4. **Resultado:** confirma el espacio de trabajo, el cambio exacto propuesto y el número de filas esperado. Tras la escritura, consulta el periodo afectado en vez de confiar en un mensaje de éxito.

### MCP utiliza una vía de conexión diferente

El [conector MCP](/docs/mcp-connector/) alojado utiliza OAuth en el navegador. Requiere `expenses:read`; `expenses:write` es opcional y se necesita para las modificaciones aprobadas. Estas credenciales OAuth son distintas de la `ApiKey` de la Agent API y no pueden sustituirla.

MCP ofrece herramientas para seleccionar espacios de trabajo, consultar el esquema, realizar consultas restringidas y ejecutar escrituras aprobadas. Por sí solo, no permite que un servicio remoto lea cualquier archivo de tu ordenador. Un cliente MCP concreto también puede acceder a archivos adjuntos o locales, pero tanto esa capacidad como el recorrido de esos datos dependen del cliente. Para el proceso desde archivos descrito antes, utiliza la vía documentada de la Agent API y concede acceso al archivo de manera explícita.

## Resuelve los movimientos que pueden hacer que una importación parezca correcta

Una cuenta puede cuadrar aunque las categorías del presupuesto estén equivocadas. Define una regla clara para estos casos:

| Fila del extracto | Tratamiento | Error habitual |
|---|---|---|
| Duplicado | Conserva una sola entrada en el libro contable para el movimiento real; utiliza un identificador bancario cuando esté disponible | Importar dos veces periodos que se solapan |
| Transferencia entre tus cuentas | Vincula los dos movimientos de las cuentas como una única transferencia | Contar la salida como gasto y la entrada como ingreso |
| Devolución de un comercio | Registra la devolución contabilizada en la categoría del gasto original | Eliminar la compra o clasificar la devolución como salario |
| Reembolso de gastos | Conserva el desembolso original y compensa después únicamente el importe que realmente te hayan reembolsado | Ocultar el periodo en el que adelantaste el dinero o contabilizar cada reembolso como ingreso |

Las transferencias exigen especial atención cuando importas las cuentas por separado. El movimiento de salida puede aparecer ahora aunque la cuenta receptora todavía no esté en la app. Marca que falta el movimiento correspondiente en vez de clasificar sin más como gasto el único lado visible.

Las devoluciones y los reembolsos de gastos deben incorporarse al libro contable cuando se contabilizan. Hasta entonces, el dinero sigue fuera de la cuenta. Si solo te reembolsan parte de una compra, compensa el importe recibido y deja el resto en la categoría de gasto correspondiente.

## Concilia el saldo y revisa después las categorías

Concilia las cuentas de una en una y utiliza la moneda de cada cuenta. No empieces comparando el total de todas las cuentas del hogar: varios errores independientes pueden compensarse entre sí y producir una cifra convincente.

Para una cuenta corriente o de ahorro que siga la convención habitual de entradas y salidas:

**saldo de cierre esperado = saldo inicial + entradas contabilizadas − salidas contabilizadas**

Si la app almacena movimientos con signo, la comprobación equivalente es:

**saldo de cierre esperado = saldo inicial + suma de los movimientos contabilizados con signo**

Las tarjetas de crédito y otras cuentas de pasivo pueden mostrar los saldos y los signos de otra manera. Antes de calcular la diferencia, normaliza el extracto y la app con la misma convención específica para esa cuenta; no reutilices a ciegas la fórmula de una cuenta corriente o de ahorro.

Después, calcula:

**diferencia = saldo de cierre de la app − saldo de cierre del extracto**

El objetivo es que la diferencia sea cero una vez que ambos saldos utilicen la misma convención. Compara transacciones contabilizadas con transacciones contabilizadas. Una retención pendiente de la tarjeta que solo aparece en un lado provoca un desfase temporal, no un resultado útil para la conciliación.

Si la diferencia no es cero, comprueba:

1. el saldo inicial y la fecha que delimita el periodo
2. las filas ausentes o duplicadas
3. las transacciones pendientes incluidas solo en un lado
4. las transferencias incompletas
5. los errores de importe, cuenta, moneda o signo

Una diferencia de cero demuestra que los movimientos de la cuenta suman correctamente. No demuestra que las compras de supermercado, los viajes, las devoluciones y los reembolsos de gastos hayan terminado en las categorías adecuadas. Revisa los totales por categoría como un paso independiente. La [guía de conciliación del presupuesto](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) explica cómo investigar una discrepancia cuenta por cuenta.

## Comprueba dónde terminan tus datos

Un **control de gastos sin conexión a una cuenta bancaria** puede seguir utilizando varios servicios. El recorrido exacto depende de tu configuración:

| Configuración | Almacenamiento de la aplicación | Otro procesamiento |
|---|---|---|
| App alojada con registro manual | Los datos financieros que introduces se almacenan en AWS RDS (Postgres) | No hace falta ningún cliente de IA para introducirlos |
| App alojada con importación directa mediante la Agent API | Los datos aprobados del libro contable se almacenan en AWS RDS (Postgres) | El cliente de terminal o su proveedor de IA puede procesar el extracto, los mensajes enviados a la IA y los resultados de la API |
| App alojada con MCP remoto | Los datos que se consultan o escriben permanecen en la base de datos alojada | El cliente MCP autorizado recibe los resultados solicitados; las escrituras requieren `expenses:write` |
| App autoalojada con registro manual | La app y la base de datos se ejecutan en una infraestructura bajo tu control | No hace falta ningún cliente de IA para introducir los datos |
| App autoalojada con un cliente de IA externo | La app y la base de datos se ejecutan en una infraestructura bajo tu control | El proveedor externo puede seguir procesando archivos, mensajes enviados a la IA o registros financieros devueltos |

La [Política de privacidad](/privacy/) del servicio alojado explica quién lo gestiona, cómo funcionan el almacenamiento en AWS y las copias de seguridad, el procesamiento mediante MCP y los límites relacionados con clientes de terceros. La [Guía de autoalojamiento](/docs/self-hosting/) explica cómo ejecutar la app y Postgres por tu cuenta. El autoalojamiento te da el control de la aplicación y la base de datos, pero no cambia la política de privacidad de otros servicios que decidas conectar.

## Mantén una rutina sencilla

Llevar un presupuesto sin vincular el banco funciona mejor como un cierre periódico que como una limpieza anual. Durante el mes, registra el efectivo, las compras inusuales y las transacciones cuyo contexto será difícil reconstruir más adelante. Al final de cada periodo del extracto:

1. exporta el extracto definitivo con las transacciones contabilizadas
2. registra a mano las filas que falten o prepara una importación revisada mediante un agente
3. resuelve los duplicados, las transferencias, las devoluciones y los reembolsos de gastos
4. concilia cada cuenta por separado
5. revisa las categorías y conserva el saldo de cierre y la fecha como el siguiente punto de referencia fiable

Esta rutina permite que un **control de gastos sin sincronización bancaria** sea fiable sin presentarlo como un proceso automático.

## Dónde encaja Expense Budget Tracker

Expense Budget Tracker está diseñado en torno a un libro contable estructurado sin sincronización bancaria automática. La app web permite registrar transacciones a mano y gestionar saldos, categorías, transferencias, presupuestos y varias monedas. Los usuarios técnicos pueden conectar un agente de terminal mediante la Agent API directa, inspeccionar el esquema disponible y revisar las lecturas restringidas y las escrituras aprobadas antes de importar un extracto.

Las limitaciones forman parte de la elección:

- no hay importación automática de movimientos bancarios
- no hay un proceso para importar extractos desde el navegador
- las importaciones desde archivos requieren un agente de IA con las capacidades necesarias que se ejecute desde la terminal, además de una revisión deliberada
- la clave de larga duración de la Agent API debe guardarse en un lugar seguro, fuera de la memoria del chat
- MCP utiliza credenciales OAuth independientes y no lee archivos locales automáticamente
- los datos financieros del servicio alojado se almacenan en el servicio gestionado AWS RDS (Postgres)
- con el autoalojamiento, tú asumes la responsabilidad del despliegue, las actualizaciones, la base de datos y las copias de seguridad

Si este equilibrio encaja contigo, abre la [app alojada](https://app.expense-budget-tracker.com/) o sigue la guía de [Primeros pasos](/docs/getting-started/). Empieza con una cuenta y un periodo cerrado. Haz que el saldo cuadre, revisa las categorías por separado y amplía el sistema solo cuando ese primer periodo sea fiable.

## Preguntas frecuentes

### ¿Puedo usar Expense Budget Tracker sin conectar una cuenta bancaria?

Sí. La app web permite registrar transacciones manualmente y no tiene sincronización bancaria automática. También puedes utilizar un agente de IA con las capacidades necesarias que se ejecute desde la terminal para leer un extracto y enviar los registros aprobados mediante la Agent API directa.

### ¿Puedo subir un CSV desde el navegador?

No. No existe un proceso para subir o importar extractos desde el navegador. Introduce las filas manualmente o concede a un agente de terminal acceso explícito al archivo y revisa las escrituras que proponga mediante la Agent API.

### ¿Una app de presupuesto sin vincular una cuenta bancaria mantiene todos los datos en privado?

No vincular el banco elimina la conexión permanente con un agregador financiero, pero no excluye a todos los terceros. La app alojada guarda los datos financieros que introduces en AWS RDS (Postgres). Un cliente o proveedor de IA puede procesar un extracto, un mensaje enviado a la IA o un registro financiero devuelto. El autoalojamiento pone la app y la base de datos bajo tu control, pero cualquier proveedor de IA externo sigue siendo externo.

### ¿El conector MCP es lo mismo que la Agent API?

No. MCP utiliza OAuth con el permiso obligatorio `expenses:read` y el permiso opcional `expenses:write`. La Agent API utiliza una `ApiKey` de larga duración obtenida mediante un OTP por correo electrónico. Las credenciales no son intercambiables y MCP no lee automáticamente los archivos de extractos locales.

### ¿Cuál es la forma más sencilla de empezar?

Utiliza una cuenta, una moneda y un periodo cerrado. Registra o importa los movimientos contabilizados, resuelve los casos especiales, concilia el saldo de cierre y revisa las categorías por separado. Esta pequeña prueba te dará una respuesta sincera sobre si una **app de presupuesto sin vincular tu cuenta bancaria** encaja en tu rutina.
