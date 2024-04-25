pragma solidity ^0.4.22;

contract SimpleEtherDrain {
    function withdrawAllAnyone() {
        //ruleid: swe-105
        msg.sender.transfer(this.balance);
    }

    function() public payable {}
}
