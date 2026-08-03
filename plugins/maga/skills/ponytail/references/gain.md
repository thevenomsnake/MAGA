# Ponytail Gain

Render this scoreboard when asked for Ponytail's measured impact. It is
one-shot: do not change the current mode, write flag files, or persist a
default.

The figures are published benchmark medians from five everyday tasks (email
validator, debounce, CSV sum, countdown timer, and rate limiter) across three
models (Haiku, Sonnet, and Opus). They are measured benchmarks, not numbers
computed from the current repository. The source is the bundled upstream
`benchmarks/` material and README.

## Scoreboard

Render these plain ASCII bars. Bar length shows the measured range; labels
carry the exact figures.

```text
  ponytail gain                     benchmark median · 5 tasks · 3 models

  Lines of code   no-skill  ████████████████████  100%
                  ponytail  ██▌·················    6–20%   ▼ 80–94%
  Cost            no-skill  ████████████████████  100%
                  ponytail  █████▌··············   23–53%  ▼ 47–77%
  Speed           ponytail  ▸ 3–6× faster

  This repo:  $ponytail-debt  (shortcuts you deferred)
              $ponytail-audit (what is still cuttable)
```

## Honesty Boundary

These are benchmark medians, not results for the current repository. Never
claim a per-repository saving such as "you saved X lines or tokens": the
unbuilt alternative is not a real baseline. The only real repository-specific
figures come from `$ponytail-debt`, which counts marked deferrals. Point to it
instead of inventing a number.
