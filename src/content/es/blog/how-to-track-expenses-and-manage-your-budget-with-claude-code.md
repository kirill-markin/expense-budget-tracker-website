---
title: "Gestor de gastos con Claude Code: conecta, importa y concilia"
description: "Conecta Claude Code a Expense Budget Tracker con un solo enlace, revisa y aprueba la importación de extractos, concilia saldos y actualiza tu presupuesto sin vincular el banco."
date: "2026-03-05"
updated: "2026-09-11"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png"
keywords:
  - "gestor de gastos con Claude Code"
  - "control de gastos con Claude"
  - "seguimiento de gastos con Claude Code"
  - "gestor de presupuestos con Claude Code"
  - "conectar Claude a un gestor de gastos"
  - "importar extractos bancarios con Claude Code"
---

Un extracto de cuatro filas puede cuadrar con una diferencia de `€0.00` y, aun así, dejar mal tu presupuesto. Si clasificas una compra de €54.20 en el supermercado como Viajes en lugar de Alimentación, el saldo de la cuenta seguirá siendo exacto, pero el informe por categorías tendrá un desfase de €54.20.

Para que un gestor de gastos con Claude Code resulte útil hacen falta dos comprobaciones: los movimientos guardados deben explicar el saldo bancario y las categorías asignadas deben coincidir con el extracto que has revisado. Claude Code puede analizar el archivo, hacer los cálculos y llamar a la API. Tú eliges la cuenta y las categorías, revisas los registros propuestos y apruebas exactamente qué se va a escribir.

En esta configuración, Expense Budget Tracker no mantiene una conexión directa con el banco ni ofrece un flujo para cargar extractos. Debes exportar el extracto, guardarlo en una ubicación que Claude Code pueda leer y enviar únicamente los registros aprobados a través de la Agent API gestionada. Si lo que más te importa es evitar el acceso permanente a tu banco, [Aplicación de presupuesto sin vincular el banco](/blog/budget-app-without-bank-linking/) analiza las ventajas y las limitaciones de este enfoque.

![Una restauradora de mosaicos levanta una tesela azul mal colocada de una franja terracota junto a una balanza de latón equilibrada](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png)

## Conecta Claude Code con un solo enlace de descubrimiento

Instala Claude Code e inicia sesión siguiendo la [guía de inicio rápido oficial](https://code.claude.com/docs/en/quickstart) de Anthropic. La [referencia de la CLI](https://code.claude.com/docs/en/cli-reference) explica cómo funcionan los directorios de trabajo y el acceso a archivos adicionales.

Abre `claude` en el directorio que contiene el extracto o dale acceso a ese directorio mediante uno de los métodos compatibles con tu configuración. A continuación, pega este prompt:

```text
Conéctate a Expense Budget Tracker desde esta URL de descubrimiento:
https://app.expense-budget-tracker.com/api/agent

Haz una petición GET, lee el JSON de la respuesta y sigue las URL de las acciones
actuales. No adivines el flujo de la API ni fijes sus pasos en el código. Pídeme la
dirección de correo de mi cuenta de Expense Budget Tracker e inicia el proceso de OTP
por correo. Cuando la solicitud se complete correctamente, indícame que revise la
carpeta de spam o correo no deseado si no veo el mensaje, pídeme el código de 8 dígitos
y sigue la acción de verificación devuelta.

Tras la verificación, pídeme que apruebe una ubicación donde guardar de forma persistente
la ApiKey devuelta, fuera de la memoria del chat y del control de versiones. Carga el
contexto de mi cuenta, enumera mis espacios de trabajo, pídeme que confirme el espacio
de destino, guárdalo como predeterminado para esta clave e inspecciona el esquema actual.
Ejecuta una consulta pequeña de solo lectura para confirmar el espacio seleccionado. No
escribas datos financieros.
```

El [enlace de agente propio de la aplicación](https://app.expense-budget-tracker.com/api/agent) devuelve el documento de descubrimiento actual. En este momento indica `https://api.expense-budget-tracker.com/v1/` como URL base de la API, junto con las URL de las acciones de autenticación y SQL. Pega el enlace del dominio de la aplicación: Claude Code debe seguir las URL que devuelva el servicio, no memorizar la secuencia interna.

El mismo proceso por correo sirve tanto para registrarse como para iniciar sesión. Cuando proporcionas el código de 8 dígitos, Claude Code recibe una `ApiKey` de larga duración. Aprueba una ubicación concreta donde guardarla, por ejemplo, un archivo de secretos excluido del control de versiones. Nunca guardes la clave en `CLAUDE.md` ni la incluyas en un commit. [Configuración del agente de IA](/docs/agent-setup/) documenta la secuencia de autenticación y selección del espacio de trabajo.

## No confundas la Agent API con MCP

«Gestor de gastos con Claude» puede referirse a dos integraciones distintas. Este artículo utiliza Claude Code en una terminal con la Agent API. En cambio, Claude y Claude Desktop pueden conectarse mediante el conector MCP remoto alojado.

| | Claude Code con Agent API | Claude o Claude Desktop con MCP |
|---|---|---|
| Ideal para | Trabajar en la terminal con archivos locales accesibles y HTTP directo | Conversar desde un cliente de Claude compatible con MCP |
| Punto de partida | `https://app.expense-budget-tracker.com/api/agent` | `https://mcp.expense-budget-tracker.com/mcp` |
| Autenticación | OTP por correo y después una `ApiKey` de larga duración | OAuth en el navegador |
| Interfaz de datos | URL obtenidas mediante el descubrimiento que llevan a los endpoints de consulta y ejecución | Herramientas `sql_query` y, de forma opcional, `sql_execute` |
| Acceso al extracto | Archivos y directorios disponibles para esa sesión de Claude Code | El conector remoto no proporciona acceso a archivos locales |

Las credenciales no son intercambiables. Si usas la aplicación web o de escritorio de Claude, sigue la [guía del conector MCP para el gestor de gastos con Claude](/blog/claude-expense-tracker-mcp-connector/). Sigue el flujo de la Agent API que se explica a continuación cuando el proceso comience con un archivo al que Claude Code pueda acceder.

También conviene dejar claros otros dos límites:

- El proveedor del modelo procesa los datos al margen de la API y el almacenamiento de Expense Budget Tracker. Antes de compartir los datos de un extracto, consulta la [documentación de Claude Code sobre el uso de datos](https://code.claude.com/docs/en/data-usage) y las condiciones del proveedor configurado en tu instalación.
- La configuración local con Docker Compose de la [guía de autoalojamiento](/docs/self-hosting/) inicia la aplicación web, el servicio de autenticación, la base de datos y el worker de tipos de cambio. No incluye la Agent API gestionada que se utiliza aquí. El despliegue en AWS del repositorio es una configuración aparte que sí incluye la API pública para máquinas.

## Acota con precisión la importación

En la primera ejecución, limítate a una cuenta, una moneda y un período cerrado del extracto. Un CSV es práctico porque resulta fácil revisar sus filas. Con cualquier otro formato de exportación, pide primero a Claude Code que confirme que puede leer el archivo en tu entorno y muestre las filas que ha interpretado. No des por sentado que admite un formato solo por el nombre del archivo.

Facilita a Claude Code estos seis datos:

1. La ruta local al extracto.
2. La cuenta bancaria y su cuenta correspondiente en el gestor.
3. La moneda de la cuenta.
4. Las fechas inicial y final de contabilización.
5. El saldo inicial o el último saldo correcto conocido.
6. El saldo final del extracto.

Deja fuera las transacciones pendientes hasta que se contabilicen. Mantén intacto el archivo de origen y pide a Claude Code que prepare una vista previa por separado.

Este conjunto de reglas para un archivo `CLAUDE.md` local puede resultar útil en el directorio de finanzas:

```markdown
# Flujo de trabajo de Expense Budget Tracker

- Empieza en https://app.expense-budget-tracker.com/api/agent y sigue el proceso de descubrimiento.
- Confirma el espacio de trabajo de destino e inspecciona el esquema actual antes de escribir SQL.
- Usa la acción de lectura para todas las revisiones y conciliaciones.
- Antes de escribir, muestra los totales del archivo de origen, los posibles duplicados, el SQL exacto y las filas esperadas.
- Espera mi aprobación explícita de todo el conjunto de cambios.
- Usa la acción de escritura solo para el INSERT, UPDATE o DELETE aprobado.
- Verifica cada escritura con una nueva lectura.
- Nunca inventes un asiento de ajuste ni resuelvas sin avisar una clasificación dudosa.
- Mantén la ApiKey fuera de este archivo y del control de versiones.
```

Añade datos que no suelan cambiar, como los nombres reales de tus cuentas, las reglas de categorización, el criterio para las transferencias y la moneda de los informes. No copies las categorías de ejemplo de este artículo salvo que coincidan con las de tu registro contable.

## Importa el extracto a partir de una vista previa completa

Cuando la conexión esté lista, pega el siguiente prompt y sustituye los valores entre corchetes:

```text
Importa [ruta local al extracto] en [cuenta del gestor] desde [fecha inicial de
contabilización] hasta [fecha final de contabilización], en [moneda]. El saldo inicial
es [importe] y el saldo final del banco es [importe].

Confirma primero el espacio de trabajo seleccionado e inspecciona el esquema actual. Usa
solo la acción de lectura para revisar la cuenta de destino, las categorías existentes y
las filas del registro contable que se solapen con el período del extracto. Confirma que
puedes leer y analizar el archivo local y preparar una vista previa completa sin escribir
nada.

Para cada fila del archivo de origen, muestra su identificador o número de fila, la fecha
de contabilización, el importe con signo, la moneda, la cuenta de destino, el tipo de
transacción propuesto, la categoría propuesta y si podría ser un duplicado. Señala las
transferencias, devoluciones, reembolsos, comisiones, filas en moneda extranjera,
contrapartes desconocidas y clasificaciones dudosas.

Después, muestra el número de filas del archivo de origen y su total con signo, todas las
filas que propones añadir al registro contable, los posibles duplicados, el SQL exacto que
enviarías y el número de filas que esperas que resulten afectadas. Detente y espera mi
aprobación explícita del conjunto de cambios completo.
```

No escribas en la base de datos hasta que apruebes un cambio: todo el trabajo previo debe ser de solo lectura. Claude Code debe inspeccionar el esquema actual en lugar de copiar de un artículo los nombres de las columnas, localizar la cuenta correspondiente y consultar las filas existentes en esas mismas fechas. Si una transacción comparte fecha e importe con otra, es una posible duplicada, no un duplicado confirmado. Dos compras legítimas pueden coincidir en ambos campos.

### Un ejemplo completo de cuatro filas

Supongamos que el extracto de una cuenta corriente tiene un saldo inicial de €1,250.00 y cuatro movimientos contabilizados:

| Fila | Contabilización | Descripción | Importe con signo | Tipo propuesto | Categoría propuesta | Nota de revisión |
|---|---|---|---:|---|---|---|
| 1 | 2026-08-31 | Sueldo | +€2,000.00 | Ingreso | Sueldo | Claro |
| 2 | 2026-09-02 | Supermercado | −€54.20 | Gasto | Alimentación | Comprueba el establecimiento si no lo reconoces |
| 3 | 2026-09-03 | Transferencia a ahorros | −€300.00 | Transferencia | — | Confirma la otra cuenta |
| 4 | 2026-09-04 | Cafetería | −€8.40 | Gasto | Restaurantes | Claro |

Los cuatro importes con signo suman `+€1,637.40`. Sumados al saldo inicial de `€1,250.00`, dan un saldo final esperado de `€2,887.40`. Este ejemplo cabe en una pantalla, pero en una importación más larga la vista previa también debe incluir todas las filas del archivo de origen y señalar cualquier duda.

La transferencia exige confirmar la otra cuenta porque mover dinero entre tus propias cuentas no cuenta como gasto. Las devoluciones y los reembolsos también deben conservar su tipo real. Si una clasificación no está clara, déjala marcada para que puedas decidir en lugar de elegir la categoría que parezca más probable.

### Aprueba un único conjunto de cambios bien definido

Revisa el espacio de trabajo, la cuenta, el intervalo de fechas, el número de filas, el total con signo, los posibles duplicados y las clasificaciones. Aprueba esa vista previa y ese SQL concretos en lugar de dar una instrucción general como «importa todo».

La Agent API separa las lecturas de las escrituras. Claude Code utiliza la acción de lectura descubierta para ejecutar un único `SELECT` o `WITH ... SELECT`; después, recurre a la acción de escritura solo para un `INSERT`, `UPDATE` o `DELETE` aprobado de forma explícita. El esquema actual es la única referencia válida para las tablas y las columnas; la [referencia de la API](/docs/api/) explica el contrato y los límites de SQL.

### Prueba los INSERT y UPDATE largos antes de procesarlos por lotes

Antes de ejecutar un `INSERT` o `UPDATE` largo, las instrucciones de descubrimiento actuales indican al agente que envíe una prueba representativa con la misma estructura SQL: entre 1 y 3 filas con valores literales para un `INSERT` o una fila concreta para un `UPDATE`. Tu aprobación abarca tanto la prueba como las demás filas de ese conjunto de cambios revisado.

Si la prueba funciona, Claude Code debe continuar de inmediato con lotes secuenciales de un máximo de 100 registros y verificar cada uno a medida que avanza. En una importación aprobada de 247 filas, después de una prueba de 3 filas quedan lotes de 100, 100 y 44. Cualquier cambio de alcance, nueva duda o error de ejecución exige una nueva aprobación. Los siguientes lotes rutinarios del conjunto ya aprobado no requieren otra.

El SQL restringido no admite `ON CONFLICT`, por lo que los duplicados deben gestionarse de forma explícita. Las respuestas de lectura están limitadas a 100 filas. Claude Code debe comprobar el número de filas y los metadatos de truncamiento de la respuesta, calcular los totales agregados en SQL y repartir la verificación detallada entre consultas ordenadas y acotadas. Una respuesta truncada no sirve como comprobación completa de la importación.

### Consulta de nuevo las filas guardadas

Una respuesta satisfactoria de la API demuestra que la solicitud se ejecutó. No demuestra que todos los valores guardados coincidan con la vista previa. Consulta de nuevo la cuenta y el período afectados y compara:

- el número de filas insertadas
- las fechas, los importes con signo y las monedas
- la cuenta asignada
- los tipos de transacción y las categorías
- los posibles duplicados
- los totales de cada lote y el total completo del extracto

Si algo no coincide, vuelve al diagnóstico en modo de solo lectura. Revisa una corrección concreta antes de realizar otra escritura. La [guía para importar extractos bancarios](/blog/how-to-import-bank-statements-into-an-expense-tracker/) profundiza en los períodos solapados, los reembolsos y las transferencias.

## Concilia el saldo y las categorías por separado

La conciliación del saldo comprueba si los movimientos guardados explican el saldo final del banco durante el mismo intervalo de fechas de contabilización.

Para una cuenta de depósito normal:

**saldo final esperado = saldo inicial + entradas contabilizadas − salidas contabilizadas**

Con movimientos con signo:

**saldo final esperado = saldo inicial + suma de los movimientos contabilizados con signo**

Las cuentas de pasivo, como las tarjetas de crédito, pueden seguir otra convención de signos. Claude Code debe indicar qué convención ha encontrado antes de hacer el cálculo.

Continúa con este prompt:

```text
Usa solo la acción de lectura. Concilia [cuenta] desde [fecha inicial de contabilización]
hasta [fecha final de contabilización] con el saldo final del banco de [importe y moneda].
Indica el punto de partida, la convención de signos, el número de filas guardadas y el
total de movimientos con signo.

Muestra el saldo final esperado, el saldo final del banco y la diferencia exacta. Si la
diferencia no es cero, enumera las filas que podrían faltar, estar duplicadas o excluidas,
tener una fecha incorrecta o llevar el signo equivocado. No insertes un asiento de ajuste
ni cambies ningún dato.

Tras comprobar el saldo, revisa por separado los totales de las categorías. Enumera las
filas sin categoría, las transferencias contadas como gastos y las categorías que difieran
de la vista previa aprobada.
```

En el ejemplo de cuatro filas, `€1,250.00 + €1,637.40 = €2,887.40`. Si el banco también cierra con €2,887.40, la diferencia de saldo es de `€0.00`.

Ese cero valida la aritmética de la cuenta para el intervalo elegido, pero no las categorías. Si cambias la compra de €54.20 en el Supermercado de Alimentación a Viajes, la diferencia de saldo seguirá siendo cero, aunque €54.20 pasarán del total de una categoría al de otra. La revisión de categorías es una comprobación independiente antes de aceptar la importación.

Cuando la diferencia no sea cero, revisa el saldo inicial, las filas que falten o estén duplicadas, las transferencias, los movimientos pendientes, los signos, las fechas y las monedas. Nunca añadas una transacción de ajuste artificial para hacer desaparecer la diferencia. La [guía de conciliación](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) explica este proceso de diagnóstico con más detalle.

## Actualiza el presupuesto solo después de conciliar

Pasa al presupuesto únicamente cuando hayas vuelto a leer correctamente las filas guardadas, la cuenta esté conciliada y los totales por categoría tengan sentido. Un gestor de presupuestos con Claude Code puede comparar los movimientos reales con `budget_lines` y preparar cambios. Un mes atípico no tiene por qué definir el presupuesto del mes siguiente.

```text
Confirma el espacio de trabajo e inspecciona el esquema actual. Usa la acción de lectura
para comparar los ingresos y gastos reales de [período completo] con las líneas de
presupuesto correspondientes. Excluye las transferencias según el tipo de transacción
guardado y muestra por separado los movimientos sin categoría.

Para cada cambio que propongas en el presupuesto, muestra la categoría, el importe actual,
el importe real, el importe propuesto, la diferencia y el motivo. Después, muestra el SQL
exacto y las filas que esperas que resulten afectadas. No escribas hasta que apruebe líneas
concretas.

Tras la aprobación, usa la acción de escritura solo para esas líneas y verifícalas con
una nueva lectura. Informa de cualquier valor guardado que difiera de la propuesta aprobada.
```

Un gasto elevado puede ser algo excepcional. Lo que parece un exceso de gasto quizá sea una transferencia o un reembolso mal clasificados. Claude Code puede calcular las diferencias y preparar el SQL; tú sigues decidiendo los importes del mes siguiente.

## Sigue el mismo orden con cada extracto

Sigue siempre este orden con cada extracto:

1. Empieza en `https://app.expense-budget-tracker.com/api/agent` y sigue el proceso de descubrimiento.
2. Carga el contexto de la cuenta, confirma el espacio de trabajo e inspecciona el esquema actual.
3. Proporciona a Claude Code un archivo de extracto accesible y unos saldos inicial y final explícitos.
4. Lee los datos del registro contable que se solapen con el período y prepara una vista previa completa de la importación.
5. Aprueba un único conjunto de cambios bien definido.
6. Para una inserción larga, ejecuta una prueba de entre 1 y 3 filas y, después, lotes secuenciales de un máximo de 100.
7. Consulta de nuevo cada lote guardado y compáralo con la vista previa.
8. Concilia la cuenta con el saldo final del banco sin usar un asiento de ajuste.
9. Revisa los totales de las categorías aunque la diferencia de saldo sea cero.
10. Prepara, aprueba y verifica por separado cualquier cambio en las líneas de presupuesto.

Empieza con una cuenta y un período cerrado. Cuando el extracto esté reflejado en un registro contable conciliado y en un presupuesto revisado, repite el proceso con la siguiente cuenta. Claude Code se encarga del trabajo repetitivo con los archivos y la API, mientras que todas las decisiones financieras quedan a la vista antes de modificar tus registros.
