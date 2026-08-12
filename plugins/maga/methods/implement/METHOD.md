---
name: implement
description: Deliver one authorized Ticket as the smallest working product slice, with risk-matched verification and repository-compliant handoff.
---

> **MAGA internal method:** Project Lead reads and executes this file inline.
> It is not a registered Skill; never turn its name into a Skill command.

# Implement One Authorized Slice

Read the Ticket, its explicit durable references, and the repository
instructions. Confirm that this exact Ticket is authorized, ready, and
unblocked before causing side effects. Do not absorb adjacent Tickets or expand
the outcome because the code makes that tempting.

1. Restate the observable outcome and acceptance boundary internally.
2. Confirm that the Ticket contains the Completion Check or Proof produced by
   registered `bar-tester` from a Product Owner-confirmed Project
   Profile. If the profile is missing or requested work crosses it, return to
   the Project Lead for user selection before implementation.
3. Inspect the existing path end to end and choose the smallest coherent change
   that makes the behavior real.
4. Reuse established code and dependencies. Introduce a new abstraction,
   dependency, seam, or migration only when the current Ticket requires it.
5. Apply registered `tdd` only when the user requested it, repository rules
   require it, or a documented risk justifies a focused red–green cycle. It is
   not the default ceremony for ordinary MAGA delivery.
6. Execute the Ticket's exact Completion Check or Proof once against the final
   change. Expand to a broader suite or independent `code-review` only when a
   newly discovered concrete risk or repository rule requires it; return
   profile drift to the Project Lead instead of silently adding a larger test
   program.
7. Commit when the repository delivery contract requires a commit. Record the
   behavior, observed validation fact, evidence, and commit or artifact identity
   in the Ticket before reporting completion.

Return control to the Project Lead for integration. Completing this method does
not authorize another Ticket and does not prove the whole product is finished.
