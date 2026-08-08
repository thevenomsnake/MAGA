#!/usr/bin/env python3
"""Backward-compatible alias for the zh-CN-specific prose checker."""

from check_zh_cn import main


if __name__ == "__main__":
    raise SystemExit(main())
