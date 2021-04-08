import React, { FC } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { PageHeader, Menu, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import UserContext from "./context/UserContext";
// import format from 'dayjs';
import Index from "./screens/index";
import List from "./screens/list";
import "./App.less";

const App: FC = () => {
  const [userInfo, setUserInfo] = React.useState({});
  const [isShowtaskModal, setIsShowtaskModal] = React.useState(false);

  const openModal = React.useCallback(() => {
    setIsShowtaskModal(true);
  }, [setIsShowtaskModal]);

  return (
    <Router>
      <UserContext.Provider
        value={{ userInfo, setUserInfo, isShowtaskModal, setIsShowtaskModal }}
      >
        <div>
          <PageHeader
            className="site-page-header"
            // onBack={() => null}
            title="To Do List"
            subTitle="This is a subtitle"
          >
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1">
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/list">List</Link>
              </Menu.Item>
              <Menu.Item key="3" className="menu-icon-right">
                <Button className="hiddenBtn" onClick={openModal}>
                  <PlusCircleOutlined
                    className="menu-icon"
                    style={{ fontSize: 20, color: "#fff" }}
                  />
                </Button>
              </Menu.Item>
            </Menu>
          </PageHeader>
          <Route path="/" exact component={Index} />
          <Route path="/list" component={List} />
        </div>
      </UserContext.Provider>
    </Router>
  );
};

export default App;
