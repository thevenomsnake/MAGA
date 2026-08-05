# Human-Only Gates

Use this reference when progress reaches an authenticated dashboard, account
provisioning step, credential boundary, payment, migration, cutover, or other
action that only the Product Owner can perform.

## Decide Whether The Gate Is Real

First use authorized project tools for actions the agent can safely perform.
Treat a step as human-only only when it requires the person's identity,
unshareable secret, legal or financial judgment, private account access, or an
irreversible confirmation the agent cannot own.

## Guide One Recoverable Stage At A Time

1. State the product reason for the stage and the observable completion signal.
2. Explain the exact page or control in product language. For authenticated web
   interaction, use the authorized Chrome capability when available.
3. Let the person enter credentials directly into the destination. Receive only
   a non-secret completion signal or redacted error.
4. Verify the postcondition with a read-only check when possible, then move to
   the next stage.
5. Request separate authorization before each external, destructive,
   irreversible, paid, or release action not already approved.

For a repeatable process, write a sanitized checklist under the repository's
existing documentation structure. Keep temporary working material inside the
repository and remove personal names, account details, machine paths, task IDs,
and secret values before committing.

This is MAGA's safe absorption of Matt Skills' `wizard` idea. It deliberately
does not generate Bash, capture secrets, write `.env` or GitHub Secrets, invoke
`gh auth` or `gh secret`, use operating-system temporary directories, or launch
an unauthorised browser.
