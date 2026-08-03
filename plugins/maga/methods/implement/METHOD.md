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
2. Inspect the existing path end to end and choose the smallest coherent change
   that makes the behavior real.
3. Reuse established code and dependencies. Introduce a new abstraction,
   dependency, seam, or migration only when the current Ticket requires it.
4. Apply registered `tdd` only when the user requested it, repository rules
   require it, or a documented risk justifies a focused red–green cycle. It is
   not the default ceremony for ordinary MAGA delivery.
5. Run one risk-matched focused verification. Expand to typechecking, a broader
   suite, or independent `code-review` only when the change's blast radius or
   repository rules justify it.
6. Commit when the repository delivery contract requires a commit. Record the
   behavior, observed validation fact, evidence, and commit or artifact identity
   in the Ticket before reporting completion.

Return control to the Project Lead for integration. Completing this method does
not authorize another Ticket and does not prove the whole product is finished.
