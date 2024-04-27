pragma solidity ^0.4.22;

contract SimpleSuicide {
    function sudicideAnyone() {
        //ruleid: swe-106
        selfdestruct(msg.sender);
    }
}
