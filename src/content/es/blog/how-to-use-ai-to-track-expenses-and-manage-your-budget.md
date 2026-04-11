---
title: "Cómo utilizar la IA para realizar un seguimiento de los gastos y gestionar su presupuesto"
description: "Una guía práctica para las finanzas personales impulsadas por la IA. Proporcione a su agente de IA una clave API y este analizará extractos bancarios, categorizará transacciones, rastreará gastos y administrará su presupuesto, todo a través de una API SQL."
date: "2026-03-05"
---

Probablemente ya utilices la IA de alguna forma para tus finanzas personales. Tal vez pegue un extracto bancario en ChatGPT y le pida que clasifique sus gastos. O toma una captura de pantalla de tu aplicación bancaria y le pides a Claude que cuente cuánto gastaste en comestibles este mes.

Eso funciona una vez. Pero la respuesta se queda en el chat. No se guarda nada, no se rastrea nada y la semana que viene vuelves a hacer lo mismo. La IA lee sus datos, le brinda un resumen y luego desaparece.

Existe una forma más útil de utilizar la IA para el seguimiento de gastos. En lugar de pedirle a la IA que analice capturas de pantalla, bríndele acceso de escritura real a su base de datos financiera. Deje que la IA registre transacciones, actualice su presupuesto y verifique los saldos directamente, no solo hable de ellos.

## Cómo se ve realmente en la práctica el "seguimiento de gastos de IA"

Kirill Markin, el creador de [Expense Budget Tracker](https://expense-budget-tracker.com/es/), ha estado categorizando cada transacción personal durante más de cinco años. Comenzó a hacerlo a mano y luego comenzó a crear herramientas para hacerlo más rápido. El sistema actual utiliza un agente de inteligencia artificial que se conecta directamente a la base de datos a través de una API SQL.

Su rutina semanal es la siguiente: descargar extractos bancarios (CSV o PDF), colocarlos en un agente de inteligencia artificial, dejar que el agente analice cada transacción y la registre. El agente ya conoce sus categorías de gastos a partir de entradas anteriores, por lo que relaciona correctamente la mayoría de las transacciones por sí solo. Kirill revisa lo que hizo la IA, corrige algunos errores y sigue adelante. Todo el proceso lleva unos 10 minutos, en comparación con una hora cuando ingresaba todo manualmente.

El mismo enfoque funciona con [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [OpenAI Codex](https://openai.com/index/codex/), GPT personalizados o cualquier agente de IA que pueda llamar a puntos finales HTTP. El ingrediente clave es el acceso directo a la base de datos: no un complemento, ni una extensión del navegador, sino una clave API que permite a la IA leer y escribir sus datos financieros.

## Cómo conectar tu agente de IA con tus finanzas

[Expense Budget Tracker](https://expense-budget-tracker.com/es/) es un sistema de finanzas personales de código abierto construido sobre Postgres. Tiene un punto final API SQL en `POST /v1/sql` que acepta consultas SQL a través de HTTP y devuelve resultados JSON.

Para conectar cualquier agente de IA:

1. Abra la aplicación y vaya a **Configuración → Claves API → Crear clave**
2. Copie la clave (comienza con `ebt_` y solo la verá una vez)
3. Dígale a su agente de IA dos cosas: la URL del punto final de la API y la clave

Eso es todo. El agente ahora puede consultar y modificar sus datos de gastos. No hay servidor MCP para ejecutar. No hay complementos para instalar. No hay integración personalizada que mantener. Cualquier IA que pueda realizar una solicitud HTTP POST, que son todas, funciona de inmediato.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

La respuesta regresa como una matriz JSON de filas. Sin tokens de paginación, sin objetos anidados, sin SDK.

## Qué puede hacer su agente de IA con este acceso

Con la clave API, el agente de IA opera con sus datos reales de gastos y presupuesto, no una copia, ni un resumen, sino la base de datos en vivo:

**Analice y registre los gastos.** Introduzca un extracto bancario (CSV, PDF o una captura de pantalla de su aplicación bancaria) en su agente de IA. El agente lee cada línea, calcula el monto, la fecha, la contraparte y la categoría, luego escribe una instrucción INSERT en la tabla `ledger_entries`. Cada gasto va directamente a tu base de datos.

**Clasifique las transacciones utilizando sus categorías existentes.** El agente comienza consultando qué categorías ya utiliza. Si ha estado clasificando "alimentos integrales" como "comestibles" durante meses, la IA lo detecta y hace lo mismo. No es necesario volver a explicar su sistema cada vez.

**Verifique los saldos de las cuentas.** Después de registrar todos los gastos de un extracto bancario, el agente puede consultar la vista `accounts` y comparar los totales con los números de su banco. Si algo no cuadra, sabrá que falta una transacción.

**Actualice su previsión presupuestaria.** La tabla `budget_lines` contiene su plan presupuestario mensual: ingresos esperados y gastos planificados por categoría. El agente de IA puede leer los datos reales de este mes, compararlos con el plan y sugerir (o realizar directamente) ajustes para el próximo mes.

**Trabaja con múltiples monedas.** Cada transacción en la base de datos permanece en su moneda original. Los tipos de cambio se obtienen diariamente del BCE, CBR y NBS. La IA no necesita convertir nada: la base de datos maneja las matemáticas monetarias en el momento de la consulta.

El esquema es intencionalmente plano y simple. Siete tablas, nombres de columnas claros, sin estructuras profundamente anidadas. Los modelos de IA producen declaraciones SQL correctas contra este esquema en el primer intento porque no hay casi nada que malinterpretar.

## Chat AI integrado para tareas rápidas

Expense Budget Tracker también tiene un asistente de IA integrado en la interfaz web. Conecta su clave OpenAI o Anthropic API en Configuración y el chat obtiene una herramienta `query_database`: el mismo acceso SQL, pero desde dentro de la aplicación.

Esto es conveniente para cosas rápidas: cargue una captura de pantalla de un recibo, pídale a la IA que lo agregue como gasto, confirme y listo. La IA integrada sigue un protocolo estricto: verifica sus categorías existentes, busca transacciones duplicadas, verifica saldos y solo escribe en la base de datos después de su aprobación.

Para tareas más grandes (procesamiento por lotes de múltiples extractos bancarios, creación de flujos de trabajo automatizados e integración con otros sistemas), la API externa SQL es más práctica. Puedes usarlo desde cualquier agente o script fuera de la aplicación.

## Por qué el SQL directo es mejor que los servidores y complementos MCP

Los servidores MCP, las acciones GPT personalizadas y los complementos específicos de proveedores son populares en este momento para conectar la IA a herramientas externas. Para las finanzas personales, introducen piezas móviles innecesarias.

Un servidor MCP es un proceso adicional que debes ejecutar y mantener activo. Si falla, la IA pierde el acceso a sus datos de gastos en mitad de la conversación. Los complementos GPT personalizados solo funcionan con ChatGPT; no te ayudarán si cambias a Claude o creas tu propio agente. Las integraciones específicas del proveedor se interrumpen cada vez que el proveedor actualiza su API.

Una API SQL evita todo esto. La interfaz es un punto final HTTP y el lenguaje SQL. Ambos han existido durante décadas y no van a ninguna parte. Cambie de un modelo de IA a otro: la misma clave API, el mismo punto final, el mismo SQL. Al agente de IA no le importa si se ejecuta dentro de ChatGPT, Claude Code o un script de Python que usted mismo escribió.

## ¿Es seguro dar acceso directo a la base de datos a la IA?

Sí, dentro de las limitaciones adecuadas. La API SQL en Expense Budget Tracker aplica varias capas de protección:

Cada consulta se ejecuta a través de la seguridad de nivel de fila Postgres. La clave API está vinculada a su usuario y espacio de trabajo: la IA solo puede ver y modificar sus datos de gastos, los de nadie más.

Sólo se permiten operaciones de datos: SELECCIONAR, INSERTAR, ACTUALIZAR, ELIMINAR. El agente de IA no puede crear tablas, eliminar nada ni cambiar permisos. Se bloquean varias declaraciones en una sola solicitud. También lo es `set_config()`, que evita la escalada de privilegios.

Las claves API se almacenan como hashes SHA-256: el texto sin formato nunca permanece en la base de datos. Puede revocar una clave instantáneamente desde Configuración. Si eliminas a un miembro del espacio de trabajo, todas sus claves se eliminan automáticamente.

La tarifa limita el uso del límite a 10 solicitudes por segundo y 10 000 por día por clave. Las consultas expiran después de 30 segundos. Las respuestas devuelven como máximo 100 filas. Estas cifras son más que suficientes para el seguimiento de gastos y la elaboración de presupuestos con IA, pero evitan cualquier comportamiento descontrolado.

## Consejos prácticos para el seguimiento de gastos impulsado por IA

Algunas cosas que hacen que el flujo de trabajo de seguimiento de gastos de IA sea más fluido, basado en el uso diario real:

**Mantenga sus categorías de gastos consistentes.** La IA aprende de sus datos existentes. Si a veces lo llama "restaurantes" y otras veces "salir a cenar", el agente se confundirá. Elija un nombre por categoría y manténgalo.

**Verifique los saldos cada semana.** Después de que la IA registre sus gastos a partir de un extracto bancario, verifique que el saldo de la cuenta en el sistema coincida con su banco. Esto detecta temprano las transacciones perdidas o duplicadas, antes de que se acumulen.

**Comience con una cuenta.** No intente configurar todas sus cuentas bancarias, tarjetas de crédito y cuentas de inversión el primer día. Comience con su cuenta corriente principal. Deje que la IA se encargue de eso durante algunas semanas. Agregue más cuentas una vez que el flujo de trabajo se sienta sólido.

**Revise la categorización de la IA cada vez.** La IA realiza correctamente la mayoría de las transacciones, pero en ocasiones categoriza incorrectamente algo, especialmente nuevos comerciantes o gastos inusuales. Dedique cinco minutos a revisar. Corregir los errores de la IA mejora la precisión futura, porque la próxima vez que consulte sus categorías, los datos corregidos son los que ve.

**Utilice la tabla de presupuesto, no solo el seguimiento de gastos.** Registrar lo que ya gastó es útil pero limitado. El valor real está en mantener un presupuesto móvil de 12 meses: las filas son categorías, las columnas son meses y los meses futuros contienen su pronóstico. Los agentes de IA son buenos para actualizar estos pronósticos en función de patrones de gasto reales. Pídale al agente que ajuste el presupuesto del próximo mes después de revisar los datos reales de este mes.

## Primeros pasos

1. Regístrese en [expense-budget-tracker.com](https://expense-budget-tracker.com/es/) (gratuito, de código abierto) o [self-host](https://github.com/kirill-markin/expense-budget-tracker) la aplicación en su propio servidor
2. Vaya a **Configuración → Claves API → Crear clave** y copie la clave.
3. Proporcione la clave, el ID del espacio de trabajo y el punto final (`https://api.expense-budget-tracker.com/v1/sql`) a su agente de IA.
4. Envíe un extracto bancario al agente y pídale que analice y registre sus gastos.

La IA descubrirá el esquema de su base de datos, comparará sus categorías de gastos y comenzará a escribir transacciones. Revise lo que registró, arregle cualquier cosa y tendrá un presupuesto administrado por IA en ejecución.

Kirill Markin escribió en detalle sobre su metodología personal: [Cómo uso la IA para manejar mis gastos de cuentas bancarias y presupuesto](https://kirill-markin.com/articles/ai-expense-tracking-bank-accounts-budget/). Cinco años de cada transacción categorizada y rastreada: el mismo enfoque descrito en este artículo, probado en batalla con dinero real en múltiples monedas y países.

La herramienta tiene licencia del MIT y es de código abierto en [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker). Utilice la versión alojada o ejecútela usted mismo; la API SQL funciona igual de cualquier manera.
