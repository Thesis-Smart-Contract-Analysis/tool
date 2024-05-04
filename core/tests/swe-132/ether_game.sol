// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EtherGame {
  
  uint256 public targetAmount = 7 ether;
  address public winner;

  function deposit() public payable {
    require(msg.value == 1 ether, "You can only send 1 Ether");

    //ruleId: swe-132
    uint256 balance = address(this).balance;
    require(balance <= targetAmount, "Game is over");

    if (balance == targetAmount) {
      winner = msg.sender;
    }
  }

  function claimReward() public {
    // ...
  }
}