---
title: "Cómo registrar reembolsos en tu presupuesto (sin ingresos ficticios)"
description: "Registra reembolsos de tarjetas de crédito, devoluciones parciales y abonos contabilizados en otro mes en su fecha real, sin inflar los ingresos ni romper la conciliación."
date: "2026-05-21"
updated: "2026-09-06"
image: "/blog/how-to-track-refunds-in-your-budget-v2.png"
keywords:
  - "cómo registrar reembolsos en tu presupuesto"
  - "reembolso de tarjeta de crédito en el presupuesto"
  - "reembolso en otro mes"
  - "reembolso parcial en el presupuesto"
  - "compra devuelta"
  - "reembolso vs reintegro"
  - "reembolso pendiente"
---

Una chaqueta de $120 comprada el 28 de junio y reembolsada el 3 de julio plantea una pequeña trampa presupuestaria. Si registras el abono de julio como ingreso, inflas tanto los ingresos como el gasto en ropa. Si lo pasas a junio, el libro mayor deja de coincidir con el extracto de la tarjeta.

La solución es conservar los dos movimientos reales. Registra la compra en su fecha de contabilización y, después, el reembolso del comercio como una reversión separada del gasto, en la fecha y la cuenta donde el abono se contabilizó de verdad. Usa la misma categoría. Así mantienes el historial de la cuenta y reflejas cuánto terminó costándote la compra devuelta.

![Una bibliotecaria devuelve un libro rojo óxido a su lugar exacto en una estantería de madera](/blog/how-to-track-refunds-in-your-budget-v2.png)

## La regla rápida para decidir

Antes de fijarte en el signo positivo, pregúntate qué representa el importe recibido.

| ¿Qué ocurrió? | Tratamiento en el presupuesto |
| --- | --- |
| Un comercio reembolsó una parte o la totalidad de una compra | Revierte el gasto en la categoría original |
| Tu empleador, un amigo o una aseguradora te devolvió dinero que habías adelantado | Sigue un método de reintegro, normalmente compensando una categoría de gastos reembolsables o tu parte del coste original |
| El emisor de una tarjeta abonó una devolución general de efectivo (cash back) o una recompensa | Sigue una política separada para las recompensas; no vincules ese abono a una compra salvo que esté ligado específicamente a ella |
| El dinero se movió entre dos cuentas que registras | Registra una transferencia, no un reembolso ni un gasto |
| Una tienda emitió crédito o una tarjeta de regalo por devolución que solo se puede usar allí | Registra ese saldo restringido por separado si necesitas que tanto las categorías como las cuentas sean precisas |
| Un reembolso del comercio está pendiente, o hay una disputa abierta pero todavía no se ha contabilizado ningún abono | Déjalo fuera del libro mayor hasta conocer el movimiento real de la cuenta |

El banco puede etiquetar varios de estos movimientos como «abono». Eso solo describe la dirección del dinero; no indica si se trata de un reembolso, un reintegro, una recompensa o una transferencia.

## Cómo registra Expense Budget Tracker un reembolso real

Expense Budget Tracker almacena cada asiento del libro mayor con un `amount` con signo y uno de tres valores de `kind`: `income`, `spend` o `transfer`.

Para el reembolso de una compra, los signos funcionan así:

- una compra normal es `kind='spend'` con un importe negativo
- un reembolso del comercio que la revierte es una nueva fila `kind='spend'` con un importe positivo
- ambos usan la misma categoría de gasto
- el reembolso se registra en la cuenta donde se recibió, con esa moneda y esa marca de tiempo

Este es el ejemplo exacto de $120:

| Marca de tiempo de contabilización | Cuenta | `amount` | `currency` | `kind` | `category` | Valor real en la cuadrícula del presupuesto |
| --- | --- | ---: | --- | --- | --- | ---: |
| `2026-06-28T14:30:00-04:00` | Everyday Card | `-120.00` | `USD` | `spend` | `Clothing` | `+120.00` |
| `2026-07-03T09:12:00-04:00` | Everyday Card | `+120.00` | `USD` | `spend` | `Clothing` | `-120.00` |

La cuadrícula del presupuesto invierte el signo de los importes cuyo `kind` es `spend`. Así, la compra se convierte en `-(-120) = +120` de gasto en ropa y el reembolso en `-(+120) = -120` de gasto en ropa. En conjunto, el resultado neto es cero.

El importe positivo del reembolso cumple dos funciones sin fingir que ganaste dinero: ajusta a tu favor el saldo real de la tarjeta y reduce el gasto real en la categoría Clothing. Borrar la compra eliminaría el historial. Registrar el reembolso como `income` dejaría sobrestimado el gasto en Clothing.

Esta regla de signos es específica del libro de Expense Budget Tracker. Si usas otra aplicación o una hoja de cálculo, confirma su convención antes de copiar el ejemplo.

## Un reembolso a una tarjeta de crédito no es un pago de la tarjeta

Para registrar bien un reembolso de tarjeta de crédito, hay que separar la compra, el reembolso y el pago:

1. La compra con tarjeta es un gasto en la categoría donde compraste el artículo.
2. Un reembolso pendiente todavía no es un movimiento liquidado del libro mayor.
3. El abono contabilizado del comercio es una entrada positiva de `spend` en la tarjeta, en la misma categoría que la compra.
4. Un pago posterior entre una cuenta corriente y una cuenta de tarjeta registradas sigue siendo una `transfer`.

El pago de la tarjeta no revierte la categoría. Liquida la deuda generada por todas las compras de esa tarjeta. Cuando registras ambas cuentas, el pago tiene un apunte negativo de transferencia en la cuenta corriente y otro positivo en la tarjeta. Contarlo como gasto cargaría dos veces el presupuesto.

Si el reembolso crea un saldo acreedor en la tarjeta, mantén ese saldo visible. No inventes efectivo en la cuenta corriente. Si el emisor envía más tarde el abono a una cuenta corriente registrada, ese movimiento posterior es una transferencia entre las dos cuentas registradas.

El flujo completo de las tarjetas se explica en [Cómo hacer un presupuesto con tarjetas de crédito](/blog/how-to-budget-with-credit-cards/), y la diferencia entre transferencias y gastos se explica en [¿Las transferencias bancarias cuentan como gastos?](/blog/do-bank-transfers-count-as-expenses/).

## Cuando el reembolso se contabiliza en otro mes

Un reembolso en otro mes debe conservar su fecha real de contabilización.

En el ejemplo anterior, junio muestra `+120` en Clothing y julio muestra `-120`. El resultado neto de los dos meses es cero. Ese gasto real negativo de julio no es un ingreso ni significa que haya aparecido efectivo en la cuenta corriente. Es la reversión de la categoría que se contabilizó en julio.

Antedatar el abono del 3 de julio al 28 de junio hace que junio parezca ordenado a costa de la conciliación. El extracto de la tarjeta de junio incluiría un reembolso que todavía no había ocurrido, mientras que el de julio contendría un abono ausente del libro.

Si quieres aportar contexto en una revisión mensual, añade una nota que vincule el reembolso con la compra original. Mantén fiel a los hechos la marca de tiempo. Puedes leer los informes teniendo en cuenta ambos meses; no puedes conciliar los extractos con una versión editada del historial.

## Un reembolso pendiente va en una lista de seguimiento, no en el libro mayor

Los comercios suelen aprobar una devolución antes de que el emisor de la tarjeta de crédito contabilice el abono. El importe o la fecha todavía pueden cambiar, así que no reduzcas antes de tiempo ni el gasto ni el saldo de la tarjeta.

Guarda el recibo, la confirmación de devolución, la referencia del comercio, el importe previsto y la fecha estimada de llegada fuera del libro mayor. Cuando se liquide el abono, registra el importe y la marca de tiempo exactos de la contabilización. Si nunca llega, aún tendrás los justificantes necesarios para reclamarlo.

En el caso de las tarjetas de crédito de Estados Unidos, un abono que no aparece puede convertirse en una cuestión de error de facturación, no en una decisión presupuestaria. La [Oficina para la Protección Financiera del Consumidor](https://www.consumerfinance.gov/ask-cfpb/how-can-i-get-a-refund-on-a-product-or-service-i-purchased-with-my-credit-card-en-1969/) indica que primero debes contactar con el vendedor y enviar al emisor un aviso de error de facturación dentro de los 60 días posteriores a la aparición del cargo en el extracto. La [Comisión Federal de Comercio](https://consumer.ftc.gov/articles/using-credit-cards-and-disputing-charges) incluye entre esos errores las devoluciones u otros abonos que el emisor no contabilizó; sus indicaciones para presentar una disputa por escrito señalan que la carta debe llegar al emisor dentro de los 60 días siguientes al envío de la primera factura que contenga el error. Como esos plazos parten de hechos distintos, actúa cuanto antes y sigue las instrucciones para consultas de facturación que aparecen en tu extracto. Esta es información general para consumidores de Estados Unidos, no asesoramiento jurídico, y no cambia cómo debe categorizarse el asiento que finalmente se registre en el libro mayor.

## Los reembolsos parciales y divididos deben sumar el abono contabilizado

Al registrar un reembolso parcial, refleja solo el importe que realmente recuperaste.

Supón que devuelves un artículo de $120, pero el comercio abona $100 porque $20 no eran reembolsables. Registra `+100` como `spend` en la categoría original. La categoría conserva un coste neto de $20, que es lo que la devolución terminó costándote. No introduzcas una reversión de $120 solo porque esa era la cantidad que esperabas recuperar.

Para un pedido dividido entre categorías, guíate por los justificantes de cada artículo, no por el nombre del comercio. Imagina un pedido de $150 registrado como $90 en Clothing y $60 en Household. Si el comercio contabiliza un único reembolso de $75 que cubre una camisa de $45 y un artículo del hogar de $30, las filas propuestas para el reembolso pueden ser:

| Cuenta | `amount` | `currency` | `kind` | `category` |
| --- | ---: | --- | --- | --- |
| Everyday Card | `+45.00` | `USD` | `spend` | `Clothing` |
| Everyday Card | `+30.00` | `USD` | `spend` | `Household` |

Las dos filas deben usar la hora real de contabilización y sumar exactamente `+75.00 USD`, igual que el abono de la tarjeta. Conserva una referencia de origen junto con el desglose para que quien lo revise más adelante pueda comprobar por qué cada importe pertenece a su categoría.

Si el extracto muestra por separado una comisión de reposición, de envío de la devolución o por una operación en moneda extranjera, registra esa comisión contabilizada como una fila negativa de gasto independiente en la categoría que uses para esas comisiones. No inventes una comisión cuando el comercio simplemente haya emitido un reembolso menor.

## El crédito en tienda y las tarjetas de regalo por devolución necesitan una cuenta propia

El crédito en tienda, incluida una tarjeta de regalo emitida por una devolución, no llega a la cuenta corriente ni a la tarjeta de crédito. Registrarlo en cualquiera de esas cuentas rompería de inmediato la conciliación.

Si el saldo es relevante y quieres que las categorías reflejen la realidad, registra el crédito del comercio o la tarjeta de regalo por devolución en una cuenta separada de crédito en tienda. La devolución se convierte en una fila positiva de `spend` en esa cuenta y en la categoría original. Una compra posterior pagada con el crédito se convierte en una fila negativa de `spend` en la cuenta de crédito en tienda y en la categoría del nuevo artículo.

Si decides no registrar el saldo restringido como una cuenta, acepta que quedará fuera del libro mayor hasta que adoptes un método manual coherente. No existe un asiento que pueda reducir a la vez la categoría original, aumentar un saldo bancario que no se movió y seguir siendo conciliable. Nunca coloques el crédito en tienda en la cuenta de la tarjeta solo para que la categoría parezca correcta.

## Los reembolsos multidivisa conservan el importe y la fecha de recepción

Registra la moneda y el importe que realmente muestra la cuenta receptora. Si una tarjeta denominada en euros muestra una compra de €90 y un reembolso posterior de €90, conserva ambas entradas en euros aunque la moneda de tus informes sea el dólar. Si el extracto de una tarjeta estadounidense muestra, en cambio, importes convertidos a USD, registra esos movimientos contabilizados en USD en vez de reconstruir entradas en euros a partir del recibo.

Expense Budget Tracker almacena las transacciones en sus monedas originales y las convierte para los informes en el momento de la consulta mediante tipos de cambio diarios. Como la compra y el reembolso pueden tener fechas distintas, es posible que dos importes iguales en euros no se compensen exactamente en un informe en dólares. Esa diferencia se debe al tipo de cambio; no demuestra que debas antedatar la fila del reembolso ni reescribirla en dólares.

Si el emisor abona un importe diferente o contabiliza una comisión de conversión por separado, conserva esos movimientos reales. No reconstruyas de memoria el tipo de cambio del día de la compra. [Presupuestos multidivisa para expatriados](/blog/multi-currency-budgeting-for-expats/) explica con más detalle la capa de informes.

## Reembolsos, reintegros, cash back, bonificaciones y contracargos

Estos abonos exigen justificantes y reglas distintas.

### Reintegro

Un reembolso del comercio cancela una compra. Un reintegro te devuelve el dinero porque adelantaste un gasto por cuenta de tu empleador, una aseguradora, un amigo o un miembro del hogar.

Si registraste el desembolso adelantado en una categoría `Reimbursable`, registra el reintegro recibido como `spend` positivo en esa categoría. Si decidiste registrar una compra compartida en su categoría habitual, compensa allí solo la parte que te devolvieron. Ambos métodos pueden funcionar; sé coherente y no registres el pago como salario. Consulta [Cómo registrar gastos reembolsables](/blog/how-to-track-reimbursable-expenses/) para ver el flujo más detallado.

### Cash back, bonificaciones y recompensas de tarjetas

Un cash back general no demuestra que se haya devuelto una compra concreta. Si una bonificación o recompensa del comercio está vinculada explícitamente a una compra, puedes reducir la categoría de esa compra cuando se contabilice el abono. De lo contrario, elige una política estable para el hogar —como una categoría específica para recompensas o tratarlas como ingresos— y aplícala de forma coherente. No asignes sin más un abono general del extracto al gasto cercano de mayor importe.

### Reembolso del comercio frente a contracargo o abono provisional

Un reembolso del comercio procede del vendedor después de una devolución, cancelación o ajuste. Un contracargo se tramita a través del proceso de disputa del emisor de la tarjeta. Abrir una disputa no borra la compra original ni constituye por sí mismo un asiento del libro mayor.

Si el emisor contabiliza un abono provisional, registra el movimiento positivo de la cuenta en su fecha real, usa la categoría de la compra disputada y anota que es provisional. Si el emisor retira más tarde el abono, registra ese nuevo movimiento negativo en la misma categoría. Conserva todos los avisos del emisor: el resultado de una disputa es una prueba, no un motivo para reescribir filas anteriores.

## Evita reembolsos duplicados al revisar extractos

Expense Budget Tracker no vincula cuentas bancarias de forma pasiva, no ofrece una herramienta nativa para cargar o importar extractos, no relaciona automáticamente los reembolsos con las compras ni categoriza automáticamente las filas de los extractos.

Sí ofrece entrada manual en la web, un chat web con IA, la cuadrícula del presupuesto, paneles, saldos, espacios de trabajo compartidos, informes multidivisa, un conector MCP alojado y una Agent API. Un agente de IA puede procesar un archivo que le proporciones expresamente y preparar cambios en el libro mayor, pero ese es un flujo dirigido por el usuario, no una sincronización pasiva ni un importador nativo. Mantén bajo tu control cualquier escritura de datos:

1. Conserva los archivos CSV y PDF originales, el recibo y la confirmación de devolución.
2. Pide al agente que inspeccione el esquema en uso, el espacio de trabajo exacto, la cuenta receptora, la moneda, la compra original y las entradas existentes en torno a ambas fechas de contabilización.
3. Conserva una referencia de origen, la descripción original, la marca de tiempo de contabilización, el importe original con signo y la referencia del comercio para cada fila propuesta.
4. Trata como posibles duplicados las coincidencias de cuenta, moneda e importe con fechas cercanas, no como una prueba automática. Dos devoluciones legítimas pueden parecer idénticas.
5. Previsualiza las filas propuestas y la operación de escritura exacta antes de aprobarlas. Para un reembolso dividido, confirma que las partes sumen el único abono contabilizado.
6. Escribe solo las filas aprobadas, vuelve a consultarlas y concilia la cuenta receptora con el saldo contabilizado que figure en un extracto o con otro punto de control fiable.

Si la compra o el reembolso ya están presentes, vincula la fila de origen con la entrada existente en lugar de insertar otra copia. No elimines la compra original cuando llegue un reembolso.

La [guía para importar extractos bancarios](/blog/how-to-import-bank-statements-into-an-expense-tracker/) ofrece una tabla de revisión completa y un flujo de aprobación. Los agentes directos deben empezar por la [guía de configuración de agentes](/docs/agent-setup/) e inspeccionar el esquema en uso antes de generar SQL. Los clientes MCP deben seguir la [guía del conector MCP](/docs/mcp-connector/) y solicitar acceso de escritura solo cuando haya un cambio aprobado listo para aplicarse.

## Concilia la cuenta y la categoría

Después de registrar el reembolso, comprueba ambos niveles:

- ¿Coincide el saldo de la cuenta receptora con los movimientos contabilizados de la tarjeta o la cuenta bancaria?
- ¿Usa el reembolso la misma categoría que la compra devuelta, o la división documentada para una devolución parcial?
- ¿Coinciden el importe y la moneda con el abono real?
- ¿Dejaste un elemento pendiente, un duplicado, un pago de tarjeta o un crédito de tienda en el lugar equivocado?
- ¿Puede otro miembro del hogar rastrear el asiento hasta los justificantes de origen?

Una cuenta puede conciliar aunque la categoría sea incorrecta, por ejemplo, cuando un reembolso se etiqueta como ingreso. Una categoría puede cuadrar aunque la cuenta sea incorrecta, por ejemplo, cuando un crédito en tienda se asigna a una tarjeta de crédito. Termina solo cuando ambas cuentan la misma historia. [Cómo conciliar tu presupuesto con tu saldo bancario](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) explica la comprobación cuenta por cuenta.

Así se registran los reembolsos en tu presupuesto sin crear ingresos ficticios: conserva la compra, espera al abono real, introduce una fila positiva de `spend` en la categoría original y concíliala en la cuenta a la que llegó el dinero.

Puedes hacerlo manualmente en [Expense Budget Tracker](/) o usar un agente para preparar una vista previa respaldada por los justificantes antes de aprobarla. El [resumen de funciones](/features/) muestra las herramientas disponibles para presupuestos, saldos, espacios de trabajo compartidos, varias divisas y agentes.
