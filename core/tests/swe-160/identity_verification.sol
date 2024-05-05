contract OnlyForHuman {
  
  function isContract(address addr) returns (bool) {
    uint size;
    //ruleId: swe-160
    assembly { size := extcodesize(addr) }
    return size > 0;
  }
  
}