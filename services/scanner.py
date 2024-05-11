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


def slither_scan(target: str) -> dict:
    # Get file name and file path
    filename = target.split("/")[-1].split(".")[0]
    filepath = f"./services/outputs/{filename}.json"

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
    return json_data


def mythril_scan(target: str) -> dict:
    # Get file path
    filepath = os.path.abspath(target)

    cmd = [
        "myth",
        "analyze",
        filepath,
        "-o",
        "json"
    ]
    completed_process = subprocess.run(cmd, capture_output=True, text=True)
    json_str = completed_process.stdout
    return json.loads(json_str)
    

if __name__ == "__main__":
    # Parse command line arguments
    targets, rules = parse_args()

    # Initialize the scanner
    scanner: Scanner = init_scanner(targets, rules)

    # Perform scanning
    print("🔍 Scanning with SemGrep")
    res: dict = scanner.scan()
    print(json.dumps(res, indent=2, sort_keys=True))

    # Scan with Slither
    print("🔍 Scanning with Slither")
    slither_res: dict = slither_scan(targets[0])
    print(json.dumps(slither_res, indent=2, sort_keys=True))

    # Scan with Mythril
    print("🔍 Scanning with Mythril")
    mythril_res: dict = mythril_scan(targets[0])
    print(json.dumps(mythril_res, indent=2, sort_keys=True))
    
