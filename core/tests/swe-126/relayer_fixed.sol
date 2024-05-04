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

contract Target {
  function execute(bytes memory _data) public {
    // Execute contract code
  }
  
}