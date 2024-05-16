from libsast import Scanner
import argparse
import json, logging, subprocess, os


SEMGREP_RULES = "./core/rules/"
SEMGREP_SCANNER_OPTIONS: "dict[str, any]" = {
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

SEMGREP = "semantic_grep"
SLITHER = "slither"
MYTHRIL = "mythril"

ERRORS = "errors"
SUCCESS = "success"
MATCHES = "matches"
ID = "id"
RESULTS = "results"
DETECTORS = "detectors"
ISSUES = "issues"

FILES = "files"
ELEMENTS = "elements"
FINDINGS = "findings"

METADATA = "metadata"
DESCRIPTION = "description"
CHECK = "check"
IMPACT = "impact"
SEVERITY = "severity"
TITLE = "title"
SWC_ID = "swc-id"
TX_SEQUENCE = "tx_sequence"

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
        default=SEMGREP_RULES,
        metavar="RULES",
    )
    args = parser.parse_args()
    return (args.target, args.rules)


def init_scanner(targets: list, rules: str) -> Scanner:
    options = SEMGREP_SCANNER_OPTIONS
    options["sgrep_rules"] = rules
    options["sgrep_extensions"] = {"*", ".sol"}
    options["show_progress"] = True
    return Scanner(options, targets)


def semgrep_scan(target: str, rules: str) -> dict:
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


def scan(target: str, rules=SEMGREP_RULES) -> dict:
    # Scan with Semgrep
    res: dict = semgrep_scan(target, rules)

    # Scan with Slither
    slither_res: dict = slither_scan(target)

    # Scan with Mythril
    mythril_res: dict = mythril_scan(target)

    # Aggregate results
    res[SLITHER] = slither_res
    res[MYTHRIL] = mythril_res

    # Normalize results
    normalize(res)

    return res


def normalize(res: dict):
    tools = [SEMGREP, SLITHER, MYTHRIL]
    normalizers = {
        SEMGREP: normalize_semgrep_findings,
        SLITHER: normalize_slither_findings,
        MYTHRIL: normalize_mythril_findings,
    }

    for tool in tools:
        if tool in res:
            tool_res = res[tool]
            normalizer = normalizers[tool]
            # 'success'
            set_success(tool_res)
            # 'findings'
            findings = normalizer(tool_res)
            for i in range(len(findings)):
                findings[i] = sort_keys(findings[i])
            res[tool][FINDINGS] = findings
            # Sort keys
            res[tool] = sort_keys(tool_res)


def set_success(res: dict):
    if ERRORS in res:
        res[SUCCESS] = len(res[ERRORS]) == 0


def normalize_semgrep_findings(res: dict) -> list[dict]:
    if MATCHES in res:
        findings = []
        for rule_id, finding in res[MATCHES].items():
            # Convert 'matches' from dict to array
            findings.append(finding)
            # Add rule_id as 'id' in metadata
            finding[METADATA][ID] = rule_id
            # Rename 'files' to 'matches'
            finding[MATCHES] = finding.pop(FILES)
        # Remove 'matches'
        res.pop(MATCHES)

    return findings


def normalize_slither_findings(res: dict) -> list[dict]:
    if RESULTS in res and DETECTORS in res[RESULTS]:
        # Move 'detectors' one level up and overwrite 'results' as 'findings'
        findings = res[RESULTS].pop(DETECTORS)
        for finding in findings:
            # Rename 'elements' to 'matches'
            finding[MATCHES] = finding.pop(ELEMENTS)
            # Move 'description' to 'metadata'
            finding[METADATA] = {}
            metadata = finding[METADATA]
            metadata[DESCRIPTION] = finding.pop(DESCRIPTION)
            # Move 'check' to 'metadata' and rename to 'id'
            metadata[ID] = finding.pop(CHECK)
            # Move 'impact' to 'metadata' and rename to 'severity'
            # TODO: Normalize severity
            metadata[SEVERITY] = finding.pop(IMPACT)
            # Move the rest of the keys to 'metadata'
            for key in finding.copy():
                if key in [MATCHES, METADATA]:
                    continue
                if key not in metadata:
                    metadata[key] = finding.pop(key)
                else:
                    finding.pop(key)
        # Remove 'results'
        res.pop(RESULTS)

    return findings


def normalize_mythril_findings(res: dict) -> list[dict]:
    if ISSUES in res:
        # Rename 'issues' to 'findings'
        findings = res.pop(ISSUES)
        for finding in findings:
            # Construct 'metadata'
            finding[METADATA] = {}
            metadata = finding[METADATA]
            metadata[DESCRIPTION] = finding.pop(DESCRIPTION)
            metadata[SEVERITY] = finding.pop(SEVERITY)
            metadata[SWC_ID] = finding.pop(SWC_ID)
            metadata[TITLE] = finding.pop(TITLE)
            # Construct 'matches'
            matches = []
            match = {}
            for key in finding.copy():
                if key is not METADATA:
                    # Move the rest of the keys to 'matches'
                    if key != TX_SEQUENCE:
                        match[key] = finding.pop(key)
                    # Exclude 'tx_sequence' from 'matches'
                    else:
                        finding.pop(key)
            matches.append(match)
            finding[MATCHES] = matches

    return findings


def sort_keys(json: dict) -> dict:
    keys = list(json.keys())
    keys.sort()
    return {key: json[key] for key in keys}


if __name__ == "__main__":
    # Parse command line arguments
    target, rules = parse_args()

    # Perform scanning
    res = scan(target, rules)
    print(json.dumps(res, indent=4))
