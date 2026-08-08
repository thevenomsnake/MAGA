#!/usr/bin/env python3
"""One focused self-check for the three-module writing checker."""

from check_writing import check_generic

SLOP_SAMPLES = {
    "zh-CN": "这是一项革命性升级。",
    "zh-TW": "這是一項革命性的升級。",
    "en": "This is a revolutionary upgrade.",
    "ja": "これは革命的なアップグレードです。",
    "ko": "이것은 혁신적인 업그레이드입니다.",
    "es": "Es una mejora revolucionaria.",
}


def main() -> None:
    for locale, text in SLOP_SAMPLES.items():
        failures, warnings = check_generic(text, locale, "copy", [])
        assert not failures, (locale, failures)
        assert warnings, f"expected a locale review warning for {locale}"

    html = (
        '<html lang="en"><head><title>Settings</title>'
        '<meta name="description" content="Account settings"></head>'
        '<body><button>Save</button></body></html>'
    )
    failures, _ = check_generic(
        html, "en", "web-microcopy", [], target_name="page.html"
    )
    assert not failures, failures

    failures, _ = check_generic(
        '<button aria-hidden="true"></button>',
        "en",
        "web-microcopy",
        [],
        target_name="fragment.html",
    )
    assert any("needs visible text" in failure for failure in failures), failures

    failures, _ = check_generic(
        '<label>Search<input type="text"></label>',
        "en",
        "web-microcopy",
        [],
        target_name="fragment.html",
    )
    assert not failures, failures

    source_html = '<button id="save" data-action="save">Save</button>'
    target_html = '<button id="save" data-action="delete">Guardar</button>'
    failures, _ = check_generic(
        target_html,
        "es",
        "web-microcopy",
        [],
        source_text=source_html,
        source_name="source.html",
        target_name="target.html",
    )
    assert "HTML markup or attribute structure changed" in failures, failures

    source = '{"items": "{count, plural, one {# item} other {# items}}", "cta": "Open ${url}"}'
    target = '{"items": "{count, plural, one {# elemento} other {# elementos}}", "cta": "Abrir ${url}"}'
    failures, _ = check_generic(
        target,
        "es",
        "web-microcopy",
        [],
        source_text=source,
        source_name="source.json",
        target_name="target.json",
    )
    assert not failures, failures

    broken = '{"items": "{total, plural, one {# elemento} other {# elementos}}"}'
    failures, _ = check_generic(
        broken,
        "es",
        "web-microcopy",
        [],
        source_text=source,
        source_name="source.json",
        target_name="target.json",
    )
    assert any("protected token" in failure for failure in failures), failures
    assert any("resource key missing" in failure for failure in failures), failures

    failures, _ = check_generic("中文 — 文案", "zh-TW", "copy", [])
    assert not failures, failures
    print("check_writing smoke passed")


if __name__ == "__main__":
    main()
