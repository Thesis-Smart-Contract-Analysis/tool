# Smart Contract Analyzer

## Description

Directory structure:
- `common`: common functions like utils, logger, etc.
- `core`: core functionalities of the tool.
- `services`: restful services.
- `frontend`: web interface.
- `requirements.txt`: dependencies management.

## Setup

Built with Python 3.11, use [pyenv-win](https://github.com/pyenv-win/pyenv-win) if want to manage multiple python versions.

Initialize virtual environment:

```powershell
python -m venv .
```

Activate virtual environment:

```powershell
source .\Scripts\activate
```

After activation:

```powershell
⮞  pip list
Package    Version
---------- -------
pip        24.0
setuptools 65.5.0
```

To install dependencies:

```powershell
pip install -r requirements.txt
```

To export dependencies:

```powershell
pip freeze > requirements.txt
```

## Dependencies

- [libsast](https://github.com/ajinabraham/libsast)
- [slither](https://github.com/crytic/slither)