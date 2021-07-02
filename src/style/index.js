import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
`;

export const Wrapper = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  width: 520px;
  height: 450px;
  background-color: #242852;
`;

export const Row = styled.div`
  height: 20%;
  width: 100%;
  border-bottom: 1.2px solid #292c58;
`;

export const Info = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 40px;
`;

export const Input = styled.input`
  display: inline-block;
  max-width: 300px;
  width: 300px;
  background-color: transparent;
  font-family: "Source Code Pro";
  border: none;
  outline: none;
  margin-left: 50px;
  color: white;
`;

export const StyledLabel = styled.label`
  display: inline-block;
  letter-spacing: 0.5px;
  color: #8f92c3;
  width: 100px;
`;

export const MessageStyle = styled.div`
  display: inline-block;
  color: red;
  margin-left: 150px;
  margin-top: 30px;
  font-size: 0.9rem;
  opacity: 0.8;

  ${({ container }) =>
    container &&
    css`
      position: absolute;
    `};

  ${({ success }) =>
    success &&
    css`
      color: green;
    `};
`;

export const FormStyle = styled.form`
  height: 100%;
  width: 100%;
`;

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

export const ButtonStyle = styled.button`
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 1px;
  width: 120px;
  background-color: #18c2c0;
  border: none;
  color: #fff;
  padding: 9px;
  border-radius: 5px;
  outline: none;
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 20px 20px;

  &:hover {
    cursor: pointer;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: gray;
    `}
`;

export const CardImage = styled.img`
  display: flex;
  flex-direction: row-reverse;
  margin: 10px 20px;
`;

export const TitleStyle = styled.h1`
  color: #8f92c3;
`;
