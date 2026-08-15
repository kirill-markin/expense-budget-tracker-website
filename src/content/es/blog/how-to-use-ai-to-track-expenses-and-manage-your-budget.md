---
title: "Cómo usar la IA para registrar gastos y gestionar tu presupuesto"
description: "Guía práctica para aplicar la IA a tus finanzas personales. Conecta mediante MCP alojado o la Agent API para procesar extractos, categorizar movimientos, registrar gastos y gestionar tu presupuesto."
date: "2026-03-05"
---

Probablemente ya uses la IA de alguna forma para tus finanzas personales. Puede que pegues un extracto bancario en ChatGPT y le pidas que clasifique tus gastos. O que subas una captura de tu aplicación bancaria y le preguntes a Claude cuánto has gastado este mes en supermercado.

Eso sirve una vez. Pero la respuesta se queda en el chat. No se guarda nada, no se registra nada y la semana siguiente vuelves a hacer lo mismo. La IA analiza tus datos, te da un resumen y luego todo se pierde.

Hay una forma más útil de usar la IA para llevar tus gastos. En vez de pedirle que analice capturas de pantalla, dale acceso real de escritura a tu base de datos financiera. Así podrá registrar movimientos, actualizar tu presupuesto y comprobar saldos directamente, no solo hablar de ellos.

## Cómo es de verdad el seguimiento de gastos con IA

Kirill Markin, creador de [Expense Budget Tracker](https://expense-budget-tracker.com/es/), lleva más de cinco años categorizando cada movimiento personal. Empezó haciéndolo a mano y después fue creando herramientas para acelerar el proceso. El sistema actual usa un agente de IA que se conecta directamente a la base de datos mediante una API SQL.

Su rutina semanal es esta: descarga extractos bancarios en CSV o PDF, los sube a un agente de IA y deja que procese cada movimiento y lo registre. El agente ya conoce sus categorías de gasto gracias a los registros anteriores, así que clasifica bien la mayoría de las transacciones por sí solo. Kirill revisa lo que hizo la IA, corrige los pocos errores y sigue adelante. Todo el proceso le lleva unos 10 minutos, frente a la hora que tardaba cuando lo introducía todo manualmente.

El mismo enfoque funciona con muchas herramientas de IA, como [Claude Code](https://docs.anthropic.com/en/docs/claude-code) y [OpenAI Codex](https://openai.com/index/codex/). Los clientes compatibles con MCP pueden usar el conector alojado con OAuth en el navegador; los agentes de terminal, scripts y otros clientes HTTP pueden usar la Agent API directa con una `ApiKey` de larga duración. Ambas rutas llegan a la misma superficie financiera restringida y aislada por espacio de trabajo.

## Cómo conectar tu agente de IA con tus finanzas

[Expense Budget Tracker](https://expense-budget-tracker.com/es/) es un sistema de finanzas personales de código abierto basado en Postgres. Admite dos formas complementarias de conexión:

1. **Conector MCP alojado.** En un cliente compatible con MCP, añade `https://mcp.expense-budget-tracker.com/mcp` y autoriza el acceso mediante OAuth en el navegador. Después, el cliente usa tokens de acceso OAuth con ámbitos para las herramientas de lectura y de escritura aprobada. El servidor está alojado, así que no necesitas instalar ni mantener un proceso MCP local. Consulta la [guía del conector MCP](/es/docs/mcp-connector/).
2. **Agent API directa.** Para agentes de terminal, scripts y clientes HTTP directos, empieza por `GET https://api.expense-budget-tracker.com/v1/`. La respuesta de descubrimiento guía al agente por la incorporación con OTP por correo electrónico y devuelve una `ApiKey` de larga duración, que se envía como `Authorization: ApiKey <key>`. Las lecturas usan `POST /v1/sql/query`; las escrituras aprobadas, `POST /v1/sql/execute`. La ruta de compatibilidad `POST /v1/sql` queda solo para scripts atómicos con varias instrucciones. Consulta la [referencia de la API](/es/docs/api/).

Con cualquiera de las dos rutas, el agente puede consultar tus datos y enviar cambios aprobados mediante la superficie de escritura dedicada. Una lectura por HTTP directo se ve así:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

La respuesta exitosa es un sobre JSON. `data.statements` contiene una entrada por cada instrucción ejecutada; cada una incluye `rows`, `rowCount`, `returnedRowCount`, `totalRowCount` y `truncated`. `data` también expone el `workspace` seleccionado y el contexto actual de `limits`.

## Qué puede hacer tu agente de IA con este acceso

Una vez conectado, el agente trabaja sobre tus datos reales de gastos y presupuesto: no una copia, ni un resumen, sino la base de datos en vivo.

**Procesar y registrar gastos.** Sube un extracto bancario en CSV o PDF, o incluso una captura de tu aplicación bancaria, al agente. El agente lee cada línea, identifica el importe, la fecha, la contraparte y la categoría, y luego escribe una instrucción `INSERT` en la tabla `ledger_entries`. Cada gasto entra directamente en tu base de datos.

**Clasificar movimientos con tus categorías actuales.** El agente empieza consultando qué categorías ya usas. Si llevas meses clasificando "Whole Foods" como "supermercado", la IA lo detecta y hace lo mismo. No tienes que volver a explicarle tu sistema cada vez.

**Comprobar saldos de cuentas.** Después de registrar todos los gastos de un extracto, el agente puede consultar la vista `accounts` y comparar los totales con los datos de tu banco. Si algo no cuadra, sabrás que falta una transacción.

**Actualizar tu previsión presupuestaria.** La tabla `budget_lines` contiene tu plan mensual: ingresos esperados y gastos previstos por categoría. El agente puede leer los datos reales de este mes, compararlos con el plan y sugerir, o incluso aplicar, ajustes para el mes siguiente.

**Trabajar con varias divisas.** Cada transacción en la base de datos se mantiene en su moneda original. Los tipos de cambio se obtienen cada día del BCE, del CBR y del NBS. La IA no necesita convertir nada: la base de datos resuelve los cálculos de divisa en el momento de la consulta.

El esquema está diseñado para ser plano y sencillo. Siete tablas, nombres de columna claros y ninguna estructura profundamente anidada. Los modelos de IA suelen generar consultas SQL correctas a la primera porque aquí hay muy poco margen para malinterpretar.

## Asistente de IA integrado para tareas rápidas

Expense Budget Tracker también incluye un asistente de IA dentro de la interfaz web. Conectas tu clave de API de OpenAI o Anthropic en Configuración y el chat obtiene una herramienta llamada `query_database`: el mismo acceso SQL, pero desde dentro de la aplicación.

Esto resulta muy cómodo para tareas rápidas: subes una captura de un recibo, le pides a la IA que lo añada como gasto, confirmas y listo. El asistente integrado sigue un protocolo estricto: revisa tus categorías actuales, busca transacciones duplicadas, comprueba saldos y solo escribe en la base de datos después de tu aprobación.

Para tareas más grandes, como procesar por lotes varios extractos bancarios, montar flujos de trabajo automatizados o integrarlo con otros sistemas, la API SQL externa es más práctica. Puedes usarla desde cualquier agente o script fuera de la aplicación.

## Por qué MCP alojado y SQL directo son complementarios

El servidor MCP alojado es la ruta pensada para conectores en clientes que hablan ese protocolo. Añades un único endpoint HTTPS, autorizas mediante OAuth en el navegador y usas herramientas separadas de lectura y escritura. Expense Budget Tracker ejecuta el servicio remoto, por lo que MCP no requiere ningún proceso en tu ordenador.

La Agent API directa es la ruta HTTP general para agentes de terminal, scripts, tareas cron, paneles y aplicaciones personalizadas. Su flujo de descubrimiento y OTP entrega una `ApiKey` de larga duración, y los endpoints SQL separados hacen explícito el límite entre lectura y escritura.

Son dos transportes sobre la misma superficie de datos restringida y aislada por espacio de trabajo, no arquitecturas rivales. Elige MCP cuando tu cliente admita conectores remotos y OAuth en el navegador; elige la Agent API cuando encaje mejor el HTTP directo.

## ¿Es seguro dar acceso directo a la base de datos a la IA?

Sí, siempre que existan límites adecuados. La API SQL de Expense Budget Tracker aplica varias capas de protección:

Cada consulta se ejecuta con seguridad a nivel de fila de Postgres. La clave de API está vinculada a tu usuario y a tu espacio de trabajo, así que la IA solo puede ver y modificar tus datos de gastos, no los de nadie más.

Solo se permiten operaciones sobre datos: `SELECT`, `INSERT`, `UPDATE` y `DELETE`. El agente no puede crear tablas, eliminar estructuras ni cambiar permisos. Los endpoints principales de consulta y ejecución aceptan una sola instrucción; la ruta de compatibilidad `/v1/sql` solo acepta scripts atómicos restringidos. También se bloquea `set_config()` para evitar escaladas de privilegios.

Las claves de API se almacenan como hashes SHA-256: el valor en texto plano nunca queda guardado en la base de datos. Puedes revocar una clave al instante desde Configuración. Si eliminas a una persona del espacio de trabajo, todas sus claves se borran automáticamente.

Además, hay límites de uso: 10 solicitudes por segundo y 10.000 al día por clave. Cada solicitud SQL tiene un plazo total de 25 segundos, devuelve como máximo 100 filas y puede afectar como máximo a 100 filas. Son cifras más que suficientes para registrar gastos y gestionar presupuestos con IA, pero sirven para frenar cualquier comportamiento descontrolado.

## Consejos prácticos para llevar gastos con IA

Algunas ideas que hacen más fluido este flujo de trabajo, basadas en el uso diario real:

**Mantén tus categorías de gasto consistentes.** La IA aprende de los datos que ya tienes. Si unas veces llamas a algo "restaurantes" y otras "comer fuera", el agente se confundirá. Elige un nombre por categoría y úsalo siempre.

**Comprueba los saldos cada semana.** Después de que la IA registre tus gastos a partir de un extracto, comprueba que el saldo de la cuenta en el sistema coincida con el de tu banco. Así detectas pronto movimientos perdidos o duplicados, antes de que el problema se acumule.

**Empieza con una sola cuenta.** No intentes configurar todas tus cuentas bancarias, tarjetas y cuentas de inversión el primer día. Empieza por tu cuenta principal. Deja que la IA se encargue de esa durante unas semanas. Añade más cuentas cuando el flujo ya te resulte sólido.

**Revisa siempre la categorización de la IA.** La mayoría de las transacciones quedarán bien clasificadas, pero de vez en cuando habrá errores, sobre todo con comercios nuevos o gastos poco habituales. Dedica cinco minutos a revisar. Corregir esos fallos mejora la precisión futura, porque la próxima vez que consulte tus categorías verá los datos corregidos.

**Usa la tabla de presupuesto, no solo el registro de gastos.** Registrar lo que ya has gastado es útil, pero se queda corto. El valor real está en mantener un presupuesto móvil de 12 meses: las filas son categorías, las columnas son meses y los meses futuros contienen tu previsión. Los agentes de IA son buenos actualizando esas previsiones a partir de patrones reales de gasto. Pídele al agente que ajuste el presupuesto del próximo mes después de revisar los datos reales de este mes.

## Primeros pasos

1. Regístrate en [expense-budget-tracker.com](https://expense-budget-tracker.com/es/) (gratis y de código abierto) o [aloja la aplicación por tu cuenta](https://github.com/kirill-markin/expense-budget-tracker)
2. Para MCP, añade `https://mcp.expense-budget-tracker.com/mcp` en un cliente compatible y autoriza mediante OAuth en el navegador
3. Para HTTP directo, dale al agente `GET https://api.expense-budget-tracker.com/v1/` y completa el flujo de OTP por correo cuando te lo pida
4. Sube un extracto bancario al agente conectado y pídele que procese y registre tus gastos

La IA descubrirá el esquema de tu base de datos, entenderá tus categorías de gasto y empezará a registrar movimientos. Revisa lo que haya guardado, corrige cualquier desajuste y tendrás un presupuesto gestionado con IA en marcha.

Kirill Markin explicó su metodología personal con detalle en este artículo: [How I Use AI to Handle My Expenses from Bank Accounts and Budget](https://kirill-markin.com/articles/ai-expense-tracking-bank-accounts-budget/). Son cinco años registrando y categorizando cada movimiento: el mismo enfoque descrito aquí, probado con dinero real, varias divisas y varios países.

La herramienta tiene licencia MIT y es completamente de código abierto en [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker). Puedes usar la versión alojada o ejecutarla por tu cuenta: la API SQL funciona igual en ambos casos.
