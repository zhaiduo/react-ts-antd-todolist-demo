import React from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Link,
//   RouteComponentProps
// } from "react-router-dom";
import { GithubOutlined } from "@ant-design/icons";
import { Button, Row, Col, Layout } from "antd";
import ExchangeRates from "../components/ExchangeRates";
import UserContext from "../context/UserContext";
import "../App.less";

const { Content } = Layout;

const Index: any = () => {
  const { userInfo }: any = React.useContext(UserContext);
  console.log("userInfo==", userInfo);
  const loginWithGithub = (e: any) => {
    console.log("loginWithGithub==", e.target);
  };
  return userInfo && Object.keys(userInfo).length ? (
    <div className="App">
      <span>Welcome </span>
      <Button type="primary">Sign Out</Button>
      <ExchangeRates />
    </div>
  ) : (
    <div className="App">
      <Row justify="space-around" align="middle">
        <Col span={24}>
          <Content className="site-layout-background">
            <Button
              type="primary"
              shape="round"
              icon={<GithubOutlined />}
              size="large"
              onClick={loginWithGithub}
              className="github-btn"
            >
              Sign In with Github Account
            </Button>
          </Content>
        </Col>
      </Row>
    </div>
  );
};

export default Index;
