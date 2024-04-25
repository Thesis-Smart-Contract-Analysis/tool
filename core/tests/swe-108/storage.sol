pragma solidity 0.4.24;

contract TestStorage {
    //ruleid: swe-108
    uint storeduint1 = 15;
    //ruleid: swe-108
    uint constant constuint = 16;
    //ruleid: swe-108
    uint32 investmentsDeadlineTimeStamp = uint32(now);

    //ruleid: swe-108
    bytes16 string1 = "test1";
    //ok: swe-108
    bytes32 private string2 = "test1236";
    //ruleid: swe-108
    string string3 = "lets string something";
    //ok: swe-108
    string public string4 = "lets string something";

    struct DeviceData {
        string deviceBrand;
        string deviceYear;
        string batteryWearLevel;
    }

    //ruleid: swe-108
    DeviceData deviceData;
    //ok: swe-108
    DeviceData private deviceData2;

    //ruleid: swe-108
    DeviceData[] deviceDataArray;
    //ok: swe-108
    uint[] private uintarray;

    //ruleid: swe-108
    mapping(address => DeviceData) structs1;
    //ok: swe-108
    mapping(address => uint) public uints1;

    function testStorage() public {
        address address1 = 0xbccc714d56bc0da0fd33d96d2a87b680dd6d0df6;
        address address2 = 0xaee905fdd3ed851e48d22059575b9f4245a82b04;

        uints1[address1] = 88;
        uints1[address2] = 99;

        DeviceData memory dev1 = DeviceData(
            "deviceBrand",
            "deviceYear",
            "wearLevel"
        );

        structs1[address1] = dev1;

        uintarray.push(8000);
        uintarray.push(9000);

        deviceDataArray.push(dev1);
    }
}
