---
title: "Escáner de recibos con IA para controlar gastos: flujo con Claude y Codex"
description: "Usa Claude o Codex para escanear recibos con IA en Expense Budget Tracker: extrae el total, revisa la operación exacta, apruébala y comprueba el asiento."
date: "2026-09-01"
image: "/blog/ai-receipt-scanner-expense-tracker.png"
keywords:
  - "escáner de recibos con IA para controlar gastos"
  - "escanear recibos con Claude"
  - "escanear recibos con IA"
  - "escanear recibos con Codex"
  - "pasar recibos a un gestor de gastos"
  - "app de presupuesto con escáner de recibos"
---

Un recibo de una cafetería marca `$27.82`, la notificación de la tarjeta sigue apareciendo como «pendiente» y el papel ya empieza a enrollarse junto al portátil. Déjalo una semana y costará bastante más reconstruir el nombre del comercio, la propina y la categoría.

Claude o Codex pueden convertir esa foto en un borrador mientras aún tienes el recibo delante. El agente lee los datos visibles, compara la transacción propuesta con las cuentas, las categorías y los asientos recientes del libro mayor, y muestra la operación exacta para que la revises. Nada cambia hasta que apruebas esa operación concreta.

Conviene dejar claro dónde termina el producto. **Expense Budget Tracker no incluye cámara ni escáner de recibos y tampoco almacena la imagen del recibo.** Claude, Codex o el proveedor del modelo que hayas configurado interpretan la imagen que les facilitas. El gestor solo guarda los datos estructurados del libro mayor que hayas aprobado.

La capacidad para leer imágenes depende de la configuración de IA elegida. [Anthropic documenta que Claude puede procesar y analizar contenido visual](https://platform.claude.com/docs/en/intro), mientras que la [API Responses de OpenAI admite entradas de texto, imagen o archivo](https://developers.openai.com/api/reference/cli/resources/responses/methods/create). Eso no significa que cualquier cliente de Claude o Codex pueda abrir una foto local por su cuenta. El cliente necesita un archivo adjunto compatible o una ruta accesible, además de tu permiso. Entender la imagen ayuda, pero las cifras siguen necesitando revisión humana.

![Claude o Codex convierte la foto de un recibo en la vista previa de un asiento para revisarlo antes de aprobar la operación](/blog/ai-receipt-scanner-expense-tracker.png)

## Qué hace realmente el «escáner»

Este es un flujo asistido por IA para pasar un recibo al libro mayor, no una cámara integrada en el producto.

El proceso funciona como un traspaso entre el recibo y el gestor de gastos: el modelo se ocupa de la imagen que le das y Expense Budget Tracker, de los datos aprobados del libro mayor.

| Etapa | Qué ocurre |
|---|---|
| Captura | Haces una foto o guardas un escaneo en un lugar al que Claude o Codex puedan acceder. |
| Interpretación | El modelo lee los campos visibles: comercio, fecha, subtotal, descuento, impuestos, propina, total, moneda y pistas sobre el pago. Marca cualquier dato dudoso. |
| Inspección del libro mayor | El agente consulta el espacio de trabajo seleccionado en Expense Budget Tracker, el esquema activo, las cuentas, las categorías y los posibles asientos duplicados. |
| Vista previa | El agente muestra los datos extraídos, las dudas, la categoría elegida y la operación exacta que propone. |
| Aprobación | Apruebas esa operación concreta o corriges los datos y pides una nueva vista previa. |
| Verificación | El agente registra una transacción estructurada y la consulta de nuevo en el libro mayor. |
| Conciliación | Cuando se contabiliza el movimiento de la tarjeta o del banco, lo cotejas con el asiento creado a partir del recibo en vez de importar una segunda copia. |

Ese último paso es lo que hace útil un **escáner de recibos con IA para controlar gastos** dentro de un libro mayor auditable. Leer `$27.82` correctamente es solo el principio. El asiento también necesita el espacio de trabajo, la cuenta, el signo, la moneda y la categoría correctos, además de una decisión sobre los posibles duplicados.

Si necesitas una app con cámara integrada, una bandeja de entrada para recibos y archivos adjuntos almacenados, este producto no ofrece eso. Expense Budget Tracker recibe los datos financieros estructurados. Las imágenes que debas conservar se quedan en tu sistema de archivos, tu archivo documental o el servicio que elijas.

## Usa la API directa para agentes o el conector MCP remoto

Expense Budget Tracker ofrece dos vías de conexión. Ambas llegan al mismo tipo de datos financieros, pero utilizan credenciales distintas y se comportan de forma diferente en el cliente.

### API directa para agentes para Claude Code, Codex y agentes con capacidad HTTP

La vía directa actual comienza en:

```text
https://api.expense-budget-tracker.com/v1/
```

Un agente empieza con `GET /v1/`, sigue las instrucciones de la respuesta, completa el alta con un código recibido por correo y guarda la `ApiKey` de larga duración fuera de la memoria del chat. Después consulta `/v1/me`, enumera y selecciona un espacio de trabajo, inspecciona `/v1/schema`, lee mediante `/v1/sql/query` y envía una única modificación aprobada a través de `/v1/sql/execute`.

Esta vía encaja bien cuando Claude Code o Codex ya pueden abrir el archivo del recibo en tu ordenador y hacer solicitudes HTTP. La [guía de configuración del agente de IA](/es/docs/agent-setup/) explica la secuencia de alta, y la [referencia de la API](/es/docs/api/) documenta el contrato actual de lectura y escritura. Para ver un flujo de terminal más amplio con Claude Code, consulta [cómo llevar el control de tus gastos y gestionar tu presupuesto con Claude Code](/es/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code/).

### MCP remoto con OAuth en el navegador

Un cliente compatible con MCP puede conectarse en su lugar a:

```text
https://mcp.expense-budget-tracker.com/mcp
```

Esta vía autoriza el acceso mediante OAuth en el navegador. Utiliza tokens de acceso y actualización de MCP, no la `ApiKey` de la API para agentes. Las lecturas usan herramientas como `list_workspaces`, `get_schema` y `sql_query`; las operaciones de escritura requieren el permiso independiente `expenses:write` y usan `sql_execute`.

El conector remoto no obtiene acceso a las fotos de tu ordenador. El cliente o el modelo siguen necesitando que les facilites el recibo mediante un archivo adjunto o un mecanismo de archivos compatible. La [guía del conector MCP](/es/docs/mcp-connector/) explica el flujo OAuth y los permisos.

Elijas la vía que elijas, aplica la misma regla: primero interpreta el recibo; después, inspecciona el libro mayor; luego muestra una vista previa clara; y, solo al final, pide una aprobación independiente para escribir.

## Un flujo de trabajo completo para un recibo pequeño

Imagina una foto nítida de este recibo ficticio de un restaurante:

| Campo impreso | Valor visible |
|---|---|
| Comercio | North Street Cafe, New York |
| Fecha y hora | 31 de agosto de 2026, 12:17 p. m. |
| Subtotal de comida | `$24.00` |
| Descuento | `-$2.00` |
| Impuestos | `$1.82` |
| Propina | `$4.00` |
| Total final | `$27.82` |
| Pista sobre el pago | Tarjeta Visa terminada en `4242` |

La aritmética cuadra: `$24.00 - $2.00 + $1.82 + $4.00 = $27.82`. La comprobación es útil, pero no demuestra cuáles son la cuenta y la categoría de destino. El agente todavía necesita consultar el libro mayor.

### 1. Confirma el destino antes de sacar conclusiones de la imagen

Pide al agente que identifique y muestre:

- el contexto de la cuenta autenticada
- el nombre y el ID exactos del espacio de trabajo
- la cuenta de destino del libro mayor y su moneda
- la fecha del recibo y la zona horaria
- la moneda del recibo

Para este ejemplo, supongamos que el usuario confirma el espacio de trabajo `Personal` con el ID `workspace-personal-example`, la cuenta `a-visa_4242-usd`, la moneda `USD` y la hora local de Nueva York para el recibo. Son valores ficticios, no nombres de espacios de trabajo, cuentas o categorías predefinidos en el producto. Los cuatro últimos dígitos de una tarjeta son una pista, no un permiso para elegir una cuenta sin avisar. Si dos tarjetas guardadas terminan en `4242`, el agente debe detenerse y preguntar cuál se utilizó para pagar.

### 2. Inspecciona el esquema activo

El agente debe llamar a:

```text
GET https://api.expense-budget-tracker.com/v1/schema
```

La respuesta del esquema es la fuente de referencia para las relaciones, las columnas, las restricciones y las reglas de escritura disponibles en ese momento. Los ejemplos de un artículo pueden quedar obsoletos; el agente debe seguir `/v1/schema` antes de generar SQL. En el esquema actual del libro mayor, un `INSERT` debe incluir explícitamente el `workspace_id` confirmado. Guardar un espacio de trabajo en la clave de API establece el contexto de la solicitud, pero no elimina esa columna de la fila que se va a insertar.

### 3. Separa los datos, las pistas y las dudas

Un informe de extracción sólido tendría este aspecto:

| Campo | Valor extraído | Confianza o problema |
|---|---|---|
| Comercio | North Street Cafe | Claro |
| Hora de la transacción | `2026-08-31 12:17` local | Clara; el usuario confirmó la zona horaria de Nueva York |
| Moneda | USD | `$` más la ubicación confirmada; el usuario confirmó la moneda de la cuenta |
| Subtotal | `24.00` | Claro |
| Descuento | `-2.00` | Claro |
| Impuestos | `1.82` | Claros |
| Propina | `4.00` | Clara |
| Total pagado | `27.82` | Claro y la aritmética cuadra |
| Método de pago | Tarjeta Visa terminada en `4242` | Pista cotejada con la cuenta confirmada por el usuario |

No conviertas un texto dudoso en un dato seguro. Si el último dígito del total podría ser `2` o `7`, la respuesta correcta es «total ilegible; hace falta otra imagen o una confirmación manual», no una conjetura que parezca razonable.

### 4. Decide entre una única transacción y un desglose por categorías

Todo el recibo corresponde a un gasto de restaurante, así que una fila del libro mayor con la categoría `Dining Out` es razonable si esa categoría exacta ya existe en el espacio de trabajo. Los impuestos, el descuento y la propina explican el importe final; en un presupuesto personal corriente no necesitan filas separadas.

Un recibo de supermercado que contenga comida, medicamentos y un electrodoméstico de cocina puede justificar un desglose por categorías. En el modelo actual del libro mayor, eso implica varias filas con el mismo `event_id`, normalmente en la misma cuenta. Cada fila tiene su propia categoría y su importe con signo, y esos importes deben sumar exactamente el pago original: `-27.82` para un gasto de `$27.82`.

La vista previa debe explicar cómo se han repartido los impuestos, los descuentos, los cargos por servicio y el redondeo que afectan a todo el recibo. En un caso puede tener sentido un reparto proporcional; en otro, asignar un descuento claramente vinculado a un artículo concreto. No existe una regla universal. Si el reparto fuera arbitrario, conserva una única fila en una categoría existente más amplia o pregunta al usuario.

El agente debe consultar las categorías existentes del libro mayor en vez de inventar una taxonomía que suene más ordenada:

```sql
SELECT category, COUNT(*) AS use_count
FROM ledger_entries
WHERE kind = 'spend'
  AND category IS NOT NULL
GROUP BY category
ORDER BY use_count DESC
LIMIT 100
```

### 5. Busca asientos que puedan coincidir y devuelve candidatos, no veredictos

Antes de preparar una inserción, consulta la cuenta confirmada en las fechas cercanas a la del recibo. Para este ejemplo, una búsqueda acotada de duplicados podría ser:

```sql
SELECT entry_id, event_id, ts, account_id, amount, currency, category, counterparty, note, external_id
FROM ledger_entries
WHERE event_id = 'receipt-2026-08-31-north-street-cafe-2782'
   OR (
     account_id = 'a-visa_4242-usd'
     AND currency = 'USD'
     AND ts >= '2026-08-29 00:00:00-04'
     AND ts < '2026-09-03 00:00:00-04'
     AND amount = -27.82
   )
ORDER BY ts
LIMIT 100
```

El agente envía esa sentencia a `POST /v1/sql/query`. Aquí, `event_id` es un valor literal creado por el agente para este evento; si hubiera un desglose, todas las filas relacionadas lo compartirían. Sirve para agrupar filas y hacer búsquedas puntuales, pero la base de datos no lo trata como una clave única de deduplicación. Una coincidencia exacta de `event_id` es un indicio sólido que conviene investigar, no un permiso para eliminar o sobrescribir nada.

Una fila cercana con el mismo importe y un comercio parecido tampoco es más que un posible duplicado. Dos pagos reales en una cafetería pueden tener el mismo importe, y una notificación de tarjeta pendiente puede contabilizarse más adelante con otro nombre de comercio u otra hora.

Si ya existe un asiento que probablemente coincida, la vista previa debe mostrarlo junto a los datos extraídos del recibo y no proponer ninguna inserción hasta que el usuario resuelva el conflicto.

### 6. Muestra el asiento y la operación exactos

Supongamos que la consulta de duplicados no devuelve candidatos y que `Dining Out` es una categoría existente. La vista previa, todavía sin escribir nada, ya puede ser concreta:

| Campo del libro mayor | Valor propuesto |
|---|---|
| Espacio de trabajo | `Personal` (`workspace-personal-example`) |
| Cuenta | `a-visa_4242-usd` |
| Marca de tiempo | `2026-08-31 12:17:00-04` |
| Importe | `-27.82` |
| Moneda | `USD` |
| Tipo | `spend` |
| Categoría | `Dining Out` |
| Contraparte | `North Street Cafe` |
| Nota | `Receipt subtotal 24.00; discount -2.00; tax 1.82; tip 4.00` |
| Posibles duplicados | Ninguno en el intervalo consultado |

La vista previa también debe mostrar la sentencia SQL exacta que se pretende enviar:

```sql
INSERT INTO ledger_entries (
  event_id,
  ts,
  account_id,
  amount,
  currency,
  kind,
  category,
  counterparty,
  note,
  workspace_id
)
VALUES (
  'receipt-2026-08-31-north-street-cafe-2782',
  '2026-08-31 12:17:00-04',
  'a-visa_4242-usd',
  -27.82,
  'USD',
  'spend',
  'Dining Out',
  'North Street Cafe',
  'Receipt subtotal 24.00; discount -2.00; tax 1.82; tip 4.00',
  'workspace-personal-example'
)
```

Esto sigue siendo una vista previa. El agente debe indicar el efecto esperado —una nueva fila del libro mayor en el espacio de trabajo confirmado— y esperar una aprobación explícita, por ejemplo: «Apruebo esta operación exacta». Cualquier corrección en el espacio de trabajo, la cuenta, el importe, la categoría, la nota o cualquier otro valor invalida la vista previa anterior y obliga a generar otra.

### 7. Ejecuta únicamente la sentencia aprobada y vuelve a leerla

Tras la aprobación, la API directa para agentes envía la sentencia exacta a:

```text
POST https://api.expense-budget-tracker.com/v1/sql/execute
```

Después, el agente la verifica mediante `/v1/sql/query`:

```sql
SELECT entry_id, event_id, ts, account_id, amount, currency, kind, category, counterparty, note, workspace_id
FROM ledger_entries
WHERE event_id = 'receipt-2026-08-31-north-street-cafe-2782'
LIMIT 100
```

La consulta de comprobación debe devolver exactamente una fila que coincida con la vista previa aprobada. Recibir una respuesta HTTP correcta sin hacer esta comparación no completa la verificación.

### 8. Concilia cuando se contabilice el cargo de la tarjeta

El recibo registra lo que ocurrió en el momento del pago. El movimiento contabilizado de la tarjeta confirma lo que terminó llegando a la cuenta. Cuando aparezca en una exportación posterior, consulta la misma cuenta, el mismo importe, el intervalo de fechas, las pistas sobre el comercio y cualquier ID estable de la fuente. Si los indicios apuntan a la fila creada a partir del recibo, excluye la fila del extracto de la importación en vez de crear un segundo asiento en el libro mayor.

Si el importe contabilizado es distinto, no crees un asiento compensatorio. Investiga si el total del recibo se leyó mal, si cambió la propina, si una preautorización pasó a ser definitiva o si la tarjeta convirtió un cargo en moneda extranjera. Prepara una única corrección visible y solicita una aprobación independiente.

Para lotes más grandes, la [guía para importar extractos bancarios](/es/blog/how-to-import-bank-statements-into-an-expense-tracker/) explica cómo tratar los periodos solapados y las transferencias. La [guía de conciliación del presupuesto](/es/blog/how-to-reconcile-your-budget-with-your-bank-balance/) explica cómo comparar la actividad contabilizada de una cuenta con un saldo fiable.

## Cuándo se complica la lectura de recibos

Las fotos de recibos son datos de entrada imperfectos. Un escáner de recibos con IA basado en Claude o Codex debe señalar estos casos en vez de disimularlos.

| Caso difícil | Tratamiento seguro |
|---|---|
| Foto borrosa, oscura, doblada o recortada | Marca los campos ilegibles, solicita otra imagen o un valor manual, y no escribas nada mientras el total, la fecha o la moneda no estén claros. |
| Subtotal frente a total | Vuelve a calcular los componentes visibles y usa el importe final que se pagó realmente. Comprueba si los impuestos están incluidos o se añaden y si el total ya incorpora un cargo por servicio. |
| Propinas | Distingue entre las propinas sugeridas impresas, las propinas escritas a mano, los importes de autorización de la tarjeta y el total final. Compara después el total con el importe contabilizado en la tarjeta. |
| Descuentos y cupones | Conserva el total final pagado. En los desgloses por categorías, muestra cómo se ha distribuido el descuento en vez de asignarlo sin avisar. |
| Devoluciones y reembolsos | Trata un recibo de devolución como indicio de un reembolso pendiente o ya abonado, no como un ingreso corriente. Registra el reembolso como un asiento estructurado independiente en la cuenta receptora solo cuando su estado y su importe estén claros; después, concílialo cuando se contabilice. |
| Recibo dividido entre categorías | Asigna un mismo `event_id` a las filas relacionadas; muestra cada importe con signo por categoría, la regla de distribución, la decisión de redondeo y la suma. Las filas deben sumar el total final pagado. |
| Efectivo frente a tarjeta | Usa la cuenta de pago real. Ni el logotipo del comercio ni una cartera en la foto demuestran el método de pago; pregunta si falta la línea correspondiente al medio de pago. |
| Moneda extranjera | Indica de forma explícita la moneda del recibo. Si la cuenta de la tarjeta usa otra moneda, no inventes un tipo de cambio ni un importe de liquidación; espera al cargo contabilizado o consigue un importe exacto confirmado. |
| Posibles duplicados | Compara la fecha, el importe con signo, la cuenta, la moneda, el comercio y cualquier identificador estable de la fuente. Presenta candidatos para que se tome una decisión, en lugar de omitirlos o insertarlos sin avisar. |

La misma prudencia se aplica al tratamiento fiscal. Un recibo puede servir como justificante, pero el modelo no debe declarar que cualquier compra es un gasto empresarial deducible ni sacar conclusiones legales o fiscales a partir del nombre del comercio. Conserva en tu propio sistema documental cualquier documento que necesites como prueba fiscal o para un reembolso y pide asesoramiento cualificado para las cuestiones que dependan de tus circunstancias.

## Un prompt reutilizable para Claude o Codex

Pégalo después de conectar el agente y sustituye los valores entre corchetes. Si estás aprendiendo el flujo, empieza con un solo recibo cada vez.

```text
Usa la imagen del recibo que está en [ruta exacta del archivo o archivo adjunto] y Expense
Budget Tracker. Para la API directa, empieza en https://api.expense-budget-tracker.com/v1/
y sigue las instrucciones de la respuesta. Usa la ApiKey almacenada fuera de la memoria del
chat. Si esta conexión usa MCP, utiliza en su lugar las herramientas de espacio de trabajo,
esquema y consulta de MCP, y mantén la misma separación entre la vista previa y la aprobación.

No escribas nada todavía. Con la API directa, muestra el contexto de mi cuenta en /me.
Enumera los espacios de trabajo disponibles y pídeme que confirme el espacio de trabajo
exacto. Inspecciona /v1/schema (o llama a get_schema). Consulta las cuentas disponibles y
pídeme que confirme la cuenta exacta y su moneda. No deduzcas una cuenta solo a partir de los
cuatro últimos dígitos de la tarjeta.

Lee la imagen y extrae el comercio, la fecha y hora del recibo, la moneda, el subtotal,
los impuestos, la propina, el cargo por servicio, los descuentos, las devoluciones, el
total final y las pistas sobre el pago. Marca todo lo que esté borroso, recortado, resulte
ambiguo o no cuadre aritméticamente. Nunca inventes un valor que falte. Indícame si encaja
una única fila del libro mayor o un desglose por categorías, y consulta mis categorías
existentes antes de proponer nombres. Para un desglose, usa un event_id para sus filas
relacionadas y demuestra que la suma de sus importes con signo coincide con el total final.

Usa consultas de solo lectura para inspeccionar los asientos que puedan coincidir en la
cuenta confirmada y el intervalo de fechas. Muestra los posibles duplicados y los indicios
de cada uno; no des por hecho que una fecha y un importe coincidentes son sin duda la misma
compra o una compra nueva.

Después, muestra una vista previa de solo lectura con el espacio de trabajo confirmado, la
cuenta exacta, el importe con signo, la moneda exacta, la marca de tiempo, el tipo, una
categoría existente, la contraparte, la nota, cada importe del desglose si corresponde y los
posibles duplicados. Muestra la sentencia SQL exacta, incluye el workspace_id confirmado en
cada INSERT e indica el número esperado de filas afectadas. No crees asientos compensatorios,
conversiones estimadas ni filas adicionales.

Detente y espera a que apruebe de forma explícita y por separado esa operación exacta. Tras
la aprobación, envía únicamente la sentencia aprobada mediante /v1/sql/execute (o
sql_execute). Vuelve a leer la fila mediante /v1/sql/query (o sql_query) y compara cada
campo almacenado con la vista previa aprobada. Informa de cualquier discrepancia sin cambiar
más datos. Más adelante, ayúdame a cotejar este asiento creado a partir del recibo con la
transacción contabilizada del banco o de la tarjeta sin crear un duplicado.
```

El prompt es estricto a propósito. «Escanear recibos con IA» parece una tarea de extracción, pero los errores costosos suelen ocurrir después: cuenta equivocada, moneda equivocada, categoría inventada, inserción duplicada u operación sin revisar.

## Dónde pasa cada dato, explicado sin rodeos

No vincular el banco no significa que ningún dato salga de tu ordenador. Cada parte de este flujo de trabajo tiene un límite distinto.

| Límite | Datos implicados |
|---|---|
| Tu dispositivo o cliente | El recibo empieza como una foto o un archivo. El cliente solo obtiene el acceso al archivo que tú le concedas. |
| Claude, Codex y el proveedor del modelo elegido | El contenido del recibo y tus instrucciones se procesan según las condiciones y la configuración de ese proveedor y cliente. Revisa esas condiciones para tu configuración; Expense Budget Tracker no puede ofrecer garantías de privacidad en nombre de Anthropic u OpenAI. |
| API directa para agentes o conector MCP | El agente envía las lecturas concretas del espacio de trabajo y del esquema, las consultas del libro mayor y las operaciones estructuradas aprobadas que requiere la tarea. Ninguna de las dos conexiones con Expense Budget Tracker necesita la imagen del recibo. |
| Almacenamiento de Expense Budget Tracker | En este flujo, el gestor guarda datos financieros estructurados y aprobados, como el importe, la moneda, la cuenta, la categoría, la contraparte y la nota. No almacena la imagen del recibo. |
| Tu archivo de recibos | Si necesitas la imagen original para devoluciones, garantías, reembolsos o archivo, la guardas en otro lugar que tú elijas. |

Este flujo puede encajar bien si buscas una [app de presupuesto sin vincular el banco](/es/blog/budget-app-without-bank-linking/): no hace falta mantener una conexión bancaria permanente y cada cambio propuesto en el libro mayor permanece visible. Aun así, eliges un proveedor de IA, concedes acceso al archivo y envías determinadas lecturas y operaciones financieras mediante la conexión con Expense Budget Tracker.

## ¿Es este el tipo de escaneo de recibos que necesitas?

Si «app de presupuesto con escáner de recibos» significa una bandeja de entrada integrada con la cámara del teléfono y archivos adjuntos almacenados, elige un producto diseñado para esa tarea. Usa este flujo cuando quieras escanear recibos con IA y mantener cada operación del libro mayor visible y separada de la imagen original.

Usa este flujo de trabajo si quieres:

- capturar recibos sin vincular una cuenta bancaria
- que Claude o Codex se encarguen de interpretar la imagen y consultar el libro mayor
- que las cuentas y categorías existentes orienten el asiento
- una vista previa exacta antes de cada operación de escritura
- candidatos a duplicado en lugar de suposiciones silenciosas
- un asiento estructurado y verificado en el libro mayor que puedas conciliar después

Expense Budget Tracker no pretende sustituir a un archivo de recibos que permita hacer búsquedas.

Empieza con un recibo nítido, una cuenta confirmada y una categoría conocida. Revisa la aritmética, aprueba un único asiento exacto, vuelve a consultarlo y cotéjalo cuando se contabilice el cargo. Este breve ciclo deja una pista de auditoría que podrás entender más adelante.
