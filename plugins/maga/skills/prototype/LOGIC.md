# Logic Prototype

Build one self-contained HTML file—a **shareable demo**—that lets anyone drive a
state model by clicking buttons. Use it for business rules, state transitions,
or data shapes that only become clear when a person pushes real-looking cases
through them.

The recipient may be a product owner, designer, or domain expert. Use their
product language, not reducer or database terminology.

## Process

### 1. State The Question

Put one visible paragraph at the top of the demo naming the model and the exact
question it answers. Completion means a reviewer can say whether the demo tests
the intended uncertainty without reading source code.

### 2. Isolate The Logic

Keep the logic in a pure module inside one `<script>` block. Choose the smallest
shape that fits:

- a pure `(state, action) => state` reducer;
- an explicit state machine when legal actions depend on current state;
- pure functions over plain data;
- a small class only when the domain truly owns ongoing internal state.

The logic must not read the DOM or reach into button handlers. The page calls
the module and renders its result; nothing flows in the other direction. This
makes a validated model liftable into production without carrying the demo UI.

### 3. Build The Shareable File

Use plain inline HTML, CSS, and JavaScript: no framework, bundler, server, install,
or external asset. The file opens directly and remains inside the repository.

Lay it out from top to bottom:

1. **Question**: title and one-line explanation of what to explore.
2. **Current state**: every relevant field as readable, product-language labels,
   not raw JSON. Highlight the last meaningful change when useful.
3. **Free play**: one action button for each behavior so the reviewer can explore
   in any order.
4. **Guided scenarios**: tabs for a happy path, a difficult edge case, and an
   action that should be rejected. Starting a scenario resets known synthetic
   state. Each step is a real button that performs the next action.

Keep typography clean, spacing generous, and color restrained. The state and
controls—not animation—carry the experience.

### 4. Hand It Over

Give the Product Owner the repository-local file and what to watch for. Capture
feedback such as “that should not be possible” as evidence about the idea, not
as a request to polish the prototype. Add actions or scenarios only when they
answer the named question.

### 5. Capture The Answer

Record the verdict and its product consequence in the current Ticket or existing
project memory. Lift only the validated pure model into production. Keep or
discard the HTML shell according to its continuing evidence value and the parent
Skill's capture rule.

## Boundaries

- Use synthetic, public-safe data and in-memory state.
- Skip tests, production error handling, abstractions, persistence, and future
  generalization.
- Keep DOM code out of the pure model.
- Keep the demo to one directly openable file.
- Ship the validated behavior, not the HTML shell.
