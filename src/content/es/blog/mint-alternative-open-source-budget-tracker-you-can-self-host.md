---
title: "Alternativa autoalojada a Mint en 2026: mantén el control de tus datos"
description: "¿Buscas una alternativa a Mint que puedas autoalojar? Compara las opciones, migra tus transacciones antiguas sin alterar los saldos y crea un sistema presupuestario auditable y portátil."
date: "2026-03-09"
updated: "2026-08-18"
image: "/blog/mint-alternative-open-source-budget-tracker-you-can-self-host.png"
keywords:
  - "alternativa autoalojada a Mint"
  - "alternativa de código abierto a Mint"
  - "alternativa local a Mint.com"
  - "alternativa a Mint en 2026"
  - "gestor de presupuesto de código abierto"
  - "gestor de gastos autoalojado"
---

En su [página actual de Mint](https://mint.intuit.com/how-mint-works), Intuit remite a Credit Karma a quienes buscan las funciones conocidas de Mint. Es una opción gestionada, pero no responde a la pregunta que se hacen muchos usuarios de perfil técnico que dejaron Mint: ¿dónde deberían guardar ahora sus años de datos presupuestarios y cómo pueden migrarlos sin alterar los saldos sin darse cuenta?

[Expense Budget Tracker](https://expense-budget-tracker.com/) es una **alternativa autoalojada a Mint** sólida si valoras más la propiedad de los datos, un libro mayor auditable y las importaciones bajo tu control que la conexión bancaria automática. No es un clon de Mint que puedas usar como sustituto directo sin cambiar nada. No se conecta automáticamente al banco ni se sincroniza con Mint. Debes registrar las transacciones de forma explícita o importar los datos que ya conserves y revisar el resultado.

Esa diferencia define toda la decisión. Si quieres que las cuentas se actualicen sin tu intervención, elige un producto basado en la agregación bancaria. Si buscas un sistema financiero que funcione sobre tu propia base de datos Postgres y que puedas inspeccionar fila por fila y automatizar a tu manera, esta opción tiene más sentido.

![Un hombre ordena fichas de madera de colores en un archivador modular junto a una balanza](/blog/mint-alternative-open-source-budget-tracker-you-can-self-host.png)

## Respuesta breve: elige entre control y comodidad automática

| Lo que más te importa | Mejor opción | Motivo |
|---|---|---|
| Conexión bancaria automática con poco mantenimiento | Un agregador gestionado | Expense Budget Tracker no sincroniza automáticamente las cuentas bancarias |
| Una base de datos local o autoalojada | Expense Budget Tracker | La configuración con Docker Compose ejecuta la aplicación web y Postgres en una infraestructura que controlas |
| Una aplicación gestionada sin tener que operar un servidor | La versión alojada de Expense Budget Tracker | La aplicación alojada ofrece acceso gestionado al libro mayor y a las funciones presupuestarias sin configuración local |
| Saldos y transferencias que se puedan inspeccionar | Expense Budget Tracker | Los saldos de las cuentas son la suma de los asientos del libro mayor y las transferencias se mantienen como movimientos explícitos en él |
| Recrear con un clic todas las funciones antiguas de Mint | No lo des por hecho con ninguna opción | Prueba los flujos de trabajo que utilizabas de verdad antes de migrar todo tu historial |

Por eso una **alternativa de código abierto a Mint** no es automáticamente la mejor alternativa para todo el mundo. El autoalojamiento te da control, pero también te obliga a gestionar las actualizaciones, las copias de seguridad, la seguridad y la recuperación. La [guía de autoalojamiento](/docs/self-hosting/) comienza con Docker Compose y también documenta el despliegue de producción en AWS.

## El modelo al que vas a migrar tus datos

La migración más segura empieza por el modelo de destino, no por las columnas del archivo CSV.

Expense Budget Tracker almacena los datos financieros en Postgres. Su vista `accounts` se deriva de los asientos del libro mayor, en lugar de mantenerse como una lista independiente de saldos. Cada asiento tiene una cuenta, un importe con signo, una moneda original y uno de estos tres tipos: `income`, `spend` o `transfer`.

Esto tiene una consecuencia útil: el saldo actual no es una cifra que se sobrescriba cada vez que el panel parece incorrecto. Es la suma de lo que ha ocurrido en el libro mayor. Por tanto, una importación incorrecta sigue siendo visible y se puede corregir, pero un saldo inicial que falte seguirá faltando.

El presupuesto es una capa independiente. Las filas del plan base contienen el importe previsto para cada mes y categoría. Los ajustes posteriores se almacenan por separado y se suman para formar el plan resultante. Los ingresos y gastos reales siguen procediendo del libro mayor. Migrar primero las transacciones y reconstruir después el presupuesto futuro evita mezclar ambas tareas.

Si trabajas con varias monedas, cada asiento conserva su moneda original. El espacio de trabajo define una moneda de referencia para los informes, a los que se aplican tipos de cambio diarios en el momento de consultarlos. Concilia primero cada cuenta en su propia moneda. El total convertido que muestra un panel es un dato de informe, no el saldo de origen del banco.

## Define el mapeo de los datos antiguos antes de importar una sola fila

Si conservas una exportación de Mint, trabaja con una copia y mantén el original sin cambios. Si no conservas ninguna, utiliza extractos bancarios y de tarjetas para los periodos que puedas verificar. No des por hecho que todavía puedes obtener una exportación de Mint ni combines una exportación conservada con extractos de las mismas fechas como dos fuentes de importación.

Documenta el mapeo antes de que un agente o script reciba acceso de escritura:

| Concepto de origen | Destino en Expense Budget Tracker | Decisión que debes tomar |
|---|---|---|
| Cuenta de Mint | `account_id` estable utilizado por los asientos del libro mayor | Elige un ID y una moneda propia para cada cuenta real; no cambies ese ID a mitad de la importación |
| Transacción | Una fila de `ledger_entries` | Normaliza la fecha, el importe con signo, la moneda y el tipo `income` o `spend` |
| Comercio o destinatario del pago | `counterparty` | Conserva el texto de origen antes de aplicar cualquier regla de limpieza |
| Nota descriptiva | `note` | Conserva el contexto útil; no conviertas las notas en categorías |
| Categoría y subcategoría | `category` | Conserva la estructura antigua o define una tabla de mapeo explícita |
| Transferencia entre tus cuentas | Dos asientos del libro mayor que comparten un `event_id` | Utiliza `kind = transfer`, un importe negativo en la cuenta de origen y uno positivo en la cuenta de destino |
| ID de transacción de origen | `external_id` o un manifiesto de importación | Conserva un identificador estable para que una segunda ejecución pueda encontrar la misma fila de origen |
| Objetivo del presupuesto antiguo | Plan presupuestario base, recreado después de la conciliación | Traslada solo el plan que sigues utilizando; no deduzcas los presupuestos antiguos a partir de los totales de las transacciones |
| Cambio posterior del plan | Ajuste presupuestario | Conserva la base original y registra el cambio por separado |

Durante una migración, resulta tentador reorganizar las categorías. También es la forma de convertir una migración controlada en varios proyectos a la vez. Conserva las categorías antiguas durante la prueba piloto. Combínalas o cámbiales el nombre solo después de que los saldos coincidan.

## Decide qué significa «saldo inicial»

Debes tomar esta decisión antes de elegir el intervalo que vas a importar porque las cuentas y los saldos proceden del libro mayor.

### Importar todo el historial

Si los datos que conservas abarcan la cuenta desde su apertura real y el historial está completo, importa todo el libro mayor. El saldo resultante debería surgir de esos asientos sin una fila inicial sintética.

Es la opción más limpia y, por lo general, la más lenta. Una exportación extensa puede contener duplicados, cuentas renombradas, categorías eliminadas y pares de transferencias que ya no parecen estar vinculados.

### Empezar en una fecha de transición clara

Para la mayoría de las migraciones, un periodo de extracto ya cerrado sirve mejor como prueba piloto. Elige la fecha inicial del extracto y registra el saldo de origen en ese punto de corte.

Expense Budget Tracker no tiene un campo de saldo inicial ni un tipo de asiento específico para ello. Si necesitas que el gestor muestre el saldo real desde el primer día, una opción es crear un asiento sintético claramente etiquetado justo antes de la primera transacción importada. El saldo positivo de un activo puede ser un asiento `income` positivo; el saldo negativo de una tarjeta o un pasivo puede ser un asiento `spend` negativo.

Esa fila seguirá contando como ingreso o gasto en los informes que incluyan su fecha. Colócala justo antes de la transición, usa una categoría como `Opening balance`, añade una nota con el extracto y la fecha de origen y comienza después el análisis normal de ingresos y gastos. La etiqueta permite auditar ese ajuste, pero no excluye automáticamente el asiento de los informes. Si también necesitas informes limpios que abarquen la fecha anterior, importar el historial completo es el modelo más seguro.

### Registrar solo la actividad nueva

Puedes omitir los saldos históricos y empezar a registrar transacciones nuevas. En ese caso, acepta que los saldos de las cuentas del gestor estarán incompletos. Esta opción sirve para registrar categorías a partir de una fecha elegida, pero no es válida si esperas que la vista de cuentas coincida con el saldo bancario actual.

## Una migración de Mint por etapas que protege los saldos

La unidad práctica de migración es una cuenta y un periodo de extracto ya cerrado. Es lo bastante pequeña como para inspeccionarla y lo bastante amplia como para detectar reembolsos, duplicados y errores de signo. Si esa cuenta tiene transferencias con otra cuenta que también registras, incluye el periodo correspondiente del extracto de la otra cuenta o elige una prueba piloto más sencilla. No puedes verificar por completo una transferencia interna viendo un solo lado.

### 1. Conserva la fuente y prepara un inventario

Guarda el archivo de Mint que hayas conservado, los extractos y cualquier mapeo de categorías fuera de la copia de trabajo de la importación. Enumera cada cuenta con:

- un ID de destino estable
- su propia moneda
- las fechas de la primera y la última transacción disponibles
- los saldos inicial y final del periodo piloto
- si contiene alguna transferencia a otra cuenta incluida en el proceso

Las cuentas archivadas o cerradas también necesitan ID estables si su historial forma parte de la migración.

### 2. Crea un espacio de trabajo limpio y elige la moneda de los informes

Utiliza un despliegue local temporal con Docker o un espacio de trabajo alojado independiente para probar la migración. Configura la moneda de referencia para los informes, pero mantén la hoja de conciliación en la moneda propia de cada cuenta.

Como la vista de cuentas se deriva de los asientos del libro mayor, una cuenta aparece cuando existe su primer asiento. Esa primera fila puede ser el saldo inicial documentado o la primera transacción real, según la elección anterior.

### 3. Define una única regla para los duplicados

Cuando exista, utiliza el ID de la transacción de origen como `external_id`. La base de datos no aplica ninguna restricción de unicidad a ese campo, así que, antes de escribir, una segunda ejecución debe consultar el destino para buscar la misma cuenta y el mismo ID de origen. Cuando la fuente no tenga ID, crea una clave de importación determinista a partir de campos estables, como el ID de la cuenta, la fecha de contabilización, el importe con signo, la moneda y la descripción de origen sin modificar. Guarda esa clave en un manifiesto de importación y compara las filas candidatas con el destino antes de cada lote.

No utilices solo `event_id` como clave de duplicados para las transferencias. Ambos lados de una transferencia comparten intencionadamente el mismo ID de evento.

Si una exportación de Mint conservada y un extracto bancario se solapan, elige una sola fuente para escribir. Utiliza la otra únicamente para verificar los recuentos y los saldos.

### 4. Prepara una prueba en seco, sin escribir datos

Analiza el primer lote y preséntalo en una tabla de revisión antes de insertar nada. Incluye:

- el identificador de la fila de origen
- el ID de la cuenta de destino
- la fecha y hora de contabilización
- el importe con signo en la moneda original
- el tipo propuesto
- la categoría propuesta
- la contraparte y la nota
- la otra cuenta de la transferencia y ambos importes con signo, cuando corresponda

Diez filas corrientes y unas pocas difíciles son más útiles que un primer intento con mil filas. Incluye un reembolso, una transferencia y un comercio que aparezca más de una vez, si los hay en el periodo.

Detente aquí si el signo de un importe o el mapeo de una cuenta son ambiguos. Una conjetura en esta etapa se convierte después en una corrección del saldo.

### 5. Inserta un lote pequeño

Escribe solo las filas revisadas de la cuenta piloto, junto con las dos partes confirmadas de sus transferencias internas. Compruébalas de inmediato en la vista de transacciones. Busca signos invertidos, fechas alteradas por la zona horaria, céntimos perdidos, monedas incorrectas y descripciones que se hayan limpiado de forma tan agresiva que ya no se puedan vincular a la fuente.

Para una transferencia entre dos cuentas tuyas, crea dos asientos con el mismo ID de evento. Un movimiento de 500 USD de una cuenta corriente a una cuenta de ahorro es una transferencia negativa de 500 USD en la cuenta corriente y una transferencia positiva de 500 USD en la cuenta de ahorro. No es un gasto en una cuenta ni un ingreso en la otra. Para una transferencia entre monedas distintas, utiliza el importe real contabilizado y la moneda de cada lado, en lugar de calcular un lado a partir del otro.

El pago de una tarjeta de crédito sigue la misma regla. Las compras originales con la tarjeta son gastos. El pago posterior es una transferencia de la cuenta corriente a la cuenta de la tarjeta, por lo que contabilizarlo como otro gasto duplica el gasto del mes.

### 6. Concilia antes de importar otro lote

Para cada cuenta afectada por el lote, comprueba que esta ecuación se cumple en su propia moneda:

`saldo inicial + movimientos contabilizados con signo = saldo final`

Compara el resultado con el extracto cerrado, no con un saldo disponible que incluya actividad pendiente. Después, comprueba:

- el número de filas de origen y de filas importadas
- cada posible duplicado
- cada par de transferencias y los asientos de ambas cuentas
- los reembolsos y las reversiones
- el saldo final exacto

Si el saldo es incorrecto, detente. Encuentra la fila ausente, duplicada o con el signo equivocado. No añadas una corrección sin explicar solo para que el total aparezca en verde. La [guía de conciliación presupuestaria](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) ofrece una lista de comprobación más completa, cuenta por cuenta.

### 7. Avanza un periodo cada vez

Cuando un periodo cuadre, añade el siguiente periodo de la misma cuenta. Completa y concilia ambos lados de cada transferencia interna antes de avanzar más allá de ese periodo. Solo entonces debes pasar a otra cuenta.

Parece más lento que una única carga masiva. Es mucho más rápido que buscar una transferencia duplicada entre varios años de movimientos de distintas cuentas.

El flujo de trabajo práctico con extractos se explica en [Cómo importar extractos bancarios a un gestor de gastos](/blog/how-to-import-bank-statements-into-an-expense-tracker/). El mismo proceso sirve tanto para un archivo CSV de Mint que hayas conservado como para una exportación del banco: analizar, mapear, revisar, escribir y conciliar.

### 8. Reconstruye el presupuesto cuando el libro mayor sea fiable

No crees un presupuesto impecable sobre transacciones sin conciliar.

Cuando los movimientos reales cuadren, vuelve a crear el plan base para el mes actual y los meses futuros. Utiliza ajustes presupuestarios para los cambios posteriores, en lugar de modificar después el plan base y perder el contexto de la decisión original. A continuación, compara los ingresos y gastos reales con el plan y revisa la vista en la moneda de referencia.

En un hogar que utiliza varias monedas, una cuenta puede conciliar perfectamente en su propia moneda mientras su valor en la moneda de referencia cambia con los tipos de cambio diarios. Esa variación es normal. No debes reescribir el importe de origen para mantener inmóvil el total convertido.

## ¿MCP o Agent API para la importación?

El producto alojado dispone ahora de dos interfaces independientes para el acceso automatizado. Sirven para tareas parecidas, pero utilizan métodos de autenticación y credenciales diferentes.

### Utiliza el conector MCP alojado si tu cliente lo admite

Conecta un cliente MCP remoto compatible con OAuth a `https://mcp.expense-budget-tracker.com/mcp`. El ámbito obligatorio `expenses:read` permite identificar los espacios de trabajo disponibles, inspeccionar el esquema y hacer consultas. Solicita el ámbito opcional `expenses:write` solo cuando el cliente deba modificar datos.

Es un límite de seguridad útil para una migración: primero inspecciona el esquema y las filas existentes con acceso de lectura y después aprueba el acceso de escritura para el lote revisado. La [guía del conector MCP](/docs/mcp-connector/) explica la conexión y el flujo de uso de las herramientas.

### Utiliza la Agent API para agentes de terminal o HTTP directo

Empieza en `GET https://api.expense-budget-tracker.com/v1/`. La respuesta de descubrimiento guía al agente por la verificación del correo electrónico, la selección del espacio de trabajo, la inspección del esquema y los endpoints SQL restringidos. Las solicitudes autenticadas utilizan una `ApiKey` de larga duración.

La [guía de configuración de la Agent API](/docs/agent-setup/) es la vía más corta para empezar, mientras que la [referencia de la API](/docs/api/) explica los endpoints de lectura y escritura. Pide al agente que muestre el mapeo propuesto y el lote exacto antes de escribir; después, consulta las filas insertadas y los saldos.

Los tokens OAuth de MCP y las claves de la Agent API son credenciales independientes. No son intercambiables y ninguna de ellas debería pegarse en notas de artículos, prompts ni archivos de código fuente.

La configuración local básica con Docker Compose inicia Postgres, las migraciones, la aplicación web, el servicio de autenticación y el worker de tipos de cambio. No inicia servicios MCP ni Agent API locales. Las URL gestionadas anteriores pertenecen al servicio alojado. El despliegue de producción documentado en AWS incluye la infraestructura de API y MCP correspondiente si quieres operar por tu cuenta la pila completa.

## Para quién encaja esta alternativa de código abierto a Mint

Expense Budget Tracker encaja bien si quieres:

- Postgres como fuente de verdad
- una opción alojada o tu propio despliegue
- saldos derivados de movimientos del libro mayor que puedas inspeccionar
- ingresos, gastos y transferencias explícitos
- asientos en la moneda original de cada cuenta e informes basados en tipos de cambio diarios
- un presupuesto con planes base y ajustes que se puedan rastrear
- acceso controlado para scripts y agentes de IA

No encaja bien si la conexión bancaria automática es el requisito principal, si quieres que la migración sea una única carga sin supervisión o si no quieres encargarte de operar un servicio autoalojado y hacer sus copias de seguridad.

El autoalojamiento tampoco hace que todas las herramientas conectadas sean privadas por arte de magia. Si proporcionas un extracto a un cliente de IA externo o le autorizas a leer datos financieros, ese cliente y su proveedor de modelos pasan a formar parte del recorrido de los datos. Revisa sus políticas y concede el mínimo acceso necesario para la tarea.

Si aún estás comparando modelos en lugar de productos, [Aplicación de presupuesto sin conexión bancaria](/blog/budget-app-without-bank-linking/) explica las ventajas y desventajas de una importación controlada. Los desarrolladores también pueden consultar la [guía general del gestor de presupuesto de código abierto y autoalojado](/blog/self-hosted-open-source-budget-tracker-for-developers/). Si tu sistema anterior se parecía más a un programa de contabilidad de escritorio, la [guía de alternativas a Quicken](/blog/quicken-alternative/) utiliza la misma prueba de migración con una sola cuenta.

## Preguntas frecuentes

### ¿Expense Budget Tracker es un sustituto directo de Mint?

No. Incluye cuentas, asientos del libro mayor, presupuestos, transferencias, informes multidivisa, una aplicación alojada y autoalojamiento. No reproduce la agregación bancaria pasiva de Mint ni ofrece una conexión en tiempo real con Mint.

### ¿Puede importar una exportación de Mint?

No existe un importador de Mint con un solo clic. Si conservas una exportación, un script o un agente conectado puede mapear sus filas en el libro mayor. Revisa un lote pequeño y concílialo antes de ampliar la importación. Si no conservas ninguna exportación, utiliza extractos bancarios y de tarjetas para el historial que puedas verificar de forma independiente.

### ¿Puedo ejecutarlo solo en mi propio equipo?

Sí. La [configuración de autoalojamiento con Docker Compose](/docs/self-hosting/) ejecuta la aplicación principal con Postgres en local. A partir de ahí, eres responsable de las copias de seguridad, las actualizaciones, el control de acceso y la recuperación.

### ¿Debería migrar todo el historial?

Solo si el historial está completo y sigue siendo útil. Una transición limpia con saldos iniciales documentados puede ser más segura que importar años de datos parciales. Elige conscientemente el punto de corte y conserva sin cambios el archivo de la fuente antigua.

### ¿Cuál es la primera prueba más segura?

Utiliza una cuenta, un periodo de extracto ya cerrado y un único archivo de origen principal. Si el periodo contiene una transferencia interna, incluye también el extracto de la otra cuenta o elige una cuenta sin ese tipo de transferencias. Importa un pequeño lote revisado y verifica con exactitud el saldo final de cada cuenta afectada. Si funciona, amplía el proceso poco a poco.

## Controla la migración, no solo el servidor

Una **alternativa local a Mint.com** solo es útil si el libro mayor sigue siendo fiable después de la migración. Ejecutar Postgres en tu propio servidor resuelve quién controla los datos. No resuelve las filas duplicadas, los pares de transferencias rotos, los saldos iniciales ausentes ni el riesgo de que un agente escriba en el espacio de trabajo equivocado.

Estos problemas se pueden gestionar cuando la migración tiene límites claros: conserva la fuente, mapea el modelo, importa una cuenta, concilia en su propia moneda y detente cada vez que las cifras no coincidan.

Si ese flujo de trabajo encaja con lo que buscas en una **alternativa a Mint en 2026**, [abre la aplicación alojada](https://app.expense-budget-tracker.com/) para hacer una prueba gestionada o sigue la [guía de autoalojamiento](/docs/self-hosting/) para ejecutar el sistema por tu cuenta. Puedes inspeccionar el [código fuente](https://github.com/kirill-markin/expense-budget-tracker) antes de confiarle cualquier dato.
