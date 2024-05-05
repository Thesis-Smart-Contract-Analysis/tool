from flask import Flask, request, send_from_directory
from werkzeug.utils import secure_filename
from scanner import init_scanner
import json, os

SERVICES_FOLDER = "./services"
ABS_SERVICES_FOLDER = os.path.abspath(SERVICES_FOLDER)
UPLOAD_FOLDER = os.path.join(ABS_SERVICES_FOLDER, "uploads")

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/scan", methods=["GET"])
def scan():
    # Get query params
    request_args: dict = request.args
    filename = request_args.get("filename", "")
    filename = secure_filename(filename)

    # TODO: validate query params

    # Build the absolute path
    abs_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    app.logger.info(f"Scanning file: {abs_path}")

    # Check if the file exists
    if not os.path.exists(abs_path):
        res = {"message": "File not found"}
        return res, 404, {"Content-Type": "application/json"}

    # Initialize the scanner
    targets = [abs_path]
    scanner = init_scanner(targets)

    # Perform scanning
    res = scanner.scan()
    return (
        json.dumps(res, indent=2, sort_keys=True),
        200,
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


@app.route("/")
def home():
    return "<p>Welcome to the Smart Contract Scanner!</p>"
