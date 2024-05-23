pragma solidity 0.4.24;

//ruleid: swe-138
contract LockedWithPrivateWithdrawFunction {
    function() public payable {}

    function withdraw() private {
        msg.sender.transfer(address(this).balance);
    }
}
