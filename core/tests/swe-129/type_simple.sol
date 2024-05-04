pragma solidity ^0.4.25;

contract TypoSimple {

    //ok: swe-129
    uint onlyOne = 1;
    //ok: swe-129
    bool win = false;

    function addOne() public {
        //ruleid: swe-129
        onlyOne =+ 1;
        if(onlyOne>1) {
            win = true;
        }
    }

    function iWin() view public returns (bool) {
        return win;
    }
}