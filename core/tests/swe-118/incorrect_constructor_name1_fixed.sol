pragma solidity ^0.4.24;

//ok: swe-118
contract Missing {
    address private owner;

    modifier onlyowner() {
        require(msg.sender == owner);
        _;
    }

    function Missing() public {
        owner = msg.sender;
    }

    function() payable {}

    function withdraw() public onlyowner {
        owner.transfer(this.balance);
    }
}
