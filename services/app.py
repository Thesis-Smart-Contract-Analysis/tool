import json, os, uuid
from flask import Flask, request, send_from_directory, Response
from flask_cors import CORS
from werkzeug.utils import secure_filename
from scanner import detect_version, scan as perform_scan, SEMGREP, SLITHER, MYTHRIL, ALL
from answerer import SEVERITIES, generate


SERVICES_FOLDER = "./services"
ABS_SERVICES_FOLDER = os.path.abspath(SERVICES_FOLDER)
UPLOAD_FOLDER = os.path.join(ABS_SERVICES_FOLDER, "uploads")

app = Flask(__name__)
cors=CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/scan", methods=["GET"])
def scan():
    # Get query params
    request_args: dict = request.args
    tool = request_args.get("tool", "")
    filename = request_args.get("filename", "")
    string = request_args.get("string", "")

    # Only one of filename or string should be provided
    if filename and string:
        return (
            {"message": "Please provide either a filename or string"},
            400,
            {"Content-Type": "application/json"},
        )

    if tool == "":
        return (
            {"message": "Please provide a tool"},
            400,
            {"Content-Type": "application/json"},
        )
    if tool not in [SEMGREP, SLITHER, MYTHRIL, ALL]:
        return (
            {"message": "Invalid tool"},
            400,
            {"Content-Type": "application/json"},
        )

    if filename:
        # Sanitize the filename
        filename = secure_filename(filename)

        # Build the absolute path
        abs_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        app.logger.info(f"Scanning file: {abs_path}")

        # Check if the file exists
        if not os.path.exists(abs_path):
            res = {"message": "File not found"}
            return res, 404, {"Content-Type": "application/json"}

    elif string:
        app.logger.info(f"Scanning string:\n {string}")

        # Generate file name and build file path
        filename = uuid.uuid4().hex + ".sol"
        abs_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        # Save the string to a file
        with open(abs_path, "w") as f:
            f.write(string)
    else:
        return (
            {"message": "Please provide a filename or string"},
            400,
            {"Content-Type": "application/json"},
        )

    try:
        # Detect version
        version = detect_version(abs_path)
        app.logger.info(f"Detected version: {version}")

        # Perform scanning
        res = perform_scan(tool=tool, target=abs_path, version=version)
        return (
            json.dumps(res, indent=2, sort_keys=True),
            200,
            {"Content-Type": "application/json"},
        )
    except Exception as e:
        return (
            {"message": f"Error occurred while scanning: {e}"},
            500,
            {"Content-Type": "application/json"},
        )


@app.route("/upload", methods=["POST"])
def upload():
    # Get the file from the request
    file = request.files["filename"]
    filename = secure_filename(file.filename)

    # Build the absolute and URL path
    abs_path: str = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    url_path: str = f"/upload/{filename}"

    # Check if the file already exists
    if os.path.exists(abs_path):
        res = {"message": "File already exists", "path": url_path}
        return res, 400, {"Content-Type": "application/json"}

    # Save the file
    file.save(abs_path)

    # Return the URL path
    return {"path": url_path}, 200, {"Content-Type": "application/json"}


@app.route("/upload/<filename>", methods=["GET"])
def get_uploaded_file(filename):
    filename = secure_filename(filename)

    # Build the absolute path
    abs_path: str = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    # Check if the file exists
    if not os.path.exists(abs_path):
        res = {"message": "File not found"}
        return res, 404, {"Content-Type": "application/json"}

    # Return the file
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@app.route("/answer", methods=["GET", "POST"])
def answer():
    request_args: dict = request.args
    severity = request_args.get("severity", "")
    filename = request_args.get("filename", "")
    string = request_args.get("string", "")
    file_content = ""

    if severity == "":
        return (
            {"message": "Please provide a severity"},
            400,
            {"Content-Type": "application/json"},
        )
    if severity not in SEVERITIES:
        return (
            {"message": "Invalid severity"},
            400,
            {"Content-Type": "application/json"},
        )

    if filename:
        # app.logger.info(f"Answering for file: {filename}")
        filename = secure_filename(filename)
        abs_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        if not os.path.exists(abs_path):
            res = {"message": "File not found"}
            return res, 404, {"Content-Type": "application/json"}
        else:
            with open(abs_path, "r", encoding='utf-8') as f:
                file_content = f.read()
    elif string:
        # app.logger.info(f"Answering for string:\n {string}")
        file_content = string
    else:
        return (
            {"message": "Please provide a filename or a string"},
            400,
            {"Content-Type": "application/json"},
        )
    
    return Response(generate(file_content, severity), mimetype='text/plain')
    
@app.route("/")
def home():
    return "<p>Welcome to the Smart Contract Scanner!</p>"
