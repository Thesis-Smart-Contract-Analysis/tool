pragma solidity ^0.5.0;

contract ModifierEntrancy {
    mapping(address => uint) public tokenBalance;
    string constant name = "Nu Token";
    Bank bank;

    constructor(address bankAddress) public {
        bank = Bank(bankAddress);
    }

    //If a contract has a zero balance and supports the token give them some token
    //todook: swe-107
    function airDrop() public supportsToken hasNoBalance {
        // In the fixed version supportsToken comes before hasNoBalance
        tokenBalance[msg.sender] += 20;
    }

    //Checks that the contract responds the way we want
    modifier supportsToken() {
        require(
            keccak256(abi.encodePacked("Nu Token")) == bank.supportsToken()
        );
        _;
    }
    //Checks that the caller has a zero balance
    modifier hasNoBalance() {
        require(tokenBalance[msg.sender] == 0);
        _;
    }
}

contract Bank {
    function supportsToken() external returns (bytes32) {
        return (keccak256(abi.encodePacked("Nu Token")));
    }
}
