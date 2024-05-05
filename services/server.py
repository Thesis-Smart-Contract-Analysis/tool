from flask import Flask, request
from scanner import init_scanner
import json, os

app = Flask(__name__)

@app.route("/scan", methods=["GET"])
def scan():
    # Get query params
    request_args: dict = request.args
    rules = request_args.get("rules", "")
    targets = [request_args.get("targets")]

    # TODO: validate query params
    app.logger.info(f"Rules: {rules}")
    app.logger.info(f"Targets: {targets}")

    # Initialize the scanner
    scanner = init_scanner(rules, targets)

    # Perform scanning
    res = scanner.scan()
    return json.dumps(res, indent=2, sort_keys=True)

@app.route("/")
def home():
    return "<p>Welcome to the Smart Contract Scanner!</p>"
