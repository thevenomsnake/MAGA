# Third-Party Notices

MAGA includes vendored Skills and lifecycle code, as well as adapted
workflow guidance, from the projects below. These notices identify the fixed
upstream versions used for the bundled files. The upstream authors do not
sponsor or endorse MAGA.

## Matt Pocock Skills

Source: https://github.com/mattpocock/skills

Reference commit: `5b15a47f2d7150f545fbcacbfe381787fc0230dc`

MAGA accounts for all 25 formal Engineering and Productivity Skills in this
snapshot. Eleven are registered with their technical identities: ten upstream
model-invoked Skills retain implicit invocation, while `wait-what` keeps its
compact communication-recovery core but is adapted from user-only invocation
to implicit Codex routing. Thirteen upstream user-invoked workflows are
distributed as internal MAGA methods rather than separate registered commands.
Category folders are flattened, and Claude-only invocation frontmatter is
represented with Codex metadata where a workflow remains registered.

The remaining upstream capability is absorbed into Project Lead. The
manual-only safety core of `wizard` becomes MAGA's manual-action gate; its Bash
template, secret collection, GitHub mutation, and browser-driving behavior are
not vendored.

MAGA's Project Lead routes these capabilities from product intent. MAGA adopts
the upstream secret-redaction guidance for diagnosis, multi-context pointers
for communication recovery, and direct file-operation triggers for domain
modeling, while preserving its native task authorization and one-question
product interface. The beta `implement-spec` skill remains upstream-only.
That routing and the consolidated surface of nineteen registered product Skills
are MAGA adaptations, not upstream Matt invocation behavior. Original names
and their mapping to the adapted surface remain recorded in the distributed
catalog.

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

Reference commit: `2ed6c52c9d7e5e56942508591085fd45dea277d3`

Bundled components: four registered Skills, the help and benchmark material
from two additional upstream Skills as references of the core Ponytail Skill,
and the Codex lifecycle hook configuration with its required JavaScript
modules. MAGA adds a local CommonJS package boundary, recognizes the MAGA
plugin's namespaced Ponytail commands, scopes persisted Codex defaults to
`PLUGIN_DATA`, and carries the upstream VS Code Copilot plugin-root fallback;
these host and surface adaptations preserve the original mode transitions
while allowing the hooks to run inside MAGA's ESM npm repository and isolated
Codex installations. The upstream Grok adapter and marketplace-specific hook
schema changes are not bundled.

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

## Humanization

Source: https://github.com/thevenomsnake/humanization

Reference commit: `c38b5b6d0878ee06b899213d4003e694cece5e0c`

Reference version: `3.0.0`

MAGA vendors the complete Humanization Skill, including its six locale
profiles, prose and GUI-copy references, deterministic checkers, UI metadata,
icons, version marker, and Skill-local license. MAGA changes the Codex card to
the MAGA product namespace, limits implicit invocation to human-readable text
written to or edited in local files, and adds SessionStart and SubagentStart
context for the same boundary. Chat-only output remains outside automatic
routing regardless of length, formatting, copy-readiness, or possible later
sharing. Explicit invocation remains available. MAGA also adopts the upstream
task-scoped author-sample calibration: it is opt-in, temporary, and subordinate
to facts, locale, privacy, CTA, accessibility, and protected-structure
boundaries. These adaptations preserve Humanization's facts, source, privacy,
CTA, locale, and protected-structure boundaries.

Humanization records that its initial `zh-CN` long-form foundation comes from
KKKKhazix/human-writing v1.1.0 under MIT, and that its concrete, restrained
text-review principles were informed by yetone/kill-ai-slop under
Apache-2.0. Those attributions and source links remain in the bundled Skill.

MIT License

Copyright (c) 2026 Human Writing Skill contributors

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
