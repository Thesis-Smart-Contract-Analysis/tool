from libsast import Scanner
import argparse
import json, logging, subprocess, os, re
from datetime import datetime


SEMGREP_RULES = "./core/rules/"
SEMGREP_DETECT_VERSION_RULE = "./services/solidity-version.yaml"
SEMGREP_DETECT_VERSION_RULE_ID = "solidity-version"
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
DEFAULT_VERSION = "0.8.25"

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
MATCH_STRING = "match_string"

SLITHER_SEMGREP_VULN_MAPPINGS = {
    "encode-packed-collision": "swe-133",
    "multiple-constructors": "swe-146",
    "rtlo": "swe-130",
    "shadowing-state": "swe-119",
    "shadowing-abstract": "swe-119",
    "shadowing-local": "swe-119",
    "suicidal": "swe-106",
    "uninitialized-storage": "swe-109",
    "controlled-array-length": "swe-124",
    "controlled-delegatecall": "swe-113",
    "reentrancy-eth": "swe-107",
    "reentrancy-no-eth": "swe-107",
    "unchecked-transfer": "swe-104",
    "unchecked-send": "swe-104",
    "unchecked-lowlevel": "swe-104",
    "weak-prng": "swe-120",
    "domain-separator-collision": "swe-158",
    "locked-ether": "swe-138",
    "tx-origin": "swe-115",
    "calls-loop": "swe-113",
    "incorrect-unary": "swe-129",
    "timestamp": "swe-116",
    "shadowing-builtin": "swe-154",
}
SEMGREP_ID = "semgrep-id"
DUPLICATED = "duplicated"
INFORMATIONAL = "Informational"
FULL_COVERAGE = "full_coverage"

SCAN_TIME = "scan_time"

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def parse_args() -> "tuple[str, str, str]":
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
    parser.add_argument(
        "-v",
        "--version",
        help="Specify the version of the smart contract",
        default=DEFAULT_VERSION,
        metavar="VERSION",
    )
    args = parser.parse_args()
    return (args.target, args.rules, args.version)


def detect_version(target: str):
    scanner: Scanner = init_scanner([target], SEMGREP_DETECT_VERSION_RULE)
    res = scanner.scan()
    semgrep_res = res[SEMGREP]

    if (
        MATCHES in semgrep_res
        and SEMGREP_DETECT_VERSION_RULE_ID in semgrep_res[MATCHES]
    ):
        files = semgrep_res[MATCHES][SEMGREP_DETECT_VERSION_RULE_ID][FILES]
        match_string = files[0][MATCH_STRING]
        version = re.findall("[0-9.*]+", match_string)[0]
        return version

    return DEFAULT_VERSION


def scan(target: str, rules=SEMGREP_RULES, version=DEFAULT_VERSION) -> dict:
    # Scan with Semgrep
    logging.info("🔍 Scanning with Semgrep")
    start_time = datetime.now()
    res: dict = semgrep_scan(target, rules)
    end_time = datetime.now()
    semgrep_scan_time = end_time - start_time
    logging.info("🕒 Scan time: %s", semgrep_scan_time)
    res[SEMGREP][SCAN_TIME] = semgrep_scan_time.total_seconds()

    # Scan with Slither
    logging.info("🔍 Scanning with Slither")
    start_time = datetime.now()
    slither_res: dict = slither_scan(target, version)
    end_time = datetime.now()
    slither_scan_time = end_time - start_time
    logging.info("🕒 Scan time: %s", slither_scan_time)
    slither_res[SCAN_TIME] = slither_scan_time.total_seconds()

    # Scan with Mythril
    logging.info("🔍 Scanning with Mythril")
    start_time = datetime.now()
    mythril_res: dict = mythril_scan(target, version)
    end_time = datetime.now()
    mythril_scan_time = end_time - start_time
    logging.info("🕒 Scan time: %s", mythril_scan_time)
    mythril_res[SCAN_TIME] = mythril_scan_time.total_seconds()

    # Aggregate results
    res[SLITHER] = slither_res
    res[MYTHRIL] = mythril_res

    # Normalize results
    normalize(res)

    # Mark duplicated findings
    mark_duplicated(res)

    # Calculate total scan time
    total_scan_time = semgrep_scan_time + slither_scan_time + mythril_scan_time
    res[SCAN_TIME] = total_scan_time.total_seconds()

    return res


def semgrep_scan(target: str, rules: str) -> dict:
    scanner: Scanner = init_scanner([target], rules)
    json = scanner.scan()
    return json


def init_scanner(targets: list, rules: str) -> Scanner:
    options = SEMGREP_SCANNER_OPTIONS
    options["sgrep_rules"] = rules
    options["sgrep_extensions"] = {"*", ".sol"}
    options["show_progress"] = False
    return Scanner(options, targets)


def slither_scan(target: str, version: str) -> dict:
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
        "--solc-solcs-select",
        version,
        "--json",
        filepath,
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)

    # Read json from file
    with open(filepath, "r") as f:
        json_data = json.load(f)

    # Remove file
    os.remove(filepath)

    return json_data


def mythril_scan(target: str, version: str) -> dict:
    # Get file path
    filepath = os.path.abspath(target)

    cmd = ["myth", "analyze", filepath, "-o", "json", "--solv", version]
    completed_process = subprocess.run(cmd, capture_output=True, text=True)
    json_str = completed_process.stdout

    return json.loads(json_str)


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

        # Remove informational findings
        findings = [finding for finding in findings if finding[IMPACT] != INFORMATIONAL]

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
            metadata[ID] = "swc-" + finding.pop(SWC_ID)
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

        # Merge finding with same metadata (not including severity)
        findings_hash_table = {}
        for finding in findings:
            metadata = finding[METADATA]
            hashed_metadata = hash_mythril_metadata(metadata)
            if hashed_metadata not in findings_hash_table:
                findings_hash_table[hashed_metadata] = finding
            else:
                findings_hash_table[hashed_metadata][MATCHES].extend(finding[MATCHES])
                finding[DUPLICATED] = True

        # Remove findings marked as duplicated
        findings = [
            finding for finding in findings_hash_table.values() if DUPLICATED not in finding
        ]

    return findings


def hash_mythril_metadata(metadata: dict) -> str:
    # Exclude severity
    metadata_for_hash = metadata.copy()
    metadata_for_hash.pop(SEVERITY)
    return hash(json.dumps(metadata_for_hash))


def sort_keys(json: dict) -> dict:
    keys = list(json.keys())
    keys.sort()
    return {key: json[key] for key in keys}


def mark_duplicated(res: dict) -> dict:
    is_duplicated = False

    # Find ids in semgrep res
    semgrep_res = res[SEMGREP]
    semgrep_findings = semgrep_res[FINDINGS]
    semgrep_ids = []
    for finding in semgrep_findings:
        metadata = finding[METADATA]
        semgrep_ids.append(metadata[ID])

    # Mark duplicated slither findings
    slither_res = res[SLITHER]
    slither_findings = slither_res[FINDINGS]
    for finding in slither_findings:
        metadata = finding[METADATA]
        slither_id = metadata[ID]
        if slither_id in SLITHER_SEMGREP_VULN_MAPPINGS:
            semgrep_id = SLITHER_SEMGREP_VULN_MAPPINGS[slither_id]
            metadata[SEMGREP_ID] = semgrep_id
            metadata[DUPLICATED] = semgrep_id in semgrep_ids
            is_duplicated = is_duplicated or metadata[DUPLICATED]

    # Mark duplicated mythril findings
    mythril_res = res[MYTHRIL]
    mythril_findings = mythril_res[FINDINGS]
    for finding in mythril_findings:
        metadata = finding[METADATA]
        mythril_id = metadata[ID]
        for semgrep_id in semgrep_ids:
            if mythril_id.split("-")[1] == semgrep_id.split("-")[1]:
                metadata[SEMGREP_ID] = semgrep_id
                metadata[DUPLICATED] = True
                is_duplicated = is_duplicated or metadata[DUPLICATED]

    # Mark duplicated semgrep findings
    res[FULL_COVERAGE] = is_duplicated


if __name__ == "__main__":
    # Parse command line arguments
    target, rules, version = parse_args()

    # Detect version
    if version == DEFAULT_VERSION:
        version = detect_version(target)

    # Perform scanning
    res = scan(target, rules, version)
    print(json.dumps(res, indent=4))
