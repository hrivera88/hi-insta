import {
  SERVER_URL,
  GET_JWT_TOKEN,
  THREAD_LISTING,
  MESSAGE_LISTING,
  ASSIGN_CHAT,
  SEND_MESSAGE,
  FETCH_SINGLE_THREAD,
  UPDATE_THREAD,
  UPDATE_LIVECHAT_THREAD,
  Fetch_LIVECHAT_MESSAGES,
  DELETE_THREAD,
  DELETE_CRM_THREAD,
} from "../../common/constants";
import jwt from "jsonwebtoken";
// EndPoints

const sendRequest = async (url, init_settings) => {
  url = SERVER_URL + url;
  try {
    let response = await fetch(url, init_settings);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    // console.log("errorrrrrrr", error);
    let err = [];
    err.error = error;
    err.no_result = true;
    return err;
  }
};
const getJwtToken = (instant_token) => {
  let url = GET_JWT_TOKEN + instant_token;
  let init = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return sendRequest(url, init);
};
const threadlisting = (token, view_history, limit) => {
  var decoded = jwt.decode(token, { complete: true });
  let url =
    THREAD_LISTING.concat("?channel_id=")
      .concat(decoded?.payload?.channelId)
      .concat("&org_name=")
      .concat(decoded?.payload?.orgName) +
    `&view_history=${parseInt(view_history)}&limit=${limit}`;
  let init = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return sendRequest(url, init);
};
const messagelisting = (org_name, thread_id, token, limit) => {
  let url =
    MESSAGE_LISTING.concat("?org_name=")
      .concat(org_name)
      .concat("&thread_id=")
      .concat(thread_id) + `&limit=${limit}`;
  let init = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  return sendRequest(url, init);
};
const liveChatMessageslist = (org_name, crm_id, user_id, token, limit) => {
  let url =
    Fetch_LIVECHAT_MESSAGES.concat("?org_name=")
      .concat(org_name)
      .concat("&crm_id=")
      .concat(crm_id)
      .concat("&user_id=")
      .concat(user_id) + `&limit=${limit}`;
  let init = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  return sendRequest(url, init);
};
const assignChatToUser = (threadObj, token) => {
  let url = ASSIGN_CHAT;
  let init = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(threadObj),
  };
  return sendRequest(url, init);
};
const sendMessage = (messageObj, token) => {
  // console.log("send message data ======> ", messageObj);
  let url = SEND_MESSAGE;
  let init = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(messageObj),
  };
  return sendRequest(url, init);
};
const fetchSingleThread = (thread_id, org_name) => {
  const token = localStorage.getItem("user");
  let url = `${FETCH_SINGLE_THREAD}?thread_id=${thread_id}&org_name=${org_name}`;
  let init = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  return sendRequest(url, init);
};
const updateThreadStatus = (threadObj, token) => {
  let url = UPDATE_THREAD;
  let init = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(threadObj),
  };
  return sendRequest(url, init);
};
const updateLiveChatThreadStatus = (threadObj, token) => {
  let url = UPDATE_LIVECHAT_THREAD;
  let init = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(threadObj),
  };
  return sendRequest(url, init);
};
const deleteThread = ({ org_name, thread_id, thread_type, crm_id }, token) => {
  let url = `${DELETE_THREAD}?org_name=${org_name}&thread_id=${thread_id}`;
  if (thread_type === "livechat") {
    url = `${DELETE_CRM_THREAD}?org_name=${org_name}&crm_id=${crm_id}`;
  }
  // let url = `${thread_type === 'livechat' ?DELETE_CRM_THREAD: DELETE_THREAD}?org_name=${org_name}&${thread_type === 'livechat' ? 'crm_id'=${}: DELETE_THREAD}`;
  let init = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  };
  return sendRequest(url, init);
};
export {
  sendRequest,
  getJwtToken,
  threadlisting,
  messagelisting,
  assignChatToUser,
  sendMessage,
  fetchSingleThread,
  updateThreadStatus,
  updateLiveChatThreadStatus,
  liveChatMessageslist,
  deleteThread,
};
