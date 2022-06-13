import { useState } from "react";
import "./style.css";
import { sendMessage } from "../../library/apiServices/webApi";
import SocketService from "../../library/socket";
import { useDispatch } from "react-redux";
import { setAgentLoading } from "../../library/redux/actions";
import "react-toastify/dist/ReactToastify.css";
// import EmojiPicker from "../emojiPicker";
// const Attachment = React.lazy(() => import("../icons/attachment"));
// const Send = React.lazy(() => import("../icons/send"));
// const Emoji = React.lazy(() => import("../icons/emoji"));

const ChatInput = (props) => {
  // eslint-disable-next-line
  // const [pickerOpen, togglePicker] = React.useReducer((state) => !state, false);
  const [currentMessage, setCurrentMessage] = useState("");
  const { activeThread } = props;
  // const [messageCount, setmessageCount] = useState(0);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const dispatch = useDispatch();
  const socket = SocketService.getInstance();
  const sendSMSMessage = async () => {
    const token = localStorage.getItem("user");
    if (currentMessage !== "") {
      let replyBody = {
        crm_id: activeThread?.crm_id,
        alivesecure_key: activeThread?.alivesecure_key,
        aliveOpentokSession: activeThread?.aliveOpentokSession || "",
        status: activeThread?.thread_status,
        status_timestamp: activeThread?.updated_at,
        timestamp: Date.now(),
        thread_type: "sms",
        crmData: activeThread?.crmData || {},
        org_name: activeThread?.org_name,
        thread_id: activeThread?.thread_id,
        created_by: activeThread?.created_by || "instauser",
        user_id: userData?.user_id,
        assignedTo: activeThread?.assignedTo,
        message: currentMessage,
        visible_to_channel: activeThread?.visible_to_channel || "",
        screen_name: activeThread?.screen_name || "",
        phone_number: activeThread?.phone_mobile || "",
        psid: activeThread?.psid || "",
        userjoined: "",
        smsblocked: activeThread?.user_blocked
          ? activeThread?.user_blocked
          : false,
        user_opt: activeThread?.user_optfalse,
        platform: activeThread?.platform || "",
        sms_platform: "bandwidth",
        alivesms_phone_number: activeThread?.channel_number || "",
        channel_id: activeThread?.channel_id,
        tags: [],
        files: "",
        isVideo: false,
        mediaurl: "",
        bandwidthError: "",
        campaigns_applied: [],
      };
      if (activeThread?.platform === "FB") {
        replyBody.fbPageID = activeThread.fbPageID;
      }
      setCurrentMessage("");
      // setmessageCount(0);
      await sendMessage(replyBody, token);
    }
  };
  const sendLiveChatMessage = async () => {
    let crmData = {};
    if (currentMessage !== "") {
      if (activeThread?.crmData) {
        crmData = {
          crmId:
            activeThread?.crmData.crmId || activeThread?.crmData.crm_id || "",
          oldCrmId: activeThread?.crmData.old_crm_id || "",
          orgName:
            activeThread?.crmData.orgName ||
            activeThread?.crmData.org_name ||
            "",
          firstName:
            activeThread?.crmData.firstName ||
            activeThread?.crmData.first_name ||
            "",
          lastName:
            activeThread?.crmData.lastName ||
            activeThread?.crmData.last_name ||
            "",
          notes: activeThread?.crmData.notes || [],
          email: activeThread?.crmData.email || "",
          phoneMobile:
            activeThread?.crmData.phoneMobile ||
            activeThread?.crmData.phone_mobile ||
            "",
          company: activeThread?.crmData.company || "",
          image: activeThread?.crmData.image || "",
          address: activeThread?.crmData.address || "",
          billing_address: activeThread?.crmData.billing_address || "",
          billing_city: activeThread?.crmData.billing_city || "",
          billing_country: activeThread?.crmData.billing_country || "",
          billing_state: activeThread?.crmData.billing_state || "",
          billing_zip: activeThread?.crmData.billing_zip || "",
          linkedin: activeThread?.crmData.linkedin || "",
          instagram: activeThread?.crmData.instagram || "",
          whatsapp: activeThread?.crmData.whatsapp || "",
          accountid: activeThread?.crmData.accountid || "",
          snapchat: activeThread?.crmData.snapchat || "",
          wechat: activeThread?.crmData.wechat || "",
          viber: activeThread?.crmData.viber || "",
          faq_question: activeThread?.crmData.faq_question || "",
          youtube: activeThread?.crmData.youtube || "",
          facebook: activeThread?.crmData.facebook || "",
          twitter: activeThread?.crmData.twitter || "",
          companytitle: activeThread?.crmData.companytitle || "",
          city: activeThread?.crmData.city || "",
          user_state: activeThread?.crmData.user_state || "",
          country: activeThread?.crmData.country || "",
          xip: activeThread?.crmData.xip || "",
        };
      } // end of crmData if
      let newThread = {
        alivesecure_key: activeThread?.alivesecureKey || "",
        aliveOpentokSession: activeThread?.aliveOpentokSession || "",
        assignedTo:
          typeof activeThread?.assignedTo === "object"
            ? activeThread?.assignedTo.userId
            : activeThread?.assignedTo || "0",
        channel_id: activeThread?.channel_id,
        channelName: activeThread?.channel_name,
        created_at: activeThread?.created_at || "",
        connect_botchain: activeThread?.connect_botchain || "",
        connect_orgbot: activeThread?.connect_orgbot || "",
        crm_id: activeThread?.crm_id || "",
        lastmessage_at: activeThread?.lastmessage_at || "",
        order_viewed: activeThread?.orderViewed || "",
        order_viewed_by: activeThread?.orderViewedBy || "",
        org_name: activeThread?.org_name || "",
        thread_id: activeThread?.thread_id || "",
        thread_status: activeThread?.thread_status || "",
        thread_type: activeThread?.thread_type || "",
        updated_at: activeThread?.updated_at,
        timestamp: activeThread?.updated_at,
        livechatimageurl: activeThread?.livechatimageurl || "",
        orgbot_content: activeThread?.orgbot_content || "",
        agent_bot_id: activeThread?.agent_bot_id || "",
        widget_id: activeThread?.widget_id || "",
        googletrackerid: activeThread?.googletrackerid || "",
        user_blocked: activeThread?.userBlocked ? true : false,
        transferchat_from: activeThread?.transferchat_from || "",
        crmData: crmData,
      };
      let data = {
        org_name: userData?.orgName,
        thread_id: activeThread?.thread_id || undefined,
        message_type: "livechat",
        route: "123",
        created_by: userData?.sceenName,
        profile_url: userData?.profile_url || "",
        user_id: userData?.user_id,
        message_content: currentMessage,
        event_mode: "redis",
        crm_id: activeThread?.crm_id,
        channel_id: activeThread?.channel_id,
        newThread: newThread,
      };
      setCurrentMessage("");
      // setmessageCount(0);
      dispatch(setAgentLoading(false));
      socket.replyToLiveChatMessage(data);
    }
  };
  return (
    <footer className="bg-main flex fixed flex-row w-full justify-center items-center p-10">
      <button
        title="Click here to upload an image"
        className="btn-col ml-10 p-0 transparent white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <section
        id="messenger-textarea-section"
        className="p-10 w-full flex flex-row items-center relative"
      >
        <textarea
          name="messenger-textarea"
          id="messenger-textarea"
          className="p-10 pr-25"
          placeholder="Your message..."
          aria-label="send a message"
          value={currentMessage}
          onChange={(event) => {
            event.preventDefault();
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              activeThread?.thread_type === "livechat"
                ? sendLiveChatMessage()
                : sendSMSMessage();
            }
          }}
        ></textarea>
      </section>
    </footer>
  );
};

// console.log("ChatInput loading", Date.now());

export default ChatInput;
