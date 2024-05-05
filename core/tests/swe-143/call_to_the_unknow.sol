
contract CallToTheUnknown {
  function call() {
    (bool success, bytes memory data) = _addr.call{
    	value: msg.value,
    	gas: 5000
    //ruleId: swe-143
    }(abi.encodeWithSignature("foo(string,uint256)", "call foo", 123));
  }
  
}