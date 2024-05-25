pragma solidity 0.4.24;

//ok: swe-138
contract LockedFixed {
    function() public payable {}

    function withdraw() public {
        msg.sender.transfer(address(this).balance);
    }
}
