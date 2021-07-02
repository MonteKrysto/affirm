import React, { useState } from "react";
import { Container, Wrapper, Row } from "./style";
import { getCardType, formatNumber } from "./lib/utils";
import { TextField, Card, Message, Form, Button, Title } from "./components";
import useValidation from "./hooks/useValidation";

const PaymentForm = () => {
  const [context, setContext] = useState();
  const [number, setNumber] = useState();
  const [cardType, setCardType] = useState();

  /**
   * These are the configuration rules that apply to the fields in the form of:
   *   [name_of_field]: {
   *       [name_of_rule]: Error message to be returned if falsy
   *   }
   * @param {object} fields
   * @returns
   */
  const fieldsConfig = fields => ({
    fields: {
      Name: {
        isRequired: "Please provide a name as it appears on your card",
        isMinLength: {
          length: 3,
          message: "Please provide a proper name",
        },
      },
      number: {
        isRequired: "Please provide a credit card number",
        checkNumber: "Incorrecto",
      },
      Expiration: {
        isRequired: "Please provide an expiration in the form of MM/YYYY",
        checkExpirationFormat: { message: "Please provide an expiration in the form of MM/YYYY" },
        checkExpirationDate: { message: "This card is expired" },
      },
      CVC: {
        isRequired: "Please provide a CVC",
        checkCvcType: { message: "CVC does not match card type" },
      },
    },

    /**
     * These are custom validators that add additional functionality outside
     * of the ones that are provided
     */
    customValidators: {
      checkNumber: config => value => {
        if (value && cardType) {
          return !cardType.regex.test(value.toString()) ? "Invalid card number" : null;
        }
      },
      checkExpirationDate: config => value => {
        let [month, year] = value.split("/");
        let date = new Date();
        let currentMonth = date.getMonth();
        let currentYear = date.getFullYear();

        if (year < currentYear || (month < currentMonth && year <= currentYear)) {
          return config.message;
        }
      },
      checkExpirationFormat: config => value => {
        // MM/YYYY
        const expirationRegex = /^([0-9]{2})[\/]([0-9]{4})$/;
        return !expirationRegex.test(value) ? config.message : null;
      },
      checkCvcType: config => value => {
        if (value && cardType) {
          return value.length !== cardType.cvcLen ? config.message : null;
        }
      },
    },
    onSubmit: context => {
      if (context.isFormValid && areThereErrors(context.errors)) {
        alert("Thank you for your payment of $10,973.23");
        setContext(context);
        resetFields(fields => fieldsConfig(fields));
        setNumber(null);
      }
    },
    showErrors: "submit",
  });

  /**
   * Entry point into using validation hook
   */
  const { getFieldProps, getFormProps, errors, isFormValid, resetFields } = useValidation(fields =>
    fieldsConfig(fields)
  );

  /**
   * Check to see if there are any errors
   * @param {object} errors
   * @returns
   */
  const areThereErrors = errors => {
    return Object.values(errors).every(err => err === null);
  };

  /**
   * The onChange override is needed here to format the card number appropriately
   * @param {object} e
   */
  const handleChange = e => {
    const cardNumber = e.target.value;

    const card = getCardType(cardNumber);
    let val = formatNumber(card, cardNumber);

    setCardType(cardNumber === "" ? null : card);
    setNumber(val);
  };

  return (
    <>
      <Container>
        <Title text='Payment Form' />
        {cardType && <Card card={cardType.image} />}
        <Wrapper>
          <Form {...getFormProps()}>
            <Row>
              <TextField
                name='Cardholder Name'
                placeholder='John Smith'
                showerrormessage='true'
                error={errors.Name}
                {...getFieldProps("Name")}
              />
            </Row>
            <Row>
              <TextField
                placeholder='8888 8888 8888 8888'
                showerrormessage='true'
                error={errors.number}
                {...getFieldProps("number", {
                  onChange: e => handleChange(e),
                  value: { number },
                  rule: val => /^$|[0-9\s]$/.test(val),
                })}
                maxLength={(cardType && cardType.maxLen) || 16}
              />
            </Row>
            <Row>
              <TextField
                placeholder='MM/YYYY'
                showerrormessage='true'
                error={errors.Expiration}
                {...getFieldProps("Expiration")}
              />
            </Row>
            <Row>
              <TextField placeholder='123' showerrormessage='true' error={errors.CVC} {...getFieldProps("CVC")} />
            </Row>
            <Row>
              {!isFormValid && <Message container message='Please fix the errors in your form!' />}

              <Button type='submit' text='Submit' />
            </Row>
          </Form>
        </Wrapper>
      </Container>
    </>
  );
};
export default PaymentForm;
