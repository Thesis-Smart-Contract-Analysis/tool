/*
 * @source: https://github.com/ConsenSys/evm-analyzer-benchmark-suite
 * @author: Suhabe Bugrara
 */

pragma solidity ^0.4.19;

contract AssertConstructor {
    function AssertConstructor() public {
        //ruleid: swe-110
        assert(false);
    }
}
