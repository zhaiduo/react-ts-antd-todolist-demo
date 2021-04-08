import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import ExchangeRates from "../components/ExchangeRates";
// import DatePicker from "../components/DatePicker";
// import TimePicker from "../components/TimePicker";
// import Calendar from "../components/Calendar";
import UserContext from "../context/UserContext";

import "../App.less";

require("dotenv").config();

type TParams = { token?: string };
const ListPage = ({ match }: RouteComponentProps<TParams>) => {
  const { userInfo }: any = React.useContext(UserContext);
  console.log("userInfo==2", userInfo, process.env.REACT_APP_FAUNA_SECRET);

  const client = new ApolloClient({
    uri: "https://graphql.fauna.com/graphql",
    headers: {
      authorization: `Bearer ${process.env.REACT_APP_FAUNA_SECRET}`
    },
    cache: new InMemoryCache()
  });
  return (
    <div className="App">
      {userInfo && Object.keys(userInfo).length ? (
        <h2>This is a page for product with ID: {match.params.token} </h2>
      ) : null}
      <ApolloProvider client={client}>
        <ConfigProvider locale={zhCN}>
          <ExchangeRates />
        </ConfigProvider>
      </ApolloProvider>
      {/* <DatePicker />
      <TimePicker />
      <Calendar /> */}
    </div>
  );
};

export default ListPage;
