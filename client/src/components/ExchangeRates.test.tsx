import React from "react";
// import {render, screen} from '@testing-library/react'
import TestRenderer from "react-test-renderer";
import { MockedProvider } from "@apollo/client/testing";
import ExchangeRates, { EXCHANGE_RATES } from "./ExchangeRates";

const { act } = TestRenderer;
const mocks: any = [
  {
    request: {
      query: EXCHANGE_RATES,
      variables: {}
    },
    result: {
      data: {
        rates: [
          { currency: "AED", rate: "3.673015", __typename: "ExchangeRate" }
        ]
      }
    }
  }
];

const SubComponent = () => <p>AED: 3.673015</p>;

it("renders ExchangeRates without error", async () => {
  const component = TestRenderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ExchangeRates />
    </MockedProvider>
  );

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  const testInstance = component.root;
  const tree: any = component.toJSON();
  // console.log("tree.children==", tree.children[0])
  // expect(tree.children[0]).toMatchObject(<p>AED: 3.673015</p>);

  // console.log("tree.children==", testInstance.findByProps({className: "sub"}).children)
  expect(testInstance.findByProps({ className: "sub" }).children[0]).toEqual(
    "AED"
  );
});
