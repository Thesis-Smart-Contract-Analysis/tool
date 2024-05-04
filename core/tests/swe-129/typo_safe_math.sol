pragma solidity ^0.4.25;

/** Taken from the OpenZeppelin github
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, reverts on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522

    //ok: swe-129
    if (a == 0) {
      return 0;
    }

    //ok: swe-129
    uint256 c = a * b;
    //ok: swe-129
    require(c / a == b);

    return c;
  }

  /**
  * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    //ok: swe-129
    require(b > 0); // Solidity only automatically asserts when dividing by 0
    //ok: swe-129
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  /**
  * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    //ok: swe-129
    require(b <= a);
    //ok: swe-129
    uint256 c = a - b;

    return c;
  }

  /**
  * @dev Adds two numbers, reverts on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    //ok: swe-129
    uint256 c = a + b;
    //ok: swe-129
    require(c >= a);

    return c;
  }

  /**
  * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
  * reverts when dividing by zero.
  */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    //ok: swe-129
    require(b != 0);
    return a % b;
  }
}


contract TypoSafeMath {

    using SafeMath for uint256;
    //ok: swe-129
    uint256 public numberOne = 1;
    //ok: swe-129
    bool public win = false;

    function addOne() public {
        //ruleId: swe-129
        numberOne =+ 1;
    }

    function addOneCorrect() public {
        //ok: swe-129
        numberOne += 1;
    }

    function addOneSafeMath() public  {
        //ok: swe-129
        numberOne = numberOne.add(1);
    }

    function iWin() public {
        //ok: swe-129
        if(!win && numberOne>3) {
            //ok: swe-129
            win = true;
        }
    }
}