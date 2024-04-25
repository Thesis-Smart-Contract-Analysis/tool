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

## Solidity in VSCode

Extension [juanfranblanco/vscode-solidity](https://github.com/juanfranblanco/vscode-solidity) trong VSCode cho phép thay đổi phiên bản của compiler.

Một số cách sử dụng compiler:
- Remote version: extension sẽ tải compiler (file JS) về thư mục `~/.vscode/extensions/juanblanco.solidity-0.0.174`.
- Local version: có thể tải compiler ở [ethereum/solc-bin](https://github.com/ethereum/solc-bin/tree/gh-pages/bin) và chỉ định đường dẫn cũng như là loại compiler ở trong `./.vscode/settings.json` (Workspace Setting) như sau:
    ```json
    {
        "solidity.compileUsingLocalVersion": "W:\\Thesis\\tool\\soljson-v0.4.24+commit.e67f0147.js",
        "solidity.defaultCompiler": "localFile"
    }
    ```

Tuy nhiên, có một số vấn đề xảy ra khi sử dụng các phiên bản cũ:

### Version 0.4.x

Sẽ xảy ra lỗi như sau ở trong output của extension:

```powershell
[Error - 2:03:51 PM] An error has occurred initialising the compiler selected localFile, please check your settings, reverting to the embedded compiler. Error: An error has ocurred, loading the compiler located at:W:\Thesis\tool\soljson-v0.4.24+commit.e67f0147.js, RangeError: Maximum call stack size exceeded
initVersion
```

Tải compiler từ `npm` về và chạy thử thì cũng thấy lỗi tương tự:

```powershell
⮞  node --version
v18.17.0
⮞  npm install -g solc@0.4.24

changed 70 packages in 5s
⮞  solcjs
node:internal/vm:73
  const result = compileFunction(
                 ^

RangeError: Maximum call stack size exceeded
    at internalCompileFunction (node:internal/vm:73:18)
    at wrapSafe (node:internal/modules/cjs/loader:1178:20)
    at Module._compile (node:internal/modules/cjs/loader:1220:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
    at Module.load (node:internal/modules/cjs/loader:1119:32)
    at Module._load (node:internal/modules/cjs/loader:960:12)
    at Module.require (node:internal/modules/cjs/loader:1143:19)
    at require (node:internal/modules/cjs/helpers:110:18)
    at Object.<anonymous> (C:\Users\aleister\AppData\Roaming\nvm\v18.17.0\node_modules\solc\index.js:3:26)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)

Node.js v18.17.0
```

Nếu sử dụng một stable version của node.js dưới 18 chẳng hạn như 16 thì không bị lỗi:

```powershell
⮞  nvm use 16.20.1
Now using node v16.20.1 (64-bit)
⮞  npm install -g solc@0.4.24

changed 70 packages, and audited 72 packages in 3s

2 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
⮞  solcjs
Must provide a file
```

Có thể thấy, version 18 của node.js không tương thích với các compiler thuộc phiên bản `0.4.x`. Cho dù có thay đổi phiên bản của node.js trong máy thì cũng không giải quyết được vấn đề. Lý do là vì VSCode hiện tại (version 1.88.1) sử dụng node.js version `18.18.2` (tìm thấy trong phần About) để chạy các extension.

Giải pháp: sử dụng RemixIDE. Có thể kết nối đến localhost bằng cách dùng `remixd`:

```powershell
npm install -g @remix-project/remixd
remixd -s . --remix-ide https://remix.ethereum.org
```

### Version 0.5.0

Sẽ xảy ra lỗi như sau:

```powershell
[Error - 2:32:28 PM] (node:7512) V8: W:\Thesis\tool\bin\soljson-v0.5.0+commit.1d4f565a.js:3 Invalid asm.js: Invalid member of stdlib
```

Giải pháp: sử dụng phiên bản sau 0.5.0

## Semgrep

Chạy với Docker:

```powershell
docker run -it -v "${PWD}:/src" semgrep/semgrep semgrep login
docker run -e SEMGREP_APP_TOKEN=<TOKEN> --rm -v "${PWD}:/src" semgrep/semgrep semgrep scan --config ./core/rules/swe-100.yaml ./core/tests/swe-100.sol
```