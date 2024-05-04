from libsast import Scanner
import argparse
import json
import os

def parse_args() -> "tuple[str, list]":
    parser = argparse.ArgumentParser(description='Scan source code for vulnerabilities')
    parser.add_argument('--sgrep_rule', help='Path to sgrep rules file')
    parser.add_argument('paths', nargs='*', help='Paths to source code to scan')
    args = parser.parse_args()
    return (args.sgrep_rule, args.paths)

def validate_paths(rule: str, paths: list):
    if not is_exist(rule):
        print("Rule file does not exist")
        exit(1)
    if not paths:
        print("No paths provided")
        exit(1)
    for path in paths:
        if not is_exist(path):
            print(f"Path {path} does not exist")
            exit(1)

def is_exist(path: str) -> bool:
    return os.path.exists(path)

def scan_file(options: dict, paths: list) -> dict:
    scanner = Scanner(options, paths)
    res = scanner.scan()
    return res

if __name__ == '__main__':
    rule, paths = parse_args()
    validate_paths(rule, paths)

    options = {
        "sgrep_rules": rule
    }
    res = scan_file(options, paths)
    print(json.dumps(res, indent=4))
    



