import { fireEvent, render, renderComponent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaymentForm from "./paymentForm";

describe("PaymentForm", () => {
  test("renders payment form", () => {
    const { getByText } = render(<PaymentForm />);
    const title = getByText(/Payment Form/i);
    expect(title).toBeInTheDocument();
  });

  describe("shows error messages", () => {
    test("when no fields are filled out and form is submitted", () => {
      const { getByText } = render(<PaymentForm />);

      fireEvent.click(getByText(/submit/i));
      expect(getByText("Please provide a name as it appears on your card")).toBeInTheDocument();
      expect(getByText("Please provide a credit card number")).toBeInTheDocument();
      expect(getByText("Please provide an expiration in the form of MM/YYYY")).toBeInTheDocument();
      expect(getByText("Please provide a CVC")).toBeInTheDocument();
    });

    test("when name is less than three characters", () => {
      const { getByText, getByPlaceholderText } = render(<PaymentForm />);

      userEvent.type(getByPlaceholderText(/John Smith/i), "tg");
      expect(getByPlaceholderText(/John Smith/i)).toHaveAttribute("value", "tg");
      fireEvent.click(getByText(/submit/i));

      expect(getByText("Please provide a proper name")).toBeInTheDocument();
    });

    test("when card number is not a recognized card", () => {
      const { getByText, getByPlaceholderText } = render(<PaymentForm />);

      userEvent.type(getByPlaceholderText(/8888 8888 8888 8888/i), "123");
      expect(getByPlaceholderText(/8888 8888 8888 8888/i)).toHaveAttribute("value", "123");
      fireEvent.click(getByText(/submit/i));

      expect(getByText("Invalid card number")).toBeInTheDocument();
    });

    test("when expiration is not in correct format", () => {
      const { getByText, getByPlaceholderText } = render(<PaymentForm />);

      userEvent.type(getByPlaceholderText("MM/YYYY"), "123");
      expect(getByPlaceholderText("MM/YYYY")).toHaveAttribute("value", "123");
      fireEvent.click(getByText(/submit/i));

      expect(getByText("Please provide an expiration in the form of MM/YYYY")).toBeInTheDocument();
    });

    test("when cvc is not in recognized format", () => {
      const { getByText, getByPlaceholderText } = render(<PaymentForm />);

      userEvent.type(getByPlaceholderText(/8888 8888 8888 8888/i), "3412 123456 12345");
      userEvent.type(getByPlaceholderText(/123/i), "123");

      expect(getByPlaceholderText(/123/i)).toHaveAttribute("value", "123");
      fireEvent.click(getByText(/submit/i));

      expect(getByText("CVC does not match card type")).toBeInTheDocument();
    });

    test("when card is expired", () => {
      const { getByText, getByPlaceholderText } = render(<PaymentForm />);

      userEvent.type(getByPlaceholderText("MM/YYYY"), "05/2020");
      fireEvent.click(getByText(/submit/i));

      expect(getByText("This card is expired")).toBeInTheDocument();
    });
  });

  describe("does not show errors", () => {
    test("when name is greater than two characters", () => {
      const { getByText, getByPlaceholderText, queryByText } = render(<PaymentForm />);

      userEvent.type(getByPlaceholderText("John Smith"), "Test Name");
      fireEvent.click(getByText(/submit/i));

      expect(queryByText("Please provide a proper name")).not.toBeInTheDocument();
    });

    test("when a card number is valid", () => {
      const { getByText, getByPlaceholderText, queryByText } = render(<PaymentForm />);

      userEvent.type(getByPlaceholderText(/8888 8888 8888 8888/i), "3412 123456 12345");
      fireEvent.click(getByText(/submit/i));

      expect(queryByText("Invalid card number")).not.toBeInTheDocument();
    });

    test("when expiration is in correct format", () => {
      const { getByText, getByPlaceholderText, queryByText } = render(<PaymentForm />);

      userEvent.type(getByPlaceholderText("MM/YYYY"), "01/2030");
      fireEvent.click(getByText(/submit/i));

      expect(queryByText("Please provide an expiration in the form of MM/YYYY")).not.toBeInTheDocument();
    });
  });
});
