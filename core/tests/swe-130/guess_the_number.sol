/*
 * @source: https://youtu.be/P_Mtd5Fc_3E
 * @author: Shahar Zini
 */
pragma solidity ^0.5.0;

contract GuessTheNumber {
    uint _secretNumber;
    address payable _owner;
    event success(string);
    event wrongNumber(string);

    constructor(uint secretNumber) public payable {
        require(secretNumber <= 10);
        _secretNumber = secretNumber;
        _owner = msg.sender;
    }

    function getValue() public view returns (uint) {
        return address(this).balance;
    }

    function guess(uint n) public payable {
        require(msg.value == 1 ether);

        uint p = address(this).balance;
        //ruleid: swe-130
        checkAndTransferPrize(
            /*The prize‮/*rebmun desseug*/ n,
            p /*‭
                /*The user who should benefit */,
            msg.sender
        );
    }

    function checkAndTransferPrize(
        uint p,
        uint n,
        address payable guesser
    ) internal returns (bool) {
        if (n == _secretNumber) {
            guesser.transfer(p);
            emit success("You guessed the correct number!");
        } else {
            emit wrongNumber("You've made an incorrect guess!");
        }
    }

    function kill() public {
        require(msg.sender == _owner);
        selfdestruct(_owner);
    }
}
