# Guía completa de MAGA para principiantes

[English](./getting-started.md) · [简体中文](./getting-started.zh-CN.md) · [日本語](./getting-started.ja.md) · [한국어](./getting-started.ko.md) · **Español**

Esta guía presupone que nunca has usado Codex, una terminal ni una revisión de código. Al terminar, MAGA estará instalado en un proyecto local y habrás pedido tu primer resultado de producto verificable.

## Qué necesitas

- Un ordenador con Windows o macOS.
- Una cuenta de ChatGPT con acceso a Codex.
- Conexión a internet.
- Una idea de producto; una frase basta.
- Una carpeta vacía para el producto.

No necesitas instalar herramientas de desarrollo por tu cuenta. Codex puede comprobar Node.js, Git y otros requisitos, explicar qué falta y pedir autorización antes de instalar nada.

## 1. Abrir Codex por primera vez

1. Instala la [aplicación de escritorio de ChatGPT](https://learn.chatgpt.com/docs/quickstart?setup=app).
2. Abre la aplicación e inicia sesión con tu cuenta de ChatGPT.
3. Elige **Codex** en el selector de ChatGPT.

Si Codex no aparece, comprueba que tu cuenta o espacio de trabajo tenga acceso. Esta guía no requiere la versión de línea de comandos.

## 2. Crear una carpeta para el producto

Crea una carpeta vacía en el Explorador de archivos o Finder. Un nombre sencillo como `client-feedback` es suficiente.

En la aplicación, crea un proyecto local o abre esa carpeta como proyecto. Confirma que Codex muestra la carpeta correcta. No elijas una carpeta superior que contenga archivos personales sin relación.

## 3. Pedir a Codex que instale MAGA

Pega este mensaje en el primer chat de Codex:

> Configura este proyecto con el plugin MAGA de https://github.com/thevenomsnake/MAGA. Comprueba e instala los requisitos que falten, inicializa MAGA en esta carpeta, verifica que funciona y dime cuándo debo iniciar un chat nuevo. Realiza tú los pasos técnicos y pídeme únicamente las autorizaciones realmente necesarias. No me pidas copiar comandos en una terminal salvo que estés realmente bloqueado.

Deja que Codex elija los comandos; tu responsabilidad es juzgar las autorizaciones.

### Cómo juzgar una autorización

| La solicitud menciona | Suele significar | Qué hacer |
| --- | --- | --- |
| La carpeta del proyecto | Crear o modificar archivos del producto | Autoriza si la ruta es correcta |
| GitHub o el repositorio de MAGA | Descargar el plugin | Autoriza si el destino es el proyecto o el área de plugins de Codex |
| Node.js o Git | Instalar un requisito ausente | Lee la explicación antes de autorizar |
| Inicio de sesión en el navegador | Autenticar una cuenta | Inicia sesión en el navegador; no pegues contraseñas ni tokens en el chat |
| Otra carpeta, pagos o borrado irreversible | Trabajo fuera de la instalación | Rechaza y pregunta por qué sería necesario |

Si no entiendes la solicitud, responde:

> Explica con lenguaje de producto qué cambia esta autorización, dónde lo cambia y si se puede deshacer.

## 4. Iniciar un chat nuevo

Las capacidades instaladas se cargan en chats nuevos. Cuando termine la configuración, permanece en el mismo proyecto e inicia un **chat nuevo de Codex**. Conserva el chat de instalación por si necesitas consultar un error.

### Opcional: elegir modelos por responsabilidad

Abre la página de detalles del plugin MAGA, selecciona su starter prompt **Configure** y elige la configuración inicial que encaje con tu uso disponible. Codex iniciará un chat de MAGA y abrirá el panel dentro de la conversación.

| Responsabilidad | Pro · calidad primero | Plus · uso habitual | Free / Go · ahorrar uso |
| --- | --- | --- | --- |
| Project Lead | Sol · xhigh | Sol · xhigh | Terra · xhigh |
| Investigación | Sol · max | Sol · max | Terra · max |
| Prototipo | Sol · xhigh | Terra · high | Terra · high |
| Entrega | Terra · xhigh | Luna · max | Luna · max |
| Diagnóstico | Sol · max | Terra · xhigh | Terra · high |
| Revisión | Sol · xhigh | Sol · high | Terra · high |
| Lanzamiento | Sol · xhigh | Sol · high | Sol · high |

Business, Enterprise y Edu pueden empezar con Plus y pasar a Pro cuando su asignación y política lo permitan. Quienes usen una API key deben elegir según su presupuesto de tokens. Sol cubre ambigüedad y control de calidad, Terra es el modelo habitual y Luna solo se recomienda en **max** para entregas con criterios claros.

La primera vez que pulsas **Save**, se activa la configuración y quedan fijadas las siete responsabilidades como un conjunto completo. Se guarda en el Codex Home actual, no en esta carpeta de producto ni en su historial de Git. Solo se aplica a tareas nuevas cuya creación apruebes explícitamente después; las tareas existentes no cambian. El Project Lead también la adopta únicamente al crear uno nuevo. Para que el Project Lead actual use la configuración nueva, pide «retoma el trabajo con la configuración nueva» y aprueba la creación de una tarea de sustitución.

MAGA decide automáticamente qué responsabilidad y configuración corresponden, pero antes de crear una tarea nueva de Codex solicita tu consentimiento con lenguaje de producto. Puedes aprobar de una vez un grupo de tareas que ya tengan nombre. El `model/list` independiente del panel es solo un catálogo orientativo, no la fuente definitiva del host que ejecutará la tarea. MAGA envía el `model` y el `thinking` guardados al host de destino de la tarea nueva para su validación final. Solo si ese host los rechaza, reintenta una vez sin overrides e informa claramente de que se usaron los valores predeterminados del host. Tampoco eleva la configuración porque una petición parezca difícil.

## 5. Describir el primer producto

Puedes comenzar con una sola frase:

> Usa MAGA como mi Project Lead. Quiero una herramienta que ayude a diseñadores independientes a organizar comentarios de clientes. No sé programar, así que pregunta con lenguaje de producto y dame resultados funcionales que pueda inspeccionar.

Si sabes un poco más, utiliza esta estructura:

> Usa MAGA como mi Project Lead. Quiero crear **[qué]** para **[quién]**. Hoy tienen este problema: **[problema]**. El primer resultado útil debe permitirles **[resultado observable]**. No podemos sacrificar **[restricciones]**. No sé programar; pregunta solo lo que pueda cambiar la dirección, el riesgo o los permisos.

No pasa nada si no conoces todos los campos. MAGA debe ayudarte a descubrirlos.

## 6. Responder preguntas de producto

| Pregunta | Significado | Ejemplo |
| --- | --- | --- |
| Usuario | Quién sufre el problema | Diseñadores independientes con 3–10 clientes |
| Problema | Qué resulta difícil hoy | Los comentarios están repartidos entre chats, correo y documentos |
| Primer resultado útil | Primera conducta que merece inspección | Añadir comentarios a un proyecto y ver qué bloquea la entrega |
| Restricción | Qué no se puede sacrificar | Entender la pantalla sin formación |
| Compromiso | Qué puede esperar | Los permisos de equipo pueden esperar; la organización por proyecto no |
| Autorización | Qué puede hacer Codex ahora | Prototipo local sí; publicar o contactar personas no |

Siempre puedes decir: “Todavía no lo sé. Muéstrame el ejemplo más pequeño que me ayude a decidir”.

## 7. Aceptar el producto sin revisar código

Cuando recibas un resultado funcional, comprueba:

1. ¿Puede el usuario previsto completar la tarea principal?
2. ¿Se ve pronto el primer valor útil?
3. ¿Usa el lenguaje del usuario en vez de términos técnicos?
4. ¿Qué ocurre con información vacía, errónea o ausente?
5. ¿Qué parte parece más lenta, confusa o poco fiable de lo esperado?
6. ¿Resuelve el problema o solo demuestra tecnología?

Da feedback a partir de observaciones:

> Puedo añadir comentarios, pero todavía parece un gestor de tareas genérico. Esperaba ver primero los cambios del proyecto y los bloqueos de entrega. Conserva los datos, cambia la jerarquía de información y enséñame el flujo revisado antes de añadir funciones.

Cuando aceptes el resultado, dilo de forma explícita:

> Acepto este alcance del producto. Registra lo aceptado, las preguntas abiertas y el siguiente resultado útil más pequeño. Muéstrame el límite y no empieces lo siguiente hasta que lo confirme.

## 8. Continuar mañana o en otro chat

Abre un chat nuevo en el mismo proyecto y escribe:

> Continúa este proyecto MAGA desde su estado guardado. Resume primero las decisiones aceptadas, las preguntas abiertas, el comportamiento actual y el siguiente resultado propuesto. No cambies nada hasta que confirme el resumen.

Usa el mismo proyecto mientras sean el mismo producto y los mismos archivos. Crea otro chat para un resultado distinto y concreto.

## 9. Problemas frecuentes

| Problema | Respuesta |
| --- | --- |
| Codex pide ejecutar un comando | “Ejecuta tú ese paso y explica la autorización mínima si hace falta” |
| Falta un requisito | Pide a Codex que lo instale, verifique la versión y reintente el paso interrumpido |
| MAGA no se reconoce | Confirma que terminó la instalación e inicia un chat nuevo en el mismo proyecto |
| GitHub no responde | Comprueba internet y acceso a GitHub; reintenta solo la descarga fallida |
| La instalación falla | Entrega el error completo y pide diagnóstico, reparación y verificación |
| Codex hace demasiadas preguntas | “Pregunta solo lo que cambie dirección, riesgo o permisos” |
| Funciona técnicamente pero el producto está mal | Describe qué observaste, qué esperabas y qué resultado importa |
| Un chat nuevo olvida el proyecto | Confirma que está en el mismo proyecto local y que lea primero el estado guardado |

## 10. Vocabulario mínimo

- **Proyecto:** carpeta, chats y contexto duradero de un producto.
- **Chat:** conversación centrada en un resultado concreto dentro del proyecto.
- **Plugin:** paquete instalable que añade flujos y herramientas reutilizables a Codex.
- **Project Lead:** coordinador de MAGA orientado a producto.
- **Autorización:** permiso para una acción concreta, como descargar o escribir archivos.
- **Aceptación:** decisión de que un resultado funcional resuelve suficientemente el problema.

## 11. Graduarte de MAGA

Cuando puedas explicar usuario, problema, resultado y restricciones; pedir la evidencia mínima; dar feedback sobre el comportamiento y juzgar permisos, estarás preparado para usar Codex directamente.

Para quitar MAGA, abre **Plugins**, busca MAGA en **Installed**, elige **Uninstall plugin** e inicia un chat nuevo. Tus archivos de producto no se eliminan.

Si también quieres limpiar las instrucciones específicas de MAGA:

> Voy a graduar este proyecto de MAGA. Identifica primero todos los archivos e instrucciones específicos de MAGA, explica qué dejará de funcionar al eliminarlos y muéstrame la lista exacta de limpieza. No borres nada hasta que apruebe la lista. Conserva todos los archivos, decisiones y software funcional del producto.

Necesitar cada vez menos MAGA es el resultado previsto.

## Ayuda oficial de Codex

- [Inicio rápido de la aplicación](https://learn.chatgpt.com/docs/quickstart?setup=app)
- [Proyectos y chats](https://learn.chatgpt.com/docs/projects)
- [Instalar y usar plugins](https://learn.chatgpt.com/docs/plugins)
- [Autorizaciones y seguridad](https://learn.chatgpt.com/docs/agent-approvals-security)
