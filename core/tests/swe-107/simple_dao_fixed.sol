/*
 * @source: http://blockchain.unica.it/projects/ethereum-survey/attacks.html#simpledao
 * @author: Atzei N., Bartoletti M., Cimoli T
 * Modified by Bernhard Mueller, Josselin Feist
 */
pragma solidity 0.4.24;

contract SimpleDAO {
    mapping(address => uint) public credit;

    function donate(address to) public payable {
        credit[to] += msg.value;
    }

    function withdraw(uint amount) public {
        if (credit[msg.sender] >= amount) {
            credit[msg.sender] -= amount;
            //ok: swe-107
            require(msg.sender.call.value(amount)());
        }
    }

    function queryCredit(address to) public view returns (uint) {
        return credit[to];
    }
}
