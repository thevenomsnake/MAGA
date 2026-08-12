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

Read
`../../skills/project-lead/references/git-and-release.md` before writing. Use
the session baseline as the protected starting state; a later `git status` does
not replace the recorded branch, `HEAD`, or pre-existing dirty set.

1. Restate the observable outcome and acceptance boundary internally.
2. Confirm that the Ticket contains the Completion Check or Proof produced by
   registered `bar-tester` from a Product Owner-confirmed Project
   Profile. If the profile is missing or requested work crosses it, return to
   the Project Lead for user selection before implementation.
3. Confirm an explicit branch or permitted worktree and a non-overlapping write
   set. Preserve every pre-existing dirty path outside this Ticket.
4. Inspect the existing path end to end and choose the smallest coherent change
   that makes the behavior real.
5. Reuse established code and dependencies. Introduce a new abstraction,
   dependency, seam, or migration only when the current Ticket requires it.
6. For generated text, write LF bytes before calculating any manifest or catalog
   `byteLength` and `sha256`; calculate both from the final bytes read from disk.
7. Apply registered `tdd` only when the user requested it, repository rules
   require it, or a documented risk justifies a focused red–green cycle. It is
   not the default ceremony for ordinary MAGA delivery.
8. Execute the Ticket's exact Completion Check or Proof once against the final
   change. Expand to typechecking, a broader suite, or independent `code-review` only when
   a newly discovered concrete risk, the change's blast radius, or a
   repository rule requires it; return profile drift to the Project Lead instead
   of silently adding a larger test program.
9. Commit this runnable slice before switching context or starting another
   slice. Stage only the intended write set. Record the behavior, observed
   validation fact, evidence, branch, and commit identity in the Ticket before
   reporting completion.

Return control to the Project Lead for integration. Completing this method does
not authorize another Ticket and does not prove the whole product is finished.
