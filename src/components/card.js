import React from "react";
import { ItemContainer, CardImage } from "../style";

const Card = ({ card }) => {
  return (
    <ItemContainer>
      <CardImage src={`images/${card}.png`} alt='Card Image' />;
    </ItemContainer>
  );
};

export default Card;
