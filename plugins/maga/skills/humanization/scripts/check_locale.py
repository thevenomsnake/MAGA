#!/usr/bin/env python3
"""Locale-owned review signals. These warnings never determine authorship."""

from __future__ import annotations

import re

# ponytail: regexes remain review leads; add a parser only after measured false positives justify it.
PATTERNS: dict[str, tuple[tuple[str, re.Pattern[str], int], ...]] = {
    "en": (
        ("contrast slogan", re.compile(r"\bnot just\b.{1,80}\b(?:it(?:'s| is)|but)\b|\bsay goodbye to\b", re.I | re.S), 2),
        ("inflated promise", re.compile(r"\b(?:revolutionary|seamless(?:ly)?|effortless(?:ly)?|next[- ]level|unlock the power|supercharge)\b", re.I), 1),
    ),
    "zh-CN": (
        ("模板化翻案", re.compile(r"(?:不是|并非|不在于|不只是)[^。！？\n]{0,80}(?:而是|而在于)|说到底|真正的?问题是"), 2),
        ("空泛承诺", re.compile(r"赋能|抓手|降本增效|革命性|无缝|颠覆性"), 1),
    ),
    "zh-TW": (
        ("模板化翻案", re.compile(r"(?:不是|並非|不在於|不只是)[^。！？\n]{0,80}(?:而是|而在於)|說到底|真正的?問題是"), 2),
        ("空泛承諾", re.compile(r"賦能|抓手|降本增效|革命性|無縫|顛覆性"), 1),
    ),
    "ja": (
        ("対比スローガン", re.compile(r"単なる.{0,60}(?:ではなく|ではありません)|さようなら.{0,30}(?:課題|悩み)"), 2),
        ("空疎な約束", re.compile(r"革命的|シームレス|次のレベル|可能性を解き放|簡単に実現"), 1),
    ),
    "ko": (
        ("대조형 슬로건", re.compile(r"단순한.{0,60}(?:아니|넘어|것이 아니라)|이제.{0,20}(?:작별|안녕)"), 2),
        ("공허한 약속", re.compile(r"혁신적|끊김 없이|차원이 다른|잠재력을 깨우|손쉽게"), 1),
    ),
    "es": (
        ("eslogan de contraste", re.compile(r"\bno solo\b.{1,80}\b(?:sino|es)\b|\bdile adiós a\b", re.I | re.S), 2),
        ("promesa inflada", re.compile(r"\b(?:revolucionari[oa]|sin fisuras|de siguiente nivel|libera el potencial|sin esfuerzo)\b", re.I), 1),
    ),
}


def check_locale(text: str, locale: str) -> list[str]:
    warnings: list[str] = []
    for label, pattern, threshold in PATTERNS.get(locale, ()):
        count = len(list(pattern.finditer(text)))
        if count >= threshold:
            warnings.append(
                f"locale review signal {label}: {count}; check density, genre, quotation, and real context before editing"
            )
    return warnings
