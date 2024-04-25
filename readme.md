# Smart Contract Analyzer

## Directory Structure

Cấu trúc thư mục:
- `common`: các chức năng dùng chung chẳng hạn như utils, logger, ...
- `core`: các chức năng cốt lõi.
- `services`: API.
- `frontend`: giao diện web.
- `requirements.txt`: quản lý phụ thuộc.

## Virtual Environment

Tạo môi trường ảo:

```powershell
python -m venv .
```

Kích hoạt môi trường ảo:

```powershell
.\Scripts\activate
```

## Rule's Convention

Các quy ước khi viết rule:
- Dựa trên bài báo "Unveiling the Landscape of Smart Contract Vulnerabilities: A Detailed Examination and Codification of Vulnerabilities in Prominent Blockchains" để viết định danh (`id`) và mô tả (`message`). Nếu mô tả trong bài báo này hoặc ở SWC không hợp lý, chẳng hạn như SWC-101 nó đi giải thích thay vì đưa ra cảnh báo, thì có thể dùng mô tả của CWE tương ứng.
- Tạm thời không cần quan tâm đến version của lỗ hổng. Sau này mình sẽ xây dựng một cơ chế để phát hiện lỗ hổng trong một khoảng version nhất định nào đó.

## Semgrep

Chạy với Docker:

```powershell
docker run -it -v "${PWD}:/src" semgrep/semgrep semgrep login
docker run -e SEMGREP_APP_TOKEN=<TOKEN> --rm -v "${PWD}:/src" semgrep/semgrep semgrep scan --config ./core/rules/swe-100.yaml ./core/tests/swe-100.sol
```