---
name: to-questionnaire
description: Turn a decision that depends on another person's knowledge into a focused discovery questionnaire.
---

> **MAGA internal method:** Project Lead reads and executes this file inline.
> It is not a registered Skill; never turn its name into a Skill command.

# To Questionnaire

Use this method when a product decision is blocked by knowledge held by an
external stakeholder. Grill the **send**, not the subject: learn who can answer
and what the project needs back, then aim the document at that gap.

1. Identify the recipient by role, expertise, and relationship to the decision.
   Use a generic role in tracked content; do not write a person's or private
   organization's identity into a public repository. Ask one focused question
   only if the role cannot be inferred.
2. Identify the concrete facts or decisions the Project Owner must be able to
   resolve after the response. Link them to the current product blocker.
3. Write `.ai-workflow/questionnaires/<topic>.md`, unless the repository already
   has a clear product-document location for stakeholder discovery. Keep the
   file inside the repository and report its path.
4. Confirm that every required fact has a question. Do not send the document,
   contact the recipient, or perform another external action without explicit
   authorization.

## Document Shape

```markdown
# <Questionnaire title>

**Purpose:** <decision this will unblock>
**From:** <generic project role>
**To:** <generic recipient role>
**How the answers will be used:** <product outcome>

## Context

<One short paragraph with only the context needed to answer.>

## How to answer

<Expected effort and deadline, if known. Partial answers and uncertainty are useful.>

## <Most important theme>

### <One question containing one idea>

_Why this matters: <only when a throwaway answer is otherwise likely>_

>

## Anything else?

What did we fail to ask that could materially change this decision?
```

Order questions by decision value because there may be only one response. Use
plain product language, synthetic examples, and no credentials, private account
details, task identifiers, or machine paths.
