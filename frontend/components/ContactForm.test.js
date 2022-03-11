import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

const submitBtn = () => screen.getByText("Submit");
const firstNameInput = () => screen.getByPlaceholderText("Edd");
const lastNameInput = () => screen.getByPlaceholderText("Burke");
const emailInput = () =>
  screen.getByPlaceholderText("bluebill1049@hotmail.com");
const messageInput = () => screen.getByLabelText("Message");

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
    fireEvent.change(firstNameInput(), { target: { value: "a" } });
    const firstNameError = await screen.findByText(
      "Error: firstName must have at least 5 characters",
      {
        exact: false,
      }
    );
    expect(firstNameError).toBeInTheDocument();
  });

  test("renders THREE error messages if user enters no values into any fields.", async () => {
    fireEvent.click(submitBtn());
    const firstNameError = await screen.findByText(
      "Error: firstName must have at least 5 characters",
      {
        exact: false,
      }
    );
    expect(firstNameError).toBeInTheDocument();
    const lastNameError = await screen.findByText(
      "Error: lastName is a required field",
      { exact: false }
    );
    expect(lastNameError).toBeInTheDocument();
    const emailError = await screen.findByText(
      "Error: email must be a valid email address",
      { exact: false }
    );
    expect(emailError).toBeInTheDocument();
  });

  test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
    fireEvent.change(firstNameInput(), { target: { value: "abcde" } });
    fireEvent.change(lastNameInput(), { target: { value: "abc" } });
    fireEvent.click(submitBtn());
    const emailError = await screen.findByText(
      "Error: email must be a valid email address",
      { exact: false }
    );
    expect(emailError).toBeInTheDocument();
  });

  test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    fireEvent.change(emailInput(), { target: { value: "aaa" } });
    const emailError = await screen.findByText(
      "Error: email must be a valid email address",
      { exact: false }
    );
    expect(emailError).toBeInTheDocument();
  });

  test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    fireEvent.change(firstNameInput(), { target: { value: "abcde" } });
    fireEvent.change(emailInput(), { target: { value: "aaa123@email.com" } });
    fireEvent.click(submitBtn());
    const lastNameError = await screen.findByText(
      "Error: lastName is a required field",
      { exact: false }
    );
    expect(lastNameError).toBeInTheDocument();
  });

  test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
    fireEvent.change(firstNameInput(), { target: { value: "abcde" } });
    fireEvent.change(lastNameInput(), { target: { value: "abc" } });
    fireEvent.change(emailInput(), { target: { value: "aaa123@email.com" } });
    fireEvent.click(submitBtn());
    const notThere = screen.queryByText("Message: abc", { exact: false });
    expect(notThere).not.toBeInTheDocument();
  });

  test("renders all fields text when all fields are submitted.", async () => {
    fireEvent.change(firstNameInput(), { target: { value: "abcde" } });
    fireEvent.change(lastNameInput(), { target: { value: "abc" } });
    fireEvent.change(emailInput(), { target: { value: "aaa123@email.com" } });
    fireEvent.change(messageInput(), { target: { value: "hello world" } });
    fireEvent.click(submitBtn());
    const firstName = screen.getByTestId("firstnameDisplay");
    expect(firstName).toBeVisible();
    const lastName = screen.getByTestId("lastnameDisplay");
    expect(lastName).toBeVisible();
    const email = screen.getByTestId("emailDisplay", {
      exact: false,
    });
    expect(email).toBeVisible();
    const message = screen.getByTestId("messageDisplay");
    expect(message).toBeVisible();
  });
});
