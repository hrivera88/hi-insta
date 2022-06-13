import React,{ useEffect, useState , useLayoutEffect, useCallback} from "react";
import {
  messagelisting,
  fetchSingleThread,
  updateLiveChatThreadStatus,
  liveChatMessageslist,
  deleteThread
} from "../../library/apiServices/webApi";
import {  useDispatch } from "react-redux";
import {
  setChatCrossButtonStatus,
  setChatWith,
} from "../../library/redux/actions";
import { setMessages } from "../../library/redux/actions";
// import moment from "moment";
// import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Header from "../../components/header";
// import Messages from "../../components/icons/messages";
// import Livechat from "../../components/icons/livechat";
// import FaceBook from "../../components/icons/faceBook";
// import ChatInput from "../../components/chatInput";
// import BubbleLoading from "../../components/bubble-loading";
import Chat from "../../components/chat";

const ChatView = (props) => {
  // const { messagesList } = useSelector((state) => state.global);
  const dispatch = useDispatch();
  // const messagesRef = useRef(null);
  const [activeThread, setactiveThread] = useState();
  const [redirect, setredirect] = useState("");
  const [limit, setlimit] = useState(20);
  const { org_name, thread_id, thread_type, crm_id } =
    props?.location?.state;
  const userData = JSON.parse(localStorage.getItem("userData"));
  const observer = React.createRef();
  // useEffect(() => {
  //   messagesRef?.current?.scrollIntoView(true);
  // }, [messagesList])
  const fetchThreadDetails = async () => {
    try {
      let threadObj = await fetchSingleThread(thread_id, org_name);
      if (threadObj && threadObj?.data) {
        if (threadObj?.data?.thread_status === "closed") {
          setredirect("Home");
        }
        if (threadObj?.data?.platform === "FB") {
          dispatch(
            setChatWith(
              `${
                threadObj?.data?.crmData?.first_name +
                " " +
                threadObj?.data?.crmData?.last_name
              }`
            )
          );
          dispatch(setChatCrossButtonStatus(false));
        } else if (threadObj.data?.thread_type === "sms") {
          dispatch(setChatWith(threadObj?.data?.crmData?.phone_mobile));
          dispatch(setChatCrossButtonStatus(false));
        } else {
          dispatch(setChatWith(`${threadObj?.data?.crmData?.first_name}`));
          dispatch(setChatCrossButtonStatus(true));
        }
        setactiveThread(threadObj.data);
      } else {
        toast("Couldn't find thread!");
        console.error("Couldn't find thread");
      }
    } catch (e) {
      toast("Error while fetching thread!");
      console.error("Error while fetching thread");
    }
  };
  const closeChat = async () => {
    try {
      const token = localStorage.getItem("user");
      // const userData = JSON.parse(localStorage.getItem("userData"))
      let threadCloseObj = activeThread;
      threadCloseObj.thread_end_chat_by = "agent";
      threadCloseObj.thread_status = "closed";
      let closeThread = await updateLiveChatThreadStatus(threadCloseObj, token);
      if (closeThread.error) {
        toast(closeThread.error);
        return;
      }
      if (closeThread) {
        toast('Chat is closed successfully.')
        // console.log("closed", closeThread);
        setTimeout(() => {
          setredirect("Home")
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const deleteActiveThreadFn = async () => {
    try {
      const token = localStorage.getItem("user");
      const userData = JSON.parse(localStorage.getItem("userData"))
      let deleteActiveThread = await deleteThread({ org_name: userData.orgName, thread_id: activeThread.thread_id, crm_id:activeThread?.crm_id, thread_type: activeThread.thread_type}, token);
      if (deleteActiveThread.error) {
        toast(deleteActiveThread.error);
        return;
      }
      if (deleteActiveThread) {
        toast('Chat is Deleted successfully.')
        // console.log("deleted", deleteActiveThread);
        setTimeout(() => {
          setredirect("Home")
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getMessagesList = async () => {
    // if (!messagesList || !messagesList.length> 0) {
    const token = localStorage.getItem("user");
    if (token) {
      let messagesList;
      if (thread_type === "livechat") {
        //org_name, crm_id,user_id, token)
        messagesList = await liveChatMessageslist(
          org_name,
          crm_id,
          userData.user_id,
          token,
          limit
        );
        // console.log("messagesList", messagesList);
        if (messagesList) {
          messagesList = messagesList.data.sort(
            (a, b) => parseFloat(a.created_at) - parseFloat(b.created_at)
          );
          const ph = messagesList.map((item) => {
            return {
              message_content: item.message_content,
              created_at: item.created_at,
              created_by: item.created_by,
              From: item.From,
              direction: item.direction,
            };
          });

          dispatch(setMessages(ph));
        }
      } else {
        messagesList = await messagelisting(org_name, thread_id, token, limit);
        if (messagesList) {
          const ph = messagesList.data.Items.map((item) => {
            return {
              message_content: item.message_content,
              created_at: item.created_at,
              created_by: item.created_by,
              From: item.From,
              direction: item.direction,
            };
          });
          dispatch(setMessages(ph));
        }
      }
    }
    // }
  };
  useEffect(() => {
    getMessagesList();
    // eslint-disable-next-line
  }, [limit]);
  useLayoutEffect(() => {
    fetchThreadDetails();
    // eslint-disable-next-line
  }, [])
  const handleBack = () => {
    setredirect("Home");
  };
  const firstMessageElementRef = useCallback(
    // (*)
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setlimit((prev) => prev + 10);
        }
      });
      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line
    []
  ); 
  return (
    <Chat
      handleBack={handleBack}
      activeThread={activeThread}
      redirect={redirect}
      setredirect={setredirect}
      userData={userData}
      thread_type={thread_type}
      ToastContainer={ToastContainer}
      closeChat={closeChat}
      toast={toast}
      deleteThread={deleteActiveThreadFn}
      firstMessageElementRef={firstMessageElementRef}
      limit={limit}
    />
  );
};
export default ChatView;
