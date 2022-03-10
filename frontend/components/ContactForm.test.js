import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

beforeEach(() => {
  render(<ContactForm />);
});

afterEach(() => {
  window.localStorage.clear();
});

describe("ContactForm component", () => {
  test("renders without errors", () => {});

  test("renders the contact form header", () => {
      const heading = screen.queryByText("Contact Form", { exact: false });
      expect(heading).toBeVisible();
      expect(heading).toBeInTheDocument();
  });

  test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
      const firstNameInput = screen.getByPlaceholderText("Edd");
      fireEvent.change(firstNameInput, { target: { value: "a" } });
      const firstNameError = await screen.findByText("Error: firstName must have at least 5 characters", { exact: false });
      expect (firstNameError).toBeInTheDocument();
  });

  test("renders THREE error messages if user enters no values into any fields.", async () => {
      const submitBtn = screen.getByText("Submit");
      fireEvent.click(submitBtn);
      const firstNameError = await screen.findByText("Error: firstName must have at least 5 characters", { exact: false });
      expect(firstNameError).toBeInTheDocument();
      const lastNameError = await screen.findByText("Error: lastName is a required field", { exact: false });
      expect(lastNameError).toBeInTheDocument();
      const emailError = await screen.findByText("Error: email must be a valid email address", { exact: false });
      expect(emailError).toBeInTheDocument();

  });

  test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
      const firstNameInput = screen.getByPlaceholderText("Edd");
      fireEvent.change(firstNameInput, { target: { value: "abcde" }});
      const lastNameInput = screen.getByPlaceholderText("Burke");
      fireEvent.change(lastNameInput, { target: { value: "abc" }});
      const submitBtn = screen.getByText("Submit");
      fireEvent.click(submitBtn);
      const emailError = await screen.findByText("Error: email must be a valid email address", { exact: false });
      expect(emailError).toBeInTheDocument();
  });

  test('renders "email must be a valid email address" if an invalid email is entered', async () => {
      const emailInput = screen.getByPlaceholderText("bluebill1049@hotmail.com");
      fireEvent.change(emailInput, { target: { value: "aaa" }});
      const emailError = await screen.findByText(
        "Error: email must be a valid email address",
        { exact: false }
      );
      expect(emailError).toBeInTheDocument();
  });

  test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {});

  test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {});

  test("renders all fields text when all fields are submitted.", async () => {});
});
