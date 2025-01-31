//Single transaction overflow
//Post-transaction effect: overflow escapes to publicly-readable storage
//Safe version

pragma solidity ^0.4.19;

contract IntegerOverflowMinimal {
    uint public count = 1;

    function run(uint256 input) public {
        count = sub(count, input);
    }

    //from SafeMath
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a); //SafeMath uses assert here
        //ok: swe-101
        return a - b;
    }
}
