// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FooFixed {
    Bar bar;

    //ok: swe-141
    constructor() {
        bar = new Bar();
    }

    function callBar() public {
        bar.log();
    }
}

contract Bar {
    event Log(string message);

    function log() public {
        emit Log("Bar was called");
    }
}

contract Mal {
    event Log(string message);

    function log() public {
        emit Log("Mal was called");
    }
}
