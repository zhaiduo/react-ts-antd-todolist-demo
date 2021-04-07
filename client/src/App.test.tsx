import React from "react";
// import { render, screen } from '@testing-library/react';
import TestRenderer from "react-test-renderer";
import { MockedProvider } from "@apollo/client/testing";
import { Button } from "antd";
import App from "./App";

const { act } = TestRenderer;

const mocks: any = [];

it("renders App without error", async () => {
  const component = TestRenderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      <App />
    </MockedProvider>
  );

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  const testInstance = component.root;
  const tree: any = component.toJSON();
  // console.log("tree.children==", testInstance.findByProps({type: "primary"}).props)
  expect(testInstance.findByProps({ type: "primary" }).props.children).toMatch(
    "learn react"
  );
});
