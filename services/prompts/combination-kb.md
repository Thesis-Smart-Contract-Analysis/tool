# Function or State Variable Default Visibility

## Mô tả

Trạng thái hiển thị (visibility) mặc định của các hàm là `public`. Việc không khai báo trạng thái hiển thị một cách tường minh có thể gây ra các hành vi không mong muốn trong smart contract. Ví dụ, các hàm vốn chỉ được dùng trong nội bộ bên trong smart contract có thể bị gọi sử dụng một cách công khai bởi bất kỳ ai.

```solidity
/*
 * @source: https://github.com/sigp/solidity-security-blog#visibility
 * @author: SigmaPrime 
 * Modified by Gerhard Wagner
 */

pragma solidity ^0.4.24;

contract HashForEther {

  function withdrawWinnings() {
    // Winner if the last 8 hex characters of the address are 0. 
    require(uint32(msg.sender) == 0);
    _sendWinnings();
  }
  
  function _sendWinnings() {
    msg.sender.transfer(this.balance);
  }
     
}
```

Trong ví dụ trên, bất kỳ ai cũng có thể gọi hàm `_sendWinnings` để rút ETH từ hợp đồng thông minh mà không cần phải tạo ra một địa chỉ có 8 ký tự cuối là `0`.

Đối với các biến trạng thái, mặc dù trạng thái hiển thị mặc định của chúng là `internal`, việc khai báo trạng thái hiển thị một cách tường minh có thể giúp tránh được những nhầm lẫn về quyền truy cập.

## Cách khắc phục

Kể từ phiên bản 0.5.0 @solidity-v0.5.0-breaking-changes, việc khai báo tường minh trạng thái hiển thị cho hàm là bắt buộc nên lỗ hổng này chỉ tồn tại ở các phiên bản trước đó của Solidity.

Mặc dù vậy, lập trình viên cũng nên xem xét cẩn thận việc sử dụng trạng thái hiển thị của từng hàm. Đặc biệt là những hàm có trạng thái hiển thị là `public` hoặc `external`.

Đối với ví dụ của smart contract `HashForEther` ở trên, có thể thêm vào các visibility như sau:

```solidity
/*
 * @source: https://github.com/sigp/solidity-security-blog#visibility
 * @author: SigmaPrime
 * Modified by Gerhard Wagner
 */

pragma solidity ^0.4.24;

contract HashForEther {
  
  function withdrawWinnings() public {
    // Winner if the last 8 hex characters of the address are 0.
    require(uint32(msg.sender) == 0);
    _sendWinnings();
  }
  
  function _sendWinnings() internal {
     msg.sender.transfer(this.balance);
  }

}
```
# Integer Overflow/Underflow <integer-overflow-underflow>

## Mô tả

Các kiểu dữ liệu lưu trữ số nguyên (bao gồm có dấu và không dấu) ở trong Solidity có kích thước là các lũy thừa cơ số 2 từ 8 đến 256. Khi thực hiện tính toán, dữ liệu có thể mang giá trị vượt ra ngoài phạm vi lưu trữ của kiểu dữ liệu. Vấn đề này được gọi là tràn số (overflow/underflow).

Trong ví dụ dưới, nếu ta gọi hàm `run` với `input` là `2` thì giá trị của biến `count` sẽ là $1 -2 = -1 = 2^{256} - 1$ (kiểu `uint` thực chất là `uint256`).

```solidity
//Single transaction overflow
//Post-transaction effect: overflow escapes to publicly-readable storage

pragma solidity ^0.4.19;

contract IntegerOverflowMinimal {
  
    uint public count = 1;

    function run(uint256 input) public {
        count -= input;
    }
    
}
```

## Cách khắc phục

Cẩn thận khi thực hiện các tính toán trên số nguyên bằng cách so sánh các toán hạng trước khi thực hiện toán tử.

Sử dụng các thư viện chẳng hạn như SafeMath của OpenZeppelin @openzeppelin-math. Về bản chất, thư viện này sử dụng các câu lệnh `assert` hoặc `require` để đảm bảo các thao tác tính toán sẽ không gây ra tràn số.

Ngoài ra, kể từ phiên bản 0.8.0 @solidity-v0.8.0-breaking-changes của Solidity, lỗi tràn số được tự động phát hiện và giao dịch sẽ được hoàn trả trước khi thao tác tính toán được thực thi.



# Outdated Compiler Version

## Mô tả

Sử dụng một phiên bản trình biên dịch đã cũ có thể gây ra các vấn đề, đặc biệt là khi phiên bản đó có các lỗi và sự cố đã được tiết lộ công khai.

## Cách khắc phục

Sử dụng phiên bản trình biên dịch của Solidity gần đây nhất.
# Floating Compiler Version

## Mô tả

Một contract có thể được biên dịch bởi nhiều phiên bản của trình biên dịch khác nhau. 

Ví dụ:

```solidity
pragma solidity >=0.4.0 < 0.6.0;
pragma solidity >=0.4.0<0.6.0;
pragma solidity >=0.4.14 <0.6.0;
pragma solidity >0.4.13 <0.6.0;
pragma solidity 0.4.24 - 0.5.2;
pragma solidity >=0.4.24 <=0.5.3 ~0.4.20;
pragma solidity <0.4.26;
pragma solidity ~0.4.20;
pragma solidity ^0.4.14;
pragma solidity 0.4.*;
pragma solidity 0.*;
pragma solidity *;
pragma solidity 0.4;
pragma solidity 0;

contract SemVerFloatingPragma { }
```

Trong ví dụ trên, smart contract khai báo rất nhiều phiên bản của trình biên dịch theo kiểu SemVer (Semantic Versoning). Điều này có thể dẫn đến việc phiên bản được sử dụng lúc kiểm thử và lúc triển khai smart contract khác nhau. Nếu smart contract được triển khai bởi một phiên bản của trình biên dịch có chứa lỗi thì có thể làm ảnh hưởng đến tính đúng đắn của nó.

## Cách khắc phục

Cần phải cố định phiên bản của trình biên dịch được sử dụng cho smart contract, ví dụ:

```solidity
pragma solidity 0.4.25;
// or
pragma solidity =0.4.25;

contract SemVerFloatingPragmaFixed { }
```
# Unchecked Return Value

## Mô tả

Một smart contract có thể giao tiếp với smart contract khác thông qua các cách sau:
- Sử dụng các hàm ở mức thấp (opcode) chẳng hạn như `call`, `delegatecall` và `staticcall` để gọi hàm hoặc gửi ETH.
- Sử dụng hàm `send` để gửi ETH.

Nếu có ngoại lệ xảy ra trong smart contract khác thì các hàm trên sẽ trả về giá trị luận lý cho biết thao tác không được thực hiện thành công thay vì lan truyền ngoại lệ. Nếu không kiểm tra giá trị luận lý này thì có thể làm ảnh hưởng đến kết quả thực thi của smart contract.

Ví dụ bên dưới dùng hàm `call` để gọi hàm `foo` của smart contract có địa chỉ là `_addr` với hai đối số lần lượt là `"call foo"` và `123`:

```solidity
contract UsingCall {
  
  function invokeFunction(address payable _addr) public payable {
  	(bool success, bytes memory data) = _addr.call{
    	value: msg.value,
    	gas: 5000
    }(abi.encodeWithSignature("foo(string,uint256)", "call foo", 123));
  }
  
}
```

Nếu hàm `foo` xảy ra ngoại lệ, biến `success` sẽ có giá trị là `false` cho biết việc gọi hàm thất bại. Tuy nhiên, việc xảy ra ngoại lệ trong một smart contract khác không làm dừng quá trình thực thi của contract `UsingCall` cũng như là không hủy bỏ các sự thay đổi lên các biến trạng thái.

Trong trường hợp sử dụng hàm `send`, ngoại lệ có thể xảy ra trong (các) hàm fallback của smart contract nhận ETH một cách tình cờ hoặc có chủ đích. 

## Cách khắc phục

Luôn kiểm tra giá trị của biến luận lý được trả về từ các hàm dùng để giao tiếp với smart contract khác mà không lan truyền ngoại lệ.

Ví dụ:

```solidity
pragma solidity 0.4.25;

contract ReturnValue {
  
  function callchecked(address callee) public {
    require(callee.call());
  }

  function callnotchecked(address callee) public {
    callee.call();
  }
  
}
```


# Access Control Management

## Mô tả

Việc không kiểm soát quyền truy cập của hàm có thể khiến cho bất kỳ ai không có quyền cũng có thể thực thi hàm, đặc biệt là các hàm rút ETH hoặc gọi các hàm nguy hiểm chẳng hạn như `selfdestruct` #footnote[`selfdestruct` là một hàm dùng để xóa bytecode của smart contract ở trên blockchain và chuyển hết ETH còn lại trong smart contract đến địa chỉ được chỉ định.].

Ví dụ:

```solidity
pragma solidity ^0.4.22;

contract SimpleEtherDrain {

  function withdrawAllAnyone() {
    msg.sender.transfer(this.balance);
  }

  function () public payable {
  }
  
}
```

Trong ví dụ trên, hàm `withdrawAllAnyone` không áp dụng các biện pháp kiểm soát quyền truy cập nên bất kỳ ai cũng có thể gọi hàm và rút hết ETH từ smart contract.

Một ví dụ khác:

```solidity
pragma solidity ^0.4.22;

contract SimpleSuicide {

  function sudicideAnyone() {
    selfdestruct(msg.sender);
  }
  
}
```

Với ví dụ này, do không kiểm soát quyền truy cập nên bất kỳ ai cũng có thể gọi hàm `sudicideAnyone` và rút hết ETH thông qua hàm `selfdestruct`.

## Cách khắc phục

Cần giới hạn lại quyền truy cập của hàm cho một số địa chỉ nhất định. Có thể sử dụng các biện pháp kiểm soát quyền truy cập chẳng hạn như smart contract Ownable của OpenZeppelin @openzeppelin-ownership.

Ví dụ:

```solidity
import "./Ownable.sol"

contract MyContract is Ownable {
  INumberInterface numberContract;
  
  function setNumberContractAddress(address _address) external onlyOwner {
    numberContract = INumberInterface(_address);
  }
  
  function someFunction() public {
    uint num = numberContract.getNum(msg.sender);
  }
}
```

Trong ví dụ trên, `onlyOwner` là một modifier giúp giới hạn quyền truy cập đến hàm. Cụ thể, nó ngăn không cho các địa chỉ không phải là chủ sở hữu smart contract thực thi hàm.

Cân nhắc không dùng hàm `selfdestruct` trong smart contract hoặc nếu có dùng thì sử dụng mô hình đa chữ ký để đảm bảo rằng có nhiều tổ chức đồng thuận với việc xóa bytecode của smart contract.

Ngoài ra, kể từ phiên bản 0.8.18 @eip-4758, Solidity không còn hỗ trợ hàm `selfdestruct`.


# Re-entrancy <re-entrancy>

## Mô tả <re-entrancy-description>

Là một kiểu tấn công đệ quy tương hỗ xảy ra giữa smart contract của nạn nhân và smart contract của kẻ tấn công. Cụ thể hơn, kẻ tấn công sẽ liên tục gọi lại một hàm trong smart contract của nạn nhân trước khi lời gọi trước đó được thực thi xong.

Ví dụ bên dưới là phiên bản đơn giản của smart contract được dùng để vận hành DAO #footnote[DAO (Decentralized Autonomous Organizations) là một tập các smart contract hoạt động như một quỹ đầu tư tự động.]:

```solidity
/*
 * @source: http://blockchain.unica.it/projects/ethereum-survey/attacks.html#simpledao
 * @author: Atzei N., Bartoletti M., Cimoli T
 * Modified by Josselin Feist
 */
pragma solidity 0.4.24;

contract SimpleDAO {
  
  mapping (address => uint) public credit;

  function donate(address to) payable public{
    credit[to] += msg.value;
  }

  function withdraw(uint amount) public {
    if (credit[msg.sender]>= amount) {
      require(msg.sender.call.value(amount)());
      credit[msg.sender]-=amount;
    }
  }  

  function queryCredit(address to) view public returns(uint){
    return credit[to];
  }
  
}
```

Trong ví dụ trên, smart contract cho phép quyên góp một lượng `msg.value` wei đến cho địa chỉ `to` thông qua hàm `donate`. Để rút ETH, người dùng có thể gọi hàm `withdraw` và truyền vào tham số `amount` lượng ETH cần rút.

Kẻ tấn công có thể xây dựng một smart contract dùng để tấn công như sau:

```solidity
pragma solidity 0.4.24;

contract Attacker {
  
  SimpleDAO public simpleDAO;

  constructor(address _simpleDAOAddress) {
    simpleDAO = SimpleDAO(_simpleDAOAddress);
  }

  function attack() {
    simpleDAO.donate.value(1)(this);
    simpleDAO.withdraw(1 ether);
  }
  
  function() {
    simpleDAO.withdraw(1 ether);
  }
  
}
```

Khi kẻ tấn công gọi hàm `attack`, smart contract `Attacker` sẽ chuyển 1 ETH đến cho `SimpleDAO` thông qua hàm `donate` với đối số của `to` là địa chỉ của `Attacker`. Sau đó, hàm `attack` gọi đến hàm `withdraw` của `SimpleDAO` với đối số của `amount` là 1 ETH.

Lúc này, hàm `withdraw` của `SimpleDAO` sẽ gọi lại hàm fallback của `Attacker`. Tuy nhiên, hàm fallback của `Attacker` lại gọi đến hàm `withdraw` của `SimpleDAO`. Việc gọi hàm này ngăn cho biến trạng thái `credit[msg.sender]` bị giảm giá trị và dẫn đến điều kiện `if (credit[msg.sender]>= amount)` là luôn đúng đối với các lời gọi đệ quy sau.

Việc gọi đệ quy sẽ tiếp diễn đến khi:
1. Xảy ra ngoại lệ hết gas (out-of-gas exception).
2. Chạm đến giới hạn của stack.
3. Smart contract `SimpleDAO` không còn ETH nào.

## Cách khắc phục <re-entrancy-remediation>

Sử dụng các mẫu bảo mật chẳng hạn như Check-Effect-Interaction hoặc Mutex @wohrer_2018_smart.

Mẫu bảo mật Check-Effect-Interaction xếp lời gọi đến smart contract khác ở cuối và sau khi cập nhật biến trạng thái. 

Ví dụ:

```solidity
pragma solidity 0.4.24;

contract SimpleDAO {
  
  mapping (address => uint) public credit;

  function donate(address to) payable public{
    credit[to] += msg.value;
  }

  function withdraw(uint amount) public {
    // 1. Check
    if (credit[msg.sender]>= amount) {
      // 2. Effect
      credit[msg.sender]-=amount;
      // 3. Interaction
      require(msg.sender.call.value(amount)());
    }
  }  

  function queryCredit(address to) view public returns(uint){
    return credit[to];
  }
  
}
```

Trong ví dụ trên, biến trạng thái `credit` được cập nhật trước khi hàm `call` được thực thi.

Ngoài ra, cũng có thể sử dụng smart contract ReentrancyGuard của OpenZeppelin @openzeppelin-reentrancy-guard để ngăn chặn các lời gọi đệ quy. Cụ thể, smart contract này cung cấp modifier `nonReentrant` để ngăn cản một smart contract gọi lại chính nó một cách trực tiếp hoặc gián tiếp.
# Uninitialized Storage Pointer

## Bố cục lưu trữ của Solidity <storage-layout>

Trước khi phân tích lỗ hổng, ta cần hiểu về cách Solidity lưu các biến `storage`. Nói một cách đơn giản, các biến `storage` được Solidity lưu liên tiếp ở trong các khe lưu trữ (slot). Có tổng cộng $2^{256}$ khe lưu trữ, mỗi khe lưu trữ có kích thước 32 byte và được đánh số từ 0 đến $2^{256} - 1$ @voitier_2023_exploring-the-storage-layout-in-solidity-and-how-to-access-state-variables, @a2018_understanding-ethereum-smart-contract-storage. 

Xét ví dụ sau:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract StorageLayout {
  uint256 x = 1; // slot 0
  uint256 y = 2; // slot 1
  uint256 z = 3; // slot 2
}
```

Do mỗi biến `x`, `y` và `z` đều có kích thước là 32 byte nên chúng được lưu trong từng slot riêng biệt. 

Trong trường hợp kích thước của các biến là nhỏ và vừa đủ một slot, chúng sẽ được đặt cạnh nhau. Ví dụ:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// contract address: 0xeBa088B4182EC4261FA4fd2526F58995Dc1Ec117

contract StorageLayout {
    uint16 x = 1;
    uint16 y = 2;
    uint16 z = 3;
}
```

Khi dùng hàm `web3.eth.getStorageAt(contractAddress, slotPosition)` của thư viện web3.js để truy vấn giá trị được lưu ở slot 0, ta thu được giá trị sau:

```solidity
slot[0] = 0x0000000000000000000000000000000000000000000000000000000300020001
```

Có thể thấy, ba biến `x`, `y` và `z` được đặt cạnh nhau. Ngoài ra, giá trị lưu ở slot 0 cũng được ABI-encode @abi-specification bằng cách đệm thêm các số 0.

Trong trường hợp các biến không thể lưu vừa trong một slot, chúng sẽ được lưu vào nhiều slot. Ví dụ:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract StorageLayout {
    uint16 x = 1;
    uint256 y = 2;
    uint16 z = 3;
}
```

Giá trị của các biến lưu trong các slot là:

```solidity
slot[0] = 0x0000000000000000000000000000000000000000000000000000000000000001
slot[1] = 0x0000000000000000000000000000000000000000000000000000000000000002
slot[2] = 0x0000000000000000000000000000000000000000000000000000000000000003
```

## Mô tả

Các biến cục bộ có vị trí dữ liệu (data location) là `storage` bên trong hàm nếu không được khởi tạo có thể trỏ đến các biến trạng thái có vị trí dữ liệu là `storage` trong smart contract. Điều này có thể dẫn đến việc giá trị của các biến trạng thái bị sửa đổi thông qua các biến cục bộ. 

Xét smart contract sau:

```solidity
// A Locked Name Registrar
contract NameRegistrar {

  bool public unlocked = false;  // registrar locked, no name updates
  
  struct NameRecord { // map hashes to addresses
    bytes32 name;
    address mappedAddress;
  }
  
  mapping(address => NameRecord) public registeredNameRecord; // records who registered names
  mapping(bytes32 => address) public resolve; // resolves hashes to addresses
  
  function register(bytes32 _name, address _mappedAddress) public {
    // set up the new NameRecord
    NameRecord newRecord;
    newRecord.name = _name;
    newRecord.mappedAddress = _mappedAddress;
    
    resolve[_name] = _mappedAddress;
    registeredNameRecord[msg.sender] = newRecord;
    
    require(unlocked); // only allow registrations if contract is unlocked
  }
}
```

Smart contract này có duy nhất một hàm là `register`. Khi biến trạng thái `unlocked` có giá trị là `true`, smart contract cho phép người dùng đăng ký tên và địa chỉ tương ứng với tên đó vào mapping `registeredNameRecord`. Câu lệnh `require` ở cuối hàm giúp hoàn trả giao dịch nếu `unlocked` có giá trị là `false`.

Dựa trên cơ chế lưu các biến `storage` của Solidity thì slot 0 sẽ lưu biến `unlocked`, slot 1 lưu biến `registeredNameRecord` và slot 2 lưu biến `resolve` #footnote[Ta bỏ qua việc mapping không thực sự được lưu ở một slot mà thay vào đó là các phần tử của nó được lưu ở các slot không liền kề nhau.].

Như đã biết, vị trí dữ liệu mặc định cho các biến có kiểu tham chiếu chẳng hạn như struct, mảng hoặc mapping là `storage`. Việc không khai báo vị trí dữ liệu cho biến `newRecord` bên trong hàm `register` làm cho nó có vị trí dữ liệu là `storage`. Do là một biến `storage` và không được khởi tạo, `newRecord` sẽ đóng vai trò là một con trỏ và trỏ đến slot 0. 

Cụ thể hơn, trường `name` và `mappedAddress` sẽ lần lượt trỏ đến biến `unlocked` và biến `registeredNameRecord`. Việc gán giá trị cho trường `name` khi đó cũng sẽ làm thay đổi giá trị của biến `unlocked`. Bằng cách chọn giá trị `_name` sao cho có bit cuối là 1, kẻ tấn công có thể gọi thực thi hàm `register` để thay đổi biến `unlocked` thành `true`.

## Cách khắc phục

Kiểm tra xem biến cục bộ thuộc kiểu tham chiếu có nhất thiết phải là `storage` hay không (thường là không vì điều này làm tăng chi phí thực hiện smart contract do việc ghi vào biến `storage` tiêu thụ rất nhiều gas). Nếu cần thiết thì nên khai báo vị trí dữ liệu tường minh là `storage`. Nếu không thì nên sử dụng vị trí dữ liệu là `memory`.

Kể từ phiên bản 0.5.0, vấn đề này đã được giải quyết do các biến `storage` chưa được khởi tạo sẽ không được biên dịch.


# Use of Deprecated Solidity Functions

## Mô tả

Với các phiên bản mới của trình biên dịch, việc sử dụng các định danh (identifier) cũ đã bị loại bỏ có thể dẫn đến các lỗi biên dịch hoặc các hành vi không mong muốn.

Ví dụ bên dưới có chứa các định danh cũ không còn sử dụng trong các phiên bản trình biên dịch sau này:

```solidity
contract DeprecatedSimple {

  function DeprecatedSimple() public { }

  function useDeprecated() public constant {
    bytes32 blockhash = block.blockhash(0);
    bytes32 hashofhash = sha3(blockhash);

    uint gas = msg.gas;

    if (gas == 0) {
      throw;
    }

    address(this).callcode();

    var a = [1,2,3];

    var (x, y, z) = (false, "test", 0);

    suicide(address(0));
  }

  function () public {}
}
```

## Cách khắc phục

Sử dụng các định danh thay thế trong smart contract.

#figure(
  table(
    columns: (auto, auto),
    align: horizon,
    table.header("Cũ", "Thay thế"),
    `suicide(address)`, `selfdestruct(address)`,
    `block.blockhash(uint)`,	`blockhash(uint)`,
    `sha3(...)`, `keccak256(...)`,
    `callcode(...)`, `delegatecall(...)`,
    `throw`,	`revert()`,
    `msg.gas`,	`gasleft`,
    `constant`,	`view`,
    `var`,	[tên kiểu dữ liệu tương ứng],
    [`function ()`], [`receive()` hoặc `fallback()`],
    [Hàm tạo trùng tên với smart contract], `constructor()`
  ),
  caption: [Các định danh cũ và định danh thay thế tương ứng]
)

Đối với ví dụ của smart contract `DeprecatedSimple` ở trên, có thể sửa lại như sau:

```solidity
contract DeprecatedSimpleFixed {

  constructor() { }
  
  function useDeprecatedFixed() public view {
    bytes32 bhash = blockhash(0);
    bytes32 hashofhash = keccak256(bhash);

    uint gas = gasleft();

    if (gas == 0) {
      revert();
    }

    address(this).delegatecall();

    uint8[3] memory a = [1,2,3];

    (bool x, string memory y, uint8 z) = (false, "test", 0);

    selfdestruct(address(0));
  }

  receive() external payable { }

}
```
# Delegatecall to Untrusted Callee

## Hàm `delegatecall`

Là một hàm low-level tương tự với hàm `call` (đều được dùng để gọi hàm của smart contract khác hoặc gửi ETH đến smart contract khác). 

Tuy nhiên, khi một smart contract A gọi thực thi hàm của smart contract B bằng `delegatecall`, hàm của smart contract B sẽ thực thi với các biến trạng thái của smart contract A.

Ví dụ:

```solidity
// NOTE: Deploy this contract first
contract B {
  
    // NOTE: storage layout must be the same as contract A
    uint256 public num;
    address public sender;
    uint256 public value;

    function setVars(uint256 _num) public payable {
      num = _num;
      sender = msg.sender;
      value = msg.value;
    }
    
}

contract A {
  
    uint256 public num;
    address public sender;
    uint256 public value;

    function setVars(address _contract, uint256 _num) public payable {
      // A's storage is set, B is not modified.
      (bool success, bytes memory data) = _contract.delegatecall(
          abi.encodeWithSignature("setVars(uint256)", _num)
      );
    }
    
}
```

Trong ví dụ trên, hàm `setVars(address,uint256)` của smart contract `A` gọi thực thi hàm `setVars(uint256)` của smart contract `B` thông qua hàm `delegatecall`.

Ta gọi thực thi hàm `setVars(address,uint256)` với các đối số lần lượt là:
- Địa chỉ của contract `B` (`0xd2184e03fC9a5deB782691e41fAB0Ba77F52202e`)
- Giá trị `1`

Sau khi thực thi, giá trị của hai biến `num` và `sender` của smart contract `A` sẽ bị thay đổi. Cụ thể:
- `num` bị thay đổi thành `1`.
- `sender` bị thay đổi thành địa chỉ gọi hàm `setVars`.

## Mô tả

Việc sử dụng hàm `delegatecall` để gọi hàm của các smart contract không tin cậy là rất nguy hiểm bởi vì các smart contract này có thể thay đổi các giá trị của các biến trạng thái hoặc chiếm quyền sở hữu của smart contract hiện tại.

Ví dụ, cho smart contract `Proxy` như sau:

```solidity
contract Proxy {

  address owner;

  constructor() {
    owner = msg.sender;  
  }

  function getOwner() public view returns (address) {
    return owner;
  }

  function forward(address callee, bytes memory _data) public {
    (bool success, ) = callee.delegatecall(_data);
    require(success);
  }

}
```

Hàm `forward` sẽ gọi đến hàm của smart contract có địa chỉ là `callee` thông qua hàm `delegatecall`. Kẻ tấn công có thể xây dựng một smart contract như sau để tấn công:

```solidity
contract Attacker {
    
  address owner;

  fallback() external { 
    owner = 0xB514b2e847116c7B57e0BFac3a180eB049cd395c;
  }

}
```

Với `0xB514b2e847116c7B57e0BFac3a180eB049cd395c` là một địa chỉ mà kẻ tấn công sở hữu.

Kẻ tấn công có thể gọi hàm `forward` với:
- Đối số của `callee` là địa chỉ của smart contract `Attacker` (giả sử là `0xaB35F973D99176552d49030c65B6cB4A82F9254e`).
- Đối số của `_data` là giá trị rỗng chẳng hạn như `0x00000000000000000000000000000000` nhằm gọi hàm `fallback` của smart contract `Attacker`.

Sau khi thực thi, giá trị của `owner` trong smart contract `Proxy` sẽ là: `0xB514b2e847116c7B57e0BFac3a180eB049cd395c`

## Cách khắc phục

Cần đảm bảo rằng hàm `delegatecall` không bao giờ gọi đến các smart contract không tin cậy. Nếu địa chỉ của smart contract được gọi hàm là giá trị truyền vào của người dùng thì cần đảm bảo địa chỉ này nằm trong một danh sách các địa chỉ được phép sử dụng (whitelist).

# Denial of Service with Failed Call

## Mô tả

Các lời gọi đến bên ngoài smart contract (thực thi hàm hoặc chuyển ETH) có thể thất bại một cách không có hoặc có chủ đích. Trong trường hợp kẻ tấn công gọi đến bên ngoài smart contract nhiều lần trong cùng một giao dịch, smart contract có thể trở nên không khả dụng.

Ví dụ:

```solidity
contract DistributeTokens {
  address public owner; // gets set somewhere
  address[] investors; // array of investors
  uint[] investorTokens; // the amount of tokens each investor gets

  // ... extra functionality, including transfertoken()

  function invest() public payable {
    investors.push(msg.sender);
    investorTokens.push(msg.value * 5); // 5 times the wei sent
  }

  function distribute() public {
    require(msg.sender == owner); // only owner
    for(uint i = 0; i < investors.length; i++) {
      // here transferToken(to,amount) transfers "amount" of tokens to the address "to"
      transferToken(investors[i],investorTokens[i]);
    }
  }
}
```

Trong ví dụ này, kẻ tấn công có thể tạo ra một lượng lớn các địa chỉ và lưu vào mảng `investors` thông qua hàm `invest`. Nếu kích thước của mảng `investors` quá lớn, việc lặp qua từng phần tử của nó và thực hiện chuyển token (`transferToken`) có thể gây ra ngoại lệ hết gas (out-of-gas exception). Khi đó, các lời gọi hàm `transferToken` thành công trong giao dịch sẽ bị hủy bỏ và khiến cho smart contract không còn khả dụng.

Ví dụ khác, smart contract sau đây thực hiện gửi ETH cho người đặt cược cao nhất.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BadAuction {

  address payable highestBidder;
  uint highestBid;

  function bid() public payable {
    require(msg.value >= highestBid);

    if (highestBidder != address(0)) {
      highestBidder.transfer(highestBid);
    }

    highestBidder = payable(msg.sender);
    highestBid = msg.value;
  }
  
}
```

Smart contract này có thể bị tấn công DoS nếu kẻ tấn công luôn làm cho hàm `transfer` gây ra ngoại lệ:

```solidity
contract Attacker {
  
  BadAuction badAuction;

  constructor(address badAuctionAddress) {
    badAuction = BadAuction(badAuctionAddress);
  }

  function bid() public payable {
    badAuction.bid{value: msg.value}();
  }

  receive() external payable {
    revert();
  }
    
}
```

Cụ thể, kẻ tấn công sẽ đặt cược và trở thành người đặt cược lớn nhất thông qua hàm `bid` của smart contract `Attacker`. Sau đó, không ai có thể trở thành người đặt cược lớn nhất được nữa do hàm `fallback` của `Attacker` luôn gây ra ngoại lệ và hoàn trả giao dịch. Điều này làm mất đi tính sẵn sàng của smart contract.

## Cách khắc phục

Những điều cần lưu ý khi thực hiện gọi đến bên ngoài smart contract:
- Không gọi đến bên ngoài smart contract nhiều lần trong cùng một giao dịch.
- Luôn giả định rằng lời gọi đến bên ngoài smart contract có thể thất bại.
- Xử lý các lời gọi thất bại.

Đối với việc chuyển ETH, có thể áp dụng mẫu bảo mật Pull-over-Push @solidity-patterns để tạo ra một hàm cho phép người dùng có thể rút ETH thay vì tự động chuyển cho họ. 

Ví dụ:

```solidity
contract PullOverPush {

  mapping(address => uint) credits;

  function allowForPull(address receiver, uint amount) private {
    credits[receiver] += amount;
  }

  function withdrawCredits() public {
    uint amount = credits[msg.sender];

    require(amount != 0);
    require(address(this).balance >= amount);

    credits[msg.sender] = 0;

    msg.sender.transfer(amount);
  }
}
```
# Authorization through `tx.origin`

## Mô tả

Lỗ hổng này xảy ra khi smart contract dùng giá trị `tx.origin` để xác thực. Giá trị này là giá trị của địa chỉ thực hiện giao dịch và nếu smart contract A có gọi thực thi hàm của smart contract B thì smart contract B có thể vượt qua xác thực của smart contract A.

Ví dụ, xét hai smart contract sau:

```solidity
contract VictimContract {
  
  address owner;

  constructor() {
    owner = payable(msg.sender);
  }

  function withdrawFunds(address to) public {
    require(tx.origin == owner);
    uint256 contractBalance = address(this).balance;
    (bool suceed, ) = to.call{value: contractBalance}("");
    require(suceed, "Failed withdrawal");
  }
  
}

contract Attacker {
  
  address owner;
  VictimContract victim;
  
  constructor(VictimContract _victim) {
    owner = payable(msg.sender);
    victim = VictimContract(_victim);
  }
  
  receive() external payable {
    victim.withdrawFunds(owner);
  }
  
}
```

Smart contract `VictimContract` cho phép chủ sở hữu rút ETH thông qua hàm `withdrawFunds` bằng cách dùng hàm `call` để gửi ETH cho địa chỉ `to`. Hàm này thực hiện xác thực bằng cách so sánh `tx.origin` với địa chỉ của chủ sở hữu. 

Để nhận ETH, smart contract `Attacker` đã cài đặt hàm `receive`. Tuy nhiên, hàm này thực hiện gọi lại hàm `withdrawFunds` của `VictimContract` với đối số là `owner` của `Attacker`.

Kẻ tấn công sẽ tìm cách dụ chủ sở hữu của smart contract chuyển ETH cho `Attacker`. Khi đó, `tx.origin` sẽ có giá trị là `owner` và việc gọi lại hàm `withdrawFunds` của `Attacker` sẽ thỏa điều kiện xác thực `tx.origin == owner`.

## Cách khắc phục

Sử dụng `msg.sender` thay vì `tx.origin` để xác thực.
# Signature Malleability

## Thuật toán chữ ký số trên đường cong elliptic (ECDSA)

Ethereum sử dụng thuật toán chữ ký số trên đường cong elliptic (ECDSA). Đường cong mà thuật toán này sử dụng là secp256k1 có phương trình như sau:

$
y^2 = x^3 + 7
$

#figure(
  image("imgs/secp256k1.png"),
  caption: [Đồ thị của đường cong Elliptic]
)

Có thể thấy, đồ thị đối xứng qua trục x. Đây là một tính chất quan trọng góp phần tạo ra lỗ hổng.

Trong ECDSA, chữ ký được biểu diễn bằng cặp số $(r, s)$. Quá trình tạo ra chữ ký @what-is-the-ecdsa:
- Thuật toán sẽ chọn một con số nguyên $k$ ngẫu nhiên với $1 < k < n$ và $n$ là số lượng điểm có trong đường cong secp256k1 (là một số nguyên tố).
- Sau đó, tạo ra điểm $R$ với $R = k * G$ (G là phần tử sinh của đường cong secp256k1). Giá trị $r$ là tọa độ x của điểm $R$.
- Tính toán bằng chứng chữ ký $s$ với công thức sau: $s = k^-1 * (h + d * r) mod n$ với $h$ là giá trị băm của thông điệp cần ký và $d$ là khóa riêng tư.

Quy trình xác thực chữ ký:
- Tính toán giá trị băm của thông điệp và nghịch đảo modulo của $s$ (ta gọi là $s'$).
- Khôi phục điểm $R$ được sinh ra trong qua trình ký bằng công thức sau: $R' = (h * s') * G + (r * s') * e$ với $e$ là khóa công khai.
- So sánh tọa độ x của $R'$ với tọa độ x của $R$ (giá trị $r$). Nếu hai giá trị này bằng nhau thì tức là chữ ký hợp lệ.

Do tính đối xứng, nếu $(r, s)$ là một chữ ký hợp lệ thì $(r, -s \mod n)$ cũng là một chữ ký hợp lệ.

## Mô tả

Các hệ thống chữ ký mật mã của Ethereum được hiện thực với giả định rằng chữ ký số là duy nhất. Smart contract hoạt động dựa trên giả định này có thể bị tấn công vì kẻ tấn công có thể chỉnh sửa các giá trị v, r và s của một chữ ký để tạo ra một chữ ký hợp lệ khác mà không cần biết khóa riêng tư (dựa vào tính đối xứng). 

Ví dụ bên dưới minh họa cho quá trình xác thực chữ ký trong Solidity:

```solidity
// source: https://medium.com/draftkings-engineering/signature-malleability-7a804429b14a
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SignatureMalleability{

  function verify(bytes32 _messageHash, bytes memory _sig, address _expectedSigner) 
  public pure returns (bool) {
    bytes32 ethSignedHash = keccak256(
      abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
    );
    address signer = recoverSigner(ethSignedHash, _sig);
    return signer == _expectedSigner;
  }

  function recoverSigner(bytes32 _ethSignedHash, bytes memory _sig) 
  public pure returns (address) {
    require(_sig.length == 65, "Invalid signature length");
    bytes32 r;
    bytes32 s;
    uint8 v;
    assembly {
      r := mload(add(_sig, 32))
      s := mload(add(_sig, 64))
      v := byte(0, mload(add(_sig, 96)))
    }
    if (v < 27) {
      v += 27;
    }
    require(v == 27 || v == 28, "Invalid signature v value");
    return ecrecover(_ethSignedHash, v, r, s);
  }

}
```

Trong ví dụ trên, hàm `verify` băm giá trị `_messageHash` theo chuẩn được nêu trong EIP-191 @eip-191 rồi gọi hàm `recoverSigner` để khôi phục địa chỉ người ký từ giá trị băm và chữ ký.

Các dòng mã hợp ngữ trong hàm `recoverSigner` được dùng để tách giá trị `_sig` thành các giá trị $r$, $s$ và $v$. Với $v$ là giá trị giúp việc khôi phục địa chỉ người ký dễ dàng hơn. Nếu địa chỉ trả về từ hàm `ecrecover` khớp với đối số truyền vào tham số `_expectedSigner` của hàm `verify` thì chữ ký là hợp lệ.

Kẻ tấn công có thể xây dựng smart contract như sau:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Attack{

  function manipulateSignature(bytes memory signature) public pure returns(bytes memory) {
    (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);

    uint8 manipulatedV = v % 2 == 0 ? v - 1 : v + 1;
    uint256 manipulatedS = modNegS(uint256(s));
    bytes memory manipulatedSignature = abi.encodePacked(r, bytes32(manipulatedS), manipulatedV);

    return manipulatedSignature;
  }

  function splitSignature(bytes memory sig) public pure returns (uint8 v, bytes32 r, bytes32 s) {
    require(sig.length == 65, "Invalid signature length");
    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := byte(0, mload(add(sig, 96)))
    }
    if (v < 27) {
      v += 27;
    }
    require(v == 27 || v == 28, "Invalid signature v value");
  }

  function modNegS(uint256 s) public pure returns (uint256) {
    uint256 n = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141;        
    return n - s;
  }

}
```

Có thể thấy, hàm `manipulateSignature` tách các thành phần $r$, $s$ và $v$ từ `signature` thông qua hàm `splitSignature`. Sau đó, nó chỉnh sửa giá trị của $v$ sao cho nếu $v$ là chẵn thì trừ đi 1 còn nếu $v$ là lẻ thì cộng thêm 1. Giá trị $s$ sẽ được chỉnh sửa thành $-s mod n$ (được tính thông qua hàm `modNegS`). Cuối cùng, ba giá trị $r$, $s$ và $v$ được ghép lại thành chữ ký thông qua hàm `abi.encodePacked`.

Như vậy, nếu kẻ tấn công biết được một chữ ký hợp lệ thì có thể dùng hàm `manipulateSignature` để tạo ra một chữ ký hợp lệ khác.

## Cách khắc phục

Không dùng chữ ký số để xây dựng định danh của giao dịch dùng để chống tấn công lặp lại chữ ký số (@signature-replay). Lý do là vì kẻ tấn công có thể tạo ra một định danh khác sử dụng một chữ ký số khác dựa trên tính dễ uốn của chữ ký số nhưng vẫn thỏa được quá trình xác thực.

Cũng có thể sử dụng smart contract `ECDSA` của OpenZeppelin @openzeppelin-cryptography-ecdsa.
# Incorrect Constructor Name

## Mô tả

Trong hàm tạo của Solidity thường thực hiện những hành động đặc quyền chẳng hạn như thiết lập chủ sở hữu của smart contract. Trước phiên bản 0.4.22, hàm tạo có tên trùng với tên smart contract. Tuy nhiên, nếu một hàm đáng lẽ được dùng làm hàm tạo nhưng có tên không trùng với tên của smart contract thì nó sẽ trở thành một hàm bình thường và có thể được gọi bởi bất kỳ ai.

Ví dụ:

```solidity
/*
 * @source: https://github.com/trailofbits/not-so-smart-contracts/blob/master/wrong_constructor_name/incorrect_constructor.sol
 * @author: Ben Perez
 * Modified by Gerhard Wagner
 */

pragma solidity 0.4.24;

contract Missing {
  
  address private owner;

  modifier onlyowner {
    require(msg.sender==owner);
    _;
  }

  function missing() public {
    owner = msg.sender;
  }

  function () payable { } 

  function withdraw() public onlyowner {
   owner.transfer(this.balance);
  }
  
}
```

Trong ví dụ trên, hàm `missing` đáng lẽ là hàm tạo nhưng có tên không trùng với tên của smart contract `Missing`. Điều này khiến cho bất kỳ ai cũng có thể gọi hàm `missing` để trở thành chủ sở hữu của smart contract.

## Cách khắc phục

Kể từ phiên bản 0.4.22, hàm tạo có tên là `constructor`. Lập trình viên nên nâng cấp phiên bản của smart contract để tránh lỗ hổng này.
# Shadowing State Variables

## Mô tả

Xảy ra khi một smart contract kế thừa smart contract khác và cả hai đều cùng khai báo một biến. Vấn đề này cũng xảy ra khi smart contract có một biến toàn cục trùng tên với một biến cục bộ ở trong hàm.

Ví dụ:

```solidity
pragma solidity 0.4.24;

contract Tokensale {
  
  uint hardcap = 10000 ether;

  function Tokensale() {}

  function fetchCap() public constant returns(uint) {
    return hardcap;
  }
  
}

contract Presale is Tokensale {
  
  uint hardcap = 1000 ether;

  function Presale() Tokensale() {}
  
}
```

Trong ví dụ trên, giá trị trả về khi gọi hàm `fetchCap` từ smart contract `Presale` là 10,000 ETH thay vì 1,000 ETH. Nói cách khác, biến `hardcap` ở trong `Presale` không ghi đè biến `hardcap` ở trong `Tokensale` và điều này có thể làm ảnh hưởng đến kết quả thực thi của smart contract.

## Cách khắc phục

Nếu muốn ghi đè biến trạng thái của smart contract được kế thừa, ta có thể gán giá trị mới cho nó ở trong hàm tạo của smart contract kế thừa. Ví dụ:

```solidity
contract Presale is Tokensale {
  
  // uint hardcap = 1000 ether;
  
  function Presale() Tokensale() {
    hardcap = 1000 ether;
  }
  
}
```

Kể từ phiên bản 0.6.0 @solidity-v0.6.0-breaking-changes, việc shadowing các biến trạng thái sẽ được phát hiện bởi trình biên dịch.
# Weak Sources of Randomness from Chain Attributes

## Mô tả

Nhu cầu sinh số ngẫu nhiên là rất cần thiết cho một số ứng dụng, đặc biệt là các trò chơi cần sử dụng bộ sinh số giả ngẫu nhiên (pseudo-random number generator) để quyết định người chiến thắng. Tuy nhiên, việc tạo ra một hạt giống sinh số ngẫu nhiên đủ mạnh trong Ethereum là rất khó khăn.

Cụ thể, việc sử dụng giá trị `block.timestamp` làm hạt giống có thể không bảo mật vì giá trị này có thể được chỉnh sửa bởi miner (như trong @timestamp-dependency). 

Việc sử dụng `blockhash` hoặc `block.difficulty` cũng tương tự vì các giá trị này được kiểm soát bởi miner. Nếu thời gian để đào một block là ngắn, miner có thể đào thật nhiều block và chọn block có giá trị băm thỏa mãn điều kiện chiến thắng của smart contract rồi bỏ các block còn lại.

Ví dụ:

```solidity
/*
 * @source: https://capturetheether.com/challenges/lotteries/guess-the-random-number/
 * @author: Steve Marx
 */

pragma solidity ^0.4.21;

contract GuessTheRandomNumberChallenge {
  
  uint8 answer;

  function GuessTheRandomNumberChallenge() public payable {
    require(msg.value == 1 wei);
    answer = uint8(keccak256(block.blockhash(block.number - 1), now));
  }

  function isComplete() public view returns (bool) {
    return address(this).balance == 0;
  }

  function guess(uint8 n) public payable {
    require(msg.value == 1 wei);

    if (n == answer) {
        msg.sender.transfer(2 wei);
    }
  }
  
}
```

Thông tin về số block (`block.number`) và thời gian của mà block được tạo ra (`now` - tương ứng với `block.timestamp` ở các phiên bản sau này của Solidity) đều được công khai nên kẻ tấn công có thể dễ dàng tái tạo được giá trị của `answer`.

## Cách khắc phục <weak-sources-of-randomness-from-chain-attributes-remediation>

Một số giải pháp sinh số ngẫu nhiên/giả ngẫu nhiên:

*Verifiable Random Function (VRF)*

Sử dụng các VRF @introduction-to-chainlink-vrf để tạo số ngẫu nhiên có thể xác thực. Với mỗi yêu cầu sinh số ngẫu nhiên, sẽ có một hoặc nhiều số ngẫu nhiên được tạo ra off-chain (bên ngoài blockchain) và đi kèm với chúng là các bằng chứng mật mã (cryptographic proof) cho biết cách mà các số ngẫu nhiên được hình thành. 

Bằng chứng mật mã sẽ được công khai và được xác thực on-chain trước khi các ứng dụng có thể sử dụng. Điều này đảm bảo các giá trị ngẫu nhiên không bị giả mạo hoặc thao túng bởi một thực thể nào đó.

*Commit-Reveal Scheme*

Cũng có thể dùng mô hình commit-reveal @atzei_2017_a. Mô hình này hoạt động như sau: mỗi thành viên tham gia vào việc tạo số ngẫu nhiên sẽ sinh ra một con số bí mật và công khai giá trị băm của số bí mật này kèm với một khoảng tiền đặt cọc. 
    
Sau một thời gian nhất định, các thành viên này sẽ phải công khai con số bí mật tương ứng với giá trị băm đã công khai trước đó. Số giả ngẫu nhiên sẽ được tính toán dựa trên những con số bí mật này. Nếu có một thành viên không công khai số bí mật, thành viên đó sẽ bị mất khoản tiền đặt cọc.

Một hiện thực của mô hình này trong thực tế là RANDAO @a2020_randao.

*Bitcoin Hashes*

Giá trị hash của Bitcoin cũng có thể được dùng làm hạt giống sinh số ngẫu nhiên bởi vì các block trong Bitcoin thường khó để đào hơn.
# Missing Protection against Signature Replay Attacks <signature-replay>

## Mô tả

Lỗ hổng này xảy ra khi smart contract thực hiện xác thực chữ ký nhưng không kiểm tra xem chữ ký đã được sử dụng hay chưa. Kẻ tấn công có thể tái sử dụng chữ ký nhiều lần để vượt qua xác thực và thực thi hàm.

Ví dụ @signature-replay-ref:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ECDSA.sol";

contract MultiSigWallet {
  
  using ECDSA for bytes32;

  address[2] public owners;

  constructor(address[2] memory _owners) payable { owners = _owners; }

  function deposit() external payable { }

  function transfer(address _to, uint256 _amount, bytes[2] memory _sigs)
    external
  {
    bytes32 txHash = getTxHash(_to, _amount);
    require(_checkSigs(_sigs, txHash), "invalid sig");

    (bool sent,) = _to.call{value: _amount}("");
    require(sent, "Failed to send Ether");
  }

  function getTxHash(address _to, uint256 _amount)
    public
    view
    returns (bytes32)
  {
    return keccak256(abi.encodePacked(_to, _amount));
  }

  function _checkSigs(bytes[2] memory _sigs, bytes32 _txHash)
    private
    view
    returns (bool)
  {
    bytes32 ethSignedHash = _txHash.toEthSignedMessageHash();

    for (uint256 i = 0; i < _sigs.length; i++) {
      address signer = ethSignedHash.recover(_sigs[i]);
      bool valid = signer == owners[i];

      if (!valid) {
        return false;
      }
    }

    return true;
  }
  
}
```

Trong ví dụ trên, hàm `transfer` có các tham số sau:
- Địa chỉ nhận ETH: `_to`.
- Lượng ETH cần chuyển: `_amount`.
- Hai chữ ký của hai chủ sở hữu ví: `memory _sigs`.

Hàm `transfer` xây dựng văn bản sẽ được ký bằng cách băm giá trị `txHash` theo chuẩn được nêu trong EIP-191 @eip-191. Sau đó, nó gọi hàm `_checkSigs` để kiểm tra xem địa chỉ được khôi phục từ hai chữ ký có khớp với địa chỉ của các chủ sở hữu ví hay không.

Do smart contract không kiểm tra sự giống nhau của các chữ ký trong những lần gọi hàm khác nhau, kẻ tấn công có thể dùng lại các chữ ký cũ (lấy được thông qua các giao dịch trước đó) để chuyển tiền đến địa chỉ `_to` với lượng ETH là `_amount` (giả sử `_to` là một địa chỉ mà kẻ tấn công sở hữu).

## Cách khắc phục

Có thể lưu lại danh sách các chữ ký đã được sử dụng và thêm một giá trị dùng một lần (nonce) vào văn bản cần ký để các chữ ký sử dụng trong những lần gọi hàm khác nhau là khác nhau. Kẻ tấn công dù biết được giá trị nonce này cũng không có khóa riêng tư của các chủ sở hữu ví để tạo ra các chữ ký hợp lệ.

Ví dụ @signature-replay-ref:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ECDSA.sol";

contract MultiSigWallet {
  
  using ECDSA for bytes32;

  address[2] public owners;
  mapping(bytes32 => bool) public executed;

  constructor(address[2] memory _owners) payable { owners = _owners; }

  function deposit() external payable {}

  function transfer(
    address _to,
    uint256 _amount,
    uint256 _nonce,
    bytes[2] memory _sigs
  ) external {
    bytes32 txHash = getTxHash(_to, _amount, _nonce);
    require(!executed[txHash], "tx executed");
    require(_checkSigs(_sigs, txHash), "invalid sig");

    executed[txHash] = true;

    (bool sent,) = _to.call{value: _amount}("");
    require(sent, "Failed to send Ether");
  }

  function getTxHash(address _to, uint256 _amount, uint256 _nonce)
    public
    view
    returns (bytes32)
  {
    return keccak256(abi.encodePacked(address(this), _to, _amount, _nonce));
  }

  // ...
  
}
```

Trong ví dụ trên, smart contract sử dụng biến `executed` để lưu lại những chữ ký đã được sử dụng. Ngoài ra, văn bản được ký có thêm giá trị `_nonce`. Giá trị này có thể là một số nguyên ngẫu nhiên hoặc tăng dần tùy thuộc vào chủ sở hữu ví.



# Lack of Proper Signature Verification

## Mô tả

Xảy ra khi smart contract không thực hiện kiểm tra tính hợp lệ của chữ ký khi thực hiện những thao tác nhạy cảm. Kẻ tấn công có thể lợi dụng điều này để vượt qua xác thực nhằm thực hiện những hành vi không được phép.

## Cách khắc phục

Không sử dụng các cách kiểm tra tính hợp lệ của chữ ký mà không thông qua hàm `ecrecover`.
# Write to Arbitrary Storage Location

## Mô tả

Smart contract cần phải đảm bảo rằng các vị trí lưu trữ dữ liệu nhạy cảm chỉ có thể được truy cập và chỉnh sửa bởi địa chỉ của người dùng hoặc smart contract mà đã được phân quyền. Nếu một kẻ tấn công có khả năng thay đổi giá trị của bất kỳ vị trí lưu trữ nào thì có thể vượt qua xác thực và thay đổi giá trị của các biến trạng thái.

Ví dụ @solidity-array-overflow:

```solidity
pragma solidity ^0.4.17; 

contract ArrayLengthManipulation{
  
  uint256 target = 10;
  uint256[] array = [9,8];

  function modifyArray (uint256 _index, uint256 _value){
    array[_index] = _value;
  }

  function popLength() public{
    // cause overflow
    array.length--;
  }

  function getLength() constant returns(uint256){
    return array.length;
  }

}
```

Mục tiêu của kẻ tấn công là thay đổi giá trị của biến `target`.

Trước tiên, kẻ tấn công sẽ gọi hàm `popLength` 3 lần để giảm kích thước #footnote[Trước phiên bản 0.6.0, kích thước của mảng động có thể được điều chỉnh thông qua thuộc tính `length` của mảng] của mảng `array` xuống $-1 = 2^{256} - 1$ (giá trị dạng thập lục phân là `0xff..ff`). Lúc đó, kích thước của mảng bằng với kích thước của mảng các slot (tính luôn cả slot lưu kích thước mảng). Điều này khiến cho chỉ số của các phần tử trong mảng cũng là chỉ số của các slot (bố cục lưu trữ theo các slot được đề cập trong phần @storage-layout[]).

Do `array` được lưu ở slot 1, chỉ số slot lưu dữ liệu của phần tử đầu tiên là giá trị băm Keccak-256 của chuỗi `0x0000000000000000000000000000000000000000000000000000000000000001`:

```
0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6
```

Các phần tử của mảng nằm ở slot `0xff..ff` trở đi sẽ bị chồng chéo. Ví dụ, chỉ số `0xff..ff` sẽ tương ứng với chỉ số $2^{256} mod 2^{256} = 0$, chỉ số `0xff..ff + 1` sẽ tương ứng với chỉ số $2^{256} + 1 mod 2^{256} = 1$, ...

Minh họa: 

#figure(
  image("imgs/Write to arbitrary storage location.png"),
  caption: [Chồng chéo không gian lưu trữ]
)

Trong hình minh họa trên, hai slot cuối cùng sẽ bị chồng chéo với slot 0 và slot 1. Kẻ tấn công sẽ cần phải tìm chỉ số mảng tương ứng với slot cần thay đổi giá trị. Cụ thể, chỉ số mảng tương ứng với slot 0 sẽ là:

```
0xff..ff - 0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6 + 0
```

Công thức tổng quát:

$
i = 2^{256} - i_a + i_b
$

Với:
- $i$ là chỉ số mảng cần tìm.
- $i_a$ là chỉ số slot của phần tử đầu tiên trong mảng.
- $i_b$ là chỉ số slot của biến cần thay đổi giá trị.

Sau khi có được chỉ số mảng thì kẻ tấn công sẽ gọi hàm `modifyArray` để thay đổi giá trị của biến `target` thông qua mảng `array`.

## Cách khắc phục

Cần phải đảm bảo rằng việc thay đổi giá trị của một cấu trúc dữ liệu không làm thay đổi dữ liệu của các cấu trúc dữ liệu khác.

Ngoài ra, đối với ví dụ ở trên, kể từ phiên bản 0.6.0, thuộc tính `length` của mảng động chỉ có thể đọc chứ không thể ghi.
# Incorrect Inheritance Order

## Đa kế thừa trong Solidity

Solidity hỗ trợ đa kế thừa nên nếu một smart contract kế thừa nhiều smart contract thì có thể dẫn đến vấn đề kim cương (Diamon Problem): nếu có hai hoặc nhiều smart contract cơ sở cùng định nghĩa một hàm, hàm nào sẽ được gọi sử dụng trong smart contract dẫn xuất? 

Giả sử có smart contract `A` như sau @on-crowdsales-and-multiple-inheritance:

```solidity
contract A {
  
  function f() {
    somethingA();
  }
  
}
```

Smart contract `B` và `C` kế thừa `A`. Hai smart contract này đều ghi đè hàm `f`:

```solidity
contract B is A {

  function f() {
    somethingB();
    super.f();
  }
  
}

contract C is A {
  
  function f() {
    somethingC();
    super.f();
  }
  
}
```

Cuối cùng, smart contract `D` kế thừa `B` và `C`:

```solidity
contract D is B, C {
  
  function f() { 
    somethingD();
    super.f();
  }
  
}
```

Câu hỏi đặt ra là: khi `D` gọi hàm `f`, hàm `f` trong `B` hay hàm `f` trong `C` sẽ được gọi?

Solidity xử lý vấn đề này bằng cách sử dụng tuyến tính hóa siêu lớp C3 đảo ngược @multiple-inheritance-and-linearization để thiết lập độ ưu tiên cho các smart contract.

Nói một cách đơn giản, khi một hàm được sử dụng trong smart contract dẫn xuất mà có nhiều định nghĩa trong các smart contract cơ sở, Solidity sẽ tìm kiếm định nghĩa của hàm trong các smart contract cơ sở từ phải sang trái (từ cụ thể đến tổng quát) và sẽ sử dụng định nghĩa đầu tiên mà nó tìm thấy.

Trong ví dụ trên, Solidity sẽ gọi hàm theo thứ tự sau:

```solidity
somethingD(); 
somethingC(); 
somethingB(); 
somethingA();
```

Hàm `f` của smart contract `C` sẽ được ưu tiên hơn hàm `f` của smart contract `B` do `C` được khai báo sau (cụ thể hơn). Ngoài ra, mặc dù smart contract `C` không kế thừa smart contract `B`, hàm `f` của `B` vẫn được gọi thông qua `super.call()` trong hàm `f` của `C`.

## Mô tả

Do mỗi smart contract cơ sở đều có độ ưu tiên, việc không quan tâm thứ tự kế thừa có thể dẫn đến những hành vi không mong muốn của smart contract.

## Cách khắc phục

Khi sử dụng đa kế thừa, cần cẩn thận trong việc sắp xếp thứ tự kế thừa của các smart contract cơ sở mà có các hàm giống nhau. Nguyên tắc chung là kế thừa các smart contract từ tổng quát đến cụ thể.
# Insufficient Gas Griefing

## Mô tả

Xảy ra khi smart contract không kiểm tra xem nó có đủ gas để gọi đến smart contract khác hay không. Kẻ tấn công có thể cung cấp thiếu gas nhằm khiến cho lời gọi đến smart contract khác bị thất bại và làm kết quả của smart contract bị sai lệch.

Ví dụ:

```solidity
/*
 * @source: https://consensys.github.io/smart-contract-best-practices/known_attacks/#insufficient-gas-griefing
 * @author: ConsenSys Diligence
 * Modified by Kaden Zipfel
 */

pragma solidity ^0.5.0;

contract Relayer {
  
  uint transactionId;

  struct Tx {
    bytes data;
    bool executed;
  }

  mapping (uint => Tx) transactions;

  function relay(Target target, bytes memory _data) public returns(bool) {
    // replay protection; do not call the same transaction twice
    require(transactions[transactionId].executed == false, 'same transaction twice');
    transactions[transactionId].data = _data;
    transactions[transactionId].executed = true;
    transactionId += 1;

    (bool success, ) = address(target).call(abi.encodeWithSignature("execute(bytes)", _data));
    return success;
  }
  
}

contract Target {
  
  function execute(bytes memory _data) public {
    // Execute contract code
  }
  
}
```

Trong ví dụ trên, smart contract `Relayer` thực hiện chuyển tiếp lời gọi hàm đến smart contract `Target` thông qua hàm `relay`. Cụ thể, hàm `relay` dùng hàm `call` để gọi đến hàm `execute` của smart contract `Target`.

Kẻ tấn công có thể chỉ cung cấp lượng gas vừa đủ để thực thi hàm `relay` nhưng không đủ để thực thi hàm `execute`. Khi đó, hàm `execute` sẽ gây ra ngoại lệ hết gas (out-of-gas exception). Nếu `Relayer` không kiểm tra và hoàn trả giao dịch dựa trên giá trị trả về của hàm `call` thì có thể làm ảnh hưởng đến kết quả thực thi của smart contract.

## Cách khắc phục

Kiểm tra xem lượng gas được cung cấp có đủ để thực thi lời gọi hàm đến smart contract khác hay không. 

Ví dụ @oualid_2022_smart-contract-gas-griefing-attack:

```solidity
pragma solidity ^0.5.0;

contract Relayer {
  uint public estimatedGasValue = 1000000;
  uint public gasNeededBetweenCalls = 5000;
  
  uint transactionId;

  struct Tx {
    bytes data;
    bool executed;
  }

  mapping (uint => Tx) transactions;

  function relay(Target target, bytes memory _data) public returns(bool) {
    // replay protection; do not call the same transaction twice
    require(transactions[transactionId].executed == false, 'same transaction twice');
    transactions[transactionId].data = _data;
    transactions[transactionId].executed = true;
    transactionId += 1;

    uint gasAvailable = gasleft() - gasNeededBetweenCalls;
    require(gasAvailable - gasAvailable/64 >= estimatedGasValue, "not enough gas provided");
    
    (bool success, ) = address(target).call(abi.encodeWithSignature("execute(bytes)", _data));
    return success;
  }
  
}
```

Trong ví dụ trên, giá trị `estimatedGasValue` là lượng gas ước lượng cần để thực thi hàm `execute` còn giá trị `gasNeededBetweenCalls` là lượng gas cần dùng để thực hiện hai dòng lệnh trước lời gọi hàm `call`. Lý do trừ đi `gasAvailable/64` là vì 1/64 lượng gas khả dụng trong smart contract sẽ được giữ lại ở `Relayer` @eip-150-and-the-63-64-rule-for-gas.

Ngoài ra, nên giới hạn danh sách người dùng tin cậy có thể thực thi các hàm chuyển tiếp trong smart contract.
# Arbitrary Jump with Function Type Variable

## Kiểu dữ liệu hàm trong Solidity

Là một tham chiếu đến hàm với một nguyên mẫu hàm cụ thể. Biến thuộc kiểu dữ liệu này có thể được gọi thực thi tương tự như các hàm thông thường.

Ví dụ, đoạn mã sau giúp thay đổi hàm cần thực thi giữa `add` và `sub` một cách linh động khi chạy:

```solidity
// source: https://medium.com/authio/solidity-ctf-part-2-safe-execution-ad6ded20e042
pragma solidity ^0.4.23;

contract AddSub {
    
  function add(uint a, uint b) internal pure returns (uint) {
    return a + b;
  }
  
  function sub(uint a, uint b) internal pure returns (uint) {
    return a - b;
  }
  
  function math(uint _a, uint _b, bool _add) public pure returns (uint) {
    function (uint, uint) internal pure returns (uint) func;
    func = _add ? add : sub;
    return func(_a, _b);
  }
}
```

## Mô tả

Kẻ tấn công có thể sử dụng các chỉ thị hợp ngữ (assembly instruction) chẳng hạn như `mstore` hoặc toán tử gán bằng để thay đổi tham chiếu của biến có kiểu là hàm đến bất kỳ chỉ thị nào nhằm phá vỡ các giới hạn truy cập và thay đổi các biến trạng thái.

Trong ví dụ bên dưới, cách duy nhất để kẻ tấn công gọi hàm `withdraw()` để rút ETH là thông qua hàm `breakIt()`. Tuy nhiên, câu lệnh `require()` trong hai hàm này mâu thuẫn với nhau và mục tiêu của kẻ tấn công là vượt qua được câu lệnh `require()` ở trong hàm `withdraw()`.

```solidity
/*
 * @source: https://gist.github.com/wadeAlexC/7a18de852693b3f890560ab6a211a2b8
 * @author: Alexander Wade
 */

pragma solidity ^0.4.25;

contract FunctionTypes {

  constructor() public payable { require(msg.value != 0); }

  function withdraw() private {
    require(msg.value == 0, 'dont send funds!');
    address(msg.sender).transfer(address(this).balance);
  }

  function frwd() internal { 
    withdraw(); 
  }

  struct Func { 
    function () internal f; 
  }

  function breakIt() public payable {
    require(msg.value != 0, 'send funds!');
    Func memory func;
    func.f = frwd;
    assembly { 
      mstore(func, add(mload(func), callvalue))
    }
    func.f();
  }
}
```

Lỗ hổng tồn tại trong đoạn mã hợp ngữ giúp trỏ biến `func` đến vị trí của một chỉ thị ở trong bytecode.

- Mã lệnh `mstore` có nguyên mẫu hàm là `mstore(p, v)` và được dùng để lưu giá trị `v` vào vùng nhớ `p`. 
- Giá trị sẽ được lưu vào vùng nhớ là `add(mload(func), callvalue)`. Với:
  - Mã lệnh `callvalue` giúp đẩy `msg.value` vào ngăn xếp.
  - Mã lệnh `mload` giúp đẩy giá trị vùng nhớ ban đầu của `func` lên ngăn xếp.

Để nhảy đến một ví trí bất kỳ, mà cụ thể là sau câu lệnh `require()` ở trong hàm `withdraw()`, kẻ tấn công chỉ cần dựa trên giá trị ban đầu của `func` và vị trí của chỉ thị cần nhảy đến ở trong bytecode để tìm ra giá trị `msg.value` cần sử dụng.

## Cách khắc phục

Hạn chế việc sử dụng hợp ngữ và không cho phép người dùng có thể gán các giá trị tùy ý cho các biến có kiểu là hàm.
# Denial of Service with Block Gas Limit

## Mô tả

Mỗi block trong Ethereum sẽ có một giới hạn gas nhất định #footnote[Tại thời điểm tháng 5 năm 2024 thì giới hạn này là 30 triệu gas @a2023_gas-and-fees.] Lỗ hổng này xảy ra khi lượng gas mà smart contract tiêu thụ vượt quá giới hạn gas của block.

Các thao tác tiêu thụ nhiều gas chẳng hạn như chỉnh sửa mảng có kích thước tăng theo thời gian có thể gây ra từ chối dịch vụ.

## Cách khắc phục

Thay vì chỉnh sửa mảng trong một block, có thể chia việc chỉnh sửa này ra nhiều block. Tổng quát hơn, cần xem xét lượng gas sử dụng trong smart contract một cách cẩn thận.
# Typographical Error

## Mô tả

Lỗi đánh máy có thể dẫn đến những hành vi không mong muốn trong smart contract. 

Ví dụ:

```solidity
pragma solidity ^0.4.25;

contract TypoOneCommand {
  uint numberOne = 1;

  function alwaysOne() public {
    numberOne =+ 1;
  }
}
```

Có thể thấy, phép toán `numberOne += 1` được viết nhầm thành `numberOne =+ 1`. Biểu thức này có ý nghĩa là gán `numberOne` cho giá trị `+1` thay vì cộng `numberOne` cho 1.

## Cách khắc phục

Lỗi này có thể được tránh khỏi nếu kiểm tra các điều kiện cần thiết trước khi thực hiện tính toán hoặc dùng thư viện SafeMath của OpenZeppelin.

Ngoài ra, toán tử một ngôi `+` đã bị loại bỏ kể từ phiên bản 0.5.0 @solidity-v0.5.0-breaking-changes của Solidity.
# Right-To-Left Override Control Character

## Mô tả

Kẻ xấu có thể sử dụng ký tự ghi đè phải sang trái (right-to-left override) có điểm mã (code point) là U+202E để thay đổi chiều hiển thị của các ký tự. 

Ký tự này thường được dùng để che giấu phần mở rộng thực sự của tập tin nhằm đánh lừa người dùng. Ví dụ, khi sử dụng nó trong chuỗi `my-text.'U+202E'cod.exe` thì giá trị được hiển thị sẽ là `my-text.exe.doc` @u202e.

Ở trong mã nguồn, ký tự U+202E có thể được sử dụng để thay đổi thứ tự của các đối số:

```solidity
/*
 * @source: https://youtu.be/P_Mtd5Fc_3E
 * @author: Shahar Zini
 */
pragma solidity ^0.5.0;

contract GuessTheNumber {
  
  // ...
  
  function guess(uint n) payable public {
    require(msg.value == 1 ether);

    uint p = address(this).balance;
    checkAndTransferPrize(/*The prize‮/*rebmun desseug*/n , p/*‭
            /*The user who should benefit */,msg.sender);
  }
  
  // ...
}
```

Trong ví dụ trên, thoạt nhìn thì có vẻ như biến `p` là đối số đầu tiên còn biến `n` là đối số thứ hai của hàm `checkAndTransferPrize`. Tuy nhiên, do tác dụng của ký tự U+202E, thứ tự thực sự của hai đối số này đã bị đảo ngược

Thứ tự gốc của chúng là:

#figure(
  image("/ethereum/imgs/Right-To-Left-Override.png"),
  caption: [Sử dụng ký tự U+202E để thay đổi thứ tự hiển thị của các đối số],
)

Với U+202D là ký tự ghi đè trái sang phải, được dùng để khôi phục chiều hiển thị.

## Cách khắc phục

Cần loại bỏ ký tự ghi đè phải sang trái trong mã nguồn.
# Unexpected Balance

## Mô tả

Ngoài việc nhận ETH từ các hàm `payable`, smart contract còn có thể nhận ETH thông qua một số cách khác chẳng hạn như hàm `selfdestruct`.

Việc giả định rằng ETH chỉ đến từ các hàm `payable` và thực hiện các phép so sánh đối với biến `this.balance` có thể làm ảnh hưởng đến kết quả thực thi của smart contract. Trong trường hợp xấu nhất, điều này có thể làm smart contract rơi vào trạng thái từ chối dịch vụ.

Ví dụ sau đây @self-destruct-ref là một trò chơi cho phép các người chơi đặt ETH vào smart contract thông qua hàm `deposit`. 

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EtherGame {
  
  uint256 public targetAmount = 7 ether;
  address public winner;

  function deposit() public payable {
    require(msg.value == 1 ether, "You can only send 1 Ether");

    uint256 balance = address(this).balance;
    require(balance <= targetAmount, "Game is over");

    if (balance == targetAmount) {
      winner = msg.sender;
    }
  }

  function claimReward() public {
    // ...
  }
    
}
```

Có thể thấy, mỗi người chơi chỉ có thể đặt 1 ETH một lần và nếu người chơi nào làm cho số dư của smart contract chạm mốc 7 ETH thì sẽ trở thành người chiến thắng.

Kẻ tấn công có thể xây dựng một smart contract như sau:

```solidity
contract Attacker {
  
  EtherGame etherGame;

  constructor(EtherGame _etherGame) {
    etherGame = EtherGame(_etherGame);
  }

  function attack() public payable {
    address payable addr = payable(address(etherGame));
    selfdestruct(addr);
  }
  
}
```

Hàm `attack` trong smart contract `Attacker` sẽ xóa bytecode của smart contract này trên blockchain rồi ép smart contract `EtherGame` nhận ETH thông qua hàm `selfdestruct`. 

Giả sử người chơi A đặt vào trò chơi 1 ETH, kẻ tấn công khởi tạo smart contract `Attacker` với `msg.value` là 7. Sau đó, kẻ tấn công gọi hàm `attack` để hủy bytecode của `Attacker` và chuyển 7 ETH sang cho `EtherGame`. Điều này khiến cho số dư (`this.balance`) của `EtherGame` có giá trị là 8 và khiến cho những người dùng khác không thể đặt cọc cũng như là trờ thành người chiến thắng (từ chối dịch vụ).

Còn một cách khác để ép smart contract nhận ETH mà không thông qua việc gọi hàm. Cụ thể, kẻ tấn công xác định các địa chỉ smart contract mà một địa chỉ có thể tạo ra. Khi đó, kẻ tấn công sẽ gửi trước ETH vào các địa chỉ này và làm cho số dư của smart contract được tạo ra có giá trị khác 0.

Công thức dùng để tính toán địa chỉ của smart contract:

```solidity
keccak256(rlp.encode([<account_address>, <transaction_nonce>]))
```

Với:
- `keccak256` là một hàm băm.
- `rlp.encode` là minh họa cho việc encode dữ liệu theo giao thức RLP (Recursive-Length Prefix).
- `account_address` là địa chỉ tạo ra smart contract.
- `transanction_nonce` có giá trị bắt đầu bằng 1 và tăng dần theo thời gian khi có một giao dịch được gửi đi từ địa chỉ.

## Cách khắc phục

Không sử dụng giá trị `this.balance` làm điều kiện để thực thi những hành động quan trọng. Thay vào đó, có thể sử dụng một biến để đếm lượng ETH được chuyển đến smart contract thông qua các hàm `payable`.

Ví dụ, đối với smart contract `EtherGame` trên, có thể dùng thêm biến `depositedEther` như sau:

```solidity
contract EtherGame {
  
  uint256 public targetAmount = 7 ether;
  address public winner;
  uint public depositedEther;

  function deposit() public payable {
    require(msg.value == 1 ether, "You can only send 1 Ether");

    uint balance = depositedEther + msg.value;
    require(balance <= targetAmount, "Game is over");

    if (balance == targetAmount) {
      winner = msg.sender;
    }

    depositedEther += msg.value;
  }

  function claimReward() public {
    // ...
  }
    
}
```
# Hash Collisions with Multiple Variable Length Arguments

## Hàm `abi.encodePacked`

Được dùng để đóng gói và ABI encode @abi-specification nhiều giá trị. Hàm này khác hàm `abi.encode` ở chỗ nó không thêm các số 0 vào giá trị đầu ra.

Giả sử dùng hàm `abi.encodePacked` để encode các giá trị sau: 
- `int16(-1)`
- `bytes1(0x42)`
- `uint16(0x03)` 
- `string("Hello, world!")`

Hàm này sẽ trả về giá trị `0xffff42000348656c6c6f2c20776f726c6421`, là sự kết hợp của các giá trị được encode:

```txt
0xffff42000348656c6c6f2c20776f726c6421
  ^^^^                                 int16(-1)
      ^^                               bytes1(0x42)
        ^^^^                           uint16(0x03)
            ^^^^^^^^^^^^^^^^^^^^^^^^^^ string("Hello, world!") without a length field
```

## Mô tả

Việc sử dụng hàm `abi.encodePacked` với đối số là các mảng có kích thước không cố định có thể gây ra đụng độ giá trị băm (hash collision). Lý do là vì hàm này đóng gói các phần tử mà không quan tâm đến việc chúng có thuộc một mảng nào đó hay không. Cụ thể, hai dòng sau đây sẽ cho ra kết quả tương đương:

```solidity
abi.encodePacked([addr1, addr2], [addr3, addr4]);
abi.encodePacked([addr1, addr2, addr3], [addr4]);
```

Nếu smart contract sử dụng giá trị của hàm `abi.encodePacked` để xác thực thì kẻ tấn công có thể vượt qua xác thực bằng cách di chuyển một hoặc nhiều phần tử từ mảng này sang mảng khác.

Ví dụ:

```solidity
/*
 * @author: Steve Marx
 * Modified by Kaden Zipfel
 */
pragma solidity ^0.5.0;

import "./ECDSA.sol";

contract AccessControl {
  
  using ECDSA for bytes32;
  mapping(address => bool) isAdmin;
  mapping(address => bool) isRegularUser;
  // Add admins and regular users.
  function addUsers(
    address[] calldata admins,
    address[] calldata regularUsers,
    bytes calldata signature
  )
      external
  {
    if (!isAdmin[msg.sender]) {
      // Allow calls to be relayed with an admin's signature.
      bytes32 hash = keccak256(abi.encodePacked(admins, regularUsers));
      address signer = hash.toEthSignedMessageHash().recover(signature);
      require(isAdmin[signer], "Only admins can add users.");
    }
    for (uint256 i = 0; i < admins.length; i++) {
      isAdmin[admins[i]] = true;
    }
    for (uint256 i = 0; i < regularUsers.length; i++) {
      isRegularUser[regularUsers[i]] = true;
    }
  }
    
}
```

Người dùng có thể được thêm vào smart contract thông qua hàm `addUsers` bằng cách truyền vào mảng các admin, mảng các người dùng thông thường cùng với chữ ký của admin:

```solidity
addUsers([addr1, addr2], [addr3, <attacker's address>, addr4], sig)
```

Kẻ tấn công có thể gọi hàm `addUsers` như sau:

```solidity
addUser([addr1, addr2, addr3, <attacker's address>], [addr4], sig)
```

Như đã biết, việc di chuyển `addr3` và `<attacker's address>` sang mảng đầu tiên không làm thay đổi giá trị trả về của hàm `abi.encodePacked`. Nhờ đó, kẻ tấn công có thể tạo ra được chữ ký hợp lệ và trở thành admin.

## Cách khắc phục

Chỉ dùng hàm `abi.encodePacked` với đối số có kích thước cố định. 

Trong ví dụ của smart contract `AccessControl` trên, chỉ cho phép thêm vào $n$ ($n in N^*$) người dùng cố định đối với mỗi lần gọi hàm.

Ví dụ thêm 1 người dùng:

```solidity
/*
 * @author: Steve Marx
 * Modified by Kaden Zipfel
 */
pragma solidity ^0.5.0;

import "./ECDSA.sol";

contract AccessControl {
  
  using ECDSA for bytes32;
  mapping(address => bool) isAdmin;
  mapping(address => bool) isRegularUser;
  // Add a single user, either an admin or regular user.
  function addUser(
    address user,
    bool admin,
    bytes calldata signature
  )
      external
  {
    if (!isAdmin[msg.sender]) {
      // Allow calls to be relayed with an admin's signature.
      bytes32 hash = keccak256(abi.encodePacked(user));
      address signer = hash.toEthSignedMessageHash().recover(signature);
      require(isAdmin[signer], "Only admins can add users.");
    }
    if (admin) {
      isAdmin[user] = true;
    } else {
      isRegularUser[user] = true;
    }
  }

}
```

Ví dụ thêm 3 người dùng:

```solidity
/*
 * @author: Steve Marx
 * Modified by Kaden Zipfel
 */
pragma solidity ^0.5.0;

import "./ECDSA.sol";

contract AccessControl {
  
  using ECDSA for bytes32;
  mapping(address => bool) isAdmin;
  mapping(address => bool) isRegularUser;
  // Add admins and regular users.
  function addUsers(
    // Use fixed length arrays.
    address[3] calldata admins,
    address[3] calldata regularUsers,
    bytes calldata signature
  )
      external
  {
    if (!isAdmin[msg.sender]) {
      // Allow calls to be relayed with an admin's signature.
      bytes32 hash = keccak256(abi.encodePacked(admins, regularUsers));
      address signer = hash.toEthSignedMessageHash().recover(signature);
      require(isAdmin[signer], "Only admins can add users.");
    }
    for (uint256 i = 0; i < admins.length; i++) {
      isAdmin[admins[i]] = true;
    }
    for (uint256 i = 0; i < regularUsers.length; i++) {
      isRegularUser[regularUsers[i]] = true;
    }
  }
    
}
```
# Frozen Ether

## Mô tả

Nếu mã nguồn có các hàm `payable` nhưng không có hàm rút ETH thì sẽ khiến cho ETH bị khóa ở trong hợp đồng thông minh @zaazaa_2023_unveiling.

Ví dụ:

```solidity
// source: https://github.com/crytic/slither/wiki/Detector-Documentation#contracts-that-lock-ether

pragma solidity 0.4.24;

contract Locked {
  
    function receive() payable public { }
    
}
```

## Cách khắc phục

Xóa `payable` hoặc thêm vào hàm rút ETH.
# Call to the Unknown

## Mô tả

Lỗ hổng này xảy ra khi hàm fallback của một smart contract được thực thi theo một cách không mong đợi khi smart contract gọi hàm với signature không tồn tại hoặc gửi ETH.

Kẻ tấn công có thể cài đặt mã độc ở trong hàm fallback chẳng hạn như gọi đệ quy để gây ra lỗ hổng re-entrancy (@re-entrancy) hoặc cố tình hoàn trả giao dịch để làm smart contract rơi vào trạng thái từ chối dịch vụ.

Ví dụ:

```solidity
pragma solidity 0.6.12;

contract CallToTheUnknown {

  function call(address _addr) {
    (bool success, bytes memory data) = _addr.call{
    	value: msg.value,
    	gas: 5000
    }(abi.encodeWithSignature("foo(string,uint256)", "call foo", 123));
  }
  
}
```

Nếu smart contract ở địa chỉ `_addr` không có hàm với signature là `"foo(string,uint256)"` thì hàm fallback của nó sẽ được gọi. 

Việc gọi hàm thông qua thực thể của smart contract cũng xảy ra vấn đề tương tự nếu giao diện của smart contract được định nghĩa trong mã nguồn không khớp với smart contract đã được triển khai trên blockchain.

Ví dụ:

```solidity
contract Alice {
  
    function ping(uint) returns (uint256);
    
}

contract Bob {
  
    function pong(Alice a) {
        a.ping(42);
    }
    
}
```

Trong ví dụ trên, nếu signature của hàm `ping` không được khai báo đúng (chẳng hạn như sai kiểu dữ liệu của tham số) thì có thể dẫn đến việc thực thi hàm fallback một cách không mong muốn.

Các hàm chuyển ETH chẳng hạn như `send` hoặc `transfer` cũng có thể gọi hàm `receive` hoặc `fallback` (là `function()` đối với các phiên bản trước 0.6.0) của smart contract nhận ETH trong một số trường hợp.

## Cách khắc phục <call-to-the-unknown-remediation>

Cẩn trọng khi gọi đến các smart contract bên ngoài, đặc biệt là các smart contract được đánh dấu là không an toàn. Có thể triển khai mẫu thiết kế Check-Effect-Pattern như đã được đề cập trong @re-entrancy-remediation.
# Hiding Malicious Code with External Contract

## Mô tả

Trong Solidity, bất kỳ địa chỉ nào cũng có thể được ép kiểu thành một thực thể của hợp đồng thông minh. Kẻ tấn công có thể lợi dụng điều này để giấu mã độc @hiding-malicious-code-with-external-contract-ref.

Trong ví dụ dưới, kẻ tấn công triển khai `Foo` ở trên chuỗi khối với đối số hàm tạo là địa chỉ của `Mal`. Trong hàm tạo, `Foo` ép kiểu đối số thành một thực thể của `Bar`.

```solidity
// source: https://solidity-by-example.org/hacks/hiding-malicious-code-with-external-contract/
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
contract Foo {
    Bar bar;

    constructor(address _bar) {
        bar = Bar(_bar);
    }

    function callBar() public {
        bar.log();
    }
}

contract Bar {
    event Log(string message);

    function log() public {
        emit Log("Bar was called");
    }
}

contract Mal {
    event Log(string message);

    function log() public {
        emit Log("Mal was called");
    }
}
```

Giả sử người dùng chỉ đọc được mã nguồn của `Foo` và `Bar`, họ thấy rằng hai hợp đồng thông minh này không có vấn đề gì và gọi sử dụng hàm `Foo.callBar()`. Người dùng mong muốn hàm `Bar.log()` được gọi nhưng trên thực tế thì `Mal.log()` mới là hàm được gọi.

Kẻ tấn công cũng có thể sử dụng hàm fallback để chứa mã độc.

## Cách khắc phục

Có thể sử dụng những cách sau:
- Khởi tạo một thực thể mới của hợp đồng thông minh ở trong hàm tạo.
- Sử dụng trạng thái hiển thị của biến thực thể là `public` để người dùng có thể kiểm tra mã nguồn của hợp đồng thông minh trước khi thực thi hàm.

Minh họa:

```solidity
contract Foo {
  Bar public bar;
  // ...
  constructor() public {
      bar = new Bar();
  }
  // ...
}
```
# Double Constructor

## Mô tả

Tại phiên bản 0.4.22, smart contract có thể sử dụng cùng lúc hai loại hàm tạo: hàm tạo trùng tên với smart contract và hàm tạo có tên là `constructor`. Hàm tạo nào được định nghĩa trước sẽ được thực thi.

Ví dụ:

```solidity
contract Example {

  address public admin;

  function Example() public {
    admin = address(0x0);
  }

  constructor() public {
    admin = msg.sender;
  }
  
}
```

Việc dùng hai hàm tạo có thể khiến cho smart contract hoạt động không như mong đợi của lập trình viên.

## Cách khắc phục

Chỉ sử dụng một hàm tạo hoặc sử dụng các phiên bản Solidity sau 0.4.22.
# Built-in Symbol Shadowing

## Mô tả

Lỗ hổng này xảy ra khi lập trình viên dùng các định danh (identifier) có sẵn của Solidity để đặt tên cho biến, hàm, modifier hoặc sự kiện. Điều này có thể thay đổi hành vi mặc định của ngôn ngữ và gây ra các lỗi nghiệp vụ @zaazaa_2023_unveiling.

Ví dụ:

```solidity
// source: https://github.com/crytic/slither/wiki/Detector-Documentation#builtin-symbol-shadowing
pragma solidity ^0.4.24;

contract Bug {
  
    uint now; // Overshadows current time stamp.

    function assert(bool condition) public {
        // Overshadows built-in symbol for providing assertions.
    }

    function get_next_expiration(uint earlier_time) private returns (uint) {
        return now + 259200; // References overshadowed timestamp.
    }
    
}
```

Trong ví dụ trên, định danh `now` được đặt tên cho biến còn định danh `assert` được đặt tên cho hàm.

## Cách khắc phục

Thay đổi tên của biến, hàm, modifier hoặc sự kiện mà trùng với tên định danh.
# Identity Verification

## Mô tả

Một số smart contract kiểm tra xem một địa chỉ có phải là smart contract hay không thông qua opcode `extcodesize`.

```solidity
contract OnlyForHuman {
  
  function isContract(address addr) returns (bool) {
    uint size;
    assembly { size := extcodesize(addr) }
    return size > 0;
  }
  
}
```

Cụ thể, opcode này giúp trả về kích thước bytecode của địa chỉ ở trên blockchain. Việc kiểm tra này có thể đến từ nhu cầu chỉ cho phép các địa chỉ không phải là của smart contract thực thi hàm.

Tuy nhiên, kẻ tấn công có thể thực thi hàm ở trong hàm tạo và vượt qua được cách kiểm tra trên. Lý do là vì trong quá trình hàm tạo thực thi, giá trị trả về của `extcodesize` sẽ là 0.

Ví dụ @how-does-a-contract-find-out-if-another-address-is-a-contract:

```solidity
pragma solidity 0.4.25;

contract Victim {

  function isContract() public view returns(bool){
    uint32 size;
    address a = msg.sender;
    assembly {
      size := extcodesize(a)
    }
    return (size > 0);
  }

}

contract Attacker {
    
  bool public iTrickedIt;
  Victim v;
  
  constructor(address _v) public {
    v = Victim(_v);
    // addrss(this) doesn't have code, yet
    iTrickedIt = !v.isContract();
  }
}
```

Trong ví dụ trên, sau khi smart contract `Attacker` được triển khai ở trên blockchain, giá trị của `iTrickedIt` sẽ là `true` do giá trị trả về từ `v.isContract()` trong quá trình hàm tạo của `Attacker` đang thực thi là `false`.

## Cách khắc phục

Để nhận biết một địa chỉ không phải là smart contract, có thể so sánh giá trị `tx.origin` với giá trị `msg.sender`.

```solidity
contract OnlyForHuman {
  
  modifier isHuman() {
    require(tx.origin == msg.sender, "sorry humans only");
    _;
  }
  
}
```

Tuy nhiên, việc sử dụng `tx.origin` để xác thực có thể dẫn đến lỗ hổng Authorization through tx.origin ở @authorization-through-tx-origin.

# Immutable Bugs 

## Mô tả

Smart contract sau khi được triển khai lên mạng blockchain thì không thể được chỉnh sửa, kể cả khi có lỗi. Các lỗi này có thể bị khai thác bởi kẻ tấn công và thiệt hại gây ra là không thể khôi phục #footnote[The DAO là ngoại lệ duy nhất].

## Cách khắc phục

Có thể sử dụng các mẫu thiết kế giúp "nâng cấp" smart contract chẳng hạn như mẫu Proxy #footnote[@proxy-pattern[Phụ lục]] @transparent-proxy-pattern.

# Ether Lost in Transfer

## Mô tả

ETH được chuyển vào các địa chỉ mồ côi (không gắn liền với bất kỳ người dùng hoặc smart contract nào) sẽ bị mất hoàn toàn.

## Cách khắc phục

Do không có cách nào biết được một địa chỉ có phải là địa chỉ mồ côi hay không, lập trình viên cần đảm bảo tính đúng đắn của các địa chỉ nhận ETH ở trong smart contract một cách thủ công.
# Stack Size Limit

## Mô tả

Mỗi lần smart contract gọi thực thi hàm của  smart contract khác (hoặc gọi đến chính nó thông qua `this.f()`), call stack tương ứng với giao dịch sẽ tăng lên một frame @atzei_2017_a. Giới hạn của call stack cho mỗi giao dịch là 1024 @solidity-1024-call-stack-depth. Khi chạm đến giới hạn này, tất cả các lời gọi hàm đến bên ngoài smart contract (hoặc `this.f()`) đều gây ra ngoại lệ.

Kẻ tấn công có thể khai thác tính chất này để tạo ra một giao dịch có call stack gần đầy trước khi gọi hàm trong smart contract để gây ra ngoại lệ. Nếu ngoại lệ không được xử lý thì smart contract có thể rơi vào trạng thái từ chối dịch vụ.

Ví dụ, xét smart contract sau:

```solidity
contract Government {

  // ...
  function lendGovernmentMoney() returns (bool) {
    uint amount = msg.value;
    if (lastTimeOfNewCredit + ONE_MINUTE < block.timestamp) {
      // Return money to sender
      msg.sender.send(amount);
      // Sends all contract money to the last creditor
      creditorAddresses[creditorAddresses.length - 1].send(profitFromCrash);
      corruptElite.send(this.balance);
      // Reset contract state
      lastTimeOfNewCredit = block.timestamp;
      profitFromCrash = 0;
      creditorAddresses = new address[](0);
      creditorAmounts = new uint[](0);
      round += 1;
      return false;
    }
    // ...
  }
  // ...
  
}
```

Kẻ tấn công có thể là chủ sở hữu smart contract và ý định của người này là không chuyển ETH cho người chiến thắng. Để khai thác lỗ hổng, kẻ tấn công xây dựng một smart contract như sau:

```solidity
contract Attacker {
  
  function attack(address target, uint count) {
    if (0 <= count && count < 1023) {
      this.attack.gas(msg.gas - 2000)(target, count + 1);
    } else {
      Governmental(target).lendGovernmentMoney();
    }
  }
  
}
```

Có thể thấy, hàm `attack` của `Attacker` tự gọi đến chính nó 1022 lần. Sau đó, nó gọi đến hàm `lendGovernmentMoney` của `Governmental`. Độ sâu của call stack lúc này là 1023.

Khi `lendGovernmentMoney` gọi hàm `send` lần đầu tiên (`msg.sender.send(amount)`), call stack sẽ có độ sâu là 1024. Điều này sẽ gây ra ngoại lệ và khiến giao dịch bị hoàn trả.

## Cách khắc phục

Sau khi có EIP-150 @eip-150, smart contract gọi hàm chỉ cung cấp 63/64 lượng gas còn lại cho smart contract khác. 

Cụ thể, lượng gas R được giữ lại ở smart contract gọi hàm sẽ là @eip-150-and-the-63-64-rule-for-gas:

$
R = A - 63/64 * A
$

Với $A$ là lượng gas khả dụng tối đa ở độ sâu $N$ của call stack (không tính lượng gas tiêu thụ bởi những thao tác khác trong hàm). Giá trị này được tính như sau:

$
A = I * (63/64)^N
$

Với I là lượng gas ban đầu (tại độ sâu 0 của call stack).

Ví dụ, gas ban đầu là 3000 thì:
- Độ sâu $N = 10$ sẽ có $3000 * (63/64)^{10} = 2562$ gas khả dụng.
- Độ sâu $N = 20$ sẽ có $3000 * (63/64)^{20} = 2189$ gas khả dụng.



#figure(image("imgs/Gas available graph.png"), caption: [Minh họa tỷ lệ gas khả dụng theo độ sâu của ngăn xếp])

Có thể thấy, lượng gas khả dụng giảm rất nhanh xuống 0 và giúp tránh được việc call stack bị tràn.
# Function Selector Clashing

## Mô tả

EVM sẽ dựa vào 4 byte đầu tiên trong dữ liệu của một giao dịch gọi hàm để thực thi hàm tương ứng. Tuy nhiên, 4 byte này dễ bị đụng độ giá trị băm và có thể dẫn đến việc smart contract thực thi một hàm nào đó mà người dùng không mong muốn.

Xét proxy contract ở @proxy-pattern[phụ lục] với logic contract có dạng như sau @a2019_beware-of-the-proxy-learn-how-to-exploit-function-clashing:

```solidity
pragma solidity ^0.5.0;

import "openzeppelin-eth/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-eth/contracts/token/ERC20/ERC20Detailed.sol";
import "zos-lib/contracts/Initializable.sol";

contract BurnableToken is Initializable, ERC20Burnable, ERC20Detailed {

  function initialize(
    string memory name,
    string memory symbol,
    uint8 decimals,
    uint256 initialSupply
  ) 
    public 
    initializer
  {
    super.initialize(name, symbol, decimals);
    _mint(msg.sender, initialSupply);
  }
  
}
```

Smart contract `ERC20Burnable` @openzeppelin-contracts-token-erc20-extensions-erc20-burnable.sol có hàm `burn` như sau:

```solidity
import {ERC20} from "../ERC20.sol";
import {Context} from "../../../utils/Context.sol";

abstract contract ERC20Burnable is Context, ERC20 {

    // ...
    function burn(uint256 value) public virtual {
      _burn(_msgSender(), value);
    }
    // ...
    
}
```

Kẻ tấn công có thể thiết lập một hàm backdoor giúp rút ETH của người dùng ở trong proxy contract như sau @a2019_beware-of-the-proxy-learn-how-to-exploit-function-clashing:

```solidity
pragma solidity ^0.5.0;

contract Proxy {

  address public proxyOwner;
  address public implementation;

  // ...
  function collate_propagate_storage(bytes16) external {
    implementation.delegatecall(abi.encodeWithSignature(
        "transfer(address,uint256)", proxyOwner, 1000
    ));
  }
    
}
```

Giả sử có một người dùng sử dụng smart contract `Proxy` của kẻ tấn công để gọi hàm `burn` của `ERC20Burnable`. Khi người dùng gọi hàm `burn`, 4 byte đầu tiên trong giao dịch gọi hàm `burn` sẽ là `0x42966c68`. Tuy nhiên, 4 byte đầu tiên trong giá trị băm của hàm `collate_propagate_storage` cũng là `0x42966c68`. 

Theo nguyên tắc, EVM sẽ thực thi hàm có giá trị băm của signature khớp với 4 byte này ở trong proxy contract. Dẫn đến, hàm `collate_propagate_storage` sẽ được thực thi thay vì hàm fallback.

## Cách khắc phục

Điều kiện của lỗ hổng là phải có sự tồn tại của proxy contract bởi vì trình biên dịch sẽ phát hiện ra hai hàm trong cùng một smart contract có 4 byte đầu trong giá trị băm trùng nhau.

Ngoài ra, có thể sử dụng một số công cụ phân tích chẳng hạn như Slither @slither-upgradeability để phát hiện lỗ hổng này.

Người dùng cũng nên xem xét mã nguồn của proxy contract một cách cẩn thận trước khi sử dụng.
# Message Call with Hardcoded Gas Amount

## Mô tả

Hàm `transfer` và hàm `send` đã từng được sử dụng để giải quyết lỗ hổng re-entrancy (@re-entrancy) vì chúng chỉ cung cấp cho smart contract nhận ETH 2300 gas (hoặc nhỏ hơn) #footnote[Dưới phiên bản 0.4.0 thì hàm `send` có gas là 0 nếu lượng ETH chuyển đi là 0 và gas là 2300 nếu lượng ETH chuyển đi khác 0.] - lượng gas này quá nhỏ để thực hiện các thao tác phức tạp chẳng hạn như cập nhật biến trạng thái hoặc gọi hàm.

Tuy nhiên, một số sự thay đổi trong EVM gây ra bởi các lần hard fork có thể làm thay đổi giá gas và làm cho các giả định của các smart contract đã được triển khai về một giá gas cố định không còn đúng. Ví dụ, EIP-1884 @eip-1884 đã tăng giá của một số opcode chẳng hạn như `SLOAD` và làm một số smart contract không còn hoạt động được nữa.

Việc sử dụng hàm `call` với mức gas cố định cũng tương tự.

Ví dụ:

```solidity
/*
 * @author: Bernhard Mueller (ConsenSys / MythX)
 */
pragma solidity 0.6.4;

interface ICallable {
  function callMe() external;
}

contract HardcodedNotGood {

  address payable _callable = 0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa;
  ICallable callable = ICallable(_callable);

  constructor() public payable {
  }

  function doTransfer(uint256 amount) public {
    _callable.transfer(amount);
  }

  function doSend(uint256 amount) public {
    _callable.send(amount);
  }

   function callLowLevel() public {
     _callable.call.value(0).gas(10000)("");
   }

   function callWithArgs() public {
     callable.callMe{gas: 10000}();
   }
   
}
```

## Cách khắc phục

Không sử dụng `transfer` và `send` cũng như là chỉ định mức gas cố định khi sử dụng hàm `call`. Để tránh lỗ hổng re-entrancy khi sử dụng hàm `call`, có thể triển khai các mẫu bảo mật đã được đề cập ở @re-entrancy-remediation.
# Short Address

## Mô tả

Lỗ hổng này liên quan đến cách mà EVM decode dữ liệu giao dịch. Cụ thể hơn, nó liên quan đến việc hợp đồng thông minh sử dụng đối số có kiểu là địa chỉ (`address`) nhưng không thực hiện kiểm tra độ dài của dữ liệu giao dịch.

Xét ví dụ sau:

```solidity
//source: https://ericrafaloff.com/analyzing-the-erc20-short-address-attack/
pragma solidity ^0.4.11;
 
contract MyToken {
  
  mapping (address => uint) balances;
  
  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  
  function MyToken() {
    balances[tx.origin] = 10000;
  }
  
  function sendCoin(address to, uint amount) returns(bool sufficient) {
    if (balances[msg.sender] < amount) return false;
    balances[msg.sender] -= amount;
    balances[to] += amount;
    Transfer(msg.sender, to, amount);
    return true;
  }
  
  function getBalance(address addr) constant returns(uint) {
    return balances[addr];
  }
  
}
```

Giao dịch thực thi hàm `sendCoin()` có dạng như sau:

```
0x90b98a11
00000000000000000000000062bec9abe373123b9b635b75608f94eb8644163e
0000000000000000000000000000000000000000000000000000000000000002
```

Với:
- `0x90b98a11` là định danh hàm.
- `00000000000000000000000062bec9abe373123b9b635b75608f94eb8644163e` là đối số thứ nhất: địa chỉ của bên nhận token. 
- `0000000000000000000000000000000000000000000000000000000000000002` là đối số thứ hai: lượng token cần gửi.

Giả sử ứng dụng sử dụng hợp đồng thông minh trên cố định lượng token chuyển đi là 2 và chỉ nhận dữ liệu đầu vào là địa chỉ của bên nhận token.

Kẻ tấn công có thể sử dụng một địa chỉ có kích thước là 19 byte. Dữ liệu giao dịch có dạng như sau #footnote[Ký tự xuống dòng là để cho dễ nhìn, dữ liệu giao dịch không có ký tự này.]:

```
0x90b98a11
00000000000000000000000062bec9abe373123b9b635b75608f94eb86441600
00000000000000000000000000000000000000000000000000000000000002  
                                                              ^^
                                                The missing byte
```

Sự kiện `Transfer` được kích hoạt có các giá trị như sau:
- `_from`: `0x58bad47711113aea5bc5de02bce6dd7aae55cce5`
- `_ to`: `0x62bec9abe373123b9b635b75608f94eb86441600`
- `_value`: `512`

Có thể thấy, byte `00` đầu tiên của đối số thứ hai được xem như là byte cuối cùng của đối số thứ nhất. Điều này khiến cho đối số thứ hai bị mất một byte. EVM xử lý vấn đề này bằng cách đệm thêm một byte `00` vào bên phải của đối số thứ hai, khiến cho giá trị của nó từ `0x02` (2) thành `0x0200` (512).

Như vậy, kẻ tấn công đã tạo ra một giao dịch với lượng token được chuyển đi gấp 256 lần. 

Việc có một địa chỉ với byte cuối là `0x0` và hợp đồng thông minh có ít nhất 512 token là không quá khó xảy ra.

## Cách khắc phục

Thực hiện kiểm tra kích thước của dữ liệu giao dịch.

Ví dụ:

```solidity
// source: https://www.reddit.com/r/ethereum/comments/63s917/comment/dfwmhc3/
contract NonPayloadAttackableToken {
  
  modifier onlyPayloadSize(uint size) {
    assert(msg.data.length == size + 4);
    _;
  } 
  
  function transfer(address _to, uint256 _value) onlyPayloadSize(2 * 32) {
    // do stuff
  }
  
}
```

Trong ví dụ trên:
- `msg.data` chứa dữ liệu giao dịch và thuộc tính `length` cho biết kích thước của dữ liệu giao dịch.
- Giá trị 4 byte cộng thêm chính là kích thước của định danh hàm.

Kể từ phiên bản 0.5.0, lỗ hổng này đã được giải quyết. Cụ thể, khi dữ liệu giao dịch không đủ kích thước thì giao dịch sẽ bị hoàn trả @v0.5.0-soliditychangelogmd.
# Transaction Ordering Dependency

Các tên gọi khác: Race Condition, Front Running.

## Mô tả

Miner thường ưu tiên chọn những giao dịch có phí gas cao để cho vào các block. Điều này khiến cho thứ tự gửi lên của các giao dịch không giống với thứ tự thực thi của chúng. 

Lỗ hổng này xảy ra khi kẻ tấn công (có thể là miner) theo dõi danh sách các giao dịch đang chờ được thực thi ở trong blockchain và phát hiện ra một giao dịch nào đó có lợi hoặc gây bất lợi cho kẻ tấn công. Bằng cách tạo ra một giao dịch có phí gas cao hơn, kẻ tấn công có thể thu lợi hoặc hủy bỏ sự bất lợi nhờ vào việc miner luôn chọn những giao dịch có phí gas cao để thực thi.

Ví dụ @manning_2018_sigpsoliditysecurityblog:

```solidity
contract FindThisHash {
  
  bytes32 constant public hash = 0xb5b5b97fafd9855eec9b41f74dfb6c38f5951141f9a3ecd7f44d5479b630ee0a;

  constructor() public payable {} // load with ether

  function solve(string solution) public {
    // If you can find the pre image of the hash, receive 1000 ether
    require(hash == sha3(solution));
    msg.sender.transfer(1000 ether);
  }
  
}
```

Trong ví dụ trên, smart contract đưa ra một bài toán là tìm tiền ảnh cho giá trị băm `0xb5b5b97fafd9855eec9b41f74dfb6c38f5951141f9a3ecd7f44d5479b630ee0a` với phần thưởng là 1000 ETH.

Giả sử có một người dùng nào đó tìm ra lời giải là `Ethereum!` và gọi hàm `solve` để nhận phần thưởng. Kẻ tấn công đang theo dõi danh sách các giao dịch sẽ kiểm tra tính đúng đắn của lời giải này và tạo ra một giao dịch có chứa lời giải với phí gas cao hơn giao dịch của nạn nhân.

Miner sẽ thực thi giao dịch của kẻ tấn công trước do nó có phí gas cao và điều này khiến cho kẻ tấn công nhận được 1000 ETH từ smart contract.

## Cách khắc phục

Có thể thiết lập mức gas tối đa cho một giao dịch nhằm ngăn chặn việc người dùng sử dụng giao dịch với phí gas cao để có lợi thế hơn những người dùng khác. 

Tuy nhiên, cách này không thể ngăn chặn được những kẻ tấn công là miner bởi vì họ có thể sắp xếp thứ tự của các giao dịch một cách tùy ý mà không quan tâm đến phí gas. Giải pháp cho vấn đề này là sử dụng mô hình commit-reveal được đề cập ở trong @weak-sources-of-randomness-from-chain-attributes-remediation. 

Cụ thể, mỗi người chơi chỉ gửi lên giá trị băm của lời giải. Bằng cách này, miner không thể sắp xếp các giao dịch do không biết được lời giải thực sự bên trong các giao dịch. Sau khi giao dịch có chứa giá trị băm được đóng vào khối ở trên blockchain, người dùng có thể tiết lộ lời giải để smart contract so khớp với giá trị băm trước đó nhằm quyết định người chiến thắng. 

Dẫu vậy, mô hình commit-reveal cũng không thể che giấu giá trị ETH được gửi cùng với giao dịch và giá trị này có thể là một phần của lời giải cho bài toán của smart contract. Trong trường hợp cần che giấu lượng ETH được gửi cùng giao dịch, có thể sử dụng kỹ thuật Submarine Sends @submarine-sends.
# Timestamp Dependency <timestamp-dependency>

## Mô tả

Smart contract có thể sử dụng các thuộc tính của block chẳng hạn như `block.timestamp` hoặc `block.number` làm điều kiện để thực thi một hành động nào đó. Tuy nhiên, việc smart contract phụ thuộc vào các giá trị này là không an toàn:
- Trong trường hợp của `block.timestamp`, miner có thể thay đổi nhãn thời gian#footnote[Tất nhiên là không được nhỏ hơn nhãn thời gian của block trước đó hoặc quá xa trong tương lai (không quá 900 giây - tương ứng với 15 phút @luu_2016_making).] của block nên giá trị của nó có thể không như lập trình viên smart contract mong đợi.
- Trường hợp của `block.number` cũng tương tự, giá trị này có thể biến thiên nhanh hơn hoặc chậm đi tùy thuộc vào thời gian đào một block trong mạng blockchain. Mà thời gian đào một block không cố định và có thể thay đổi vì nhiều lý do chẳng hạn như blockchain tổ chức lại sau khi fork.

Ví dụ:

```solidity
pragma solidity ^0.5.0;

contract TimedCrowdsale {

  event Finished();
  event notFinished();

  // Sale should finish exactly at January 1, 2019
  function isSaleFinished() private returns (bool) {
    return block.timestamp >= 1546300800;
  }

  function run() public {
    if (isSaleFinished()) {
      emit Finished();
    } else {
      emit notFinished();
    }
  }

}
```

Smart contract trên sử dụng điều kiện `block.timestamp >= 1546300800` để phát ra sự kiện `Finished`. Giả sử thời gian hiện tại là 1546300000 (cách thời điểm kết thúc 800 giây và nhỏ hơn giới hạn 900 giây của Ethereum). Kẻ tấn công có thể làm cho sự kiện `Finished` được phát ra sớm hơn bằng cách gán nhãn thời gian cho block là thời điểm kết thúc (1546300800).

## Cách khắc phục

- Lập trình viên cần chú ý đến tính khả biến của các thuộc tính liên quan đến block khi sử dụng trong smart contract.
- Sử dụng Oracle #footnote[Là một loại công nghệ cho phép smart contract kết nối đến thế giới bên ngoài, thường là để lấy các số ngẫu nhiên hoặc dữ liệu thời gian thực] nếu có nhu cầu sinh số ngẫu nhiên (tương tự như phần @weak-sources-of-randomness-from-chain-attributes-remediation[]).
  

# Unencrypted Private Data On-Chain

## Mô tả

Trạng thái hiển thị `private` không đảm bảo rằng giá trị của biến sẽ được giữ bí mật. Bởi vì, khi cập nhật các biến trạng thái, người dùng cần gửi các giao dịch lên blockchain. Các giao dịch này là công khai với tất cả mọi người và có thể được phân tích bởi kẻ tấn công nhằm suy ra giá trị của biến. 

Do tính chất này, smart contract không nên lưu những dữ liệu riêng tư hoặc cần mã hóa.

Ví dụ, xét smart contract `OddEven` sau:

```solidity
/*
 * @source: https://gist.github.com/manojpramesh/336882804402bee8d6b99bea453caadd#file-odd-even-sol
 * @author: https://github.com/manojpramesh
 * Modified by Kaden Zipfel
 */

pragma solidity ^0.5.0;

contract OddEven {
  
  struct Player {
    address addr;
    uint number;
  }

  Player[2] private players;
  uint count = 0;

  function play(uint number) public payable {
    require(msg.value == 1 ether, 'msg.value must be 1 eth');
    players[count] = Player(msg.sender, number);
    count++;
    if (count == 2) selectWinner();
  }

  function selectWinner() private {
    uint n = players[0].number + players[1].number;
    (bool success, ) = players[n%2].addr.call.value(address(this).balance)("");
    require(success, 'transfer failed');
    delete players;
    count = 0;
  }
  
}
```

Smart contract trên là một trò chơi giữa hai người chơi. Mỗi người chơi lần lượt gọi hàm `play` với đối số của `number` là một con số bất kỳ. Nếu tổng hai số của hai người chơi (`n`) là chẵn thì người chơi đầu tiên sẽ được nhận toàn bộ ETH của contract. Ngược lại, nếu `n` là lẻ thì người chơi thứ hai sẽ được nhận toàn bộ ETH.

Giả sử người chơi đầu tiên gọi hàm `play` trong một giao dịch có dữ liệu như sau:

```
0x6587f6ec0000000000000000000000000000000000000000000000000000000000000064
```

Người chơi thứ hai sẽ phân tích dữ liệu trên như sau @r_2018_keeping-secrets-on-ethereum:
- `6587f6ec` là 4 byte đầu tiên trong giá trị băm Keccak-256 của "play(uint)".
- `0000000000000000000000000000000000000000000000000000000000000064` là giá trị đối số của `number` được đệm cho đủ 32 byte và có giá trị ở hệ thập phân là 100.

Từ những thông tin này, người chơi thứ hai sẽ chọn một số lẻ bất kỳ để tổng hai số của hai người chơi là số lẻ nhằm nhận được ETH từ smart contract.

## Cách khắc phục

Lưu dữ liệu riêng tư ở bên ngoài blockchain hoặc sử dụng mã hóa. 

Đối với smart contracrt `OddEven` ở trên, có thể áp dụng mô hình commit-reveal tương tự như phần @weak-sources-of-randomness-from-chain-attributes-remediation[]. Cụ thể, các biến trạng thái và cấu trúc trong smart contract phục vụ cho trò chơi sẽ có dạng như sau:

```solidity
/*
 * @source: https://github.com/yahgwai/rps
 * @author: Chris Buckland
 * Modified by Kaden Zipfel
 * Modified by Kacper Żuk
 */

contract OddEven {
  
  enum Stage {
    FirstCommit,
    SecondCommit,
    FirstReveal,
    SecondReveal,
    Distribution
  }

  struct Player {
    address addr;
    bytes32 commitment;
    bool revealed;
    uint number;
  }

  Player[2] private players;
  Stage public stage = Stage.FirstCommit;
  // ...
  
}
```

Trò chơi sẽ bao gồm 3 giai đoạn. Giai đoạn đầu tiên là giai đoạn commit:

```solidity
contract OddEven {
  
  // ...
  function play(bytes32 commitment) public payable {
    // Only run during commit stages
    uint playerIndex;
    if(stage == Stage.FirstCommit) playerIndex = 0;
    else if(stage == Stage.SecondCommit) playerIndex = 1;
    else revert("only two players allowed");

    // Require proper amount deposited
    // 1 ETH as a bet + 1 ETH as a bond
    require(msg.value == 2 ether, 'msg.value must be 2 eth');

    // Store the commitment
    players[playerIndex] = Player(msg.sender, commitment, false, 0);

    // Move to next stage
    if(stage == Stage.FirstCommit) stage = Stage.SecondCommit;
    else stage = Stage.FirstReveal;
  }
  // ...
  
}
```

Ở giai đoạn này, mỗi người chơi sẽ gửi lên smart contract giá trị băm (`commitment`) của các giá trị sau:
- Địa chỉ của người chơi.
- Con số tham gia trò chơi.
- Một giá trị bí mật.

Ngoài ra, người chơi cũng cần phải gửi thêm 1 ETH nhằm đảm bảo người chơi sẽ phải tiết lộ con số tham gia trò chơi và giá trị bí mật.

Giai đoạn thứ hai là giai đoạn tiết lộ bí mật:

```solidity
contract OddEven {

  // ...
  function reveal(uint number, bytes32 blindingFactor) public {
    // Only run during reveal stages
    require(stage == Stage.FirstReveal || stage == Stage.SecondReveal, "wrong stage");

    // Find the player index
    uint playerIndex;
    if(players[0].addr == msg.sender) playerIndex = 0;
    else if(players[1].addr == msg.sender) playerIndex = 1;
    else revert("unknown player");

    // Protect against double-reveal, which would trigger move to Stage.Distribution too early
    require(!players[playerIndex].revealed, "already revealed");

    // Check the hash to prove the player's honesty
    require(keccak256(abi.encodePacked(msg.sender, number, blindingFactor)) == players[playerIndex].commitment, "invalid hash");

    // Update player number if correct
    players[playerIndex].number = number;

    // Protect against double-reveal
    players[playerIndex].revealed = true;

    // Move to next stage
    if(stage == Stage.FirstReveal) stage = Stage.SecondReveal;
    else stage = Stage.Distribution;
  }
  // ...
  
}
```

Ở giai đoạn này, mỗi người chơi sẽ phải tiết lộ con số tham gia trò chơi (`number`) và giá trị bí mật (`blindingFactor`).

Giai đoạn cuối cùng là giai đoạn tính toán kết quả và phân bố ETH:

```solidity
contract OddEven {

  // ...
  function distribute() public {
    // Only run during distribution stage
    require(stage == Stage.Distribution, "wrong stage");

    // Find winner
    uint n = players[0].number + players[1].number;

    // Payout winners winnings and bond
    players[n%2].addr.call.value(3 ether)("");

    // Payback losers bond
    players[(n+1)%2].addr.call.value(1 ether)("");

    // Reset the state
    delete players;
    stage = Stage.FirstCommit;
  }
  
}
```

Giai đoạn này sẽ tính toán kết quả và gửi ETH cho các người chơi.
# Untrustworthy Data Feeds

## Mô tả

Để lấy dữ liệu từ bên ngoài blockchain, smart contract thường sử dụng các nguồn cấp dữ liệu chẳng hạn như các Oracle. Tuy nhiên, không có gì đảm bảo rằng dữ liệu từ các nguồn này là đáng tin cậy bởi vì kẻ tấn công có thể thao túng dữ liệu nhằm khiến cho các thao tác của smart contract trở nên sai lệch.

## Cách khắc phục

Có thể sử dụng công cụ Town Crier @town-crier. Công cụ này đóng vai trò như là một bên xác thực dữ liệu trung gian giữa smart contract và các nguồn cấp dữ liệu. 


