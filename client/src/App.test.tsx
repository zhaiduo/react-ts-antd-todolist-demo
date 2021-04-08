import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "./mock/matchMedia";
import { MockedProvider } from "@apollo/client/testing";
import { Button } from "antd";
import App from "./App";

const mocks: any = [];

it("renders App without error", async () => {
  const { container, getByText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
  expect(getByText("Sign In with Github Account")).toBeInTheDocument();
});
