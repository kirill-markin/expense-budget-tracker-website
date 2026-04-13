---
title: "Cómo usar la IA para registrar gastos y gestionar tu presupuesto"
description: "Guía práctica para aplicar la IA a tus finanzas personales. Dale a tu agente una clave de API y podrá procesar extractos bancarios, categorizar movimientos, registrar gastos y ayudarte con el presupuesto a través de una API SQL."
date: "2026-03-05"
---

Probablemente ya uses la IA de alguna forma para tus finanzas personales. Puede que pegues un extracto bancario en ChatGPT y le pidas que clasifique tus gastos. O que subas una captura de tu aplicación bancaria y le preguntes a Claude cuánto has gastado este mes en supermercado.

Eso sirve una vez. Pero la respuesta se queda en el chat. No se guarda nada, no se registra nada y la semana siguiente vuelves a hacer lo mismo. La IA analiza tus datos, te da un resumen y luego todo se pierde.

Hay una forma más útil de usar la IA para llevar tus gastos. En vez de pedirle que analice capturas de pantalla, dale acceso real de escritura a tu base de datos financiera. Así podrá registrar movimientos, actualizar tu presupuesto y comprobar saldos directamente, no solo hablar de ellos.

## Cómo es de verdad el seguimiento de gastos con IA

Kirill Markin, creador de [Expense Budget Tracker](https://expense-budget-tracker.com/es/), lleva más de cinco años categorizando cada movimiento personal. Empezó haciéndolo a mano y después fue creando herramientas para acelerar el proceso. El sistema actual usa un agente de IA que se conecta directamente a la base de datos mediante una API SQL.

Su rutina semanal es esta: descarga extractos bancarios en CSV o PDF, los sube a un agente de IA y deja que procese cada movimiento y lo registre. El agente ya conoce sus categorías de gasto gracias a los registros anteriores, así que clasifica bien la mayoría de las transacciones por sí solo. Kirill revisa lo que hizo la IA, corrige los pocos errores y sigue adelante. Todo el proceso le lleva unos 10 minutos, frente a la hora que tardaba cuando lo introducía todo manualmente.

El mismo enfoque funciona con [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [OpenAI Codex](https://openai.com/index/codex/), GPT personalizados o cualquier agente de IA capaz de hacer peticiones HTTP. La clave está en el acceso directo a la base de datos: no un complemento, ni una extensión del navegador, sino una clave de API que permita a la IA leer y escribir tus datos financieros.

## Cómo conectar tu agente de IA con tus finanzas

[Expense Budget Tracker](https://expense-budget-tracker.com/es/) es un sistema de finanzas personales de código abierto basado en Postgres. Tiene un punto de acceso SQL en `POST /v1/sql` que acepta consultas SQL por HTTP y devuelve resultados en JSON.

Para conectar cualquier agente de IA:

1. Abre la aplicación y ve a **Configuración → Claves de API → Crear clave**
2. Copia la clave (empieza por `ebt_` y solo podrás verla una vez)
3. Dale a tu agente de IA dos datos: la URL del punto de acceso y la clave

Y ya está. El agente puede consultar y modificar tus datos de gastos. No hay que levantar ningún servidor MCP. No hay complementos que instalar. No hay integraciones a medida que mantener. Cualquier IA que pueda hacer una petición HTTP POST, es decir, prácticamente todas, funciona desde el primer momento.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

La respuesta vuelve como una lista JSON de filas. Sin cursores de paginación, sin objetos anidados y sin SDK.

## Qué puede hacer tu agente de IA con este acceso

Con la clave de API, el agente trabaja sobre tus datos reales de gastos y presupuesto: no una copia, ni un resumen, sino la base de datos en vivo.

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

## Por qué el SQL directo es mejor que los servidores MCP y los complementos

Los servidores MCP, las acciones personalizadas de GPT y los complementos específicos de cada proveedor están de moda para conectar la IA con herramientas externas. En finanzas personales añaden complejidad innecesaria.

Un servidor MCP es un proceso adicional que tienes que arrancar y mantener funcionando. Si falla, la IA pierde el acceso a tus datos de gastos en mitad de la conversación. Los complementos personalizados de GPT solo funcionan con ChatGPT; no te sirven si cambias a Claude o si montas tu propio agente. Las integraciones específicas de cada proveedor se rompen cada vez que ese proveedor actualiza su API.

Una API SQL evita todo eso. La interfaz se reduce a un punto de acceso HTTP y al lenguaje SQL. Ambos llevan décadas existiendo y no van a desaparecer. Puedes pasar de un modelo de IA a otro y seguir usando la misma clave de API, el mismo punto de acceso y el mismo SQL. Al agente le da igual si se ejecuta dentro de ChatGPT, Claude Code o un script de Python escrito por ti.

## ¿Es seguro dar acceso directo a la base de datos a la IA?

Sí, siempre que existan límites adecuados. La API SQL de Expense Budget Tracker aplica varias capas de protección:

Cada consulta se ejecuta con seguridad a nivel de fila de Postgres. La clave de API está vinculada a tu usuario y a tu espacio de trabajo, así que la IA solo puede ver y modificar tus datos de gastos, no los de nadie más.

Solo se permiten operaciones sobre datos: `SELECT`, `INSERT`, `UPDATE` y `DELETE`. El agente no puede crear tablas, eliminar estructuras ni cambiar permisos. También se bloquean varias sentencias en una sola petición y el uso de `set_config()`, lo que evita escaladas de privilegios.

Las claves de API se almacenan como hashes SHA-256: el valor en texto plano nunca queda guardado en la base de datos. Puedes revocar una clave al instante desde Configuración. Si eliminas a una persona del espacio de trabajo, todas sus claves se borran automáticamente.

Además, hay límites de uso: 10 solicitudes por segundo y 10.000 al día por clave. Las consultas caducan a los 30 segundos. Las respuestas devuelven como máximo 100 filas. Son cifras más que suficientes para registrar gastos y gestionar presupuestos con IA, pero sirven para frenar cualquier comportamiento descontrolado.

## Consejos prácticos para llevar gastos con IA

Algunas ideas que hacen más fluido este flujo de trabajo, basadas en el uso diario real:

**Mantén tus categorías de gasto consistentes.** La IA aprende de los datos que ya tienes. Si unas veces llamas a algo "restaurantes" y otras "comer fuera", el agente se confundirá. Elige un nombre por categoría y úsalo siempre.

**Comprueba los saldos cada semana.** Después de que la IA registre tus gastos a partir de un extracto, comprueba que el saldo de la cuenta en el sistema coincida con el de tu banco. Así detectas pronto movimientos perdidos o duplicados, antes de que el problema se acumule.

**Empieza con una sola cuenta.** No intentes configurar todas tus cuentas bancarias, tarjetas y cuentas de inversión el primer día. Empieza por tu cuenta principal. Deja que la IA se encargue de esa durante unas semanas. Añade más cuentas cuando el flujo ya te resulte sólido.

**Revisa siempre la categorización de la IA.** La mayoría de las transacciones quedarán bien clasificadas, pero de vez en cuando habrá errores, sobre todo con comercios nuevos o gastos poco habituales. Dedica cinco minutos a revisar. Corregir esos fallos mejora la precisión futura, porque la próxima vez que consulte tus categorías verá los datos corregidos.

**Usa la tabla de presupuesto, no solo el registro de gastos.** Registrar lo que ya has gastado es útil, pero se queda corto. El valor real está en mantener un presupuesto móvil de 12 meses: las filas son categorías, las columnas son meses y los meses futuros contienen tu previsión. Los agentes de IA son buenos actualizando esas previsiones a partir de patrones reales de gasto. Pídele al agente que ajuste el presupuesto del próximo mes después de revisar los datos reales de este mes.

## Primeros pasos

1. Regístrate en [expense-budget-tracker.com](https://expense-budget-tracker.com/es/) (gratis y de código abierto) o [aloja la aplicación por tu cuenta](https://github.com/kirill-markin/expense-budget-tracker)
2. Ve a **Configuración → Claves de API → Crear clave** y copia la clave
3. Dale al agente la clave, el ID del espacio de trabajo y el punto de acceso `https://api.expense-budget-tracker.com/v1/sql`
4. Sube un extracto bancario al agente y pídele que procese y registre tus gastos

La IA descubrirá el esquema de tu base de datos, entenderá tus categorías de gasto y empezará a registrar movimientos. Revisa lo que haya guardado, corrige cualquier desajuste y tendrás un presupuesto gestionado con IA en marcha.

Kirill Markin explicó su metodología personal con detalle en este artículo: [How I Use AI to Handle My Expenses from Bank Accounts and Budget](https://kirill-markin.com/articles/ai-expense-tracking-bank-accounts-budget/). Son cinco años registrando y categorizando cada movimiento: el mismo enfoque descrito aquí, probado con dinero real, varias divisas y varios países.

La herramienta tiene licencia MIT y es completamente de código abierto en [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker). Puedes usar la versión alojada o ejecutarla por tu cuenta: la API SQL funciona igual en ambos casos.
