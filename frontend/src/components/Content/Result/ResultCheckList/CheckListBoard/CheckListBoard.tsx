import React from "react";

import { RESULT_TYPE } from "@/enums";

import MythrilCheckListBoard from "./MythrilCheckListBoard";
import SlitherCheckListBoard from "./SlitherCheckListBoard";
import "./CheckListBoard.scss";

const CheckListBoard: React.FC<{
  type: RESULT_TYPE;
}> = ({ type }) => {
  if (type === RESULT_TYPE.SLITHER) return <SlitherCheckListBoard />;

  if (type === RESULT_TYPE.MYTHRIL) return <MythrilCheckListBoard />;
};

export default CheckListBoard;
