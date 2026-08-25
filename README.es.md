<h1 align="center">MAGA</h1>

<p align="center"><strong>Make Apps Great Again</strong></p>

<p align="center">Construye el software que tienes en mente.</p>

<p align="center">
  Para diseñadores de producto, responsables de producto y personas que crean software por primera vez.<br>
  Tú tomas las decisiones de producto. MAGA las convierte en software funcional y verificable.
</p>

<p align="center">
  <a href="https://maga.sumimi.jp/"><strong>Sitio web</strong></a> ·
  <a href="./docs/getting-started.es.md"><strong>Empezar</strong></a> ·
  <a href="./assets/maga-operating-model.svg"><strong>Cómo funciona</strong></a> ·
  <a href="./LICENSE">MIT License</a>
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-CN.md">简体中文</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.ko.md">한국어</a> ·
  <strong>Español</strong>
</p>

<p align="center">
  <a href="https://maga.sumimi.jp/">
    <img src="./website/design/hero-concept.png" alt="El sitio de MAGA muestra el flujo desde la decisión de producto hasta la aceptación" width="100%">
  </a>
</p>

MAGA es un plugin de transición para que la gente de producto empiece a crear con Codex en la aplicación de escritorio de ChatGPT. Describe el usuario, el problema, la experiencia, las restricciones y las decisiones de producto con lenguaje natural. Un Project Lead persistente elige los métodos adecuados y coordina investigación, prototipos, implementación, validación y reparación mientras hace visibles las prácticas que hay detrás.

No necesitas entender código, elegir Skills, gestionar tareas de ingeniería ni revisar código. Aceptas el producto evaluando su comportamiento, su experiencia y su resultado de negocio.

> [!NOTE]
> MAGA no es un constructor visual no-code. El producto sigue teniendo código. Codex se encarga de esa capa de implementación; tú conservas la intención, las prioridades, las restricciones y la aceptación del producto.

## Empieza en dos etapas

No necesitas saber usar una terminal. Si nunca has usado Codex, sigue la **[guía completa para principiantes](./docs/getting-started.es.md)** desde la instalación de la aplicación hasta la aceptación del primer resultado.

### 1. Configura MAGA

1. Abre la [aplicación de escritorio de ChatGPT](https://learn.chatgpt.com/docs/quickstart?setup=app), inicia sesión y elige **Codex**.
2. Crea o abre una carpeta local vacía para el proyecto.
3. Pega este mensaje en Codex:

> Configura este proyecto con el plugin MAGA de https://github.com/thevenomsnake/MAGA. Comprueba e instala los requisitos que falten, inicializa o recupera MAGA en esta carpeta, verifica que funciona y crea o reutiliza una tarea Project Lead con un nombre claro para este producto. Dime el nombre exacto de esa tarea cuando esté lista. Realiza tú los pasos técnicos y pídeme únicamente las autorizaciones que sean realmente necesarias.

Lee cada solicitud de autorización. Durante la configuración, autoriza solo cambios en esta carpeta, la descarga del repositorio MAGA indicado al proyecto o al área de plugins de Codex, y los requisitos que Codex acabe de explicar. El inicio de sesión en GitHub, los ajustes de cuenta o repositorio, los pushes y la escritura en Issues o Pull Requests no forman parte de la configuración. No necesitas copiar comandos en una terminal.

### 2. Empieza el producto

Cuando Codex confirme que ha terminado, abre la **tarea Project Lead que acaba de nombrar** y describe allí el producto. Como otro ejemplo de descripción de producto, puedes escribir:

> Usa MAGA como mi Project Lead. Quiero una herramienta que ayude a diseñadores independientes a organizar comentarios de clientes. Los comentarios deben quedar asociados a cada proyecto y necesito ver qué problemas bloquean la entrega. No sé programar, así que pregunta solo con lenguaje de producto y dame resultados funcionales que pueda inspeccionar.

Eso basta para empezar. MAGA identifica el primer resultado útil y pregunta solo lo que puede cambiar la dirección del producto o el límite de permisos.

## Why MAGA

### ¿Por qué un plugin y no una aplicación envoltorio?

Codex ya realiza trabajo de ingeniería complejo. Puede entender repositorios, escribir y modificar código, ejecutar comprobaciones, revisar cambios, trabajar entre tareas de un proyecto y aplicar Skills reutilizables. La guía oficial de OpenAI describe la misma evolución: proporcionar contexto duradero a Codex, convertir el trabajo repetible en Skills y distribuir capacidades estables como plugins. Consulta las [prácticas recomendadas de Codex](https://learn.chatgpt.com/guides/best-practices), la [documentación de Skills](https://learn.chatgpt.com/docs/build-skills) y la [documentación de plugins](https://developers.openai.com/plugins/).

El propio nombre Codex deja claro su centro de gravedad: el código. Su vocabulario y su modelo de extensión resultan más fáciles de manejar cuando alguien puede formular el trabajo como ingeniería e inspeccionar el resultado técnico.

A la gente de producto se le suele decir que “no entiende la tecnología y solo da órdenes”. De acuerdo: llevemos esa dirección hasta el final. MAGA es el plugin que permite decidir objetivos y compromisos de producto sin freno, mientras Codex se encarga del código.

> **Dirige sin freno. Acepta con criterio.**

No necesitas otra aplicación entre tú y Codex. La empresa que crea tanto el modelo como el cliente está en la mejor posición para mantenerlos alineados, igual que Apple puede ajustar conjuntamente sus chips y sus sistemas operativos: la hoja de ruta, los límites de capacidad, la interfaz y el ciclo de lanzamientos avanzan como una sola pieza. Codex seguirá evolucionando. Una aplicación envoltorio independiente debe perseguir cada nueva capacidad, interacción y modelo de permisos; un plugin permanece dentro del producto nativo, añade solo las prácticas de producto que faltan y se puede desinstalar cuando ya no lo necesites.

MAGA está diseñado deliberadamente como un plugin de transición. Empieza con el lenguaje y las decisiones que la gente de producto ya conoce y va mostrando las prácticas subyacentes: definir resultados, reunir evidencia, establecer restricciones, gestionar compromisos y aceptar software funcional. El objetivo es aumentar tu autonomía, no crear una dependencia permanente. Si algún día puedes trabajar directamente con Codex y necesitas menos MAGA, o ninguno, el plugin habrá cumplido su función.

MAGA existe porque la capacidad del modelo y la colaboración de producto son problemas distintos.

Un Skill convencional suele hacer fiable un trabajo repetible. Una colección de Skills todavía suele asumir que la persona operadora sabe qué trabajo viene después, cómo ordenar los flujos técnicos, qué contexto necesita cada tarea y cómo evaluar un diff de código.

MAGA añade un modelo operativo por encima de esas capacidades:

- Un único Project Lead orientado a producto recibe lenguaje de producto normal.
- El enrutamiento por intención elige Skills y métodos según la evidencia disponible.
- El estado duradero del proyecto conserva decisiones, límites, roles y trabajo autorizado.
- La aceptación de producto sustituye a la revisión de código como interfaz del Product Owner.

<p align="center">
  <img src="./assets/maga-operating-model.svg" alt="Comparación de comportamiento entre Traditional Skills y MAGA en entrada, coordinación, trabajo técnico, aceptación y continuidad" width="100%">
</p>

## Para quién es

| Tu situación | Lo que aportas | Lo que gestiona MAGA |
| --- | --- | --- |
| Creas software por primera vez | El problema, el usuario y la expectativa básica | La aclaración necesaria y el camino hasta un resultado verificable |
| Diseñas productos | Criterios de experiencia, arquitectura de información y decisiones de interacción | Métodos de investigación, prototipado, implementación y validación |
| Eres responsable o manager de producto | Objetivos, prioridades, riesgos, recursos y límites de decisión | Contexto persistente, coordinación de la ejecución y escalado de decisiones reales |

Si ya diriges una línea de producto o un equipo multidisciplinar, MAGA suele resultar más fácil de usar. Ya tienes sus entradas más valiosas: objetivos, prioridades, criterios de experiencia, juicio de riesgo y límites de autoridad. MAGA no exige añadir experiencia en programación a ese rol.

## El contrato de trabajo

| No necesitas | Tú sigues decidiendo |
| --- | --- |
| Escribir, leer o revisar código | A qué usuario y problema sirve el producto |
| Elegir Skills internos o flujos de ingeniería | Qué restricciones de experiencia y negocio no se pueden sacrificar |
| Dividir Tickets, nombrar tareas o gestionar tareas de ingeniería | La prioridad y los compromisos aceptables |
| Elegir frameworks de prueba o arquitectura de implementación | Si el resultado funcional resuelve el problema de producto |

La revisión de código, las pruebas, la depuración y la validación técnica siguen ocurriendo. Se convierten en evidencia de ingeniería gestionada por el Project Lead, no en una segunda profesión impuesta al Product Owner.

## Qué ocurre después de describir un producto

1. **Alinear el resultado.** MAGA identifica el usuario, el problema, el primer valor observable, el formato de entrega y las restricciones materiales.
2. **Elegir la siguiente evidencia.** El Project Lead decide si hacen falta aclaraciones, investigación, un prototipo, implementación, validación o diagnóstico.
3. **Construir la unidad verificable más pequeña.** Codex resuelve las decisiones de implementación y produce algo que se puede ejecutar, ver o comprobar.
4. **Comprobar la ingeniería.** Las pruebas, la revisión focalizada y el diagnóstico establecen si el resultado es técnicamente sólido.
5. **Volver al juicio de producto.** Evalúas el comportamiento y la experiencia, y describes la siguiente decisión con lenguaje de producto.

Por ejemplo:

```text
Esto todavía parece un gestor de tareas. Quiero ver primero qué cambió esta semana
y después poder seguir cada cambio hasta su responsable.
```

Ese comentario cambia la arquitectura de información y el siguiente paso de entrega. No necesitas nombrar un componente ni señalar una línea de código.

## Qué conserva MAGA

1. **Intención:** usuario, problema, resultado esperado y restricciones.
2. **Enrutamiento:** si el siguiente paso es aclarar, investigar, diseñar, implementar, validar o reparar.
3. **Estado:** decisiones aceptadas, preguntas abiertas, trabajo activo y siguiente resultado útil.
4. **Autoridad:** qué acciones están aprobadas y cuáles requieren una decisión nueva.
5. **Evidencia:** prototipos, comportamiento funcional, pruebas, diagnósticos y aceptación de producto.
6. **Diseño:** design records aceptados del producto y del sistema que sobreviven al reemplazo de una tarea.
7. **Continuidad:** subagentes nativos de solo lectura, task dispatch acotado y thread Goals opcionales con condiciones de parada explícitas.

Esta información vive en el proyecto. Una tarea Project Lead nueva o recuperada puede leerla desde el estado duradero, sin convertir el historial de una tarea en el registro del producto.

## Límites de producto y permisos

MAGA puede avanzar trabajo autorizado sin convertir una petición en lenguaje natural en permiso ilimitado.

- El trabajo reversible dentro del proyecto indicado y las comprobaciones proporcionales al riesgo forman parte de la ejecución normal.
- Publicar, pagar, operar cuentas, enviar mensajes externos y borrar de forma irreversible requiere autorización explícita.
- Para una pregunta breve y de solo lectura dentro de un Ticket aprobado, MAGA puede usar hasta dos subagentes nativos. No pueden escribir, hacer commit, crear tareas, publicar ni ampliar el alcance; si el host no los admite, MAGA continúa en la tarea actual o usa un worker con nombre.
- Con una Autonomy Policy confirmada, MAGA puede crear workers con nombre dentro de un Ticket aprobado hasta el worker limit del proyecto y entregarles un context packet acotado. No crea Tickets nuevos ni amplía su alcance automáticamente.
- Un thread Goal solo continúa el objetivo aprobado actual; no autoriza permisos, lanzamientos ni trabajo nuevo.
- Las decisiones de producto que no se pueden deducir de decisiones anteriores vuelven al Product Owner.
- Codex en la aplicación de escritorio de ChatGPT sigue siendo la interfaz; MAGA no crea un panel paralelo.

## Modelos por responsabilidad

MAGA trabaja a la escala de una aplicación completa, pero esa aplicación no tiene por qué ser una plataforma enorme. Coordina todo lo necesario para llevar un producto enfocado desde la intención hasta una primera versión pequeña, completa y funcional. No necesitas aprender los siete nombres siguientes como profesiones ni dirigir siete equipos; son etiquetas internas con las que MAGA divide el trabajo.

### Entender las siete responsabilidades con una primera versión pequeña pero completa

Imagina que quieres crear y lanzar una pequeña aplicación para que una comunidad de aficionados comparta su actividad. Las personas pueden registrarse, añadir un nombre y un perfil breve, publicar actualizaciones cortas, ver las publicaciones recientes de la comunidad en la cronología de inicio y responder. No es una sola función añadida a un producto existente ni un intento de construir de golpe una gran red social: es una primera versión pequeña pero completa, con un ciclo principal real que puede ponerse en manos de usuarios.

- **Project Lead (`project-lead`) — hace avanzar el producto completo:** Convierte tu dirección de producto en un alcance y unos criterios de aceptación claros; por ejemplo, completar el ciclo «registrarse → perfil → publicar → cronología de inicio → responder». Después coordina investigación, prototipo, implementación y validación. Las decisiones que cambian el público o la dirección de la experiencia siguen siendo tuyas.
- **Investigación (`research`) — busca evidencia para las decisiones de producto:** Averigua cómo se comunica hoy la comunidad, dónde falla la experiencia actual y qué esperan realmente sus integrantes de los perfiles, las publicaciones cortas, la cronología de inicio y las respuestas, para no diseñar solo a partir de suposiciones.
- **Prototipo (`prototype`) — permite ver y usar el producto antes de construirlo por completo:** Crea una versión interactiva del registro, el perfil, la publicación, la cronología de inicio y las respuestas para que puedas inspeccionar la información, probar tú mismo la secuencia y decidir si funciona el ciclo principal.
- **Entrega (`delivery`) — convierte la experiencia aceptada en un producto real:** Transforma el prototipo en una aplicación funcional mediante partes pequeñas, de modo que las cuentas, los perfiles, las publicaciones y las respuestas se guarden de verdad y queden conectados correctamente, en lugar de existir solo como pantallas o demostración.
- **Diagnóstico (`diagnosis`) — encuentra el origen de los fallos reales:** Si una publicación nueva no aparece en la cronología de inicio, el contenido desaparece al actualizar o una respuesta aparece en el lugar equivocado, reproduce el comportamiento y aísla la causa real en vez de reconstruir el producto a ciegas.
- **Revisión (`review`) — comprueba de forma independiente la integridad y la fiabilidad:** Recorre todo el camino desde el registro hasta publicar, navegar y responder, contrasta el resultado con tus requisitos y confirma que la información de las cuentas y el contenido de la comunidad respetan límites esenciales de accesibilidad, privacidad y seguridad.
- **Lanzamiento (`release`) — entrega el producto de forma fiable a usuarios reales:** Confirma que la configuración en vivo, las copias de seguridad, la visibilidad operativa y una vía de reversión están listas. Después de que apruebes el lanzamiento, abre el producto al público y verifica que una persona nueva pueda completar todo el recorrido principal.

Cuando configuras modelos, no estás contratando ni gestionando a siete personas. Estás decidiendo cuánta capacidad de juicio y razonamiento puede utilizar cada clase de trabajo entre bastidores. MAGA sigue ocupándose de elegir responsabilidades, dirigir tareas y coordinar el trabajo.

| Responsabilidad | Pro · calidad primero | Plus · uso habitual | Free / Go · ahorrar uso |
| --- | --- | --- | --- |
| Project Lead (`project-lead`) | Sol · xhigh | Sol · xhigh | Terra · xhigh |
| Investigación (`research`) | Sol · max | Sol · max | Terra · max |
| Prototipo (`prototype`) | Sol · xhigh | Terra · high | Terra · high |
| Entrega (`delivery`) | Terra · xhigh | Luna · max | Luna · max |
| Diagnóstico (`diagnosis`) | Sol · max | Terra · xhigh | Terra · high |
| Revisión (`review`) | Sol · xhigh | Sol · high | Terra · high |
| Lanzamiento (`release`) | Sol · xhigh | Sol · high | Sol · high |

Los espacios Business, Enterprise y Edu pueden empezar con Plus y pasar a Pro cuando su asignación y política lo permitan. Quienes usen una API key deben elegir según su presupuesto de tokens. **Sol** cubre ambigüedad, criterio y acabado; **Terra** es el modelo habitual para trabajo acotado que todavía requiere razonamiento y herramientas. **Luna** solo se recomienda en **max** para entregas con un criterio de finalización claro. Cada fila se puede modificar después de aplicar una configuración.

Para cambiar estas opciones, abre la página de detalles del plugin MAGA y elige su starter prompt **Configure**. Se iniciará una tarea de MAGA con un panel de configuración dentro de la propia tarea. El panel no está incrustado en la página de detalles porque las páginas de plugins de Codex todavía no admiten formularios personalizados arbitrarios. La primera vez que pulsas **Save**, se activa la configuración y quedan fijadas las siete responsabilidades como un conjunto completo. Se guarda en el Codex Home actual, fuera del repositorio del producto y de su historial de Git.

La configuración guardada solo se aplica a las tareas nuevas que se creen explícitamente después. Las tareas existentes no cambian. El Project Lead también la adopta únicamente al crear uno nuevo. Para que un Project Lead existente continúe con la configuración nueva, debes pedir explícitamente «retoma el trabajo con la configuración nueva» y aprobar la creación de una tarea de sustitución.

MAGA decide automáticamente qué responsabilidad y configuración corresponden. Si el proyecto tiene una Autonomy Policy confirmada, puede crear workers con nombre dentro de un Ticket aprobado hasta el límite confirmado para ese proyecto y entregarles un context packet acotado. El límite inicial recomendado es dos. Si no existe esa policy, confirma el nombre concreto de la tarea. El `model/list` independiente del panel es solo un catálogo orientativo, no la fuente definitiva del host que ejecutará la tarea. MAGA envía el `model` y el `thinking` que guardaste explícitamente al host de destino de la tarea nueva para que allí se validen. Solo si ese host los rechaza, reintenta una vez sin overrides e informa claramente de que se usaron los valores predeterminados del host. Tampoco sube silenciosamente de modelo porque una tarea parezca difícil.

## Qué incluye

La versión actual es **v0.16.0**. Contiene 19 Skills registrados, coordinación proactiva acotada de tareas, subagentes nativos de solo lectura con recuperación de sus tareas hijas, design records del proyecto, continuación opcional mediante thread Goal, una biblioteca de métodos internos que se carga solo cuando hace falta, un perfil de Bar Tester confirmado por la persona responsable del producto, enrutamiento automático a Humanization para texto legible guardado en archivos locales y protecciones de entrega Git basadas en commits explícitos.

Antes del primer Ticket de software, Bar Tester propone un perfil según el uso actual, la exposición, la forma de entrega y el tamaño del sistema, y la persona responsable del producto lo confirma de una sola vez. Para un prototipo personal, parte de una sola comprobación en la entrada real; solo añade pruebas cuando crecen el público, la exposición, el límite de entrega o un riesgo concreto.

| Capa | Responsabilidad |
| --- | --- |
| Project Lead | Recibe lenguaje de producto, mantiene el estado, elige métodos y coordina tareas |
| Bar Tester | Confirma cómo se usa el producto hoy y elige la prueba mínima suficiente, incluido el límite que una lista de pedidos esperados puede ignorar cuando alguien pide arroz frito |
| Descubrimiento de producto | Aclaración, investigación, lenguaje del dominio, conceptos y priorización |
| Diseño y entrega | Planificación, prototipado, implementación, validación y cierre |
| Project memory | Estado duradero del producto, design records aceptados, autorización de Tickets y punteros de recuperación |
| Humanización de contenido | Artículos, documentos, mensajes y textos de producto o GUI naturales en seis locales |
| Diagnóstico y simplificación | Depuración, revisión de código y eliminación de complejidad innecesaria |
| Biblioteca de métodos | Carga flujos externos bajo demanda para no ocupar todas las tareas |

Humanization usa un límite determinista: el archivo local. Se ejecuta automáticamente solo cuando MAGA escribe o modifica texto legible en un archivo local, como Markdown u otro documento, un informe, artículo, borrador de comunicación guardado, notas de versión o copy visible del producto en archivos de código o recursos. El texto devuelto solo en el chat nunca lo activa automáticamente, sin importar su longitud, formato Markdown, facilidad de copia o posible uso posterior. La invocación explícita sigue disponible y la ejecución automática es silenciosa.

`wait-what` conserva la invocación automática: cuando una persona indica en cualquier idioma que la explicación anterior no se entendió, MAGA la replantea en la conversación actual, añade la premisa que faltaba y usa un lenguaje más claro y el vocabulario del proyecto. También se puede invocar explícitamente con `$wait-what`. Codex puede mostrar un indicador del Skill si el host lo admite, pero la recuperación no depende de ese elemento de interfaz.

Explora la implementación: [Catálogo de Skills](./plugins/maga/skill-catalog.json) · [Project Lead](./plugins/maga/skills/project-lead/SKILL.md) · [Project Lead orientado a producto](./playbooks/product-oriented-project-lead.md)

<details>
<summary><strong>Enrutamiento, tareas y autorización</strong></summary>

### Enrutamiento

El Project Lead identifica primero el tipo de evidencia necesaria y después selecciona un Skill registrado o un método interno. Se puede invocar un Skill explícitamente, pero el trabajo normal de producto no lo exige.

### Límites de tareas

El trabajo permanece en la tarea actual por defecto. Con una Autonomy Policy confirmada, MAGA puede crear workers con nombre dentro del worker limit del proyecto para Tickets aprobados que necesiten ejecución paralela, contexto aislado, permisos distintos o aceptación independiente. Sin esa policy, confirma el nombre concreto. No crea previamente salas vacías de investigación, prototipo, implementación o revisión.

### Autorización

La aprobación en lenguaje natural se aplica a la unidad de producto descrita con claridad. La Autonomy Policy solo puede cubrir la creación de tareas dentro de ese Ticket; no autoriza Tickets posteriores, resultados ampliados ni acciones externas o irreversibles.

Más información: [Enrutamiento de capacidades](./plugins/maga/skills/project-lead/references/capability-routing.md) · [Bucle nativo de Codex](./plugins/maga/skills/project-lead/references/native-codex-loop.md) · [Memoria del proyecto](./plugins/maga/skills/project-lead/references/project-memory.md)

</details>

<details>
<summary><strong>Comportamiento de instalación</strong></summary>

`install` añade o actualiza el marketplace de MAGA e instala `maga@maga`.

`init` acepta un directorio vacío y después:

1. Instala el plugin.
2. Escribe `.ai-workflow/PROJECT.md`, `AGENTS.md` y `.gitignore`.
3. Inicializa Git y crea un primer commit cuando existe una identidad configurada.
4. Crea o reutiliza una tarea Project Lead con un nombre claro.
5. Abre el proyecto en Codex dentro de la aplicación de escritorio de ChatGPT.

`start` lee el estado existente y restaura el Project Lead sin reescribir archivos del proyecto. Estos detalles son para quienes mantienen el proyecto; una persona usuaria puede pedir a Codex que configure, recupere o elimine MAGA.

</details>

## Trabajo externo y licencias

MAGA adapta métodos maduros en revisiones fijas:

- [mattpocock/skills](https://github.com/mattpocock/skills): material de 25 Skills formales de Engineering y Productivity, fijado en `5b15a47`.
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail): implementación mínima, revisión de complejidad y lifecycle Hooks, fijado en `2ed6c52`.
- [thevenomsnake/humanization](https://github.com/thevenomsnake/humanization): prosa y textos de GUI naturales en seis locales, fijado en `c38b5b6` (Humanization `3.0.0`).

El enrutamiento, el estado de proyecto, el instalador y el contrato de Project Lead son adaptaciones de MAGA. Las fuentes, modificaciones y licencias se registran en [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

## Investigación y guías

- [Índice de investigación](./research/README.md)
- [Project Lead orientado a producto](./playbooks/product-oriented-project-lead.md)
- [Colaboración entre múltiples tareas](./playbooks/multi-session-collaboration.md)
- [Orquestación nativa de Tickets en Codex](./playbooks/codex-ticket-orchestration.md)
- [Investigación sobre AI slop](./research/kill-ai-slop.md)

## License

MAGA se publica bajo la [MIT License](./LICENSE). Los materiales de terceros conservan sus licencias respectivas; consulta [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
