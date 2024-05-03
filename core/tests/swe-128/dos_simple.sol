pragma solidity ^0.4.25;

contract DosOneFunc {
    address[] listAddresses;

    function ifillArray() public returns (bool) {
        if (listAddresses.length < 1500) {
            for (uint i = 0; i < 350; i++) {
                //ok: swe-128
                listAddresses.push(msg.sender);
            }
            return true;
        } else {
            //ruleid: swe-128
            listAddresses = new address[](0);
            return false;
        }
    }
}
