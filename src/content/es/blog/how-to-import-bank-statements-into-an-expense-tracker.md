---
title: "Cómo importar extractos bancarios en una aplicación de control de gastos"
description: "Usa un agente de IA para importar un extracto bancario en CSV o PDF: revisa duplicados y transferencias, y concilia el saldo antes de añadir las filas aprobadas."
date: "2026-03-16"
updated: "2026-09-05"
image: "/blog/how-to-import-bank-statements-into-an-expense-tracker-v2.png"
keywords:
  - "importar extractos bancarios en una aplicación de control de gastos"
  - "importar extractos bancarios CSV"
  - "importar extractos bancarios PDF"
  - "analizador de extractos bancarios con IA"
  - "conciliación de extractos bancarios"
  - "control de gastos sin vincular cuentas bancarias"
---

Un extracto bancario o de tarjeta de un periodo cerrado puede parecer listo para importar y, aun así, esconder varias trampas. Algunas transacciones quizá ya estén en tu registro contable porque las añadiste a partir de recibos. Un pago a la tarjeta puede parecer otro gasto, aunque las compras se registraran semanas antes.

La forma segura de **importar extractos bancarios en una aplicación de control de gastos** es conservar el archivo original del banco, dejar que un agente de IA prepare un borrador revisable, aprobar solo las filas que entiendas y conciliar después cada cuenta afectada.

Expense Budget Tracker no tiene una función nativa para subir archivos CSV o PDF con un solo clic ni mantiene una conexión permanente con tu banco. Este flujo de trabajo utiliza un agente de IA externo o un script para leer el extracto e interactuar con la aplicación. El agente procesa el archivo; tú revisas y controlas qué se escribe exactamente en el registro contable.

![Un trabajador postal revisa un lote de paquetes en una puerta de clasificación, con un duplicado apartado](/blog/how-to-import-bank-statements-into-an-expense-tracker-v2.png)

## Empieza por una única fuente original

Conserva el extracto original sin cambios. Trabaja con una copia e indica al agente la ruta exacta del archivo o el adjunto, la cuenta, la moneda y el intervalo de fechas ya cerrado.

Siempre que sea posible, cada archivo debe corresponder a una sola cuenta y un solo periodo del extracto. Si una exportación bancaria combina dos tarjetas, mezcla movimientos pendientes y contabilizados o se solapa con varios periodos, divide la revisión en secciones explícitas antes de normalizar las transacciones. De lo contrario, será mucho más difícil localizar la causa de un descuadre posterior.

Para importar un periodo ya cerrado, utiliza solo las transacciones contabilizadas. Los movimientos pendientes pueden cambiar de importe, descripción o fecha. Ponlos en una lista de seguimiento aparte en lugar de tratarlos como movimientos ya liquidados.

El formato del archivo determina el riesgo de extracción. Al importar un extracto bancario CSV se parte de campos estructurados; con un extracto bancario PDF quizá haya que partir de texto extraído o de píxeles.

- Un CSV estructurado suele ser el punto de partida más limpio, pero el agente todavía debe confirmar el delimitador, el formato de fecha, el separador decimal, la moneda y si los importes aparecen en columnas separadas de débito y crédito o en un único campo con signo.
- Un PDF basado en texto puede mantener legible el texto de las transacciones, pero perder la alineación de las columnas. Añade a cada fila del borrador el número de página junto con el número secuencial de la transacción o con una referencia de línea para poder rastrearla hasta el origen.
- Un PDF escaneado o compuesto solo por imágenes requiere OCR o una herramienta capaz de interpretar imágenes. Las páginas recortadas, la impresión poco nítida y las columnas fusionadas pueden impedir una extracción exacta. Si una fecha, un importe, una moneda o un saldo no están claros, detente y solicita un archivo mejor o una confirmación manual.

La fiabilidad de un **analizador de extractos bancarios con IA** depende del archivo que le proporciones y del acceso que la herramienta elegida tenga a él. Una tabla ordenada no demuestra que todas las filas o cifras se hayan extraído correctamente.

## Usa exactamente esta tabla de revisión

El agente debe crear primero un borrador fuera del registro contable, con exactamente una fila de revisión por cada transacción contabilizada en el original, incluidos los duplicados y las exclusiones. Utiliza estos campos en este orden:

| Campo | Qué debe contener |
|---|---|
| `source_ref` | Número de fila en el CSV, o página del PDF junto con el número secuencial de la transacción o una referencia de línea |
| `posted_at` | Fecha y hora de contabilización si aparecen en la fuente; incluye una zona horaria solo cuando la fuente la indique o el usuario la confirme |
| `raw_description` | Texto original tal como aparece, sin normalizar el nombre del comercio |
| `statement_amount` | Importe original de débito, crédito o con signo, exactamente como aparece en la fuente |
| `currency` | Moneda de origen; nunca la infieras automáticamente a partir de un símbolo |
| `ledger_amount` | Importe normalizado según la convención de signos de la aplicación |
| `target_account` | Cuenta existente exacta elegida en el espacio de trabajo |
| `proposed_kind` | Valor exacto que permite el esquema actual para este movimiento |
| `proposed_category` | Categoría existente exacta o, si se trata de una transferencia, el valor sin categoría que exija el esquema actual |
| `transfer_match` | Cuenta de contrapartida y referencia de origen, o `unresolved` |
| `duplicate_candidate` | Fila coincidente del registro contable y pruebas de la coincidencia, o `none found` |
| `uncertainty` | Cualquier duda sin resolver sobre el texto, la fecha, el importe, la cuenta, la moneda o la clasificación |
| `decision` | `insert`, `match existing`, `exclude` o `needs review` |

Por ejemplo, una fila ya registrada a partir de un recibo debe permanecer en la tabla con `match existing`. Debe seguir visible como evidencia y no convertirse en una segunda entrada del registro contable.

La descripción original y el importe del extracto siguen siendo importantes después de que el agente genere campos más limpios. Son la forma más rápida de volver a la fuente cuando una categoría propuesta o un signo parecen incorrectos.

## Conecta el agente y comprueba los datos reales

Para un agente que se ejecute en una terminal o un script HTTP directo, empieza con:

```text
GET https://api.expense-budget-tracker.com/v1/
```

Sigue la respuesta de descubrimiento, completa el flujo de autenticación mediante el código enviado por correo electrónico y guarda fuera de la memoria del chat la clave `ApiKey` de larga duración que recibas. Las solicitudes autenticadas usan `Authorization: ApiKey <key>`. La [guía de configuración del agente](/es/docs/agent-setup/) explica todo el proceso de conexión.

Antes de construir cualquier SQL, el agente debe:

1. Confirmar la identidad autenticada y el espacio de trabajo exacto.
2. Seleccionar el espacio de trabajo previsto o enviar su ID con la solicitud.
3. Inspeccionar `GET /v1/schema` para conocer las relaciones y columnas permitidas en ese momento.
4. Consultar la cuenta de destino exacta, su moneda, las categorías existentes y el último punto de conciliación fiable mediante `POST /v1/sql/query`.
5. Consultar los movimientos ya registrados durante el periodo del extracto y durante el margen adicional para detectar duplicados antes de proponer una operación de escritura.

No copies en un script de importación una lista de columnas tomada de este artículo. El esquema actual es el contrato. La [referencia de la API](/es/docs/api/) documenta los endpoints y las reglas de SQL, mientras que `/v1/schema` indica al agente qué puede escribirse en ese momento.

Como alternativa, un cliente con soporte para MCP puede conectarse a:

```text
https://mcp.expense-budget-tracker.com/mcp
```

Esta ruta utiliza OAuth en el navegador en lugar de una clave `ApiKey`. Solicita el alcance `expenses:read` para usar `list_workspaces`, `get_schema` y `sql_query`. Añade el alcance opcional `expenses:write` solo cuando el cliente esté listo para llamar a `sql_execute`. La [guía del conector MCP](/es/docs/mcp-connector/) explica la conexión y el modelo de aprobación.

Ambas rutas devuelven como máximo 100 filas por consulta. La API directa también limita a 100 las filas afectadas por cada solicitud de mutación. Si un periodo contiene más filas, divide las consultas en tramos no solapados de fechas o referencias de origen y comprueba que cada fila contabilizada del extracto aparezca exactamente una vez en la tabla de revisión.

## Define un intervalo práctico para detectar duplicados

Consulta la cuenta de destino durante todo el periodo del extracto y amplíalo tres días naturales por cada lado. Este pequeño margen permite encontrar entradas creadas a partir de recibos y filas importadas cuyas fechas de compra y contabilización difieren. Es un margen de revisión, no una prueba de que dos filas sean la misma transacción.

Si tanto la fuente como el registro contable incluyen un identificador bancario estable de la transacción, trátalo como una prueba sólida de duplicado. Si no existe, marca un posible duplicado cuando coincidan todos estos datos:

- cuenta de destino
- moneda
- importe exacto con signo
- fecha con una diferencia máxima de tres días naturales

Después compara la descripción original, la contraparte normalizada, el texto de referencia y cualquier recibo que respalde la coincidencia. Dos compras reales pueden tener el mismo importe en el mismo comercio, así que el agente debe señalar posibles duplicados en lugar de eliminarlos, actualizarlos u omitirlos sin avisar.

Aquí se cruzan el trabajo con extractos y el trabajo con recibos. Un [flujo para escanear recibos](/es/blog/ai-receipt-scanner-expense-tracker/) permite comprobar los detalles de una compra concreta: comercio, artículos, impuestos, propina y total. Un extracto demuestra el movimiento en una cuenta y puede incluir los saldos inicial y final. Cuando ambos describan la misma compra, vincúlalos; no la registres dos veces.

## Usa las categorías de tu registro para preparar el borrador

Lee las categorías que ya se usan en el espacio de trabajo seleccionado y asigna las filas del extracto a esas mismas categorías. La descripción de un comercio puede sugerir una categoría, pero no demostrarla. El nombre de un procesador de pagos, una plataforma de compraventa o una etiqueta de transferencia desconocida es un indicio especialmente débil.

Pon las filas poco claras en `needs review`. No inventes una categoría para que la tabla parezca completa. Lo útil es una lista breve de dudas vinculadas a referencias de origen concretas, no una conjetura presentada como certeza y escondida entre las filas aprobadas.

Los reembolsos merecen el mismo cuidado. Mantén visibles el signo original y el movimiento de la cuenta; después, clasifícalos según el criterio que ya se aplique en el espacio de trabajo. No marques automáticamente como ingreso todos los importes positivos.

## Evita convertir transferencias en gastos que no existen

Una transferencia interna cambia los saldos de las cuentas sin generar consumo. Si ambas cuentas forman parte del conjunto que controlas, representa los dos movimientos mediante la relación que exija el esquema actual. El movimiento de origen sale de una cuenta, la contrapartida entra en la otra y el par no debe inflar el gasto.

Esto cubre los casos habituales:

- pasar dinero de una cuenta corriente a una cuenta de ahorro es una transferencia interna cuando ambas están registradas
- una compra con tarjeta de crédito es un gasto en la cuenta de la tarjeta
- el pago posterior a esa tarjeta registrada desde la cuenta corriente es una transferencia, no la compra de nuevo
- una comisión bancaria indicada por separado es un gasto, aunque aparezca junto a una transferencia
- en las transferencias entre monedas, cada movimiento conserva el importe y la moneda reales del extracto de su propia cuenta; no inventes un importe convertido para el movimiento que falta

Si falta la cuenta o el extracto de la contrapartida, deja `transfer_match` como `unresolved`. No inventes el otro movimiento ni apruebes la fila como gasto ordinario solo para terminar el lote. Encontrarás el criterio detallado para decidir en [¿Las transferencias bancarias cuentan como gastos?](/es/blog/do-bank-transfers-count-as-expenses/).

Una cuenta que quede fuera del presupuesto que controlas necesita una política explícita. Un pago que cruza ese límite puede ser una compra, la liquidación de una deuda, una aportación a una inversión, un reembolso u otra cosa. La palabra «transferencia» en la descripción del banco no basta para decidirlo.

## Aprueba un lote concreto, no una intención imprecisa

Cuando cada fila contabilizada de la fuente tenga una decisión —aunque sea `needs review`—, el agente debe mostrar:

- el espacio de trabajo, la cuenta del extracto, la moneda y el periodo
- el número de filas contabilizadas de la fuente y los totales de débitos, créditos o importes con signo del extracto
- las filas vinculadas a entradas existentes del registro contable
- las filas excluidas de la importación y el motivo
- los posibles duplicados y las transferencias sin resolver
- el SQL exacto de un lote pequeño, construido a partir del esquema actual
- el número esperado de filas afectadas

Utiliza una aprobación así de específica:

```text
Apruebo únicamente el lote de importación del extracto [number].
Espacio de trabajo: [name and ID]
Cuenta del extracto: [account name and ID]
Periodo: [start through end]
Referencias de origen aprobadas: [exact list]
Filas afectadas esperadas: [count]
Ejecuta únicamente el SQL exacto mostrado en la última vista previa.
No cambies ninguna otra fila. Detente después de comprobar el resultado con una nueva consulta.
```

Si cambian el espacio de trabajo, la cuenta, el SQL, la lista de referencias de origen o el resultado esperado, la aprobación deja de ser válida. Solicita una nueva vista previa y otra aprobación.

## Escribe en lotes pequeños y comprueba cada uno

Para la API directa, envía en cada solicitud a `POST /v1/sql/execute` una única sentencia `INSERT`, `UPDATE` o `DELETE` aprobada. Para MCP, usa `sql_execute` con `expenses:write`. Una inserción de varias filas sigue siendo una sola sentencia, pero mantén los lotes lo bastante pequeños como para que una persona pueda comparar cada fila con la tabla de revisión. Empieza por el grupo coherente más pequeño: los dos movimientos de una transferencia o unas pocas filas ordinarias. Continúa solo cuando la consulta de comprobación sea correcta y el siguiente lote tenga su propia vista previa y aprobación.

Después de cada lote, vuelve a consultar exactamente esas filas mediante `/v1/sql/query` o `sql_query`. Compara la cuenta, la marca de tiempo, el importe con signo, la moneda, el tipo, la categoría y la relación de transferencia guardados con la vista previa aprobada. Después, vincula cada fila recuperada con su referencia de origen aprobada. Una respuesta HTTP de éxito no demuestra que el registro contable contenga lo que pretendías.

No mezcles tareas de limpieza con la importación. Si la consulta posterior revela un valor incorrecto o hace falta corregir una fila existente, prepara un `UPDATE` o `DELETE` exacto y separado, explica su efecto y solicita una nueva aprobación.

## Concilia todas las cuentas afectadas por la importación

Para un extracto que incluya un saldo inicial y otro final, aplica primero la convención de débitos, créditos y saldos del propio extracto:

```text
expected source closing balance = source opening balance + sum(posted source movements)
```

Para la aplicación, calcula el saldo hacia delante desde el último punto de control fiable de la cuenta, en lugar de asumir que la primera fecha del extracto ya está conciliada:

```text
expected tracker balance at cutoff = last known-good tracker balance
                                   + sum(signed ledger movements after that checkpoint through the cutoff)
```

Traduce cualquier forma específica del banco de presentar débitos, créditos o deuda de tarjeta a la convención de signos de la aplicación y muestra esa conversión. El saldo esperado en la aplicación debe coincidir con el saldo final normalizado del extracto de esa cuenta. Compara también las referencias de origen importadas con la tabla de revisión: cada fila contabilizada del extracto debe haberse insertado, vinculado a una fila existente o excluido explícitamente.

Si la importación creó o vinculó los dos movimientos de una transferencia interna, concilia ambas cuentas con sus propios extractos o puntos de control de saldo fiables. Que el saldo de la cuenta de origen coincida todavía puede ocultar un movimiento de destino inventado o duplicado.

Una exportación CSV de transacciones puede no incluir saldos inicial y final. En ese caso, usa un saldo independiente proporcionado por el banco para una fecha y hora de corte exactas o un punto de conciliación fiable anterior. Sin uno ni otro, puedes verificar la cobertura y los totales de las filas, pero no afirmar que has realizado una **conciliación completa del extracto bancario**.

La condición para detenerse es sencilla: si alguna cuenta tiene una diferencia de saldo sin explicar, queda una fila de origen sin resolver, hay dudas sobre un importe o una moneda, o existe algún posible duplicado o alguna transferencia sin aclarar, detente. No añadas una transacción de ajuste. Conserva el borrador e investiga el descuadre concreto con el [flujo de conciliación del presupuesto](/es/blog/how-to-reconcile-your-budget-with-your-bank-balance/).

## Ten claro dónde se procesan los datos del extracto

Esta es una **aplicación de control de gastos sin vincular cuentas bancarias**, pero eso no garantiza que el extracto permanezca en tu equipo.

El cliente de IA o el proveedor del modelo que elijas puede procesar el CSV o PDF y el texto financiero que contiene. Revisa las condiciones de tratamiento de datos de ese proveedor y concédele solo el acceso al archivo que necesite para el trabajo. En el flujo documentado aquí, el agente envía solicitudes SQL y operaciones de escritura estructuradas y aprobadas a la aplicación, y recibe a cambio determinadas filas estructuradas. El archivo original del extracto no se sube a Expense Budget Tracker.

Alojar Expense Budget Tracker por tu cuenta no implica alojar también el agente de IA, la herramienta de OCR ni el proveedor del modelo. Son sistemas independientes, cada uno con su propio perímetro de datos. Si tu prioridad es evitar el acceso bancario permanente, lee [cómo puede funcionar una aplicación de presupuesto sin vincular cuentas bancarias](/es/blog/budget-app-without-bank-linking/) y elige cada parte del flujo de trabajo en consecuencia.

## Un prompt que puedes reutilizar

```text
Importa en Expense Budget Tracker el extracto bancario o de tarjeta del periodo cerrado
indicado en [file path or attachment]. Corresponde al espacio de trabajo [name], a la
cuenta [name] y al periodo [dates].

Por ahora, no escribas nada. Conserva el archivo original. Determina si es un CSV
estructurado, un PDF basado en texto o un PDF escaneado o compuesto por imágenes, e informa
de cualquier limitación de extracción. Excluye la actividad pendiente. Crea exactamente la
tabla de revisión de este artículo y conserva la referencia de origen, la descripción sin
modificar, el importe original, el importe normalizado del registro contable y las dudas de
cada fila contabilizada.

Para HTTP directo, empieza en https://api.expense-budget-tracker.com/v1/, sigue su
respuesta de descubrimiento, usa la clave ApiKey de larga duración devuelta o ya guardada, confirma
/me y el espacio de trabajo exacto, inspecciona /v1/schema y consulta mediante /v1/sql/query.
Para MCP, usa list_workspaces, get_schema y sql_query con expenses:read; solicita
expenses:write solo para una escritura aprobada mediante sql_execute.

Antes de proponer SQL, consulta los movimientos ya existentes del periodo de destino más tres
días naturales por cada lado. Respeta el límite de 100 filas de resultados y, cuando haga falta,
divide la consulta en tramos que no se solapen. Marca los posibles duplicados; nunca los omitas
sin avisar. Reutiliza las categorías existentes. Trata los pagos a tarjetas de crédito y los
movimientos entre cuentas registradas como transferencias, vincula los dos movimientos reales
según el esquema actual y deja las contrapartidas ausentes sin resolver en lugar de inventarlas.

Muestra la tabla de revisión completa, el recuento de filas, los totales de la fuente, las
pruebas de duplicados, los pares de transferencias, las exclusiones y todos los puntos sin
resolver. Después, muestra el SQL exacto basado en el esquema actual para un lote pequeño y
el número esperado de filas afectadas. Espera mi aprobación específica para ese lote.

Tras la aprobación, ejecuta únicamente esa sentencia INSERT, UPDATE o DELETE mediante
/v1/sql/execute o sql_execute. Vuelve a consultar exactamente esas filas y compáralas con la
vista previa aprobada. Concilia cada cuenta afectada con el saldo final de su extracto o con un
punto de control de saldo fiable y exacto. Detente sin añadir una fila de ajuste si queda algo
sin explicar.
```

El resultado es concreto: las pruebas originales, una decisión para cada fila de origen, un cambio aprobado en el registro contable y saldos que puedes explicar.
