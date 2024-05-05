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
        //ruleId: swe-134
        _callable.transfer(amount);
    }

    function doSend(uint256 amount) public {
        //ruleId: swe-134
        _callable.send(amount);
    }

    function callLowLevel() public {
        //ruleId: swe-134
        _callable.call.value(0).gas(10000)("");
    }

    function callWithArgs() public {
        //ruleId: swe-134
        callable.callMe{gas: 10000}();
    }
}
