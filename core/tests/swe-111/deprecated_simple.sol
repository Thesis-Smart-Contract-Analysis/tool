pragma solidity ^0.4.24;

contract DeprecatedSimple {
    // Do everything that's deprecated, then commit suicide.

    //ruleid: swe-111
    function useDeprecated() public constant {
        //ruleid: swe-111
        bytes32 blockhash = block.blockhash(0);
        //ruleid: swe-111
        bytes32 hashofhash = sha3(blockhash);

        //ruleid: swe-111
        uint gas = msg.gas;

        if (gas == 0) {
            //ruleid: swe-111
            throw;
        }

        //ruleid: swe-111
        address(this).callcode();

        //ruleid: swe-111
        var a = [1, 2, 3];

        //ruleid: swe-111
        var (x, y, z) = (false, "test", 0);

        //ruleid: swe-111
        suicide(address(0));
    }

    //ruleid: swe-111
    function() public {}
}
