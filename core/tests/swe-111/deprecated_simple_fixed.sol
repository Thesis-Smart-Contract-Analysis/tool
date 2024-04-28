pragma solidity ^0.4.24;

contract DeprecatedSimpleFixed {
    function useDeprecatedFixed() public view {
        //ok: swe-111
        bytes32 bhash = blockhash(0);
        //ok: swe-111
        bytes32 hashofhash = keccak256(bhash);

        //ok: swe-111
        uint gas = gasleft();

        if (gas == 0) {
            //ok: swe-111
            revert();
        }

        //ok: swe-111
        address(this).delegatecall();

        //ok: swe-111
        uint8[3] memory a = [1, 2, 3];

        //ok: swe-111
        (bool x, string memory y, uint8 z) = (false, "test", 0);

        //ok: swe-111
        selfdestruct(address(0));
    }

    //ok: swe-111
    function receive() external payable {}
}
