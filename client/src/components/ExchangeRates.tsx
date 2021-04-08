import React from "react";
import { useQuery, useMutation, gql, NetworkStatus } from "@apollo/client";
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

export const CREATE_TODO = gql`
  mutation PostMutationTodo($task: String!, $completed: Boolean!) {
    createTodo(data: { task: $task, completed: $completed }) {
      _id
      task
      completed
    }
  }
`;

export const EDIT_TODO = gql`
  mutation EditTodo($task: String!, $completed: Boolean!, $id: ID!) {
    updateTodo(id: $id, data: { task: $task, completed: $completed }) {
      _id
      task
      completed
    }
  }
`;

export const DEL_TODO = gql`
  mutation DelTodo($id: ID!) {
    deleteTodo(id: $id) {
      _id
    }
  }
`;

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
  const { loading, error, data, refetch, networkStatus } = useQuery(
    EXCHANGE_RATES,
    {
      variables: {},
      notifyOnNetworkStatusChange: true
    }
  );
  console.log("data==", data, error, isShowtaskModal);

  const [hasMore] = React.useState(false);

  const [disabled, setDisabled] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [checkedComplete, setCheckedComplete] = React.useState(false);
  const [taskName, setTaskName] = React.useState("");
  const [taskId, setTaskId] = React.useState("");
  const [bounds, setBounds] = React.useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });

  const [
    delTodo,
    { loading: mutationLoading, error: mutationError }
  ] = useMutation(DEL_TODO, {
    refetchQueries: [{ query: EXCHANGE_RATES }],
    update(cache, { data: data2 }) {
      console.log("update==delTodo", cache, data2);
      refetch();
    }
  });

  const [
    editTodo,
    { loading: mutationLoading2, error: mutationError2 }
  ] = useMutation(EDIT_TODO, {
    refetchQueries: [{ query: EXCHANGE_RATES }],
    update(cache, { data: data2 }) {
      console.log("update==editTodo", cache, data2);
      refetch();
    }
  });

  const [createTodo] = useMutation(CREATE_TODO, {
    variables: {
      task: taskName,
      completed: checkedComplete
    },
    refetchQueries: [{ query: EXCHANGE_RATES }],
    update(cache, { data: data2 }) {
      console.log("update==createTodo", cache, data2);
      refetch();
    }
  });

  const draggleRef: any = React.createRef();
  const modelRef: any = React.createRef();
  const inputRef: any = React.createRef();

  const handleModalOk = React.useCallback(
    (e: any) => {
      e.preventDefault();
      if (!taskName) {
        Modal.warning({
          title: "Confirm",
          icon: <ExclamationCircleOutlined />,
          content: `Please enter your task name!`,
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            console.log("onOk==", inputRef);
            if (inputRef && inputRef.current) {
              console.log("inputRef.current==", inputRef.current);
              inputRef.current.focus();
            }
            return new Promise((resolve) => {
              resolve(true);
            });
          }
        });
        return;
      }

      // console.log("isEdit==", isEdit, taskId, taskName, checkedComplete);

      if (isEdit && taskId) {
        editTodo({
          variables: { task: taskName, completed: checkedComplete, id: taskId }
        });
        setIsShowtaskModal(false);
        setTaskName("");
        setTaskId("");
        setCheckedComplete(false);
        setIsEdit(false);
      } else {
        createTodo();
        setIsShowtaskModal(false);
        setTaskName("");
        setCheckedComplete(false);
      }
    },
    [
      setIsShowtaskModal,
      setTaskName,
      setTaskId,
      setCheckedComplete,
      taskId,
      taskName,
      checkedComplete,
      isShowtaskModal,
      inputRef,
      createTodo,
      useMutation,
      isEdit,
      editTodo,
      setIsEdit
    ]
  );

  const handleModalCancel = React.useCallback(() => {
    setIsShowtaskModal(false);
    setTaskName("");
    setCheckedComplete(false);
  }, [setIsShowtaskModal]);

  const onStartDrag = React.useCallback(
    (event: any, uiData: any) => {
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
    },
    [draggleRef, setBounds]
  );

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

  if (networkStatus === NetworkStatus.refetch)
    return <div className="demo-loading-container-top">Refetching</div>;
  if (loading)
    return (
      <div className="demo-loading-container-top">
        <Spin />
      </div>
    );
  if (error) return <div className="demo-loading-container-top">Error :(</div>;

  if (!data || !data.allTodos || !data.allTodos.data) {
    return <div className="demo-loading-container-top">Error :(</div>;
  }

  // React.useMemo(() => {
  //   // if (data.allTodos.data.length !== todolist) setTodolist(data.allTodos.data);
  // }, [todolist, setTodolist, data]);

  const editItem = (item: any) =>
    React.useCallback(
      (e: any) => {
        console.log("editItem==", item, e);
        setIsEdit(true);
        setTaskName(item.task);
        setTaskId(item._id);
        setCheckedComplete(item.completed);
        setIsShowtaskModal(true);
      },
      [
        setCheckedComplete,
        setIsShowtaskModal,
        setTaskName,
        setIsEdit,
        setTaskId
      ]
    );

  const delItem = (item: any) =>
    React.useCallback(
      (e: any) => {
        console.log("delItem==", item, e);
        Modal.confirm({
          title: "Confirm",
          icon: <ExclamationCircleOutlined />,
          content: (
            <div>
              Are you sure to delete {item.task}
              {mutationLoading && <p>Waiting...</p>}
              {mutationError && <p>Delete Error :( Please try again</p>}
            </div>
          ),
          okText: "确认",
          cancelText: "取消",
          onOk: async () => {
            setTaskId(item._id);
            // console.log("setTaskId==", taskId, item._id);
            await delTodo({ variables: { id: item._id } });
            return new Promise((resolve) => {
              if (mutationError) {
                resolve(false);
              } else {
                resolve(true);
              }
            });
          },
          onCancel: () => {
            return new Promise((resolve) => {
              resolve(true);
            });
          }
        });
      },
      [taskId, setTaskId, delTodo]
    );

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
          dataSource={data.allTodos.data
            .map((n: any) => n)
            .sort((a: any, b: any) => {
              return a.completed < b.completed;
            })}
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
            ref={modelRef}
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
            ref={inputRef}
          />
        </p>
        {mutationLoading2 && <p>Waiting...</p>}
        {mutationError2 && <p>Edit Error :( Please try again</p>}
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
