<h1 align="center">MAGA</h1>

<p align="center"><strong>Make Apps Great Again</strong></p>

<p align="center">Construye el software que tienes en mente.</p>

<p align="center">
  Para diseñadores de producto, responsables de producto y personas que crean software por primera vez.<br>
  Tú tomas las decisiones de producto. MAGA las convierte en software funcional y verificable.
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <a href="./README.zh-CN.md">简体中文</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.ko.md">한국어</a> ·
  <strong>Español</strong>
</p>

MAGA es un flujo de trabajo instalable para crear productos con Codex Desktop. Describe el usuario, el problema, la experiencia, las restricciones y las decisiones de producto con lenguaje natural. Un Project Lead persistente elige los métodos adecuados y coordina investigación, prototipos, implementación, validación y reparación.

No necesitas entender código, elegir Skills, gestionar sesiones de ingeniería ni revisar código. Aceptas el producto evaluando su comportamiento, su experiencia y su resultado de negocio.

> [!NOTE]
> MAGA no es un constructor visual no-code. El producto sigue teniendo código. Codex se encarga de esa capa de implementación; tú conservas la intención, las prioridades, las restricciones y la aceptación del producto.

## Empieza aquí

Necesitas [Codex Desktop](https://openai.com/codex/), Codex CLI, Node.js 18 o posterior y Git. Añade `--no-git` si no quieres que MAGA inicialice un repositorio.

```bash
npx github:thevenomsnake/MAGA init ./my-product
```

Abre el proyecto nuevo y describe lo que quieres crear:

```text
Quiero una herramienta que ayude a diseñadores independientes a organizar comentarios de clientes.
Los comentarios deben quedar asociados a cada proyecto y necesito ver qué problemas bloquean la entrega.
```

MAGA identifica el primer resultado útil del producto, pregunta únicamente lo que pueda cambiar la dirección o los permisos e inicia el trabajo adecuado. No tienes que traducir antes la idea a tareas técnicas.

Para instalar solamente el plugin en un entorno existente:

```bash
npx github:thevenomsnake/MAGA install
```

Para retomar un proyecto inicializado y su Project Lead:

```bash
npx github:thevenomsnake/MAGA start ./my-product
```

## Why MAGA

### ¿Por qué necesitamos una capa sobre Codex si Codex ya es suficientemente bueno?

Codex ya realiza trabajo de ingeniería complejo. Puede entender repositorios, escribir y modificar código, ejecutar comprobaciones, revisar cambios, trabajar entre conversaciones de un proyecto y aplicar Skills reutilizables. La guía oficial de OpenAI describe la misma evolución: proporcionar contexto duradero a Codex, convertir el trabajo repetible en Skills y distribuir capacidades estables como plugins. Consulta las [prácticas recomendadas de Codex](https://learn.chatgpt.com/guides/best-practices), la [documentación de Skills](https://learn.chatgpt.com/docs/build-skills) y la [documentación de plugins](https://developers.openai.com/plugins/).

El propio nombre Codex deja claro su centro de gravedad: el código. Su vocabulario y su modelo de extensión resultan más fáciles de manejar cuando alguien puede formular el trabajo como ingeniería e inspeccionar el resultado técnico.

A la gente de producto se le suele decir que “no entiende la tecnología y solo da órdenes”. De acuerdo: llevemos esa dirección hasta el final. MAGA es el plugin que permite decidir objetivos y compromisos de producto sin freno, mientras Codex se encarga del código.

> **Dirige sin freno. Acepta con criterio.**

MAGA existe porque la capacidad del modelo y la colaboración de producto son problemas distintos.

Un Skill convencional suele hacer fiable un trabajo repetible. Una colección de Skills todavía suele asumir que la persona operadora sabe qué trabajo viene después, cómo ordenar los flujos técnicos, qué contexto necesita cada tarea y cómo evaluar un diff de código.

MAGA añade un modelo operativo por encima de esas capacidades:

- Un único Project Lead orientado a producto recibe lenguaje de producto normal.
- El enrutamiento por intención elige Skills y métodos según la evidencia disponible.
- El estado duradero del proyecto conserva decisiones, límites, roles y trabajo autorizado.
- La aceptación de producto sustituye a la revisión de código como interfaz del Product Owner.

En sentido estricto, MAGA no es una segunda aplicación ni una interfaz alternativa. Codex Desktop sigue siendo la interfaz. La capa envolvente es el contrato de trabajo instalado que determina cómo una intención de producto se convierte en trabajo de ingeniería coordinado.

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
- Codex Desktop sigue siendo la interfaz; MAGA no crea un panel paralelo.

## Qué incluye

La versión actual es **v0.9.0**. Contiene 15 Skills registrados y una biblioteca de métodos internos que se cargan solo cuando son necesarios.

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
5. Abre el proyecto en Codex Desktop.

`start` lee el estado existente y restaura el Project Lead sin reescribir archivos del proyecto. Ejecuta `npx github:thevenomsnake/MAGA --help` para ver todas las opciones.

</details>

## Trabajo externo y licencias

MAGA adapta métodos maduros en revisiones fijas:

- [mattpocock/skills](https://github.com/mattpocock/skills): material de 22 Skills formales de Engineering y Productivity, fijado en `2ab9580`.
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
