import React from "react";
import { ItemContainer, ButtonStyle } from "../style";

const Button = ({ text, ...props }) => {
  return (
    <ItemContainer>
      <ButtonStyle {...props}>{text}</ButtonStyle>
    </ItemContainer>
  );
};

export default Button;
