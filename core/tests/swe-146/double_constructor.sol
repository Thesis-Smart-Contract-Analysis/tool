contract Example {

  address public admin;

  //ruleId: swe-146
  function Example() public {
    admin = address(0x0);
  }

  constructor() public {
    admin = msg.sender;
  }
  
}