import argparse
import json, logging, subprocess, os, re
from datetime import datetime


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
DEFAULT_VERSION = "0.8.25"

SEMGREP = "semantic_grep"
SLITHER = "slither"
MYTHRIL = "mythril"
ERRORS = "errors"
MATCHES = "matches"
ID = "id"
CHECK_ID = "check_id"
RESULTS = "results"
DETECTORS = "detectors"
ISSUES = "issues"
FINDINGS = "findings"
METADATA = "metadata"
DESCRIPTION = "description"
EXTRA = "extra"
SEVERITY = "severity"

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
    "controlled-delegatecall": "swe-112",
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
}
SEMGREP_ID = "semgrep-id"
DUPLICATED = "duplicated"
# DUPLICATED_WITH_SLITHER = "duplicated-with-slither"


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
    SEMGREP_DETECT_VERSION_RULE = "./services/solidity-version.yaml"
    SEMGREP_DETECT_VERSION_RULE_ID = "solidity-version"
    METAVARS = "metavars"
    VERSION_VAR = "$VERSION"
    ABSTRACT_CONTENT = "abstract_content"

    version = DEFAULT_VERSION
    semgrep_res = semgrep_scan(target, SEMGREP_DETECT_VERSION_RULE)

    if RESULTS not in semgrep_res:
        return version

    for result in semgrep_res[RESULTS]:
        if result[CHECK_ID].split(".")[-1] != SEMGREP_DETECT_VERSION_RULE_ID:
            continue
        metavars = result[EXTRA][METAVARS]
        if VERSION_VAR in metavars:
            version = metavars[VERSION_VAR][ABSTRACT_CONTENT]
            return version

    return version


def scan(target: str, rules=SEMGREP_RULES, version=DEFAULT_VERSION) -> dict:
    SCAN_TIME = "scan_time"

    res: dict = {}

    # Scan with Semgrep
    logging.info("🔍 Scanning with Semgrep")
    start_time = datetime.now()
    res[SEMGREP] = semgrep_scan(target, rules)
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
    filepath = os.path.abspath(target)

    cmd = ["semgrep", "scan", "--config", rules, "--json", "--quiet", filepath]
    completed_process = subprocess.run(cmd, capture_output=True, text=True)
    json_str = completed_process.stdout
    return json.loads(json_str)


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
    filepath = os.path.abspath(target)

    cmd = [
        "myth",
        "a",
        "-o",
        "json",
        "--solv",
        version,
        "--parallel-solving",
        "--execution-timeout",
        "10",
        filepath,
    ]
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
            # 'errors'
            normalize_errors(tool_res)
            # 'success'
            set_success(tool_res)
            # 'findings'
            findings = normalizer(tool_res)
            for i in range(len(findings)):
                findings[i] = sort_keys(findings[i])
            res[tool][FINDINGS] = findings
            # Sort keys
            res[tool] = sort_keys(tool_res)


def normalize_errors(res: dict):
    ERROR = "error"

    if ERROR in res:
        res[ERRORS] = res.pop(ERROR)
        if res[ERRORS] == None:
            res[ERRORS] = []


def set_success(res: dict):
    SUCCESS = "success"

    if ERRORS in res:
        res[SUCCESS] = len(res[ERRORS]) == 0


def normalize_semgrep_findings(res: dict) -> list[dict]:
    MESSAGE = "message"
    PATH = "path"
    START = "start"
    END = "end"
    LINES = "lines"
    INTERFILE_LANGUAGES_USED = "interfile_languages_used"
    SKIPPED_RULES = "skipped_rules"
    VERSION = "version"
    PATHS = "paths"

    findings = []

    if RESULTS in res:
        findings = res.pop(RESULTS)
        for finding in findings:
            # Construct 'metadata'
            finding[METADATA] = finding[EXTRA].pop(METADATA)
            metadata = finding[METADATA]
            metadata[MESSAGE] = finding[EXTRA].pop(MESSAGE)
            metadata[SEVERITY] = finding[EXTRA].pop(SEVERITY).capitalize()
            metadata[ID] = finding.pop(CHECK_ID).split(".")[-1]
            # Construct 'matches'
            finding[MATCHES] = []
            matches = finding[MATCHES]
            match = {}
            match[PATH] = finding.pop(PATH)
            match[START] = finding.pop(START)
            match[END] = finding.pop(END)
            match[LINES] = finding[EXTRA].pop(LINES)
            matches.append(match)
            finding.pop(EXTRA)

    # Remove redundant keys
    res.pop(INTERFILE_LANGUAGES_USED)
    res.pop(SKIPPED_RULES)
    res.pop(VERSION)
    res.pop(PATHS)

    return findings


def normalize_slither_findings(res: dict) -> list[dict]:
    ELEMENTS = "elements"
    CHECK = "check"
    IMPACT = "impact"

    findings = []

    if RESULTS in res and DETECTORS in res[RESULTS]:
        # Move 'detectors' one level up and overwrite 'results' as 'findings'
        findings = res[RESULTS].pop(DETECTORS)

        # Remove informational findings
        # findings = [finding for finding in findings if finding[IMPACT] != INFORMATIONAL]

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
    LINENO = "lineno"
    REDUNDANT = "redundant"
    SWC_ID = "swc-id"
    TITLE = "title"
    TX_SEQUENCE = "tx_sequence"

    findings = []

    if ISSUES in res:
        # Rename 'issues' to 'findings'
        findings = res.pop(ISSUES)
        for finding in findings:
            # Skip finding if 'lineno' is not present
            if LINENO not in finding:
                finding[REDUNDANT] = True
                continue
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
                    # Exclude 'tx_sequence' from 'matches'
                    if key == TX_SEQUENCE:
                        finding.pop(key)
                    # Move the rest of the keys to 'matches'
                    else:
                        match[key] = finding.pop(key)
            matches.append(match)
            finding[MATCHES] = matches

        # Remove findings marked as redundant
        findings = [finding for finding in findings if REDUNDANT not in finding]

    return findings


# def hash_mythril_metadata(metadata: dict) -> str:
#     # Exclude severity
#     metadata_for_hash = metadata.copy()
#     metadata_for_hash.pop(SEVERITY)
#     return hash(json.dumps(metadata_for_hash))


def sort_keys(json: dict) -> dict:
    keys = list(json.keys())
    keys.sort()
    return {key: json[key] for key in keys}


def mark_duplicated(res: dict) -> dict:
    INFORMATIONAL = "Informational"
    FULL_COVERAGE = "full_coverage"

    is_all_duplicated = False

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
        metadata[DUPLICATED] = False
        # Skip informational findings
        severity = metadata[SEVERITY]
        if severity == INFORMATIONAL:
            continue
        slither_id = metadata[ID]
        if slither_id in SLITHER_SEMGREP_VULN_MAPPINGS:
            semgrep_id = SLITHER_SEMGREP_VULN_MAPPINGS[slither_id]
            metadata[SEMGREP_ID] = semgrep_id
            metadata[DUPLICATED] = semgrep_id in semgrep_ids
            is_all_duplicated = is_all_duplicated and metadata[DUPLICATED]

    # Find slither findings that have semgrep id
    # semgrep_ids_in_slither_res = [
    #     finding[METADATA][SEMGREP_ID]
    #     for finding in slither_findings
    #     if SEMGREP_ID in finding[METADATA]
    # ]

    # Mark duplicated mythril findings
    mythril_res = res[MYTHRIL]
    mythril_findings = mythril_res[FINDINGS]
    for finding in mythril_findings:
        metadata = finding[METADATA]
        mythril_id = metadata[ID]
        metadata[SEMGREP_ID] = "swe-" + mythril_id.split("-")[1]
        metadata[DUPLICATED] = False
        for semgrep_id in semgrep_ids:
            if "swe" not in semgrep_id:
                continue
            if mythril_id.split("-")[1] == semgrep_id.split("-")[1]:
                metadata[DUPLICATED] = True
                is_all_duplicated = is_all_duplicated and metadata[DUPLICATED]
        # Mark duplicated mythril findings with slither findings
        # for semgrep_id in semgrep_ids_in_slither_res:
        #     if mythril_id.split("-")[1] == semgrep_id.split("-")[1]:
        #         metadata[DUPLICATED_WITH_SLITHER] = True
        #         is_duplicated = is_duplicated and metadata[DUPLICATED_WITH_SLITHER]

    # Mark duplicated semgrep findings
    res[FULL_COVERAGE] = is_all_duplicated


if __name__ == "__main__":
    # Parse command line arguments
    target, rules, version = parse_args()

    # Detect version
    if version == DEFAULT_VERSION:
        version = detect_version(target)

    # Perform scanning
    res = scan(target, rules, version)
    print(json.dumps(res, indent=4))
