import {
  SET_MESSAGES,
  SET_THREAD_LISTING,
  SET_SINGLE_MESSAGE,
  SET_USER_DATA,
  SET_VISITOR_LOADING,
  SET_AGENT_LOADING,
  SET_CROSS_BUTTON_STATUS,
  SET_CHATTING_WITH,
  SET_SIGNLE_THREAD
} from "../constants/types";

export const setMessages = (payload) => ({
  type: SET_MESSAGES,
  payload,
});
export const setSingleMessage = (payload) => ({
  type: SET_SINGLE_MESSAGE,
  payload,
});
export const setThreadListing = (payload) => ({
  type: SET_THREAD_LISTING,
  payload,
});
export const setUserData = (payload) => ({
  type: SET_USER_DATA,
  payload,
});
export const setVisitorLoading = (payload) => ({
  type: SET_VISITOR_LOADING,
  payload,
});
export const setAgentLoading = (payload) => ({
  type: SET_AGENT_LOADING,
  payload,
});
export const setChatCrossButtonStatus = (payload) => ({
  type: SET_CROSS_BUTTON_STATUS,
  payload,
});
export const setChatWith = (payload) => ({
  type: SET_CHATTING_WITH,
  payload,
});
export const setSingleThread = (payload) => ({
  type: SET_SIGNLE_THREAD,
  payload,
});
