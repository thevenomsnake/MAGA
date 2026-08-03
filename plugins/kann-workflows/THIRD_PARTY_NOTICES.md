# Third-Party Notices

Kann Workflows includes vendored Skills and lifecycle code, as well as adapted
workflow guidance, from the projects below. These notices identify the fixed
upstream versions used for the bundled files. The upstream authors do not
sponsor or endorse Kann Workflows.

## Matt Pocock Skills

Source: https://github.com/mattpocock/skills

Reference commit: `2ab958093e83e0ec752e6c1c5932da465bf23e0c`

Bundled components: the 22 formal Engineering and Productivity Skill folders.
Their Codex invocation metadata is preserved; category folders are flattened
so each Skill is an immediate child of the Kann plugin's `skills/` directory,
and Claude-only `disable-model-invocation` frontmatter is removed because Codex
uses the equivalent `agents/openai.yaml` policy.

MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Ponytail

Source: https://github.com/DietrichGebert/ponytail

Reference commit: `16f29800fd2681bdf24f3eb4ccffe38be3baec6b`

Bundled components: all six Skill folders and the Codex lifecycle hook
configuration with its required JavaScript modules. Kann adds a local CommonJS
package boundary, recognizes the Kann plugin's namespaced Ponytail commands,
and scopes persisted Codex defaults to `PLUGIN_DATA`; these host adaptations
preserve the original mode transitions while allowing the hooks to run inside
Kann's ESM npm repository and isolated Codex installations.

MIT License

Copyright (c) 2026 DietrichGebert

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
