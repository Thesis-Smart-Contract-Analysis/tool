// source: https://www.reddit.com/r/ethereum/comments/63s917/comment/dfwmhc3/
pragma solidity ^0.4.11;

contract NonPayloadAttackableToken {
    modifier onlyPayloadSize(uint size) {
        assert(msg.data.length == size + 4);
        _;
    }

    //ok: short-address
    function transfer(
        address _to,
        uint256 _value
    ) public onlyPayloadSize(2 * 32) {
        // do stuff
    }
}
