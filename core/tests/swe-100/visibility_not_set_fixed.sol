/*
 * @source: https://github.com/sigp/solidity-security-blog#visibility
 * @author: SigmaPrime
 * Modified by Gerhard Wagner
 */

pragma solidity ^0.4.24;

contract HashForEther {
    //ok: swe-100
    function withdrawWinnings() public {
        // Winner if the last 8 hex characters of the address are 0.
        require(uint32(msg.sender) == 0);
        _sendWinnings();
    }

    //ok: swe-100
    function _sendWinnings() internal {
        msg.sender.transfer(this.balance);
    }
}
