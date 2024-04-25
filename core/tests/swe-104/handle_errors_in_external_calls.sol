pragma solidity ^0.8.0;

interface ExternalContract {
    function deposit() external payable;
}

contract HandleErrorsInExternalCalls {
    function badSend(address payable someAddress) external {
        //ruleid: swe-104
        someAddress.send(55);
    }

    function badCall(address payable someAddress) external {
        //ruleid: swe-104
        someAddress.call{value: 55}("");
        //ruleid: swe-104
        someAddress.call{value: 100}(abi.encodeWithSignature("deposit()"));
    }

    function goodSend(address payable someAddress) external {
        //ok: swe-104
        (bool success, ) = someAddress.call{value: 55}("");
        //ok: swe-104
        require(success, "Send failed");
    }

    function goodCall(address payable someAddress) external {
        //ok: swe-104
        (bool success, ) = someAddress.call{value: 100}(
            abi.encodeWithSignature("deposit()")
        );
        //ok: swe-104
        require(success, "Call failed");
    }

    function saferDeposit(address payable someAddress) external {
        //ok: swe-104
        ExternalContract(someAddress).deposit{value: 100}();
    }
}
