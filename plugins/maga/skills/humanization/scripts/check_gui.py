#!/usr/bin/env python3
"""GUI component checks and source/target resource integrity checks."""

from __future__ import annotations

import json
import re
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
TRANSLATABLE_ATTRIBUTES = {"alt", "aria-label", "placeholder", "title"}
LOCALE_ATTRIBUTES = {"dir", "lang"}


class GUIHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.events: list[tuple[str, str, tuple[str, ...]]] = []
        self.stack: list[dict[str, Any]] = []
        self.lang: str | None = None
        self.saw_page = False
        self.title_parts: list[str] = []
        self.description = ""
        self.og_fields: set[str] = set()
        self.controls: list[dict[str, Any]] = []
        self.labels: list[dict[str, Any]] = []
        self.roles: list[dict[str, Any]] = []
        self.review_text: list[str] = []

    def _start(self, tag: str, attrs: list[tuple[str, str | None]], push: bool) -> None:
        tag = tag.lower()
        attr_map = {name.lower(): value or "" for name, value in attrs}
        event_kind = "start" if push else "startend"
        attribute_contract = tuple(
            sorted(
                name
                if (
                    name in TRANSLATABLE_ATTRIBUTES | LOCALE_ATTRIBUTES
                    or (
                        name == "value"
                        and tag == "input"
                        and attr_map.get("type", "").lower() in {"button", "submit", "reset"}
                    )
                    or (
                        name == "content"
                        and tag == "meta"
                        and (
                            attr_map.get("name", "").lower() == "description"
                            or attr_map.get("property", "").lower()
                            in {"og:title", "og:description"}
                        )
                    )
                )
                else f"{name}={value}"
                for name, value in attr_map.items()
            )
        )
        self.events.append((event_kind, tag, attribute_contract))
        if tag in {"html", "head", "body"}:
            self.saw_page = True
        if tag == "html":
            self.lang = attr_map.get("lang")
        if tag == "meta":
            if attr_map.get("name", "").lower() == "description":
                self.description = attr_map.get("content", "").strip()
            prop = attr_map.get("property", "").lower()
            if prop.startswith("og:") and attr_map.get("content", "").strip():
                self.og_fields.add(prop)

        label_index: int | None = None
        if tag == "label":
            label_index = len(self.labels)
            self.labels.append({"for": attr_map.get("for", ""), "text": []})

        control_index: int | None = None
        if tag in {"button", "input", "select", "textarea"}:
            control_index = len(self.controls)
            enclosing_label = next(
                (item["label"] for item in reversed(self.stack) if item["label"] is not None),
                None,
            )
            self.controls.append(
                {"tag": tag, "attrs": attr_map, "text": [], "label": enclosing_label}
            )
        elif tag == "img" and attr_map.get("alt", "").strip():
            enclosing_control = next(
                (item["control"] for item in reversed(self.stack) if item["control"] is not None),
                None,
            )
            if enclosing_control is not None:
                self.controls[enclosing_control]["text"].append(attr_map["alt"])

        role_index: int | None = None
        if attr_map.get("role", "").lower() in {"status", "alert"}:
            role_index = len(self.roles)
            self.roles.append(
                {"role": attr_map["role"].lower(), "attrs": attr_map, "text": []}
            )

        for name in ("content", "aria-label", "alt", "placeholder", "title", "value"):
            if attr_map.get(name):
                self.review_text.append(attr_map[name])

        if push:
            self.stack.append(
                {
                    "tag": tag,
                    "control": control_index,
                    "label": label_index,
                    "role": role_index,
                }
            )

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._start(tag, attrs, tag.lower() not in VOID_TAGS)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._start(tag, attrs, False)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        self.events.append(("end", tag, ()))
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index]["tag"] == tag:
                del self.stack[index:]
                break

    def handle_data(self, data: str) -> None:
        if not data.strip() or any(item["tag"] in {"script", "style"} for item in self.stack):
            return
        self.review_text.append(data)
        if any(item["tag"] == "title" for item in self.stack):
            self.title_parts.append(data)
        for item in self.stack:
            if item["control"] is not None:
                self.controls[item["control"]]["text"].append(data)
            if item["label"] is not None:
                self.labels[item["label"]]["text"].append(data)
            if item["role"] is not None:
                self.roles[item["role"]]["text"].append(data)


def parse_html(text: str) -> GUIHTMLParser:
    parser = GUIHTMLParser()
    parser.feed(text)
    parser.close()
    return parser


def looks_like_html(text: str, name: str) -> bool:
    suffix = Path(name).suffix.lower()
    if suffix in {".json", ".arb", ".yaml", ".yml", ".po"}:
        return False
    return suffix in {".html", ".htm"} or bool(
        re.search(r"<[A-Za-z][\w:-]*(?:\s|/?>)", text)
    )


def check_html(text: str, locale: str) -> tuple[list[str], str, GUIHTMLParser]:
    parser = parse_html(text)
    failures: list[str] = []
    if parser.saw_page:
        if parser.lang != locale:
            failures.append(f"lang must be declared as {locale}")
        if not "".join(parser.title_parts).strip():
            failures.append("<title> must be non-empty")
        if not parser.description:
            failures.append("meta[name=description] must have non-empty content")

    for control in parser.controls:
        attrs = control["attrs"]
        control_id = attrs.get("id", "")
        explicit_label = any(
            label["for"] == control_id and "".join(label["text"]).strip()
            for label in parser.labels
        ) if control_id else False
        wrapped_label = (
            control["label"] is not None
            and bool("".join(parser.labels[control["label"]]["text"]).strip())
        )
        labelled = explicit_label or wrapped_label
        aria = bool(attrs.get("aria-label", "").strip() or attrs.get("aria-labelledby", "").strip())
        visible = bool("".join(control["text"]).strip()) if control["tag"] == "button" else False
        input_value = control["tag"] == "input" and attrs.get("type", "").lower() in {"button", "submit", "reset"} and bool(attrs.get("value", "").strip())
        image_alt = control["tag"] == "input" and attrs.get("type", "").lower() == "image" and bool(attrs.get("alt", "").strip())
        hidden = control["tag"] == "input" and attrs.get("type", "").lower() == "hidden"
        if not hidden and not (labelled or aria or visible or input_value or image_alt):
            failures.append(f"<{control['tag']}> needs visible text, label, or aria-label")

    for item in parser.roles:
        if not "".join(item["text"]).strip() and not item["attrs"].get("aria-label", "").strip():
            failures.append(f"role={item['role']} must contain text")

    if parser.og_fields:
        for field in ("og:title", "og:type", "og:url", "og:image"):
            if field not in parser.og_fields:
                failures.append(f"missing Open Graph field {field}")
    return failures, " ".join(parser.review_text), parser


def _compare_json(source: Any, target: Any, path: str, failures: list[str]) -> None:
    if type(source) is not type(target):
        failures.append(f"resource type changed at {path}")
        return
    if isinstance(source, dict):
        source_keys, target_keys = set(source), set(target)
        for key in sorted(source_keys - target_keys):
            failures.append(f"resource key missing: {path}.{key}")
        for key in sorted(target_keys - source_keys):
            failures.append(f"resource key added: {path}.{key}")
        for key in sorted(source_keys & target_keys):
            _compare_json(source[key], target[key], f"{path}.{key}", failures)
    elif isinstance(source, list):
        if len(source) != len(target):
            failures.append(f"resource list length changed at {path}")
        for index, (source_item, target_item) in enumerate(zip(source, target)):
            _compare_json(source_item, target_item, f"{path}[{index}]", failures)
    elif not isinstance(source, str) and source != target:
        failures.append(f"non-string resource value changed at {path}")


def check_resource_integrity(
    source_text: str, target_text: str, source_name: str, target_name: str
) -> list[str]:
    failures: list[str] = []
    source_suffix = Path(source_name).suffix.lower()
    target_suffix = Path(target_name).suffix.lower()
    if source_suffix in {".json", ".arb"} and target_suffix in {"", ".json", ".arb"}:
        try:
            source_json = json.loads(source_text)
            target_json = json.loads(target_text)
        except json.JSONDecodeError as error:
            return [f"invalid JSON/ARB resource: {error.msg}"]
        _compare_json(source_json, target_json, "$", failures)
    elif looks_like_html(source_text, source_name) and looks_like_html(target_text, target_name):
        source_parser = parse_html(source_text)
        target_parser = parse_html(target_text)
        if source_parser.events != target_parser.events:
            failures.append("HTML markup or attribute structure changed")
    return failures


def check_gui(text: str, locale: str, target_name: str) -> tuple[list[str], str]:
    if Path(target_name).suffix.lower() in {".json", ".arb"}:
        try:
            resource = json.loads(text)
        except json.JSONDecodeError as error:
            return [f"invalid JSON/ARB resource: {error.msg}"], text

        strings: list[str] = []

        def collect(value: Any) -> None:
            if isinstance(value, str):
                strings.append(value)
            elif isinstance(value, dict):
                for item in value.values():
                    collect(item)
            elif isinstance(value, list):
                for item in value:
                    collect(item)

        collect(resource)
        return [], " ".join(strings)
    if looks_like_html(text, target_name):
        failures, review_text, _ = check_html(text, locale)
        return failures, review_text
    return [], text
