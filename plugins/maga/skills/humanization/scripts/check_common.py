#!/usr/bin/env python3
"""Deterministic checks shared by every locale and format."""

from __future__ import annotations

import collections
import re

MUSTACHE = re.compile(r"\{\{[^{}\n]+\}\}")
DOLLAR_VARIABLE = re.compile(r"\$\{[^{}\n]+\}")
PRINTF = re.compile(r"%(?:\([^)]+\))?(?:\d+\$)?[-+#0 ]*\d*(?:\.\d+)?[A-Za-z@]")
BRACE_ARGUMENT = re.compile(r"(?<![$\{])\{\s*([A-Za-z_][\w.-]*)\s*(?:,|\})")
ICU_TYPE = re.compile(r"\{\s*([A-Za-z_][\w.-]*)\s*,\s*(plural|selectordinal|select)\s*,")
ICU_SELECTOR = re.compile(r"(?:^|[,\s])((?:=\d+)|zero|one|two|few|many|other)\s*\{")
URL = re.compile(r"https?://[^\s<>'\"]+")
ESCAPE = re.compile(r"\\(?:[nrtbfv\\\"']|u[0-9A-Fa-f]{4}|x[0-9A-Fa-f]{2})")


def protected_tokens(text: str) -> collections.Counter[str]:
    tokens: list[str] = []
    for pattern in (MUSTACHE, DOLLAR_VARIABLE, PRINTF, ESCAPE):
        tokens.extend(match.group() for match in pattern.finditer(text))
    tokens.extend(f"{{{match.group(1)}}}" for match in BRACE_ARGUMENT.finditer(text))
    tokens.extend(
        f"icu:{match.group(1)}:{match.group(2)}" for match in ICU_TYPE.finditer(text)
    )
    tokens.extend(
        f"icu-selector:{match.group(1)}" for match in ICU_SELECTOR.finditer(text)
    )
    tokens.extend(match.group().rstrip(".,);]") for match in URL.finditer(text))
    return collections.Counter(tokens)


def compare_protected_tokens(source: str, target: str) -> list[str]:
    source_tokens = protected_tokens(source)
    target_tokens = protected_tokens(target)
    failures: list[str] = []
    for token, count in (source_tokens - target_tokens).items():
        failures.append(f"protected token missing or renamed: {token} ({count})")
    for token, count in (target_tokens - source_tokens).items():
        failures.append(f"protected token added: {token} ({count})")
    return failures


def check_common(
    text: str, brand_terms: list[str], source_text: str | None = None
) -> list[str]:
    failures: list[str] = []
    if not text.strip():
        failures.append("input is empty")
    failures.extend(
        f"missing declared brand term: {term}" for term in brand_terms if term not in text
    )
    if source_text is not None:
        failures.extend(compare_protected_tokens(source_text, text))
    return failures
