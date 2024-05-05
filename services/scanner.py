from libsast import Scanner
import argparse
import json, os

RULES = "./core/rules/"
SCANNER_OPTIONS: "dict[str, any]" = {
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

def parse_args() -> "tuple[str, list[str]]":
    parser = argparse.ArgumentParser(
        prog="python3 scanner.py",
        description="Scan smart contracts for vulnerabilities",
    )
    parser.add_argument(
        "-r",
        "--rules",
        help="Path to directory containing semgrep rules",
        default=RULES,
        metavar="RULES",
    )
    parser.add_argument(
        "-t",
        "--targets",
        help="Path to directory containing tests",
        metavar="TARGETS",
        nargs="*",
        required=True,
    )
    args = parser.parse_args()
    return (args.rules, args.targets)


def init_scanner(targets: list, rules=RULES) -> Scanner:
    # Convert to absolute paths
    # rules = os.path.abspath(rules)
    # targets = [os.path.abspath(target) for target in targets]

    # Initialize scanner options
    options = SCANNER_OPTIONS
    options["sgrep_rules"] = rules
    options["sgrep_extensions"] = {"*", ".sol"}
    options["show_progress"] = True
    return Scanner(options, targets)


if __name__ == "__main__":
    rules, targets = parse_args()
    print(f"Rules: {rules}")
    print(f"Targets: {targets}")

    # Initialize the scanner
    scanner: Scanner = init_scanner(rules, targets)

    # Perform scanning
    res: dict = scanner.scan()
    print(json.dumps(res, indent=2))
