import { useEffect, useState } from "react";
import "./style.css";
import moment from "moment";
import SocketService from "../../library/socket";
import {
  setThreadListing,
  setSingleThread,
  setSingleMessage,
} from "../../library/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import Back from "../../components/icons/back";
// import Cross from "../../components/icons/cross";
const Header = (props) => {
  const {
    threadsList,
    threadListingType,
    handleBack,
    pageType,
    thread_id,
    setredirect,
    toast,
    actionBar,
  } = props;
  const [threadList, setthreadList] = useState();
  const { chattingWith } = useSelector((state) => state.global);
  let socket,
    fetchLiveChatMessagesEventSub,
    fetchSMSMessagesEventSub,
    isThreadUpdatedEventSub,
    updatedThreadCrmEventEventSub,
    isAliveChatUpdatedEventSub,
    tempMessageId = "";
  const dispatch = useDispatch();
  // console.log(pageType, "pageType");
  useEffect(() => {
    setthreadList(threadsList);
    // eslint-disable-next-line
    socket = SocketService.getInstance();
    socketEventSub();

    return () => {
      fetchLiveChatMessagesEventSub?.unsubscribe();
      fetchSMSMessagesEventSub?.unsubscribe();
      isThreadUpdatedEventSub?.unsubscribe();
      updatedThreadCrmEventEventSub?.unsubscribe();
      isAliveChatUpdatedEventSub.unsubscribe();
    };
    // eslint-disable-next-line
  }, [threadList, thread_id]);
  const socketEventSub = () => {
    fetchLiveChatMessagesEventSub = socket
      ?.fetchLiveChatMessages()
      .subscribe((pushedmessage) => {
        if (parseInt(pageType) === 1) {
          if (parseInt(threadListingType) === 2) {
            let isThreadExist =
              threadList &&
              threadList?.length > 0 &&
              threadList?.find(
                (item) => item.thread_id === pushedmessage.thread_id
              );
            if (
              (!isThreadExist || isThreadExist === {}) &&
              pushedmessage?.created_by === undefined &&
              pushedmessage?.user_id === undefined
            ) {
              // console.log("creating new thread, live chat");
              const createdAt =
                pushedmessage?.newThread?.lastmessage_at ||
                pushedmessage?.newThread?.updated_at ||
                pushedmessage?.newThread?.created_at ||
                moment().valueOf();
              let newThread = {
                phone_mobile: pushedmessage?.newThread?.phone_mobile || "",
                thread_type: pushedmessage?.newThread?.thread_type,
                thread_id: pushedmessage?.newThread?.thread_id,
                org_name: pushedmessage?.newThread?.org_name,
                crm_id: pushedmessage?.newThread?.crm_id,
                alivesecure_key: pushedmessage?.newThread?.alivesecure_key,
                aliveOpentokSession:
                  pushedmessage?.newThread?.aliveOpentokSession || "",
                status: pushedmessage?.newThread?.thread_status,
                status_timestamp: pushedmessage?.newThread?.updated_at,
                timestamp: pushedmessage?.newThread?.created_at,
                created_by: pushedmessage?.created_by,
                assignedTo: pushedmessage?.newThread?.assignedTo || "0",
                phone_number: pushedmessage?.newThread?.phone_mobile || "",
                smsblocked: pushedmessage?.newThread?.user_blocked
                  ? pushedmessage?.newThread?.user_blocked
                  : false,
                platform: pushedmessage?.newThread?.platform || "",
                sms_platform: pushedmessage?.newThread?.platform || "",
                alivesms_phone_number: "",
                channel_id: pushedmessage?.newThread?.channel_id,
                crmData: pushedmessage?.newThread?.crmData || {},
                campaign_pending:
                  pushedmessage?.newThread?.campaign_pending || "",
                lastmessage_at: pushedmessage?.newThread?.lastmessage_at,
                history_thread_timestamp: moment
                  .unix(createdAt / 1000)
                  .format("MM/DD/YY"),
                last_active_time: moment.unix(createdAt / 1000).fromNow(),
              };
              if (threadList?.length > 0) {
                setthreadList((state) => [...state, newThread]);
              } else {
                setthreadList([newThread]);
              }
              dispatch(setSingleThread(newThread));
            }
          }
        } else {
          if (
            pushedmessage?.newThread?.thread_id === thread_id &&
            tempMessageId !== pushedmessage.message_id
          ) {
            // console.log("Message", tempMessageId);
            tempMessageId = pushedmessage.message_id;
            dispatch(
              setSingleMessage({
                message_content: pushedmessage.message_content || "",
                created_at: pushedmessage.created_at,
                created_by: pushedmessage.created_by,
                From: pushedmessage.From,
                direction: pushedmessage.direction,
                media_url: pushedmessage.media_url || [],
              })
            );
          }
        }
      });
    fetchSMSMessagesEventSub = socket
      ?.fetchSMSMessages()
      .subscribe((pushedmessage) => {
        // console.log("pushedmessage", pushedmessage);
        if (parseInt(pageType) === 1) {
          if (parseInt(threadListingType) === 2) {
            let isThreadExist =
              threadList &&
              threadList?.length > 0 &&
              threadList?.find(
                (item) => item.thread_id === pushedmessage.thread_id
              );
            // console.log(
            //   "creating new thread,found existing thread",
            //   isThreadExist
            // );
            if (!isThreadExist || isThreadExist === {}) {
              // console.log("creating new thread,SMS chat");
              const createdAt =
                pushedmessage?.newThread?.lastmessage_at ||
                pushedmessage?.newThread?.updated_at ||
                pushedmessage?.newThread?.created_at ||
                moment().valueOf();
              let newThread = {
                phone_mobile: pushedmessage?.newThread?.phone_mobile,
                thread_type: pushedmessage?.newThread?.thread_type,
                thread_id: pushedmessage?.newThread?.thread_id,
                org_name: pushedmessage?.newThread?.org_name,
                crm_id: pushedmessage?.newThread?.crm_id,
                alivesecure_key: pushedmessage?.newThread?.alivesecure_key,
                aliveOpentokSession:
                  pushedmessage?.newThread?.aliveOpentokSession || "",
                status: pushedmessage?.newThread?.thread_status,
                status_timestamp: pushedmessage?.newThread?.updated_at,
                timestamp: pushedmessage?.newThread?.created_at,
                created_by: pushedmessage?.created_by,
                assignedTo: pushedmessage?.assignedTo,
                phone_number: pushedmessage?.newThread?.phone_mobile || "",
                smsblocked: pushedmessage?.newThread?.user_blocked
                  ? pushedmessage?.newThread?.user_blocked
                  : false,
                platform: pushedmessage?.newThread?.platform || "",
                sms_platform: pushedmessage?.newThread?.platform || "",
                alivesms_phone_number: "",
                channel_id: pushedmessage?.newThread?.channel_id,
                crmData: pushedmessage?.newThread?.crmData || {},
                campaign_pending:
                  pushedmessage?.newThread?.campaign_pending || "",
                lastmessage_at: pushedmessage?.newThread?.lastmessage_at,
                history_thread_timestamp: moment
                  .unix(createdAt / 1000)
                  .format("MM/DD/YY"),
                last_active_time: moment.unix(createdAt / 1000).fromNow(),
              };
              if (threadList?.length > 0) {
                setthreadList((state) => [...state, newThread]);
              } else {
                setthreadList([newThread]);
              }
              dispatch(setSingleThread(newThread));
            }
          }
        } else {
          // console.log(
          //   pushedmessage?.newThread?.thread_id,
          //   "working in else condition...",
          //   thread_id
          // );
          if (
            pushedmessage?.newThread?.thread_id === thread_id &&
            tempMessageId !== pushedmessage.message_id
          ) {
            // console.log(pushedmessage.message_id, "Message", tempMessageId);
            tempMessageId = pushedmessage.message_id;
            dispatch(
              setSingleMessage({
                message_content: pushedmessage.message_content || "",
                created_at: pushedmessage.created_at,
                created_by: pushedmessage.created_by,
                From: pushedmessage.From,
                direction: pushedmessage.direction,
                media_url: pushedmessage.media_url || [],
              })
            );
          }
        }
      });
    isThreadUpdatedEventSub = socket
      ?.isThreadUpdated()
      .subscribe((updatedThread) => {
        if (
          parseInt(threadListingType) === 2 ||
          threadListingType === undefined
        ) {
          if (updatedThread && updatedThread?.threadStatus === "deleted") {
            let updatedThreads = threadList?.filter(
              (thread) => thread.thread_id !== updatedThread.threadId
            );
            if (!parseInt(pageType) === 1 || pageType === undefined) {
              toast("Chat is Deleted by User!");
              setTimeout(() => {
                setredirect("Home");
              }, 3000);
            }
            dispatch(setThreadListing(updatedThreads));
          }
        }
      });
    updatedThreadCrmEventEventSub = socket
      ?.updatedThreadCrmEvent()
      .subscribe((updatedThreadCrm) => {
        if (parseInt(threadListingType) === 2) {
          let updateThreadsArray = threadList;
          if (updateThreadsArray && updateThreadsArray.length) {
            let threadIndex = updateThreadsArray.findIndex(
              (el) => el.thread_id === updatedThreadCrm.threadId
            );
            if (parseInt(threadIndex) > -1) {
              if (
                updateThreadsArray[parseInt(threadIndex)] &&
                updateThreadsArray[parseInt(threadIndex)].crmData
              ) {
                updateThreadsArray[parseInt(threadIndex)].crmData =
                  updatedThreadCrm?.crmData;
                setthreadList(updateThreadsArray);
                dispatch(setThreadListing(updateThreadsArray));
              }
            }
          }
        }
      });

    isAliveChatUpdatedEventSub = socket
      .isAliveChatUpdated()
      .subscribe((updateThreadStatus) => {
        if (updateThreadStatus?.thread_status === "closed") {
          if (!parseInt(pageType) === 1 || pageType === undefined) {
            console.log("in state close check....");
            toast("Chat is closed by User!");
            setTimeout(() => {
              setredirect("Home");
            }, 3000);
          } else {
            let updatedThreads = threadList?.filter(
              (thread) => thread.thread_id !== updateThreadStatus.thread_id
            );
            dispatch(setThreadListing(updatedThreads));
          }
        }
      });
  };

  return (
    <>
      {parseInt(pageType) === 1 ? (
        <header id="insta-header" className="bg-main fixed flex flex-row w-full justify-center items-center p-10">
          <section
            id="threads-header"
            className="h-full flex flex-col items-center justify-center"
          >
            <div className="logo-img h-full flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="98.809"
                className="mb-10"
                height="34.544"
                viewBox="0 0 243.809 86.544"
              >
                <path
                  d="M51.456,40.991C43.1,41.307,38.492,45.46,37.9,45.985V16.4a27.171,27.171,0,0,0-7.474-1.681c-4.376-.147-7.76.963-9.181,3.077A8.158,8.158,0,0,0,20,22.643V99.682H38.012V70.156c0-9.761,5.2-12.422,10.58-12.422,4.927,0,10.114,1.576,10.114,10.845v31.1H76.719v-34.8C76.719,46.494,64.352,40.5,51.456,40.991Z"
                  transform="translate(-20 -14.706)"
                  fill="#fff"
                />
                <path
                  d="M45.948,21.349a11.763,11.763,0,0,0-6.822,1.787q-2.566,1.791-2.573,6.162V78.4H54.565V23.022c-.441-.143-1.492-.467-3.127-.95A19.55,19.55,0,0,0,45.948,21.349Z"
                  transform="translate(33.029 6.576)"
                  fill="#fff"
                />
                <path
                  d="M78.195,36.565c-8.424-.307-15.061,4.809-16.407,6.154V17.783c-.446-.143-1.475-.467-3.094-.946a19.007,19.007,0,0,0-5.456-.727,11.892,11.892,0,0,0-6.864,1.778q-2.6,1.8-2.594,6.162V64.081c0,25.2,15.541,32.67,31.1,32.67,12.934,0,30.875-8.336,30.875-30.1C105.758,53.114,97.309,37.258,78.195,36.565ZM74.491,80.2c-9.353,0-12.813-7.293-12.813-13.6,0-4.931,3.182-13.586,12.813-13.586,9.488,0,12.808,8.1,12.808,13.586C87.3,73.607,83.029,80.2,74.491,80.2Z"
                  transform="translate(56.182 -10.208)"
                  fill="#fff"
                />
                <path
                  d="M114.638,22.072a19.48,19.48,0,0,0-5.477-.723,11.736,11.736,0,0,0-6.822,1.787c-1.719,1.194-2.568,3.245-2.568,6.162V51.775q0,11.646-10.513,11.64-10.53,0-10.522-11.64V23.022c-.454-.143-1.5-.467-3.136-.95a19.492,19.492,0,0,0-5.473-.723,11.8,11.8,0,0,0-6.835,1.787q-2.566,1.791-2.573,6.162V55.129c0,6.545,2.459,24.839,28.538,24.839,25.583,0,28.521-18.294,28.521-24.839V23.022C117.328,22.879,116.285,22.555,114.638,22.072Z"
                  transform="translate(110.444 6.576)"
                  fill="#fff"
                />
                <path
                  d="M36.512,24.128A9.176,9.176,0,1,1,45.688,33.3,9.181,9.181,0,0,1,36.512,24.128Z"
                  transform="translate(32.898 -13.934)"
                  fill="#fff"
                />
                <path
                  d="M60.718,24.128A9.176,9.176,0,1,1,69.894,33.3,9.181,9.181,0,0,1,60.718,24.128Z"
                  transform="translate(110.444 -13.934)"
                  fill="#fff"
                />
                <path
                  d="M70,24.128A9.174,9.174,0,1,1,79.18,33.3,9.178,9.178,0,0,1,70,24.128Z"
                  transform="translate(140.193 -13.934)"
                  fill="#fff"
                />
                <g transform="translate(233.972 30.287)">
                  <path
                    d="M77.362,22.512h-1.7v-.6h4.124v.6h-1.7v5.036h-.719Z"
                    transform="translate(-75.66 -21.911)"
                    fill="#fff"
                  />
                  <path
                    d="M76.882,21.911h.841l1.093,3.027.412,1.148h.034l.4-1.148,1.085-3.027h.841v5.637H80.9v-3.1c0-.5.05-1.169.092-1.665h-.034l-.454,1.253-1.085,2.947h-.4l-1.089-2.947-.45-1.253h-.034c.034.5.1,1.169.1,1.665v3.1h-.664Z"
                    transform="translate(-71.745 -21.911)"
                    fill="#fff"
                  />
                </g>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="52"
                height="22"
                viewBox="0 0 112 48"
              >
                <text
                  transform="translate(56 38)"
                  fill="#fff"
                  fontSize="41"
                  fontFamily="HibuCoText-Regular, Hibu Co Text, Open Sans"
                >
                  <tspan x="-55" y="0">
                    CHAT
                  </tspan>
                </text>
              </svg>
            </div>
          </section>
        </header>
      ) : (
        <header id="insta-header" className="bg-main fixed flex flex-row w-full justify-center items-center p-10">
          <section
            id="chat-header"
            className="flex flex-row items-center w-full"
          >
            <button
              className="btn-col transparent white"
              onClick={handleBack}
              style={{ cursor: "pointer", padding: 10 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10.5"
                height="18.366"
                viewBox="0 0 10.5 18.366"
              >
                <path
                  d="M14.416,15.374l6.949-6.944a1.313,1.313,0,0,0-1.859-1.854l-7.873,7.868a1.31,1.31,0,0,0-.038,1.81L19.5,24.177a1.313,1.313,0,1,0,1.859-1.854Z"
                  transform="translate(-11.251 -6.194)"
                  fill="currentColor"
                />
              </svg>
            </button>
            <div className="profile-image small ml-auto flex flex-col justify-center items-center">
              <div className="image-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 45.004 45.005"
                >
                  <g transform="translate(-162 -435)">
                    <path
                      d="M21.324,39.963,14.61,43.626a6.034,6.034,0,0,0-1.078.767,22.488,22.488,0,0,0,28.894.075,5.957,5.957,0,0,0-1.184-.793l-7.19-3.594a2.742,2.742,0,0,1-1.516-2.452V34.806a10.859,10.859,0,0,0,.68-.875,16.544,16.544,0,0,0,2.235-4.5,2.258,2.258,0,0,0,1.6-2.148V24.268A2.248,2.248,0,0,0,36.3,22.6V18.247s.894-6.774-8.279-6.774-8.279,6.774-8.279,6.774V22.6a2.245,2.245,0,0,0-.752,1.669v3.011a2.257,2.257,0,0,0,1.041,1.894,14.942,14.942,0,0,0,2.722,5.632v2.751A2.745,2.745,0,0,1,21.324,39.963Z"
                      transform="translate(156.481 430.321)"
                      fill="#e7eced"
                    />
                    <g transform="translate(162 435)">
                      <path
                        d="M22.887,0a22.488,22.488,0,0,0-14.864,39.7,5.979,5.979,0,0,1,1.067-.759L15.8,35.285a2.743,2.743,0,0,0,1.429-2.407V30.126a14.928,14.928,0,0,1-2.722-5.632A2.258,2.258,0,0,1,13.47,22.6V19.588a2.248,2.248,0,0,1,.752-1.669V13.567S13.328,6.793,22.5,6.793s8.279,6.774,8.279,6.774V17.92a2.245,2.245,0,0,1,.752,1.669V22.6a2.258,2.258,0,0,1-1.6,2.148,16.544,16.544,0,0,1-2.235,4.5,10.86,10.86,0,0,1-.68.875v2.821A2.741,2.741,0,0,0,28.533,35.4l7.19,3.594a5.987,5.987,0,0,1,1.18.791A22.5,22.5,0,0,0,22.887,0Z"
                        transform="translate(0 0)"
                        fill="#556080"
                      />
                    </g>
                  </g>
                </svg>
              </div>
              <p className="font-14 tracking-05 font-normal white m-0 mt-5">
                {chattingWith}
              </p>
            </div>
            <button
              className="btn-col ml-auto transparent white"
              onClick={actionBar}
              style={{ cursor: "pointer" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="6"
                viewBox="0 0 28 6"
              >
                <g transform="translate(-325 -65)">
                  <circle
                    cx="3"
                    cy="3"
                    r="3"
                    transform="translate(325 65)"
                    fill="currentColor"
                  />
                  <circle
                    cx="3"
                    cy="3"
                    r="3"
                    transform="translate(336 65)"
                    fill="currentColor"
                  />
                  <circle
                    cx="3"
                    cy="3"
                    r="3"
                    transform="translate(347 65)"
                    fill="currentColor"
                  />
                </g>
              </svg>
            </button>
          </section>
        </header>
      )}

      {/* <header
      className="flex-row chat monitor flex-center-items  padding-left-10 padding-right-10 only-border-bottom border-width-1 border-style-solid border-grey-200"
      style={{ backgroundColor: `${bgColor}` }}
    >
      {parseInt(pageType) === 1 && (
        <button
          type="button"
          className="btn-action transparent white"
          onClick={handleBack}
        >
          <Back />
        </button>
      )}
      <div className="branding h-35-px" style={{ margin: "auto" }}>
        {/* eslint-disable-next-line */}
      {/* <img
          className="full-height"
          src={logoURL}
          alt="alive5 logo image"
          srcSet=""
        />
      </div>
      {parseInt(pageType) !== 0 && (
        <>
          {parseInt(pageType) === 1 && thread_type === "livechat" ? (
            <button
              id="close"
              className="btn-action transparent white"
              type="button"
              data-toggle="modal"
              data-target="#exampleModal "
            >
              <Cross />
            </button>
          ) : (
            <div></div>
          )}
        </>
      )}
       
    </header> */}
      {/* <ToastContainer />  */}
    </>
  );
};

export default Header;
