# Smart Contract Analyzer

## Description

Directory structure:
- `common`: common functions like utils, logger, etc.
- `core`: core functionalities of the tool.
- `services`: restful services.
- `frontend`: web interface.
- `requirements.txt`: dependencies management.

## Run Semgrep

Run with Docker:

```powershell
docker run -it -v "${PWD}:/src" semgrep/semgrep semgrep login
docker run -e SEMGREP_APP_TOKEN=<TOKEN> --rm -v "${PWD}:/src" semgrep/semgrep semgrep scan --config ./core/rules/swe-100.yaml ./core/tests/swe-100.sol
```