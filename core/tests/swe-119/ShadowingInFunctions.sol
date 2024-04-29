pragma solidity 0.4.24;

contract ShadowingInFunctions {
    uint n = 2;
    uint x = 3;

    //ruleid: swe-119
    function test1() constant returns (uint n) {
        return n; // Will return 0
    }

    //ruleid: swe-119
    function test2() constant returns (uint n) {
        n = 1;
        return n; // Will return 1
    }

    //ruleid: swe-119
    function test3() constant returns (uint x) {
        //ruleid: swe-119
        uint n = 4;
        return n + x; // Will return 4
    }
}
