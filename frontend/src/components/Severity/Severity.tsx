import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { SEVERITY } from "@/enums";

import "./Severity.scss";

const Severity: React.FC<{ type: SEVERITY | string }> = ({ type }) => {
  return (
    <Box className={`severity severity--${type.toLowerCase()}`}>
      <Typography className="severity__title">{type}</Typography>
    </Box>
  );
};

export default Severity;
