from libsast import Scanner
import argparse
import json, logging


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

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def parse_args() -> "tuple[str, list[str]]":
    parser = argparse.ArgumentParser(
        prog="python3 scanner.py",
        description="Scan smart contracts for vulnerabilities",
    )
    parser.add_argument(
        "-t",
        "--targets",
        help="Path to directory containing tests",
        metavar="TARGETS",
        nargs="*",
        required=True,
    )
    parser.add_argument(
        "-r",
        "--rules",
        help="Path to directory containing semgrep rules",
        default=RULES,
        metavar="RULES",
    )
    args = parser.parse_args()
    return (args.targets, args.rules)


def init_scanner(targets: list, rules=RULES) -> Scanner:
    logging.info(f"Targets: {targets}")
    logging.info(f"Rules: {rules}")

    options = SCANNER_OPTIONS
    options["sgrep_rules"] = rules
    options["sgrep_extensions"] = {"*", ".sol"}
    options["show_progress"] = True
    return Scanner(options, targets)


if __name__ == "__main__":
    # Parse command line arguments
    targets, rules = parse_args()

    # Initialize the scanner
    scanner: Scanner = init_scanner(targets, rules)

    # Perform scanning
    res: dict = scanner.scan()
    print(json.dumps(res, indent=2))
