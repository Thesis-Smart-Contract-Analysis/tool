pragma solidity 0.4.25;

contract ReturnValue {
    function callchecked(address callee) public {
        //ok: swe-104
        require(callee.call());
    }

    function callnotchecked(address callee) public {
        //ruleid: swe-104
        callee.call();
    }
}
