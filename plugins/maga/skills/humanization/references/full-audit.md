# Explicit full text audit

Read this reference only when the user requests a complete text audit, an
itemized inventory, or a coverage receipt. Ordinary writing and revision use
the changed text as their scope.

1. Fix the requested file or directory scope. Identify each meaningful paragraph,
   UI string, or interface description by its heading, line, node, or resource key.
2. Record each unit's locale, format, surface, and disposition: keep, rewrite,
   move, remove, or unresolved. Split a mixed unit when its parts serve different
   readers or actions. Preserve code, links, placeholders, and resource structure.
3. Review the facts and wording using the common contract, one format reference,
   and the relevant locale. Include the result or reason for each disposition.
4. Report reviewed, protected/skipped, and unresolved units with locations.
   State the checked scope and any parser limits; claim complete coverage only
   when every unit in that scope is accounted for and none remains unresolved.

Use a compact table or the project's existing inventory. MAGA does not bundle
Humanization 4.1's scanner or manifest CLI. For YAML, PO, source code, or design
files, use the project's parser or a clearly scoped manual review; report any
unverified structure instead of treating a plain-text checker as a parser.

The coverage approach is adapted from [Humanization 4.1.0](https://github.com/thevenomsnake/humanization/blob/d10aafc8daee3e07e060cd3b1236af584c393dd7/humanization/references/inventory.md).
