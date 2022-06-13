import { useEffect, useRef, useState } from "react";
import {
  messagelisting,
  assignChatToUser,
  fetchSingleThread,
  liveChatMessageslist,
  updateThreadStatus
} from "../../library/apiServices/webApi";
import { useDispatch } from "react-redux";
import {
  setMessages,
  setChatCrossButtonStatus,
  setChatWith,
} from "../../library/redux/actions";
// import moment from "moment";
import SocketService from "../../library/socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Header from "../../components/header";
// import Messages from "../../components/icons/messages";
// import Livechat from "../../components/icons/livechat";
// import FaceBook from "../../components/icons/faceBook";
import MonitorChat from "../../components/monitor-chat";

const MonitorView = (props) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const dispatch = useDispatch();
  const [activeThread, setActiveThread] = useState({});
  const messagesRef = useRef(null);
  const socket = SocketService.getInstance();
  const { org_name, thread_id, thread_type, thread_status, crm_id, platform } =
    props.location.state;
  const [redirect, setredirect] = useState("");
  const [redirectDataObj, setredirectDataObj] = useState({});

  const fetchThreadDetails = async () => {
    try {
      let threadObj = await fetchSingleThread(thread_id, org_name);
      if (threadObj && threadObj.data) {
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
        getMessagesList();
        setActiveThread(threadObj.data);
      } else {
        toast("Couldn't find thread!");
        console.error("Couldn't find thread");
      }
    } catch (e) {
      toast("Error while fetching thread!");
      console.error("Error while fetching thread");
    }
  };
  const getMessagesList = async () => {
    const token = localStorage.getItem("user");
    if (token) {
      let messagesList;
      if (thread_type === "livechat") {
        messagesList = await liveChatMessageslist(
          org_name,
          crm_id,
          userData.user_id,
          token
        );
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
          messagesRef?.current?.scrollIntoView(true);
        }
      } else {
        messagesList = await messagelisting(org_name, thread_id, token);
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
          messagesRef?.current?.scrollIntoView(true);
        }
      }
    }
  };
  const assignChatToUsers = async () => {
    console.log("=======start chat click is working=======");
    const token = localStorage.getItem("user");
    let threadObj = {
      thread_status: "open",
      user_id: userData.user_id,
      thread_id: thread_id,
      org_name: org_name,
      agent_bot_name: "Bilal test",
      created_by: userData.sceenName,
      profile_url: "",
      thread_start_chat: "",
      assignedTo: userData.user_id,
      connect_orgbot: "release",
      crm_id: crm_id,
      connect_botchain: "release",
      accept: true,
      read_by: userData.user_id,
      bot_user_id: "",
      chat_accept_flag: true,
    };
    if (thread_type === "livechat") { //updateThreadStatus
      threadObj.thread_status = "chatting";
      threadObj.bot_user_id = userData?.orgUserBotId;
      await assignChatToUser(threadObj, token).then((ress) => {
        if (ress.code === 200) {
          threadObj.threadStatus = threadObj.thread_status;
          socket.joinLiveChatMessageRoom(threadObj);
          toast("Thread is assigned to you!");
          setTimeout(() => {
            setredirect("ChatView");
          }, 3000);
        } else {
          toast(ress.error);
        }
        return;
      });
    } else {
      await updateThreadStatus(threadObj, token).then((ress) => {
        if (ress.code === 200) {
          threadObj.threadStatus = threadObj.thread_status;
          socket.joinLiveChatMessageRoom(threadObj);
          toast("Thread is assigned to you!");
          setTimeout(() => {
            setredirect("ChatView");
          }, 3000);
        } else {
          toast(ress.error);
        }
        return;
      });
    }
   
  };
  const handleBack = () => {
    setredirect("Home");
  };
  useEffect(() => {
    // let tempMessageId = "";
    setredirectDataObj({
      thread_id: thread_id,
      org_name: org_name,
      thread_type: thread_type,
      crm_id: crm_id,
      thread_status: thread_status,
      platform: platform || "platform",
    });

    fetchThreadDetails();
    // eslint-disable-next-line
  }, []);
  return (
    <MonitorChat
      redirectDataObj={redirectDataObj}
      toast={toast}
      redirect={redirect}
      userData={userData}
      thread_type={thread_type}
      handleBack={handleBack}
      assignChatToUsers={assignChatToUsers}
      activeThread={activeThread}
      ToastContainer={ToastContainer}
      setredirect= {setredirect}
    />
  );
};
export default MonitorView;
