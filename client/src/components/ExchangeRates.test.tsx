import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "../mock/matchMedia";
import { MockedProvider } from "@apollo/client/testing";
import ExchangeRates, {
  EXCHANGE_RATES,
  EDIT_TODO,
  DEL_TODO,
  CREATE_TODO
} from "./ExchangeRates";
import UserContext from "../context/UserContext";
// import { getByTextContent, findByTextContent } from "../mock/helper";

const mocks: any = [
  {
    request: {
      query: EXCHANGE_RATES,
      variables: {}
    },
    result: {
      data: {
        allTodos: {
          data: [
            {
              completed: true,
              task: "哈哈哈宿舍睡觉睡觉睡觉23",
              __typename: "Todo",
              _id: "295289913030476289"
            }
          ]
        }
      }
    }
  }
];

const mock2: any = [
  {
    request: {
      query: EDIT_TODO,
      variables: {
        task: "I have changed.",
        completed: true,
        id: "295289913030476289"
      }
    },
    result: {
      data: {
        allTodos: {
          data: [
            {
              completed: true,
              task: "I have changed.",
              __typename: "Todo",
              _id: "295289913030476289"
            }
          ]
        }
      }
    }
  }
];

const customRender = (ui: any, { providerProps, ...renderOptions }: any) => {
  return render(
    <UserContext.Provider {...providerProps}>{ui}</UserContext.Provider>,
    renderOptions
  );
};

it("renders TodoList without error", async () => {
  const providerProps = {
    value: {
      isShowtaskModal: false,
      setIsShowtaskModal: (v: boolean) => {
        providerProps.value.isShowtaskModal = v;
      }
    }
  };

  const { container, getByText } = customRender(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ExchangeRates />
    </MockedProvider>,
    { providerProps }
  );

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  expect(getByText("哈哈哈宿舍睡觉睡觉睡觉23")).toBeInTheDocument();

  const editBtn = screen.getByTestId("edit-btn-0");
  const leftClick = { button: 0 };
  fireEvent.click(editBtn, leftClick);
  expect(getByText("New To Do")).toBeInTheDocument();

  const inputNode = screen.getByPlaceholderText("Please enter you task name.");
  fireEvent.change(inputNode, { target: { value: "I have changed." } });

  await waitFor(() =>
    expect(screen.getByDisplayValue("I have changed.")).toBeTruthy()
  );

  const submitBtn = screen.getByText("OK");
  // screen.getByText("确定");
  const leftClick2 = { button: 0 };
  fireEvent.click(submitBtn, leftClick2);
  // await waitFor(() => expect(getByText("New To Do")).not.toBeInTheDocument());
  // await waitFor(() => expect(getByText("I have changed.")).toBeInTheDocument());
});
