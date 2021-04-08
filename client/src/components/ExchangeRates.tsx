import React from "react";
import { useQuery, gql } from "@apollo/client";
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
  CheckOutlined
} from "@ant-design/icons";
import {
  List,
  Spin,
  Skeleton,
  Modal,
  Button,
  Input,
  Switch,
  Typography
} from "antd";
import Draggable from "react-draggable";
// import reqwest from "reqwest";
import InfiniteScroll from "react-infinite-scroller";
import UserContext from "../context/UserContext";

import "./ExchangeRates.less";

const { Text } = Typography;

export const EXCHANGE_RATES = gql`
  query GetTodos {
    allTodos {
      data {
        _id
        task
        completed
      }
    }
  }
`;

const ExchangeRates: any = () => {
  const { isShowtaskModal, setIsShowtaskModal }: any = React.useContext(
    UserContext
  );
  const { loading, error, data } = useQuery(EXCHANGE_RATES);
  console.log("data==", data, error, isShowtaskModal);
  const [hasMore] = React.useState(false);

  const [disabled, setDisabled] = React.useState(false);
  const [checkedComplete, setCheckedComplete] = React.useState(false);
  const [taskName, setTaskName] = React.useState("");
  const [bounds, setBounds] = React.useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });

  const draggleRef: any = React.createRef();

  const handleModalOk = React.useCallback(() => {
    setIsShowtaskModal(false);
    setTaskName("");
    setCheckedComplete(false);
  }, [setIsShowtaskModal]);

  const handleModalCancel = React.useCallback(() => {
    setIsShowtaskModal(false);
    setTaskName("");
    setCheckedComplete(false);
  }, [setIsShowtaskModal]);

  const onStartDrag = (event: any, uiData: any) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    if (draggleRef && draggleRef.current) {
      const targetRect = draggleRef.current.getBoundingClientRect();
      setBounds({
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y)
      });
    }
  };

  const onChangeComplate = React.useCallback(() => {
    setCheckedComplete(!checkedComplete);
  }, [setCheckedComplete, checkedComplete]);

  const onChangeTask = React.useCallback(
    (e: any) => {
      console.log("onChangeTask==", e.target.value);
      setTaskName(e.target.value);
    },
    [setTaskName]
  );

  if (loading)
    return (
      <div className="demo-loading-container-top">
        <Spin />
      </div>
    );
  if (error) return <div className="demo-loading-container-top">Error :(</div>;

  if (!data || !data.allTodos || !data.allTodos.data) {
    return <p>Error :(</p>;
  }

  const editItem = (item: any) =>
    React.useCallback(
      (e: any) => {
        console.log("editItem==", item, e);
        setTaskName(item.task);
        setCheckedComplete(item.completed);
        setIsShowtaskModal(true);
      },
      [setCheckedComplete, setIsShowtaskModal, setTaskName]
    );

  const delItem = (item: any) => (e: any) => {
    console.log("delItem==", item, e);
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure to delete "${item.task}"`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        return new Promise((resolve) => {
          resolve(true);
        });
      },
      onCancel: () => {
        return new Promise((resolve) => {
          resolve(true);
        });
      }
    });
  };

  const handleInfiniteOnLoad = () => {};

  return (
    <div className="demo-infinite-container">
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={handleInfiniteOnLoad}
        hasMore={!loading && hasMore}
        useWindow={false}
      >
        <List
          dataSource={data.allTodos.data}
          renderItem={(item: any, index: number) => (
            <List.Item
              key={index}
              actions={[
                <Button
                  onClick={editItem(item)}
                  className="link"
                  key="list-loadmore-edit"
                >
                  Edit
                </Button>,
                <Button
                  onClick={delItem(item)}
                  className="link"
                  key="list-loadmore-delete"
                >
                  Delete
                </Button>
              ]}
              className="demo-loading-item"
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={
                    item.completed ? (
                      <div className="center">
                        <CheckCircleFilled
                          style={{ fontSize: 30, color: "#cccccc" }}
                        />
                      </div>
                    ) : (
                      <div className="center">
                        <CheckCircleOutlined
                          style={{ fontSize: 30, color: "#1DA57A" }}
                        />
                      </div>
                    )
                  }
                />
                <div
                  className={
                    item.completed
                      ? "demo-loading-content-done"
                      : "demo-loading-content"
                  }
                >
                  {item.task}
                </div>
              </Skeleton>
            </List.Item>
          )}
        >
          {loading && hasMore && (
            <div className="demo-loading-container">
              <Spin />
            </div>
          )}
        </List>
      </InfiniteScroll>
      <Modal
        title={
          <div
            style={{
              width: "100%",
              cursor: "move"
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            New To Do
          </div>
        }
        visible={isShowtaskModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStartDrag(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <p>
          <Text className="fixTitle">Complete: </Text>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            // defaultChecked
            checked={checkedComplete}
            onChange={onChangeComplate}
          />
        </p>
        <br />
        <p>
          <Input
            placeholder="Please enter you task name."
            bordered={false}
            value={taskName}
            onChange={onChangeTask}
          />
        </p>
      </Modal>
    </div>
  );
  // return data.rates.map((n: any) => (
  //   <div key={n.currency}>
  //     <p className="sub">
  //       {n.currency}:{n.rate}
  //     </p>
  //   </div>
  // ));
};

export default ExchangeRates;
