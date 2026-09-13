---
title: "Cómo hacer un presupuesto con tarjetas de crédito sin contar dos veces el mismo gasto"
description: "Registra compras con tarjeta, reembolsos, saldos de extractos y pagos en un único libro mayor preciso, sin volver a contar el pago como gasto."
date: "2026-04-15"
updated: "2026-09-13"
image: "/blog/credit-card-payment-transfer-ledger.png"
keywords:
  - "cómo hacer un presupuesto con tarjetas de crédito"
  - "usar tarjetas de crédito en el presupuesto"
  - "presupuesto con tarjetas de crédito"
  - "evitar contar dos veces los pagos de tarjetas de crédito"
  - "presupuestar el saldo del extracto"
  - "planificar el pago de la tarjeta de crédito"
---

El extracto de una tarjeta cierra con un saldo de $230. Después, una nueva compra lleva el saldo actual a $262 y sale un pago automático de $230 de la cuenta corriente. Si el presupuesto vuelve a registrar ese pago como gasto, mostrará $492 gastados entre septiembre y octubre, aunque las compras netas sumaron solo $262.

En el banco no ha ocurrido nada complicado. El presupuesto se ha limitado a contar dos etapas del mismo dinero.

Para usar tarjetas de crédito en un presupuesto sin duplicar gastos, hay que separar tres funciones:

- Las compras y los reembolsos explican el gasto de cada categoría.
- El extracto indica qué importe hay que pagar por un ciclo de facturación ya cerrado.
- El pago mueve dinero de la cuenta corriente a la tarjeta y reduce la deuda.

Esta guía desarrolla el método fila por fila: el cierre del extracto, los movimientos posteriores al cierre, un reembolso, una compra dividida y, por último, el pago automático.

![Un artesano mueve las mismas fichas de cerámica entre dos bandejas contables conectadas](/blog/credit-card-payment-transfer-ledger.png)

## Registra las dos partes del pago de la tarjeta

Empieza por incluir tanto la cuenta corriente como la tarjeta de crédito en el mismo seguimiento presupuestario. Así, una compra con tarjeta genera un gasto y aumenta una deuda registrada. Al pagar la tarjeta cambian dos saldos registrados, pero no aparece una segunda compra.

Si la tarjeta queda fuera del sistema, una salida de la cuenta corriente no basta para conservar el detalle de supermercado, transporte y hogar. Puedes introducir a mano las compras hechas con la tarjeta, pero necesitas un criterio coherente sobre qué cuentas controla el presupuesto antes de clasificar el pago posterior. La regla general se explica en [¿Las transferencias bancarias cuentan como gastos?](/blog/do-bank-transfers-count-as-expenses/).

Expense Budget Tracker aplica esta convención exacta en el libro mayor:

- Cada fila guarda un importe con signo en una cuenta. Un evento dividido usa varias filas que, sumadas, coinciden exactamente con el movimiento contabilizado en esa cuenta.
- `amount` es negativo cuando el valor sale de una cuenta y positivo cuando entra.
- Una compra con tarjeta es `kind='spend'`: lleva un importe negativo en la tarjeta y su categoría de gasto real.
- El reembolso de un comercio es otra fila `spend`, con un importe positivo en la tarjeta y la categoría original.
- Un pago entre una cuenta corriente y una tarjeta incluidas en el seguimiento usa dos filas `transfer` con el mismo `event_id`; las dos categorías son `NULL`.
- La cuadrícula del presupuesto calcula el gasto real por categoría a partir de las filas `spend`, no de las filas `transfer`.

Esta convención de signos es específica de Expense Budget Tracker. Antes de copiar los números a otra aplicación u hoja de cálculo, comprueba cómo representa los pasivos y los reembolsos.

## Un ejemplo desde el cierre del extracto hasta el pago automático

Supongamos que, antes de la primera transacción de la tabla, los saldos registrados son $2,400 en la cuenta corriente y $0 en la tarjeta. El ciclo de facturación cierra el 12 de septiembre y el pago automático del saldo del extracto vence el 7 de octubre. La fecha de cierre cae entre el reembolso del 11 de septiembre y la cena del 13 de septiembre, pero no genera una fila en el libro mayor.

| Fecha de contabilización | Evento | Cuenta | `amount` | `kind` | `category` | `event_id` |
| --- | --- | --- | ---: | --- | --- | --- |
| 2026-09-02 | Compra de supermercado | Everyday Card | `-84.00` | `spend` | `Groceries` | `purchase-0902` |
| 2026-09-04 | Compra en tienda, parte para el hogar | Everyday Card | `-90.00` | `spend` | `Household` | `purchase-0904` |
| 2026-09-04 | Compra en tienda, parte de cuidado personal | Everyday Card | `-30.00` | `spend` | `Personal care` | `purchase-0904` |
| 2026-09-10 | Abono de transporte | Everyday Card | `-46.00` | `spend` | `Transport` | `purchase-0910` |
| 2026-09-11 | Reembolso parcial del comercio | Everyday Card | `+20.00` | `spend` | `Household` | `refund-0911` |
| 2026-09-13 | Cena después del cierre | Everyday Card | `-32.00` | `spend` | `Dining out` | `purchase-0913` |
| 2026-10-07 | El pago automático del extracto sale de la cuenta corriente | Checking | `-230.00` | `transfer` | `NULL` | `card-payment-1007` |
| 2026-10-07 | El pago automático del extracto reduce la deuda de la tarjeta | Everyday Card | `+230.00` | `transfer` | `NULL` | `card-payment-1007` |

La compra del 4 de septiembre es un único cargo de $120 del comercio, repartido entre dos categorías útiles. Las dos filas negativas comparten un `event_id` y suman el total contabilizado: `-$90 + -$30 = -$120`. Dividir una compra nunca debe cambiar el saldo adeudado en la tarjeta.

El reembolso del 11 de septiembre resta $20 al gasto de la categoría `Household` el día en que se contabiliza el abono. No es un ingreso ni borra la compra original. Para abonos parciales, tardíos o contabilizados en otro mes, sigue el [flujo completo para registrar reembolsos](/blog/how-to-track-refunds-in-your-budget/).

### El cierre del extracto no genera ninguna fila

Hasta el 12 de septiembre, los movimientos de la tarjeta son:

```text
-$84 - $90 - $30 - $46 + $20 = -$230
```

El emisor muestra esa deuda como un saldo de extracto de $230. El cierre no mueve dinero, así que no genera ninguna fila de ingreso, gasto o transferencia. Solo sirve como punto de conciliación: en este ejemplo, los movimientos de la tarjeta contabilizados hasta el cierre suman `-$230` y coinciden exactamente en valor con el saldo del extracto.

La cena de $32 se contabiliza después del cierre. Cuenta como gasto real de septiembre en `Dining out` y aumenta la deuda actual de la tarjeta, pero no forma parte del saldo de $230 que vence el 7 de octubre.

Por tanto, justo antes del pago automático, los saldos registrados son:

| Cuenta | Saldo |
| --- | ---: |
| Checking | `$2,400` |
| Everyday Card | `-$262` |
| Saldo neto total | `$2,138` |

### El pago automático cambia los saldos, no el total neto

El 7 de octubre, el pago crea dos movimientos:

```text
Checking:      $2,400 - $230 = $2,170
Everyday Card:  -$262 + $230 =   -$32
Combined:      $2,170 - $32  = $2,138
```

El saldo neto total es de $2,138 antes y después del pago. El efectivo baja $230 y la deuda se reduce en esos mismos $230. Es una transferencia interna.

El saldo restante de `-$32` en la tarjeta corresponde a la cena del nuevo ciclo. Pagar el extracto anterior no hace desaparecer esa compra ni adelanta su vencimiento un ciclo.

### El presupuesto solo cuenta el gasto una vez

Expense Budget Tracker invierte el signo de los importes de las filas `spend` al calcular el gasto real. Estos son los resultados por categoría de septiembre:

| Categoría | Cálculo | Gasto real de septiembre |
| --- | --- | ---: |
| Groceries | `-(-84)` | `$84` |
| Household | `-(-90 + 20)` | `$70` |
| Personal care | `-(-30)` | `$30` |
| Transport | `-(-46)` | `$46` |
| Dining out | `-(-32)` | `$32` |
| **Total** | `84 + 70 + 30 + 46 + 32` | **`$262`** |

Las dos filas `transfer` de octubre aportan $0 al gasto real por categoría. Septiembre muestra $262 de gasto neto y octubre no añade un gasto ficticio de $230 llamado «pago de tarjeta de crédito». Así se evita contar dos veces los pagos de la tarjeta.

## Presupuestar el saldo del extracto exige tener efectivo en la cuenta corriente

Clasificar el pago como transferencia no elimina su efecto sobre el flujo de caja. El pago automático sigue necesitando $230 en la cuenta pagadora cuando llegue la fecha. Para planificar el pago de la tarjeta, reserva ese dinero antes del vencimiento sin asignar una categoría de gasto a la transferencia.

En cada cierre de extracto, reserva su saldo en la cuenta corriente y proyecta esa cuenta hasta la fecha de vencimiento:

```text
saldo contabilizado de la cuenta corriente
- salidas de la cuenta corriente que vencen antes del pago automático
- saldo del extracto programado para el pago automático
- colchón de seguridad elegido para la cuenta corriente
= efectivo que queda disponible para decidir su uso
```

En este ejemplo simplificado, la reserva para la fecha de vencimiento es de $230. Quedan $2,170 antes de restar el colchón de seguridad u otros compromisos de la cuenta corriente. La cena de $32 posterior al cierre necesita una reserva aparte para el siguiente pago de la tarjeta, aunque no aparezca en el extracto actual. Cuando ambas obligaciones están cubiertas con efectivo, quedan $2,138 antes de esos otros compromisos:

```text
$2,400 en la cuenta corriente
- $230 de reserva para el extracto actual
-  $32 de reserva para el próximo ciclo
= $2,138 antes de otros compromisos de la cuenta corriente y del colchón de seguridad
```

Estas reservas son etiquetas para planificar, no nuevos asientos en el libro mayor. Una proyección real también debe incluir el alquiler, los suministros, las suscripciones y cualquier otra salida de la cuenta corriente que venza antes del 7 de octubre.

Ahí está la conexión práctica entre el presupuesto por categorías y los saldos de las cuentas: la categoría explica qué compraste; la previsión de efectivo indica si la cuenta corriente podrá pagarlo cuando corresponda.

Usa el pago automático para ejecutar el pago, no como prueba de que el dinero está disponible. Comprueba la cuenta de pago elegida, la regla de pago, la fecha de vencimiento, el saldo del extracto y el saldo previsto de la cuenta corriente después del pago. Si el emisor cambia el importe adeudado tras una devolución o un ajuste, consulta el extracto vigente y el contrato de la tarjeta en lugar de suponer cómo aplicará el abono.

## Concilia los movimientos contabilizados y separa los pendientes

Las autorizaciones pendientes sirven como aviso, pero no como referencia fiable para conciliar. El importe de un restaurante puede cambiar cuando se contabiliza la propina. La retención de un hotel o una gasolinera puede desaparecer o liquidarse por otro importe. Un reembolso pendiente puede retrasarse.

Sigue esta rutina:

1. Lleva los movimientos pendientes en una breve lista de seguimiento o en la previsión de efectivo.
2. Añade cada transacción al libro mayor conciliado cuando se contabilice, con la cuenta, el importe con signo, la moneda, la categoría y la fecha y hora reales de contabilización.
3. Si ya habías introducido una copia provisional, localízala y corrige esa fila en vez de añadir un duplicado.
4. Al cierre del extracto, comprueba qué ocurrió con cada movimiento contabilizado que figure en la fuente: se vinculó a una fila existente, se añadió una sola vez o se excluyó de forma explícita con un motivo.
5. Cuando se contabilice el pago, concilia por separado la cuenta corriente y la tarjeta. Que una cuenta cuadre puede ocultar que falta uno de los dos movimientos de la transferencia en la otra.

No añadas una fila de ajuste solo para hacer cuadrar el saldo. Busca la compra, el duplicado, el reembolso, la comisión o la transferencia que falta. [Cómo conciliar tu presupuesto con tu saldo bancario](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) explica el proceso cuenta por cuenta.

Si el documento de origen es un CSV, un PDF o una captura de pantalla, Expense Budget Tracker no dispone de un importador nativo de archivos. La [guía para importar extractos](/blog/how-to-import-bank-statements-into-an-expense-tracker/) describe un flujo dirigido por el usuario y asistido por un agente, con una tabla de revisión, comprobaciones de duplicados, una vista previa exacta de los datos que se van a guardar, aprobación, nueva consulta de las filas y conciliación.

## Registra aparte los movimientos que sí son costes reales

El pago de la tarjeta es una transferencia, pero algunos movimientos de la tarjeta sí representan gasto real.

### Intereses y comisiones

Cuando se contabilicen en la tarjeta intereses, una cuota anual, una comisión por demora u otro cargo explícito, regístralos como una fila `spend` negativa en una categoría clara como `Interest` o `Bank fees`. El cargo aumenta la deuda de la tarjeta y el gasto real del presupuesto. El pago posterior sigue siendo una transferencia porque el coste ya quedó registrado cuando lo cobró el emisor.

No escondas los intereses ni una comisión desglosada dentro del importe del pago. Para conciliar, el cargo del extracto y el pago deben seguir visibles como eventos distintos.

### Reembolsos posteriores al cierre del extracto

El reembolso de un comercio ya contabilizado sigue siendo una fila `spend` positiva en la categoría original, aunque llegue en el ciclo siguiente. Reduce la deuda actual de la tarjeta y el gasto real de esa categoría en su fecha verdadera de contabilización.

No modifiques retroactivamente un extracto ya cerrado. Tampoco supongas que el reembolso reducirá en la misma cantidad el pago automático programado: comprueba el importe que el emisor muestra como pendiente y las reglas que aplica. El libro mayor refleja lo que se contabilizó; el extracto determina cuánto te pide pagar el emisor.

### Compras divididas entre categorías

Divide una compra solo cuando el desglose ayude a tomar una decisión presupuestaria. Usa varias filas `spend` con el mismo `event_id`, asigna cada una a su categoría real y asegúrate de que los importes con signo sumen exactamente el único cargo contabilizado en la tarjeta. Conserva el recibo u otro comprobante original que justifique el reparto.

En un cargo de $120, `-$90` más `-$30` completa el movimiento. Si registraras también el `-$120` original, duplicarías el movimiento de la cuenta y exagerarías el gasto.

## Sobre el pago total y los periodos de gracia

El método contable de esta guía sirve en cualquier país. Las reglas de las tarjetas cambian según el lugar y el contrato.

Para las tarjetas de EE. UU., la Oficina para la Protección Financiera del Consumidor (CFPB) indica que los emisores no están obligados a ofrecer un periodo de gracia, aunque la mayoría de las tarjetas sí lo ofrece para las compras. Si tu tarjeta tiene ese periodo y no arrastras saldo, pagar el saldo completo del extracto antes de la fecha de vencimiento puede evitar intereses sobre las compras nuevas. Si pierdes el periodo de gracia, pueden aplicarse intereses tanto al saldo impagado como a las compras nuevas desde la fecha de cada compra. Los periodos de gracia suelen aplicarse a las compras, no a los anticipos de efectivo ni a operaciones similares. Consulta la [explicación de la CFPB sobre el periodo de gracia](https://www.consumerfinance.gov/ask-cfpb/what-is-a-grace-period-for-a-credit-card-en-47/) y sigue lo que indiquen tu extracto y el contrato de la tarjeta.

El momento del pago también depende de las reglas del emisor. Según la CFPB, por lo general un pago de tarjeta en EE. UU. debe recibirse —no basta con enviarlo— antes de la fecha de vencimiento. Su [guía sobre pagos atrasados](https://www.consumerfinance.gov/ask-cfpb/when-is-my-credit-card-payment-considered-to-be-late-en-79/) explica el límite habitual de las 17:00 en la zona horaria indicada en el extracto, además de las horas límite para pagos por internet, pagos en persona, domingos y festivos. Programa el pago con margen suficiente para que llegue conforme a las reglas de tu cuenta.

Si ya se están acumulando intereses, el momento del pago afecta a algo más que las comisiones por demora. La CFPB explica que muchas compañías de tarjetas estadounidenses calculan los intereses a diario a partir del saldo diario medio. Por eso, cuando no hay periodo de gracia, adelantar el pago de una parte o de todo el saldo puede reducir los intereses. También pueden aplicarse tipos distintos a las compras, los anticipos de efectivo y otras clases de saldo. Consulta su [guía para calcular los intereses](https://www.consumerfinance.gov/ask-cfpb/how-does-my-credit-card-company-calculate-the-amount-of-interest-i-owe-en-51/). Fuera de EE. UU., o si tu contrato establece otras condiciones, aplica las normas locales que rijan tu tarjeta.

## Cuándo deja de bastar este método

Esta guía está pensada para el uso normal de una tarjeta cuando el efectivo disponible puede cubrir el saldo del extracto sin depender de ingresos futuros.

Si necesitas que llegue el próximo salario para cubrir compras que ya hiciste, quizá estés usando el [desfase de caja de la tarjeta de crédito](/blog/how-to-get-off-the-credit-card-float/). Si arrastras saldo, continúa registrando con precisión las compras nuevas, los reembolsos, los intereses y las comisiones, pero añade un plan específico para reducir la deuda. El principal que pagas entre una cuenta corriente y una tarjeta incluidas en el seguimiento sigue siendo una transferencia; la necesidad de reservar efectivo y el gasto por intereses son muy reales.

## Usa Expense Budget Tracker con revisión previa

Las [funciones de Expense Budget Tracker](/features/) permiten aplicar este método mediante el registro manual desde la web, un chat con IA en la web, una cuadrícula de presupuesto mensual, paneles y saldos, espacios de trabajo compartidos, informes en varias monedas, un conector MCP alojado, una API para agentes y la opción de autoalojamiento.

Expense Budget Tracker no sincroniza cuentas bancarias en segundo plano, no permite importar archivos de extractos de forma nativa ni clasifica transacciones automáticamente. El registro asistido por agentes solo se realiza bajo indicación del usuario. Antes de aprobar cada operación, revisa el espacio de trabajo de destino, la cuenta, los importes con signo, las categorías, los posibles duplicados, los pares de transferencias y los cambios concretos propuestos. Después, vuelve a consultar las filas y concilia las dos cuentas.

Para conectar un agente directamente, empieza por la [configuración del agente](/docs/agent-setup/). Si usas un cliente MCP, consulta la [guía del conector MCP](/docs/mcp-connector/).

La regla que no cambia es sencilla: las compras y los reembolsos determinan las categorías, los cierres de extracto crean puntos de control y los pagos entre cuentas registradas mueven saldos. Cuando mantienes separadas esas tres funciones, presupuestar con tarjetas de crédito se convierte en una tarea contable rutinaria, no en una discusión mensual sobre los mismos dólares.
