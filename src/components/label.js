import React from "react";
import { StyledLabel } from "../style";

const Label = ({ htmlFor, text }) => {
  return <StyledLabel htmlFor={htmlFor}>{text}</StyledLabel>;
};

export default Label;
