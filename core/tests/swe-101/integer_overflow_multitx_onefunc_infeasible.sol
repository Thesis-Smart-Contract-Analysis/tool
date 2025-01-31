/*
 * @source: https://github.com/ConsenSys/evm-analyzer-benchmark-suite
 * @author: Suhabe Bugrara
 */

//Multi-transactional, single function
//Overflow infeasible because arithmetic instruction not reachable

pragma solidity ^0.4.23;

contract IntegerOverflowMultiTxOneFuncInfeasible {
    uint256 private initialized = 0;
    uint256 public count = 1;

    function run(uint256 input) public {
        if (initialized == 0) {
            return;
        }
        //todook: swe-101
        count -= input;
    }
}
