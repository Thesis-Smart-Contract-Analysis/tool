from libsast import Scanner
import argparse
import json, logging, subprocess, os


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
        "--target",
        help="Path to a smart contract",
        metavar="TARGET",
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
    return (args.target, args.rules)


def init_scanner(targets: list, rules: str) -> Scanner:
    options = SCANNER_OPTIONS
    options["sgrep_rules"] = rules
    options["sgrep_extensions"] = {"*", ".sol"}
    options["show_progress"] = True
    return Scanner(options, targets)


def semgrep_scan(target: str, rules=RULES) -> dict:
    scanner: Scanner = init_scanner([target], rules)
    json = scanner.scan()
    return json


def slither_scan(target: str) -> dict:
    # Get file name and file path
    filename = target.split("/")[-1].split(".")[0]
    filepath = f"./services/{filename}.json"

    # Delete file if existed
    try:
        os.remove(filepath)
    except FileNotFoundError:
        pass

    # Build and execute the command
    cmd = [
        "slither",
        target,
        "--solc-disable-warnings",
        "--exclude-optimization",
        "--exclude-informational",
        "--json",
        filepath,
    ]
    subprocess.run(cmd)

    # Read json from file
    with open(filepath, "r") as f:
        json_data = json.load(f)

    # Remove file
    os.remove(filepath)

    return json_data


def mythril_scan(target: str) -> dict:
    # Get file path
    filepath = os.path.abspath(target)

    cmd = ["myth", "analyze", filepath, "-o", "json"]
    completed_process = subprocess.run(cmd, capture_output=True, text=True)
    json_str = completed_process.stdout

    return json.loads(json_str)


def scan(target: str, rules: str) -> dict:
    # Scan with Semgrep
    res: dict = semgrep_scan(target, rules)

    # Scan with Slither
    slither_res: dict = slither_scan(target)

    # Scan with Mythril
    mythril_res: dict = mythril_scan(target)

    # Aggregate results
    res["slither"] = slither_res
    res["mythril"] = mythril_res
    return res


if __name__ == "__main__":
    # Parse command line arguments
    target, rules = parse_args()

    # Perform scanning
    res = scan(target, rules)
    print(json.dumps(res, indent=4))
