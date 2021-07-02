import React from "react";
import { Info, Input } from "../style";
import Label from "./label";
import ErrorMessage from "./message";

const TextField = ({
  id,
  name,
  maxLength,
  placeholder,
  onChange,
  onBlur,
  value,
  error,
  showerrormessage,
  ...others
}) => {
  return (
    <Info>
      <Label htmlFor={name} text={name} />
      <Input
        type='text'
        id={id}
        name={name}
        maxLength={maxLength}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        placeholder={placeholder}
        {...others}
      />
      {showerrormessage && error && <ErrorMessage message={error} />}
    </Info>
  );
};

export default TextField;
