import argparse
import json, logging, subprocess, os, time
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
ALL = "all"
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
        "--tool",
        help="Specify the scanning tool",
        choices=[SEMGREP, SLITHER, MYTHRIL],
        default=SEMGREP,
        metavar="TOOL",
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
    return (args.tool, args.target, args.rules, args.version)


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


def scan(tool: str, target: str, rules=SEMGREP_RULES, version=DEFAULT_VERSION) -> dict:
    res: dict = {}

    # Scan with Semgrep
    if tool == SEMGREP:
        res = scan_with_scan_time(tool, semgrep_scan, target, rules)
    # Scan with Slither
    elif tool == SLITHER:
        res = scan_with_scan_time(tool, slither_scan, target, version)
    # Scan with Mythril
    elif tool == MYTHRIL:
        res = scan_with_scan_time(tool, mythril_scan, target, version)
    elif tool == ALL:
        res[SEMGREP] = scan(SEMGREP, target, rules=rules)
        res[SLITHER] = scan(SLITHER, target, version=version)
        res[MYTHRIL] = scan(MYTHRIL, target, version=version)
        return res

    # Normalize results
    res = normalize(tool, res)

    # Mark duplicated findings
    if tool == SLITHER or tool == MYTHRIL:
        mark_duplicated(res, tool)

    # Write to file
    with open(f"./services/outputs/{tool}_res.json", "w", encoding="utf-8") as f:
        json.dump(res, f, indent=2)

    return res


def scan_with_scan_time(tool: str, fn, *args, **kwargs) -> float:
    SCAN_TIME = "scan_time"

    logging.info(f"🔍 Scanning with {tool}")
    start_time = time.time()
    res = fn(*args, **kwargs)
    end_time = time.time()
    scan_time = end_time - start_time
    logging.info("🕒 Scan time: %s", scan_time)

    res[SCAN_TIME] = scan_time
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
        # "--execution-timeout",
        # "10",
        filepath,
    ]
    completed_process = subprocess.run(cmd, capture_output=True, text=True)
    json_str = completed_process.stdout

    return json.loads(json_str)


def normalize(tool: str, res: dict):
    normalizers = {
        SEMGREP: normalize_semgrep_findings,
        SLITHER: normalize_slither_findings,
        MYTHRIL: normalize_mythril_findings,
    }

    # 'errors'
    normalize_errors(res)
    # 'success'
    set_success(res)
    # 'findings'
    normalizer = normalizers[tool]
    findings = normalizer(res)
    print(findings)
    for i in range(len(findings)):
        findings[i] = sort_keys(findings[i])
    res[FINDINGS] = findings
    # Sort keys
    res = sort_keys(res)
    return res


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


def mark_duplicated(res: dict, tool: str) -> dict:
    INFORMATIONAL = "Informational"
    # FULL_COVERAGE = "full_coverage"
    SEMGREP_RES_FILE = f"./services/outputs/{SEMGREP}_res.json"

    # is_all_duplicated = False

    # Check if semgrep results file exists
    semgrep_res = {}
    if os.path.exists(SEMGREP_RES_FILE):
        # Load semgrep results
        with open(SEMGREP_RES_FILE, "r", encoding="utf-8") as f:
            semgrep_res = json.load(f)
    else:
        raise Exception("Semgrep results not found")

    # Find ids in semgrep res
    semgrep_findings = semgrep_res[FINDINGS]
    semgrep_ids = []
    for finding in semgrep_findings:
        metadata = finding[METADATA]
        semgrep_ids.append(metadata[ID])

    # Mark duplicated slither findings
    if tool == SLITHER:
        slither_findings = res[FINDINGS]
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
                # is_all_duplicated = is_all_duplicated and metadata[DUPLICATED]

    # Find slither findings that have semgrep id
    # semgrep_ids_in_slither_res = [
    #     finding[METADATA][SEMGREP_ID]
    #     for finding in slither_findings
    #     if SEMGREP_ID in finding[METADATA]
    # ]

    # Mark duplicated mythril findings
    elif tool == MYTHRIL:
        mythril_findings = res[FINDINGS]
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
                    # is_all_duplicated = is_all_duplicated and metadata[DUPLICATED]
            # Mark duplicated mythril findings with slither findings
            # for semgrep_id in semgrep_ids_in_slither_res:
            #     if mythril_id.split("-")[1] == semgrep_id.split("-")[1]:
            #         metadata[DUPLICATED_WITH_SLITHER] = True
            #         is_duplicated = is_duplicated and metadata[DUPLICATED_WITH_SLITHER]

    # Mark duplicated semgrep findings
    # res[FULL_COVERAGE] = is_all_duplicated


if __name__ == "__main__":
    # Parse command line arguments
    tool, target, rules, version = parse_args()

    # Detect version
    if version == DEFAULT_VERSION:
        version = detect_version(target)

    # Perform scanning
    res = scan(tool, target, rules, version)
    print(json.dumps(res, indent=4))
