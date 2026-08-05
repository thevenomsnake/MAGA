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

No necesitas entender código, elegir Skills, gestionar sesiones de ingeniería ni revisar código. Aceptas el producto evaluando su comportamiento, su experiencia y su resultado de negocio.

> [!NOTE]
> MAGA no es un constructor visual no-code. El producto sigue teniendo código. Codex se encarga de esa capa de implementación; tú conservas la intención, las prioridades, las restricciones y la aceptación del producto.

## Empieza aquí

No necesitas saber usar una terminal. Si nunca has usado Codex, sigue la **[guía completa para principiantes](./docs/getting-started.es.md)** desde la instalación de la aplicación hasta la aceptación del primer resultado.

1. Abre la [aplicación de escritorio de ChatGPT](https://learn.chatgpt.com/docs/quickstart?setup=app), inicia sesión y elige **Codex**.
2. Crea o abre una carpeta local vacía para el proyecto.
3. Pega este mensaje en Codex:

> Configura este proyecto con el plugin MAGA de https://github.com/thevenomsnake/MAGA. Comprueba e instala los requisitos que falten, inicializa MAGA en esta carpeta, verifica que funciona y dime cuándo debo iniciar un chat nuevo. Realiza tú los pasos técnicos y pídeme únicamente las autorizaciones que sean realmente necesarias.

Lee cada solicitud de autorización y acéptala solo si se refiere a esta carpeta, a GitHub o a un requisito que Codex acaba de explicar. No necesitas copiar comandos en una terminal.

Cuando Codex confirme que ha terminado, inicia un **chat nuevo en el mismo proyecto** y describe el producto:

> Usa MAGA como mi Project Lead. Quiero una herramienta que ayude a diseñadores independientes a organizar comentarios de clientes. Los comentarios deben quedar asociados a cada proyecto y necesito ver qué problemas bloquean la entrega. No sé programar, así que pregunta solo con lenguaje de producto y dame resultados funcionales que pueda inspeccionar.

Eso basta para empezar. MAGA identifica el primer resultado útil y pregunta solo lo que puede cambiar la dirección del producto o el límite de permisos.

## Why MAGA

### ¿Por qué un plugin y no una aplicación envoltorio?

Codex ya realiza trabajo de ingeniería complejo. Puede entender repositorios, escribir y modificar código, ejecutar comprobaciones, revisar cambios, trabajar entre conversaciones de un proyecto y aplicar Skills reutilizables. La guía oficial de OpenAI describe la misma evolución: proporcionar contexto duradero a Codex, convertir el trabajo repetible en Skills y distribuir capacidades estables como plugins. Consulta las [prácticas recomendadas de Codex](https://learn.chatgpt.com/guides/best-practices), la [documentación de Skills](https://learn.chatgpt.com/docs/build-skills) y la [documentación de plugins](https://developers.openai.com/plugins/).

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
| Dividir Tickets, nombrar tareas o gestionar sesiones | La prioridad y los compromisos aceptables |
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

Esta información vive en el proyecto. Una conversación nueva puede recuperarla desde el estado duradero, sin convertir la transcripción en el registro del producto.

## Límites de producto y permisos

MAGA puede avanzar trabajo autorizado sin convertir una petición en lenguaje natural en permiso ilimitado.

- El trabajo reversible dentro del proyecto indicado y las comprobaciones proporcionales al riesgo forman parte de la ejecución normal.
- Publicar, pagar, operar cuentas, enviar mensajes externos y borrar de forma irreversible requiere autorización explícita.
- Las decisiones de producto que no se pueden deducir de decisiones anteriores vuelven al Product Owner.
- Codex en la aplicación de escritorio de ChatGPT sigue siendo la interfaz; MAGA no crea un panel paralelo.

## Modelos por responsabilidad

MAGA mantiene la elección del modelo fuera de las conversaciones habituales de producto sin ocultarte esa decisión. Estos siete nombres no son disciplinas técnicas que debas dominar ni siete trabajos que tengas que gestionar personalmente; son etiquetas internas que MAGA usa para convertir tus decisiones de producto en trabajo coordinado.

### Un ejemplo de producto: «Guardar en privado» en una red social

Imagina una red social clásica con cronología. Una persona encuentra una publicación larga, pero no puede leerla en ese momento. Dar «Me gusta» haría pública su reacción y las capturas de pantalla son difíciles de organizar. El producto quiere ofrecer **Guardar en privado**: el contenido debe seguir guardado después de actualizar la página o cambiar de dispositivo, y nadie más debe poder verlo.

- **Project Lead (`project-lead`) — coordina el resultado:** Convierte la intención en una promesa comprobable: guardar con una acción clara, encontrar la publicación más tarde, conservarla entre dispositivos y mantenerla privada. También protege el alcance y decide qué pregunta debe resolverse a continuación.
- **Investigación (`research`) — aclara necesidades y expectativas:** Estudia cuándo las personas prefieren guardar en lugar de dar «Me gusta» o hacer una captura, cómo esperan recuperar lo guardado y qué significa «privado» para ellas.
- **Prototipo (`prototype`) — vuelve visible la experiencia:** Prepara un flujo que se puede inspeccionar y probar: la acción de guardar, la confirmación, la colección privada, quitar un elemento y los estados vacíos, antes de construir la función definitiva.
- **Entrega (`delivery`) — construye la parte aceptada:** Convierte el flujo aprobado en una función real, vinculando cada publicación guardada con la cuenta correcta para que permanezca después de actualizar o abrir otro dispositivo sin hacerse visible para otras personas.
- **Diagnóstico (`diagnosis`) — encuentra por qué algo falla:** Si una publicación aparece como guardada pero desaparece al actualizar, no llega al otro dispositivo o queda expuesta por error, localiza dónde se rompe la promesa y corrige la causa.
- **Revisión (`review`) — comprueba la promesa del producto:** Verifica con evidencia que guardar, encontrar, quitar, evitar duplicados, sincronizar y proteger la privacidad funcionan como se acordó, incluida la accesibilidad de la experiencia.
- **Lanzamiento (`release`) — decide si está listo para llegar a usuarios:** Confirma el alcance, los riesgos de privacidad, la observación del funcionamiento y la forma de volver atrás si aparece un problema antes de activar la función.

La tabla siguiente indica qué configuración de IA asume cada responsabilidad. MAGA coordina estas partes; tú sigues tomando las decisiones de producto y aceptando el resultado.

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

Para cambiar estas opciones, abre la página de detalles del plugin MAGA y elige su starter prompt **Configure**. Se iniciará un chat de MAGA con un panel de configuración dentro de la conversación. El panel no está incrustado en la página de detalles porque las páginas de plugins de Codex todavía no admiten formularios personalizados arbitrarios. La primera vez que pulsas **Save**, se activa la configuración y quedan fijadas las siete responsabilidades como un conjunto completo. Se guarda en el Codex Home actual, fuera del repositorio del producto y de su historial de Git.

La configuración guardada solo se aplica a las tareas nuevas que se creen explícitamente después. Las tareas existentes no cambian. El Project Lead también la adopta únicamente al crear uno nuevo. Para que un Project Lead existente continúe con la configuración nueva, debes pedir explícitamente «retoma el trabajo con la configuración nueva» y aprobar la creación de una tarea de sustitución.

MAGA decide automáticamente qué responsabilidad y configuración corresponden, pero antes de crear una tarea nueva de Codex solicita tu consentimiento explícito con lenguaje de producto. Puedes aprobar de una vez un grupo de tareas que ya tengan nombre. El `model/list` independiente del panel es solo un catálogo orientativo, no la fuente definitiva del host que ejecutará la tarea. MAGA envía el `model` y el `thinking` que guardaste explícitamente al host de destino de la tarea nueva para que allí se validen. Solo si ese host los rechaza, reintenta una vez sin overrides e informa claramente de que se usaron los valores predeterminados del host. Tampoco sube silenciosamente de modelo porque una tarea parezca difícil.

## Qué incluye

La versión actual es **v0.10.0**. Contiene 16 Skills registrados y una biblioteca de métodos internos que se cargan solo cuando son necesarios.

| Capa | Responsabilidad |
| --- | --- |
| Project Lead | Recibe lenguaje de producto, mantiene el estado, elige métodos y coordina tareas |
| Descubrimiento de producto | Aclaración, investigación, lenguaje del dominio, conceptos y priorización |
| Diseño y entrega | Planificación, prototipado, implementación, validación y cierre |
| Diagnóstico y simplificación | Depuración, revisión de código y eliminación de complejidad innecesaria |
| Biblioteca de métodos | Carga flujos externos bajo demanda para no ocupar todas las conversaciones |

Explora la implementación: [Catálogo de Skills](./plugins/maga/skill-catalog.json) · [Project Lead](./plugins/maga/skills/project-lead/SKILL.md) · [Project Lead orientado a producto](./playbooks/product-oriented-project-lead.md)

<details>
<summary><strong>Enrutamiento, tareas y autorización</strong></summary>

### Enrutamiento

El Project Lead identifica primero el tipo de evidencia necesaria y después selecciona un Skill registrado o un método interno. Se puede invocar un Skill explícitamente, pero el trabajo normal de producto no lo exige.

### Límites de tareas

El trabajo permanece en la tarea actual por defecto. MAGA crea otra tarea únicamente para un objeto concreto que se beneficie de ejecución paralela, contexto aislado, permisos distintos o aceptación independiente. No crea previamente salas vacías de investigación, prototipo, implementación o revisión.

### Autorización

La aprobación en lenguaje natural se aplica a la unidad de producto descrita con claridad. No autoriza automáticamente Tickets posteriores ni resultados con un alcance materialmente ampliado.

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

- [mattpocock/skills](https://github.com/mattpocock/skills): material de 25 Skills formales de Engineering y Productivity, fijado en `8b36d4f`.
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail): implementación mínima, revisión de complejidad y lifecycle Hooks, fijado en `16f2980`.

El enrutamiento, el estado de proyecto, el instalador y el contrato de Project Lead son adaptaciones de MAGA. Las fuentes, modificaciones y licencias se registran en [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

## Investigación y guías

- [Índice de investigación](./research/README.md)
- [Project Lead orientado a producto](./playbooks/product-oriented-project-lead.md)
- [Colaboración entre múltiples sesiones](./playbooks/multi-session-collaboration.md)
- [Orquestación nativa de Tickets en Codex](./playbooks/codex-ticket-orchestration.md)
- [Investigación sobre AI slop](./research/kill-ai-slop.md)

## License

MAGA se publica bajo la [MIT License](./LICENSE). Los materiales de terceros conservan sus licencias respectivas; consulta [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
