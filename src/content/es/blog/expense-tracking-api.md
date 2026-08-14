---
title: "API de seguimiento de gastos en 2026: automatiza transacciones y presupuestos de forma segura"
description: "Guía práctica sobre las API de seguimiento de gastos: modela correctamente transacciones, transferencias, cuentas y presupuestos, y conecta scripts o agentes de IA sin poner en riesgo la integridad de los datos."
date: "2026-08-14"
image: "/blog/expense-tracking-api.png"
keywords:
  - "API de seguimiento de gastos"
  - "API de rastreador de gastos"
  - "API de finanzas personales"
  - "API de presupuestos"
  - "API de transacciones"
  - "API de datos financieros"
  - "API para la gestión de gastos"
  - "API de gestión de gastos"
---

Una API de seguimiento de gastos puede devolver `200 OK` y, aun así, convertir una transferencia de $900 a una cuenta de ahorro en $900 de gasto. La solicitud se procesó correctamente. La contabilidad quedó mal.

Ese es el verdadero reto al automatizar las finanzas personales. Enviar SQL o JSON por HTTPS es una tarea de ingeniería corriente. Lo difícil es preservar el significado de las cuentas, las transferencias, los gastos y los planes presupuestarios: una automatización aparentemente correcta puede estropear la contabilidad sin que nadie lo advierta.

Un cliente seguro necesita algo más que un punto de acceso para escrituras. Debe seguir un orden de trabajo: consultar el contrato vigente, autenticarse, seleccionar el espacio de trabajo correcto, inspeccionar el esquema, leer lo que ya existe, pedir a una persona que apruebe un cambio concreto, hacer una pequeña prueba de escritura, continuar en lotes controlados y conciliar el resultado.

Así se construye ese flujo de trabajo con la API SQL restringida de Expense Budget Tracker.

![Un operario de cambios ferroviarios prueba el paso de un vagón por un desvío antes de que siga un pequeño lote.](/blog/expense-tracking-api.png)

## El modelo de datos determina si una automatización es segura

Empieza por los límites del modelo contable, no por la lista de puntos de acceso.

| Concepto | Qué significa | Un error habitual de automatización |
| --- | --- | --- |
| Cuenta | Dónde se guarda el dinero o se registra una deuda | Tratar el saldo actual como una transacción nueva |
| Apunte del libro mayor | Dinero que realmente se movió | Mezclar importes previstos con gastos reales |
| Transferencia | Movimiento entre tus propias cuentas | Contar el apunte de salida como un gasto |
| Partida presupuestaria | Un plan para una categoría y un periodo | Sustituir el plan por el gasto real y borrar la desviación |
| Espacio de trabajo | El ámbito de datos de una persona o grupo | Escribir datos correctos en la contabilidad equivocada |

Estos errores son fáciles de pasar por alto porque cada fila puede parecer válida por separado. Un pago con tarjeta puede mostrar el nombre habitual del comercio. Ambos lados de una transferencia pueden tener importes correctos. Un presupuesto ajustado para que coincida con el gasto real puede producir un informe impecable. Aun así, el significado contable sigue siendo incorrecto.

La distinción más útil es la que separa los importes reales de los planes:

- Los apuntes del libro mayor registran lo que ocurrió.
- Las partidas presupuestarias registran lo que pretendías gastar o lo que planeas ahora.
- Los informes comparan ambos grupos; una importación no debe mezclarlos.

La [cuadrícula presupuestaria y las funciones de seguimiento de saldos](/es/features/) de Expense Budget Tracker mantienen esta separación. El cliente de la API debe respetarla también.

## Empieza por el contrato vigente

El punto de entrada público es el [documento de descubrimiento de Expense Budget Tracker](https://api.expense-budget-tracker.com/v1/). Describe el flujo de autenticación actual, enlaza la [especificación OpenAPI](https://api.expense-budget-tracker.com/v1/openapi.json) e indica a un script o agente qué llamada debe hacer a continuación.

Toma esas respuestas vigentes como contrato. Una lista de relaciones guardada o un ejemplo de código antiguo pueden quedar obsoletos sin dejar de parecer del todo fiables.

La secuencia de configuración actual es esta:

1. Consulta `GET https://api.expense-budget-tracker.com/v1/`.
2. Envía el correo electrónico del usuario a la `bootstrapUrl` recibida.
3. Pide al usuario el código de 8 dígitos enviado por correo y sigue la acción de verificación recibida.
4. Guarda la ApiKey de larga duración fuera de la memoria del chat.
5. Consulta `/v1/me` y `/v1/workspaces`, y selecciona el espacio de trabajo previsto.
6. Consulta `/v1/schema` con autenticación para ver las relaciones, las columnas, las operaciones permitidas, las restricciones y las indicaciones para agentes disponibles con esa clave.
7. Lee los datos mediante `/v1/sql` antes de proponer cualquier modificación.
8. Ejecuta únicamente el cambio aprobado y vuelve a consultar los datos afectados.

La [referencia de la API](/es/docs/api/) detalla los puntos de acceso, y la [guía de configuración del agente](/es/docs/agent-setup/) explica paso a paso el flujo del código por correo. Si alguna contradice la respuesta actual de descubrimiento o de OpenAPI, prevalece el contrato publicado por el servicio.

### Consulta el servicio y autentícate

El descubrimiento es público:

```bash
curl --fail --silent --show-error \
  https://api.expense-budget-tracker.com/v1/
```

Tras completar la verificación, guarda la clave recibida en un gestor de secretos aprobado o en una variable de entorno local. Utiliza un marcador claramente reconocible en la documentación y los scripts; una clave que parezca real no aporta ninguna ventaja.

```bash
export EXPENSE_BUDGET_TRACKER_API_KEY="<paste-returned-key-here>"
```

Las solicitudes autenticadas utilizan el esquema de autorización completo `ApiKey`:

```bash
curl --fail --silent --show-error \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY" \
  https://api.expense-budget-tracker.com/v1/me
```

### Haz explícita la selección del espacio de trabajo

Obtén los espacios de trabajo disponibles para el titular de la clave, elige el que el usuario haya indicado y guárdalo como predeterminado para esa clave:

```bash
curl --fail --silent --show-error \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY" \
  https://api.expense-budget-tracker.com/v1/workspaces
```

```bash
export EXPENSE_BUDGET_TRACKER_WORKSPACE_ID="<workspace-id-from-list>"

curl --fail --silent --show-error \
  -X POST \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY" \
  "https://api.expense-budget-tracker.com/v1/workspaces/$EXPENSE_BUDGET_TRACKER_WORKSPACE_ID/select"
```

Después de seleccionarlo, las solicitudes posteriores a `/v1/sql` pueden omitir `X-Workspace-Id`. La cabecera sigue disponible para sustituir el espacio de trabajo en una sola solicitud. Trátala como un cambio deliberado, no como una comodidad escondida dentro de una función auxiliar: la forma más fácil de guardar datos correctos en el lugar equivocado es ocultar el contexto del espacio de trabajo.

### Inspecciona el esquema disponible para esta clave

El documento OpenAPI describe el transporte. La respuesta autenticada de `/v1/schema` describe la parte de la base de datos que puede utilizar el espacio de trabajo seleccionado.

```bash
curl --fail --silent --show-error \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY" \
  https://api.expense-budget-tracker.com/v1/schema
```

Lee la respuesta completa antes de generar SQL. Comprueba:

- los nombres exactos de las relaciones y las columnas
- las operaciones permitidas para cada relación
- los campos obligatorios y las restricciones
- las indicaciones sobre transferencias y otras reglas de escritura
- las restricciones de sintaxis y de funciones SQL

La respuesta de descubrimiento actual identifica `ledger_entries`, `budget_lines`, `workspace_settings` y `account_metadata` como relaciones en las que se permite escribir según las reglas de aprobación vigentes. La vista derivada `accounts` y las relaciones de tipos de cambio gestionadas por el proceso en segundo plano son de solo lectura. Esto es importante: para cambiar el saldo de una cuenta hay que modificar los datos correspondientes del libro mayor, no la vista derivada de cuentas.

No copies un `INSERT` de un artículo dando por hecho que sus columnas siguen siendo válidas. Inspeccionar el esquema cuesta menos que reparar una importación que parece convincente, pero es incorrecta.

## Lee suficiente contexto antes de escribir

Un flujo seguro con una **API de finanzas personales** empieza con una pregunta: ¿cuál es el estado real de este espacio de trabajo?

Antes de importar o editar, confirma que:

- la cuenta de destino existe en el espacio de trabajo seleccionado
- su moneda coincide con los datos de origen
- las categorías existentes pueden reutilizarse de forma coherente
- el intervalo de fechas de destino no contiene ya los mismos movimientos
- el periodo presupuestario corresponde a un plan, no a un apunte del libro mayor
- el saldo actual te proporciona un punto de conciliación

Las consultas exactas dependen del esquema actual. Para hacer una comprobación sencilla de la conexión, confirma el nombre de la relación en `/v1/schema` y consulta después la vista derivada de cuentas:

```bash
curl --fail --silent --show-error \
  -X POST \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY" \
  -H "Content-Type: application/json" \
  https://api.expense-budget-tracker.com/v1/sql \
  -d '{"sql":"SELECT * FROM accounts LIMIT 10"}'
```

La respuesta actual contiene una lista `statements` con los campos `rowCount`, `returnedRowCount`, `totalRowCount` y `truncated` para cada sentencia. Revísalos. Que el JSON pueda procesarse no demuestra que hayas recibido el conjunto de resultados completo.

## Mantén las transferencias fuera del total de gastos

Supón que transfieres $900 de una cuenta corriente a una cuenta de ahorro. El dinero salió de una cuenta y llegó a otra, pero el hogar no gastó $900.

Un importador poco fiable ve primero el débito y lo clasifica como gasto destinado al ahorro. Otro registra el cargo y el abono como movimientos independientes, lo que infla la actividad de las cuentas y dificulta la conciliación posterior. Un buen cliente de una **API de transacciones** reconoce la transferencia antes de escribir y utiliza la representación vinculada que describe el esquema actual.

Las transferencias entre monedas distintas exigen el mismo cuidado. Conserva el importe y la moneda registrados en cada lado de la transferencia. No inventes una única cifra convertida que no aparezca en ninguna de las dos cuentas.

Los pagos de tarjetas de crédito son otra trampa habitual. Las compras realizadas con la tarjeta son gastos; pagar la tarjeta mueve dinero entre cuentas. Si cuentas ambos movimientos como gasto, obtendrás un duplicado que puede parecer perfectamente válido.

Por eso una **API para la gestión de gastos** necesita la semántica de un libro mayor. Primero, el cliente debe entender cómo se movió el dinero; después puede categorizarlo.

## Separa los planes presupuestarios de los movimientos reales del libro mayor

Una **API de presupuestos** no debe convertirse en un segundo almacén de transacciones.

Imagina un plan de $500 para supermercado en agosto y compras reales por $620. Lo que interesa ver es una desviación de $120. Si una automatización cambia el plan de agosto a $620 mientras importa las transacciones, borra la decisión original y resta utilidad al informe.

Hay motivos válidos para actualizar un presupuesto: recalcular la previsión de septiembre después de revisar agosto, copiar un plan recurrente a un mes futuro o cambiar una categoría tras una variación de los ingresos. Son decisiones de planificación. Preséntalas por separado y pide una aprobación específica para ellas.

El flujo correcto lee los planes y los importes reales, calcula la diferencia y propone un cambio para un presupuesto futuro. La importación de transacciones no debe modificar un plan como efecto secundario.

## Obtén la aprobación antes de la primera modificación

Antes de pedir a una persona que apruebe una escritura, muéstrale un conjunto de cambios que pueda evaluar de verdad:

- el espacio de trabajo y la cuenta seleccionados
- la relación y el intervalo de fechas afectados
- las filas de origen, los apuntes del libro mayor y los totales esperados
- cómo se tratarán los duplicados y las transferencias
- los cambios presupuestarios, si los hay, separados de los cambios en las transacciones
- las consultas que verificarán el resultado

«Pon en orden mis finanzas» no concreta qué se ha aprobado. «Importa estas 64 filas en la cuenta corriente en EUR del 1 al 31 de julio, empareja cuatro transferencias y no hagas ningún cambio en el presupuesto» define mucho mejor el alcance.

Las instrucciones de descubrimiento actuales exigen que una persona apruebe las modificaciones. Cuando el usuario aprueba ese conjunto de cambios exacto, la aprobación cubre tanto la prueba representativa como los demás lotes secuenciales. Pide una nueva aprobación únicamente si cambia la modificación solicitada, aparece otra ambigüedad o falla la ejecución.

## Comprueba la estructura de la escritura y después usa lotes controlados

El contrato OpenAPI vigente permite que `/v1/sql` reciba una o varias sentencias `SELECT`, `WITH`, `INSERT`, `UPDATE` o `DELETE` separadas por punto y coma. Poder enviar varias sentencias resulta útil, pero no justifica meter una importación completa en una sola solicitud opaca.

Para un `INSERT` largo, prueba primero la misma estructura SQL con entre 1 y 3 filas literales de los datos aprobados. Para un `UPDATE` largo, limita la primera solicitud a una sola fila aprobada. Utiliza filas reales del conjunto de cambios, no registros financieros ficticios que después habría que limpiar.

Esa pequeña prueba responde a una pregunta concreta: ¿aceptan esta estructura de escritura las columnas, los literales y las restricciones actuales? No demuestra que la categorización sea correcta ni que las cuentas cuadren.

Si la prueba funciona, continúa de inmediato con el trabajo ya aprobado, en lotes secuenciales de un máximo de 100 registros por llamada a la herramienta. Si falla, corrige el SQL mientras el conjunto afectado todavía sea pequeño. No amplíes ni alteres el cambio aprobado para hacer desaparecer el error.

El contrato SQL restringido actual también indica que:

- no se admite `ON CONFLICT`
- solo se permiten llamadas a las funciones `SUM`, `COUNT`, `MIN`, `MAX`, `AVG` y `COALESCE`
- las búsquedas sin distinción entre mayúsculas y minúsculas deben usar `ILIKE`
- los filtros de fecha deben usar intervalos explícitos en lugar de funciones de fecha en tiempo de ejecución
- los literales de cadena usan comillas simples normales; las cadenas con delimitadores de dólar están bloqueadas

Consulta esas reglas en el OpenAPI actual y en `/v1/schema` cada vez que desarrolles o actualices un cliente reutilizable. Forman parte de la interfaz, no son detalles casuales de implementación.

El contrato no publica ningún mecanismo de idempotencia para las escrituras. Si una solicitud agota el tiempo de espera o se pierde la respuesta, no la repitas a ciegas. Consulta primero el intervalo de destino y determina si se aplicó la modificación anterior.

## Concilia las cuentas después de cada escritura

Una respuesta HTTP correcta indica que el servidor aceptó la solicitud. La conciliación indica si el resultado financiero también es correcto.

| Automatización | Lee primero | Verifica después |
| --- | --- | --- |
| Importar un extracto | Cuenta, intervalo de fechas, movimientos existentes, saldo inicial | Filas importadas, duplicados, pares de transferencias, saldo final |
| Categorizar apuntes | Categorías existentes y filas de destino | Número de filas modificadas y totales por categoría |
| Actualizar un presupuesto futuro | Plan actual e importes reales recientes | Nuevos valores del plan y separación respecto a los importes reales |
| Crear un informe de gastos | Intervalo de fechas completo y límites de la respuesta | Totales contrastados con otra agregación o con un total de origen conocido |

Al importar un extracto, compara el saldo resultante de la cuenta con el saldo de cierre del extracto. Si no coinciden, detente. Encuentra el movimiento que falta, está duplicado o se clasificó mal antes de añadir otro mes.

Los recuentos también necesitan una explicación. Un archivo de origen con 64 filas no tiene por qué producir 64 apuntes del libro mayor si una transferencia requiere movimientos vinculados entre cuentas. Una diferencia puede ser correcta; el problema es dejarla sin explicar.

Para cada sentencia devuelta por `/v1/sql`, revisa los metadatos de recuento y truncamiento y después vuelve a consultar los registros afectados por separado. La respuesta de una **API de datos financieros** no basta como prueba. El libro mayor, los totales y el documento de origen deben coincidir.

## Elige un script o un agente según los datos de entrada

Un script determinista encaja bien con un formato CSV estable. Un agente de IA resulta útil cuando hace falta criterio para interpretar archivos PDF, capturas de pantalla, descripciones incoherentes de comercios o decisiones de categorización. Ambos deben seguir la misma secuencia de descubrimiento, aprobación y conciliación.

Expense Budget Tracker no se conecta automáticamente al banco. Tú proporcionas un extracto, una exportación, una captura de pantalla u otros datos de origen; el script o el agente trabaja con esa información. La [guía para importar extractos bancarios](/es/blog/how-to-import-bank-statements-into-an-expense-tracker/) y la guía para [presupuestar sin vincular el banco](/es/blog/budget-app-without-bank-linking/) explican ese flujo de trabajo con más detalle.

Para un agente, el descubrimiento resulta especialmente útil: Claude Code, Codex u otra herramienta capaz de hacer solicitudes HTTP puede empezar con una sola URL y seguir las acciones que devuelve el servicio. El usuario sigue proporcionando el código recibido por correo, aprueba las escrituras y mantiene la ApiKey fuera de la memoria del chat.

Consulta la [guía para llevar el control de tus gastos con Claude Code](/es/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code/) para configurar el terminal, o la guía más amplia sobre [seguimiento de gastos y presupuestos con IA](/es/blog/how-to-use-ai-to-track-expenses-and-manage-your-budget/) para conocer el flujo de trabajo. Quienes quieran controlar toda la pila pueden seguir la [guía para autoalojar el rastreador de presupuesto](/es/blog/self-hosted-open-source-budget-tracker-for-developers/).

## Lista de comprobación para la primera automatización

Sigue este orden para una tarea real y acotada:

1. Consulta el documento de descubrimiento y la especificación OpenAPI vigentes.
2. Completa la autenticación mediante código por correo y guarda la ApiKey fuera del chat.
3. Consulta el contexto de la cuenta, obtén la lista de espacios de trabajo y selecciona el previsto.
4. Inspecciona `/v1/schema` con autenticación, incluidas las operaciones y las indicaciones.
5. Lee la cuenta de destino, el intervalo de fechas, las categorías y el contexto presupuestario.
6. Presenta un conjunto de cambios preciso y obtén la aprobación de una persona.
7. Realiza la prueba de escritura necesaria con datos representativos.
8. Continúa el trabajo aprobado en lotes secuenciales de un máximo de 100 registros.
9. Vuelve a consultar los datos afectados y revisa los límites de la respuesta.
10. Concilia los saldos, los recuentos, las transferencias y los totales presupuestarios.

La **API de un rastreador de gastos** se gana la confianza cuando conserva el significado contable y deja las decisiones financieras en manos de quien es dueño de los datos. Empieza por una cuenta y un solo flujo de trabajo. Lee primero, aprueba el cambio exacto y comprueba después que las cuentas cuadren.

Luego automatiza la siguiente parte aburrida.
