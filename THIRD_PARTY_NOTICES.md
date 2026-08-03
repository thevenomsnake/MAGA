# Third-Party Notices

MAGA includes vendored Skills and lifecycle code, as well as adapted
workflow guidance, from the projects below. These notices identify the fixed
upstream versions used for the bundled files. The upstream authors do not
sponsor or endorse MAGA.

## Matt Pocock Skills

Source: https://github.com/mattpocock/skills

Reference commit: `2ab958093e83e0ec752e6c1c5932da465bf23e0c`

Bundled components: workflow material from all 22 formal Engineering and
Productivity Skill folders. Nine upstream model-invoked Skills remain
registered with their technical identities and implicit invocation behavior.
The thirteen upstream user-invoked workflows are distributed as internal MAGA
methods rather than separate registered commands. Category folders are
flattened, and Claude-only invocation frontmatter is represented with Codex
metadata where a workflow remains registered.

MAGA's Project Lead routes internal methods from product intent. That routing
and the consolidated fifteen-Skill product surface are MAGA adaptations, not
upstream Matt invocation behavior. Original names and their mapping to the
adapted surface remain recorded in the distributed catalog.

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

Bundled components: four registered Skills, the help and benchmark material
from two additional upstream Skills as references of the core Ponytail Skill,
and the Codex lifecycle hook configuration with its required JavaScript
modules. MAGA adds a local CommonJS package boundary, recognizes the MAGA
plugin's namespaced Ponytail commands, and scopes persisted Codex defaults to
`PLUGIN_DATA`; these host and surface adaptations preserve the original mode
transitions while allowing the hooks to run inside MAGA's ESM npm repository
and isolated Codex installations.

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
