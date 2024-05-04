// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EtherLostInTransfer {
    address owner = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    modifier onlyAdmin() {
        require(msg.sender == owner);
        _;
    }

    function withdrawAll() public onlyAdmin {
        //ruleid: swe-145
        payable(0x617F2E2fD72FD9D5503197092aC168c91465E7f2).transfer(
            address(this).balance
        );
    }

    function withdraw(address receiver) public onlyAdmin {
        //ruleid: swe-145
        payable(receiver).transfer(
            address(this).balance
        );
    }
}
