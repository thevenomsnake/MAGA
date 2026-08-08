#!/usr/bin/env python3
"""Check expressive text through common, locale, and GUI modules."""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

from check_common import check_common
from check_gui import check_gui, check_resource_integrity
from check_locale import check_locale

LOCALES = ("zh-CN", "zh-TW", "en", "ja", "ko", "es")
FORMATS = ("prose", "copy", "web-microcopy")


def read_input(path: str) -> str:
    return sys.stdin.read() if path == "-" else Path(path).read_text(encoding="utf-8")


def check_generic(
    text: str,
    locale: str,
    format_name: str,
    brand_terms: list[str],
    *,
    source_text: str | None = None,
    source_name: str = "",
    target_name: str = "",
) -> tuple[list[str], list[str]]:
    failures = check_common(text, brand_terms, source_text)
    review_text = text
    if format_name == "web-microcopy":
        gui_failures, review_text = check_gui(text, locale, target_name)
        failures.extend(gui_failures)
        if source_text is not None:
            failures.extend(
                check_resource_integrity(source_text, text, source_name, target_name)
            )
    return failures, check_locale(review_text, locale)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check text with explicit locale and format modules"
    )
    parser.add_argument("--locale", choices=LOCALES, required=True)
    parser.add_argument("--format", dest="format_name", choices=FORMATS, required=True)
    parser.add_argument("--brand-term", action="append", default=[])
    parser.add_argument("--source", help="UTF-8 source resource for invariant comparison")
    parser.add_argument("path", help="UTF-8 target path or - for stdin")
    args = parser.parse_args()

    try:
        text = read_input(args.path)
        source_text = read_input(args.source) if args.source else None
    except (OSError, UnicodeError) as error:
        print(f"cannot read input: {error}", file=sys.stderr)
        return 2

    failures, warnings = check_generic(
        text,
        args.locale,
        args.format_name,
        args.brand_term,
        source_text=source_text,
        source_name=args.source or "",
        target_name=args.path,
    )

    zh_result: subprocess.CompletedProcess[str] | None = None
    if args.locale == "zh-CN" and args.format_name == "prose" and not failures:
        checker = Path(__file__).with_name("check_zh_cn.py")
        checker_path = args.path if args.path != "-" else "-"
        zh_result = subprocess.run(
            [sys.executable, str(checker), checker_path],
            input=text if checker_path == "-" else None,
            text=True,
            capture_output=True,
        )

    if failures:
        print("\n".join(f"- {failure}" for failure in failures))
    if warnings:
        print("\n需要人工判断")
        print("\n".join(f"- {warning}" for warning in warnings))
    if zh_result is not None:
        if zh_result.stdout:
            print(zh_result.stdout.rstrip())
        if zh_result.stderr:
            print(zh_result.stderr.rstrip(), file=sys.stderr)

    if failures:
        return 1
    if zh_result is not None and zh_result.returncode:
        return zh_result.returncode
    print(f"OK locale={args.locale} format={args.format_name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
