import React from "react";
import { MessageStyle } from "../style";

const Message = ({ message, container, success }) => {
  return (
    <MessageStyle container={container} success={success}>
      <span>{message}</span>
    </MessageStyle>
  );
};

export default Message;
