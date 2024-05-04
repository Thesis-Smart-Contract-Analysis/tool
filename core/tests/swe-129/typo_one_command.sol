pragma solidity ^0.4.25;

contract TypoOneCommand {
    //ok: swe-129
    uint numberOne = 1;

    function alwaysOne() public {
        //ruleId: swe-129
        numberOne =+ 1;
    }
}