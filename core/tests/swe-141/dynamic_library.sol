// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.4.0;

contract SetProvider {
    address setLibAddr;
    address owner;

    function SetProvider() {
        owner = msg.sender;
    }

    function updateLibrary(address a) {
        if (msg.sender == owner) {
            setLibAddr = a;
        }
    }

    function getSet() returns (address) {
        return setLibAddr;
    }
}

library Set {
    function version() returns (uint);
}

contract Bob {
    SetProvider public setProvider;

    function Bob(address setProviderAddress) {
        setProvider = SetProvider(setProviderAddress);
    }

    function getSetVersion() returns (uint) {
        address setAddr = setProvider.getSet();
        //ruleid: swe-141
        return Set(setAddr).version();
    }
}
