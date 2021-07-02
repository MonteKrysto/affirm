import React from "react";
import { FormStyle } from "../style";

const Form = ({ children, ...props }) => {
  return <FormStyle {...props}>{children}</FormStyle>;
};

export default Form;
