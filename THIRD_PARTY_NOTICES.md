# Third-Party Notices

MAGA includes vendored Skills and lifecycle code, as well as adapted
workflow guidance, from the projects below. These notices identify the fixed
upstream versions used for the bundled files. The upstream authors do not
sponsor or endorse MAGA.

## Matt Pocock Skills

Source: https://github.com/mattpocock/skills

Reference commit: `8b36d4fb2635b3c21998dcd8144439c9e5ba7302`

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

MAGA's Project Lead routes these capabilities from product intent. That
routing and the consolidated surface of eighteen registered product Skills are
MAGA adaptations, not upstream Matt invocation behavior. Original names and
their mapping to the adapted surface remain recorded in the distributed
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

## Humanization

Source: https://github.com/thevenomsnake/humanization

Reference commit: `d3b8f3791fee58c030aa52539296ad361654f1c7`

Reference version: `3.0.0`

MAGA vendors the complete Humanization Skill, including its six locale
profiles, prose and GUI-copy references, deterministic checkers, UI metadata,
icons, version marker, and Skill-local license. MAGA changes the Codex card to
the MAGA product namespace, limits implicit invocation to human-readable text
written to or edited in local files, and adds SessionStart and SubagentStart
context for the same boundary. Chat-only output remains outside automatic
routing regardless of length, formatting, copy-readiness, or possible later
sharing. Explicit invocation remains available. These adaptations
preserve Humanization's facts, source, privacy, CTA,
locale, and protected-structure boundaries.

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
