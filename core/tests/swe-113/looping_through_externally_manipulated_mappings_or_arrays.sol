/*
 * @source: https://github.com/sigp/solidity-security-blog?tab=readme-ov-file#11-denial-of-service-dos-1
 */
contract DistributeTokens {
    address public owner; // gets set somewhere
    address[] investors; // array of investors
    uint[] investorTokens; // the amount of tokens each investor gets

    // ... extra functionality, including transferToken()
    function transferToken(address investor, uint amount) internal {
        // ...
    }

    function invest() public payable {
        investors.push(msg.sender);
        investorTokens.push(msg.value * 5); // 5 times the wei sent
    }

    function distribute() public {
        require(msg.sender == owner); // only owner
        for (uint i = 0; i < investors.length; i++) {
            // here transferToken(to,amount) transfers "amount" of tokens to the address "to"
            //ruleid: swe-113
            transferToken(investors[i], investorTokens[i]);
        }
    }
}
