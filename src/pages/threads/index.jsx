import React, { useLayoutEffect,useEffect, useState, useCallback } from "react";
// import Header from "../../components/header";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SocketService from "../../library/socket";
import moment from "moment";
import jwt from "jsonwebtoken";
import { ToastContainer, toast } from "react-toastify";
import { threadlisting } from "../../library/apiServices/webApi";
import { setThreadListing, setUserData } from "../../library/redux/actions";
import { getJwtToken } from "../../library/apiServices/webApi";
import "react-toastify/dist/ReactToastify.css";
import Intro from "../intro";
import ThreadList from "../../components/threadsList";
// const Messages = React.lazy(() => import("../../components/icons/messages"));
// const Livechat = React.lazy(() => import("../../components/icons/livechat"));
// const FaceBook = React.lazy(() => import("../../components/icons/faceBook"));

const Queue = (props) => {
  const { threadListing, userData } = useSelector((state) => state.global);
  const { instant_token } = useParams(); //props.match.params
  const [redirect, setredirect] = useState("");
  const [redirectDataObj, setredirectDataObj] = useState({});
  const [isIntro, setisIntro] = useState(false);
  const [limit, setlimit] = useState(10);
  const threadListingType = localStorage.getItem("threadListing") || 2;
  const observer = React.createRef();

  const dispatch = useDispatch();
  // const [isViewHistory, setisViewHistory] = useState(false);
  const fetchThreadList = (view_history = 2) => {
    // setisIntro(false);
    if (view_history === 1) {
      localStorage.setItem("threadListing", 1);
      // setisViewHistory(true);
    } else {
      localStorage.setItem("threadListing", 2);
      // setisViewHistory(false);
    }
    const token = localStorage.getItem("user");
    if (token) {
      var decoded = jwt.decode(token, { complete: true });
      localStorage.setItem("userData", JSON.stringify(decoded.payload));
      dispatch(setUserData(decoded.payload));
      threadlisting(token, view_history, limit)
        .then((resp) => {
          setisIntro(true);
          if (resp && resp?.data?.length > 0) {
            const ph = resp?.data.map((item) => {
              const createdAt =
                item.lastmessage_at ||
                item.updated_at ||
                item.created_at ||
                moment().valueOf();
              return {
                phone_mobile: item.phone_mobile,
                thread_type: item.thread_type,
                thread_id: item.thread_id,
                org_name: item.org_name,
                crm_id: item.crm_id,
                alivesecure_key: item?.alivesecure_key,
                aliveOpentokSession: item?.aliveOpentokSession || "",
                status: item?.thread_status,
                status_timestamp: item?.updated_at,
                timestamp: item?.timestamp,
                created_by: item.created_by,
                history_thread_timestamp: moment
                  .unix(createdAt / 1000)
                  .format("MM/DD/YY"),
                last_active_time: moment.unix(createdAt / 1000).fromNow(),
                assignedTo: item?.assignedTo,
                phone_number: item?.phone_mobile || "",
                smsblocked: item?.user_blocked ? item?.user_blocked : false,
                platform: item?.platform || "",
                sms_platform: item?.platform || "",
                alivesms_phone_number: "",
                channel_id: item?.channel_id,
                crmData: item?.crmData || {},
                campaign_pending: item?.campaign_pending || "",
                lastmessage_at: item.lastmessage_at,
              };
            });
            dispatch(setThreadListing(ph));
          } else {
            dispatch(setThreadListing([]));
          }
        })
        .catch((err) => {
          toast("Short Link is Expired. try again later with a new link!");
          // console.log("Error occured: ", err)
        });
    } else {
      toast("Token not available!");
      // console.log("User Token is not available");
    }
  };
  const chatAssignCheck = ({ thread_id, org_name, thread_type }) => {
    // console.log("Attempt===>", thread_id, thread_type, org_name);
    let threadExistedObj = threadListing?.find(
      (item) => item.thread_id === thread_id
    );
    // console.log("active thread", threadExistedObj);
    if (
      threadExistedObj &&
      threadExistedObj.assignedTo === userData.user_id &&
      threadExistedObj.status !== "closed"
    ) {
      setredirectDataObj({
        thread_id: thread_id,
        org_name: org_name,
        thread_type: thread_type,
        crm_id: threadExistedObj?.crm_id,
        thread_status: threadExistedObj.status,
        platform: threadExistedObj?.platform || "platform",
      });
      setredirect("ChatView");
    } else {
      setredirect("MonitorView");
      setredirectDataObj({
        thread_id: thread_id,
        org_name: org_name,
        thread_type: thread_type,
        crm_id: threadExistedObj?.crm_id,
        thread_status: threadExistedObj.status,
        platform: threadExistedObj?.platform || "platform",
      });
    }
  };
  const jwtToken = () => {
    try {
      getJwtToken(instant_token)
        .then((jwtData) => {
          let curTime = new Date().toLocaleString();
          localStorage.setItem("user", jwtData.data.token);
          localStorage.setItem("time", curTime);
          SocketService.getInstance();
          let threadViewStatus =
            parseInt(localStorage.getItem("threadListing")) || 2;
          if (threadViewStatus === 1) {
            // setisViewHistory(false);
          }
          fetchThreadList(threadViewStatus);
        })
        .catch((error) => {
          // console.log("error is", error);
          toast(error);
        });
    } catch (e) {
      // console.log("error is", e);
      toast(e);
    }
  };
  const lastBookElementRef = useCallback(
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
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token){
      let threadViewStatus =parseInt(localStorage.getItem("threadListing")) || 2;
          fetchThreadList(threadViewStatus);
    }
    // eslint-disable-next-line
  }, [limit])
  
  useLayoutEffect(() => {
    jwtToken();
    // setTimeout(() => {
    //   setisIntro(true);
    // }, 3000);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {!isIntro ? (
        <Intro />
      ) : (
        <ThreadList
          threadList={threadListing}
          fetchThreadList={(threadListType) => fetchThreadList(threadListType)}
          threadListingType={threadListingType}
          redirect={redirect}
          ToastContainer={ToastContainer}
          redirectDataObj={redirectDataObj}
          chatAssignCheck={chatAssignCheck}
          lastBookElementRef={lastBookElementRef}
          // chatAssignCheck={(threadObj) => chatAssignCheck(threadObj)}
        />
      )}
    </>
  );
};
export default Queue;
