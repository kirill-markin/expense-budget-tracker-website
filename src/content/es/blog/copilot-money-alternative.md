---
title: "Alternativa a Copilot Money: código abierto y multidivisa"
description: "Compara Copilot Money y Expense Budget Tracker: sincronización bancaria, monedas, acceso compartido y coste. Prueba a migrar unos pocos datos CSV antes de cambiar."
date: "2026-03-19"
updated: "2026-09-20"
image: "/blog/copilot-money-alternative-v2.png"
keywords:
  - "alternativa a Copilot Money"
  - "alternativa de código abierto a Copilot Money"
  - "exportación de Copilot Money"
  - "app de presupuesto multidivisa"
  - "control de presupuesto autoalojado"
---

Una cuenta corriente en USD y una cuenta en EUR necesitan saldos separados, aunque quieras un único informe de gastos del hogar. Copilot Money solo admite USD actualmente, así que este es un motivo concreto para plantearse una **alternativa a Copilot Money**. La solución que documenta para otras monedas consiste en introducir manualmente el importe convertido. Su [guía sobre monedas](https://help.copilot.money/en/articles/10715424-international-currency) explica esta limitación.

Expense Budget Tracker es una alternativa de código abierto que conserva los movimientos en su moneda original y los convierte para los informes. También permite invitar a otras personas a un espacio de trabajo y alojar la aplicación por tu cuenta. A cambio, tendrás que seguir registrando los movimientos: no hay sincronización bancaria automática ni un importador nativo de Copilot Money. Introduces las transacciones en el navegador o revisas la propuesta de importación de un agente externo.

Esta comparación se basa en la documentación publicada de ambos productos, consultada el 20 de septiembre de 2026. No describe una migración que hayamos realizado. Expense Budget Tracker es nuestro producto; lo que te ayudará a decidir es comprobar si su forma de trabajar encaja con tus cuentas.

![Una persona prueba a colocar una caja en una barca mientras otras dos esperan en el muelle](/blog/copilot-money-alternative-v2.png)

## Compara el trabajo que tendrás cada semana

| Necesidad | Copilot Money | Expense Budget Tracker |
|---|---|---|
| Movimientos bancarios | Las conexiones bancarias incorporan los movimientos a la app | Registro manual o importaciones revisadas mediante un agente externo o un script |
| Monedas | USD; sin conversión nativa de divisas | Movimientos en su moneda original, con tipos de cambio diarios disponibles para los informes |
| Finanzas compartidas | Se comparte la misma cuenta; los demás dispositivos con sesión iniciada tienen control total | Invitaciones a un espacio de trabajo compartido |
| Acceso | Disponible en Estados Unidos para iPhone, iPad, Mac y web | Interfaz de navegador, conector MCP y Agent API |
| Facturas recurrentes e inversiones | Seguimiento de suscripciones y funciones de inversión | Planificación del presupuesto y saldos de cuentas; tendrás que mantener al día las facturas previstas |
| Alojamiento | Servicio alojado por el proveedor | Nube gestionada o autoalojamiento a partir del código abierto |
| Coste | $95 al año o $13 al mes | Versión alojada gratuita durante la beta; código gratuito para autoalojamiento, con costes de infraestructura y mantenimiento |

La [web de Copilot Money](https://www.copilot.money/) recoge las plataformas y los precios. Su [guía de inicio rápido](https://help.copilot.money/en/articles/11157550-quick-start-guide) describe la disponibilidad en Estados Unidos, las conexiones bancarias, los presupuestos, las suscripciones y las inversiones. Sí permite compartir el acceso: las [instrucciones para compartir con tu pareja](https://help.copilot.money/en/articles/4523792-sharing-your-account-with-a-partner) explican cómo hacerlo mediante una misma cuenta.

En el caso de Expense Budget Tracker, consulta los [precios actuales](/es/pricing/) antes de decidir. Que sea gratuito durante la beta no significa que vaya a serlo siempre. Alojarlo por tu cuenta también significa hacerte cargo de las actualizaciones y las copias de seguridad; la [guía de autoalojamiento](/es/docs/self-hosting/) explica qué implica. Un proveedor externo de IA puede seguir procesando los datos financieros que le facilites, aunque alojes la aplicación por tu cuenta.

Si las actualizaciones bancarias automáticas son lo que mantiene tu presupuesto al día, tener que revisar los movimientos antes de registrarlos puede añadir un trabajo que no quieras asumir cada semana. Expense Budget Tracker tampoco sustituye la detección automática de suscripciones ni la gestión de carteras de inversión. Si te importa más conservar las monedas por separado o controlar el alojamiento, prueba a migrar unos pocos datos antes de trasladar tu historial.

## Qué puedes trasladar con una exportación de Copilot Money

Copilot Money permite exportar transacciones en CSV desde sus distintas plataformas, y la versión web puede exportar una selección filtrada. Los campos documentados incluyen fechas, nombres, importes, estado, categorías, tipos, cuentas, notas y movimientos recurrentes asociados. Consulta sus [instrucciones de exportación de transacciones](https://help.copilot.money/en/articles/5944414-exporting-your-transaction-data).

Utiliza ese CSV como documento de origen. La siguiente tabla propone cómo revisar la correspondencia de los campos; no es una especificación de importación automática:

| Campo exportado | Qué revisar antes de registrarlo en la aplicación |
|---|---|
| Fecha | Confirma el formato y el periodo al que pertenece |
| Nombre y notas | Conserva la descripción original y el contexto útil, de modo que puedas relacionarlos con la fila de origen |
| Importe | Conserva el valor original; comprueba su signo con compras, reembolsos, ingresos y transferencias conocidos antes de normalizarlo |
| Pendiente o contabilizado | Incluye solo movimientos contabilizados en la prueba de un periodo cerrado |
| Categoría y categoría superior | Asigna las categorías que hayas elegido para el espacio de trabajo; no des por hecho que las estructuras son idénticas |
| Tipo | Distingue ingresos, gastos/reembolsos y transferencias internas |
| Cuenta y número enmascarado | Asócialos a la cuenta de destino exacta y confirma su moneda por separado |
| Excluido | Anota el motivo de la exclusión; excluirlo del presupuesto no elimina necesariamente su efecto en el saldo de una cuenta |
| Movimientos recurrentes asociados | Consérvalos como contexto; vuelve a crear por separado los planes presupuestarios que necesites |

Mantén intacta la exportación y numera las filas de origen en tu copia de trabajo. Un CSV de transacciones no es una copia de seguridad completa de la aplicación. No des por hecho que permite restaurar los importes presupuestados, la configuración de movimientos recurrentes o los saldos iniciales. Obtén extractos bancarios o saldos de referencia con fecha para hacer la conciliación.

Copilot Money ya distingue entre ingresos (Income), transferencias internas (Internal Transfers) y movimientos de tipo Regular, que incluyen gastos y reembolsos. Su [guía de tipos de transacción](https://help.copilot.money/en/articles/3971267-transaction-types) trata los pagos de tarjetas de crédito como transferencias internas. Conserva esas distinciones al migrar en lugar de clasificar cada salida de dinero como gasto.

## Prueba con un único periodo cerrado

Elige un periodo breve y cerrado que incluya compras habituales, un reembolso y una transferencia entre dos cuentas que lleves en la aplicación. Incluye ambas cuentas de la transferencia y obtén sus saldos iniciales y finales. Deja los movimientos pendientes fuera de la prueba.

Empieza en la [app web](/es/docs/getting-started/) con unos pocos movimientos manuales, o utiliza un agente externo para el CSV. El [procedimiento de importación de extractos](/es/blog/how-to-import-bank-statements-into-an-expense-tracker/) cubre toda la revisión. No hay una pantalla de carga de archivos que convierta esta exportación en una migración terminada.

Para una importación asistida, pide al agente que primero examine el esquema actual y el espacio de trabajo seleccionado. Pídele un borrador que incluya la fila de origen, la cuenta de destino, la moneda, el importe original exportado, el importe normalizado del registro contable, la categoría propuesta, el movimiento correspondiente de la transferencia y cualquier duda. Mantén separadas las dos columnas de importes para poder revisar cada cambio de signo. Compara el borrador con los movimientos existentes para señalar duplicados. Revisa los datos exactos que se propone guardar antes de aprobar un lote pequeño y, después, vuelve a leer las filas guardadas. La [guía del conector MCP](/es/docs/mcp-connector/) explica el acceso de lectura y el permiso de escritura independiente.

No intentes recuperar la moneda de una cuenta extranjera cambiando la etiqueta de dólares a euros en los importes exportados. Si el origen contiene valores convertidos o etiquetados de forma incorrecta, vuelve a los registros bancarios originales para obtener los importes reales en EUR.

## Comprueba los saldos antes de comparar informes

Este ejemplo de prueba utiliza los signos normalizados de Expense Budget Tracker: las salidas son negativas; los ingresos, las transferencias recibidas y los reembolsos son positivos. Estos signos describen el registro contable de destino, no el formato CSV de Copilot Money. Los importes son ficticios.

| Cuenta | Saldo inicial | Movimientos contabilizados | Saldo final |
|---|---:|---|---:|
| Cuenta corriente en USD | $1,000 | +$500 de ingreso − $80 de compra + $20 de reembolso − $200 de transferencia − $3 de comisión | $1,237 |
| Cuenta de ahorro en USD | $300 | +$200 de transferencia | $500 |
| Cuenta corriente en EUR | €400 | −€60 de compra + €15 de reembolso | €355 |

La cuenta corriente cuadra así: `1,000 + 500 − 80 + 20 − 200 − 3 = 1,237`. La cuenta de ahorro recibe la transferencia correspondiente de $200. Ambos movimientos de la transferencia afectan a los saldos, pero ninguno cuenta como gasto o ingreso. Los reembolsos de $20 y €15 reducen el gasto en las categorías de sus compras originales, en lugar de convertirse en ingresos. La comisión de $3, contabilizada por separado, sigue siendo un gasto.

En esta prueba, el gasto neto en USD es de $63 y el gasto neto en EUR es de €45. No los sumes para obtener «108» de gasto del hogar. Primero, contrasta cada uno de los tres saldos finales con su propia documentación. Después, utiliza una moneda de informe y los tipos de cambio disponibles para comparar los importes.

Los tipos de cambio de los informes no indican qué conversión aplicó realmente el banco. Una transferencia entre monedas necesita el importe real contabilizado en cada lado. Comprueba la cobertura de tipos de cambio para todas las monedas que necesites; Expense Budget Tracker no promete admitir cualquier moneda. La [guía de presupuestos multidivisa](/es/blog/multi-currency-budgeting-for-expats/) explica las monedas admitidas y la diferencia entre la conversión para informes y la conciliación de cuentas.

## Decide después de la prueba, antes de trasladar años de datos

Continúa solo cuando hayas registrado qué hacer con cada fila de origen, todas las cuentas afectadas cuadren y las transferencias y los reembolsos aparezcan correctamente en los informes de gastos. Resuelve primero las dudas sobre posibles duplicados y las transferencias a las que les falte el movimiento correspondiente. Nunca añadas un asiento de ajuste solo para ocultar una diferencia sin explicar.

Después, dedica una semana a mantener al día los nuevos movimientos con el método de registro que hayas elegido. Invita a tu pareja si el acceso compartido forma parte de la decisión y comprueba que ambos podéis hacer lo que necesitáis.

Si sigues usando Copilot Money por la sincronización bancaria, la detección de suscripciones o el seguimiento de inversiones, quizá te convenga quedarte. Si la prueba confirma que conservar las monedas originales, compartir el espacio de trabajo o alojar la aplicación por tu cuenta compensan el trabajo de registro, traslada otro periodo cerrado. Una muestra conciliada es un motivo más sólido para cambiar que una lista de funciones.
