pragma solidity 0.6.12;

contract CallToTheUnknown {
    function call(address _addr) public payable {
        (bool success, bytes memory data) = _addr.call{
            value: msg.value,
            gas: 5000
        }(abi.encodeWithSignature("foo(string,uint256)", "call foo", 123));
        //ruleId: swe-143
    }
}
