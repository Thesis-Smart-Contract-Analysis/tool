/*
 * @source: https://github.com/sigp/solidity-security-blog#visibility
 * @author: SigmaPrime
 * Modified by Gerhard Wagner
 */

pragma solidity ^0.4.24;

contract HashForEther {
    function func1() {
        // Winner if the last 8 hex characters of the address are 0.
        require(uint32(msg.sender) == 0);
        func2();
    }

    function func2() {
        msg.sender.transfer(this.balance);
    }

    function func3() public {
        // Winner if the last 8 hex characters of the address are 0.
        require(uint32(msg.sender) == 0);
        func4();
    }

    function func4() internal {
        msg.sender.transfer(this.balance);
    }
}
