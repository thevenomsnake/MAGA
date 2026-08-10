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
2. Confirm an explicit branch or permitted worktree and a non-overlapping write
   set. Preserve every pre-existing dirty path outside this Ticket.
3. Inspect the existing path end to end and choose the smallest coherent change
   that makes the behavior real.
4. Reuse established code and dependencies. Introduce a new abstraction,
   dependency, seam, or migration only when the current Ticket requires it.
5. For generated text, write LF bytes before calculating any manifest or catalog
   `byteLength` and `sha256`; calculate both from the final bytes read from disk.
6. Apply registered `tdd` only when the user requested it, repository rules
   require it, or a documented risk justifies a focused red–green cycle. It is
   not the default ceremony for ordinary MAGA delivery.
7. Run one risk-matched focused verification. Expand to typechecking, a broader
   suite, or independent `code-review` only when the change's blast radius or
   repository rules justify it.
8. Commit this runnable slice before switching context or starting another
   slice. Stage only the intended write set. Record the behavior, observed
   validation fact, evidence, branch, and commit identity in the Ticket before
   reporting completion.

Return control to the Project Lead for integration. Completing this method does
not authorize another Ticket and does not prove the whole product is finished.
