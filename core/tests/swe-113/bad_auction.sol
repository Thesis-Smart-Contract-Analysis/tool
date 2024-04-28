/*
 * @source: https://fravoll.github.io/solidity-patterns/pull_over_push.html
 */

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BadAuction {
    address payable highestBidder;
    uint highestBid;

    function bid() public payable {
        require(msg.value >= highestBid);

        if (highestBidder != address(0)) {
            //ruleid: swe-113
            highestBidder.transfer(highestBid);
        }

        highestBidder = payable(msg.sender);
        highestBid = msg.value;
    }
}
