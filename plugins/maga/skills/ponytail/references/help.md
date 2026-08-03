# Ponytail Help

Render this reference card when asked for Ponytail help. It is one-shot: do
not change the current mode, write flag files, or persist a default.

## Levels

| Level | Trigger | What changes |
|-------|---------|--------------|
| **Lite** | `$ponytail lite` | Build what was asked and name the lazier alternative in one line. |
| **Full** | `$ponytail` or `$ponytail full` | Enforce the ladder: YAGNI → reuse → stdlib → native → one line → minimum. Default. |
| **Ultra** | `$ponytail ultra` | Prefer deletion and challenge speculative requirements before building. |

The level sticks until changed or the next session-start lifecycle event.
Startup, resume, clear, and compact reload the configured default, matching the
bundled Ponytail hooks.

## Registered Skills

| Skill | Trigger | What it does |
|-------|---------|--------------|
| **ponytail** | `$ponytail` | Apply the simplest solution that genuinely works. |
| **ponytail-review** | `$ponytail-review` | Review a diff only for removable complexity. |
| **ponytail-audit** | `$ponytail-audit` | Audit a whole repository for what can be deleted or simplified. |
| **ponytail-debt** | `$ponytail-debt` | Harvest `ponytail:` shortcut comments into a debt ledger. |

## Information Routes

| Route | What it shows |
|-------|---------------|
| `$ponytail help` | This quick-reference card. |
| `$ponytail gain` | The published benchmark scoreboard. |

Natural-language equivalents such as "how do I use ponytail?" and "show
ponytail impact" use the same one-shot routes. MAGA's namespaced form, such as
`$maga:ponytail help`, is also accepted by the lifecycle hooks.

## Deactivate

Say "stop ponytail" or "normal mode". `$ponytail off` also works. Resume with
`$ponytail`.

## Configure the Default

The default is `full`, automatically activated each session. Change it with
the highest-priority environment variable:

```bash
export PONYTAIL_DEFAULT_MODE=ultra
```

Or persist it for this MAGA installation with `$ponytail default lite`, using
`lite`, `full`, `ultra`, or `off`. The setting lives in MAGA's writable plugin
data. Resolution order: environment variable → config file → `full`.

Update Ponytail through MAGA rather than as a separate installation. The
bundled copy is pinned and updated together with MAGA.

Upstream documentation: https://github.com/DietrichGebert/ponytail
