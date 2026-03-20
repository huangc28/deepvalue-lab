#!/usr/bin/env python3
import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build or publish a DeepValue stock analysis payload."
    )
    parser.add_argument("--ticker", required=True)
    parser.add_argument("--report", required=True)
    parser.add_argument("--detail", required=True)
    parser.add_argument("--detail-zh", required=True, dest="detail_zh")
    parser.add_argument("--base-url", default="http://localhost:9000")
    parser.add_argument("--provenance", default="codex-gpt-5")
    parser.add_argument(
        "--payload",
        action="store_true",
        help="Print the request body JSON instead of publishing it.",
    )
    return parser.parse_args()


def read_text(path_str: str) -> str:
    path = Path(path_str)
    if not path.is_file():
        raise FileNotFoundError(f"Missing file: {path}")
    return path.read_text()


def read_json(path_str: str) -> object:
    path = Path(path_str)
    if not path.is_file():
        raise FileNotFoundError(f"Missing file: {path}")
    return json.loads(path.read_text())


def build_payload(args: argparse.Namespace) -> dict:
    return {
        "report": {
            "markdown": read_text(args.report),
            "provenance": args.provenance,
        },
        "stockDetail": read_json(args.detail),
        "stockDetailZhTW": read_json(args.detail_zh),
    }


def publish(args: argparse.Namespace, payload: dict) -> int:
    body = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        url=f"{args.base_url.rstrip('/')}/v1/stocks/{args.ticker.upper()}/reports",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request) as response:
            sys.stdout.write(response.read().decode("utf-8"))
            sys.stdout.write("\n")
            return 0
    except urllib.error.HTTPError as exc:
        sys.stderr.write(exc.read().decode("utf-8"))
        sys.stderr.write("\n")
        return 1


def main() -> int:
    args = parse_args()
    payload = build_payload(args)
    if args.payload:
        json.dump(payload, sys.stdout, ensure_ascii=False, indent=2)
        sys.stdout.write("\n")
        return 0
    return publish(args, payload)


if __name__ == "__main__":
    raise SystemExit(main())
