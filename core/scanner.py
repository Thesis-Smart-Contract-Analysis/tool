from libsast import Scanner
import argparse
import json
import sys

ScannerOptions = {
    "sgrep_rules": None,
    "sgrep_extensions": None,
    "match_rules": None,
    "match_extensions": None,
    "choice_rules": None,
    "choice_extensions": None,
    "alternative_path": None,
    "ignore_filenames": None,
    "ignore_extensions": None,
    "ignore_paths": None,
    "show_progress": False,
}


def parse_args() -> "tuple[str, list]":
    parser = argparse.ArgumentParser(
        prog="python3 scanner.py",
        description="Scan smart contracts for vulnerabilities",
    )
    parser.add_argument(
        "-r",
        "--rules",
        help="Path to directory containing semgrep rules",
        default="./core/rules/",
        metavar="RULES",
    )
    parser.add_argument(
        "-t",
        "--targets",
        help="Path to directory containing tests",
        default=["./core/tests/swe-100"],
        metavar="TARGETS",
        nargs="*",
    )
    args = parser.parse_args()
    return (args.rules, args.targets)


def init_scanner(rules: str, targets: list) -> Scanner:
    options = ScannerOptions
    options["sgrep_rules"] = rules
    options["sgrep_extensions"] = {"*", ".sol"}
    options["show_progress"] = True
    return Scanner(options, targets)


rules, targets = parse_args()
scanner = init_scanner(rules, targets)
res = scanner.scan()
print(json.dumps(res, indent=2))
