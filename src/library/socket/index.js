import * as io from "socket.io-client";
import { Observable } from "rxjs";
import { SOCKET_HOST_ADDRESS,FETCH_SMS_EVENT, UPATE_THREAD_CRM_EVENT, SMS_THREAD_UPDATE_EVENT,  FETCH_LIVECHAT_MESSAGES_EVENT, BUDDYCHAT_TYPING_EVENT, LIVECHAT_THREAD_UPDATE_EVENT, REPLAYTO_LIVECHAT_MESSAGES_EVENT, JOIN_BUDDY_CHATROOM_EVENT } from "../../common/constants";
import jwt from "jsonwebtoken";
export default class SocketService {
  static socket;
  static instance;
  static getInstance() {
    if (SocketService.instance === undefined) {
      SocketService.instance = new SocketService();
    }

    return SocketService.instance;
  }
  constructor() {
    if (!this.socket) {
      const token = localStorage.getItem("user");
      var decodedToken = jwt.decode(token, { complete: true });
      const socket_address = SOCKET_HOST_ADDRESS;
      this.socket = io.connect(socket_address, {
        secure: true,
        transports: ["websocket", "polling"],
        query: {
          authToken: token,
          channel_id: decodedToken?.payload?.channelId,
          org_name : decodedToken?.payload?.orgName
        },
        withCredentials: true,
      });
      this.socket.on("connect_error", (error) => {
        console.log("Socket disconnect  connect_error", error); // undefined
      });
      this.socket.on("disconnect", (error) => {
        console.log(
          "Socket disconnect",
          this.socket,
          this.socket.id,
          this.socket.connected,
          error
        ); // undefined
      });
      // client-side
      this.socket.on("connect", () => {
        console.log(
          "Socket is connected",
          this.socket,
          this.socket.id,
          this.socket.connected
        ); // x8WIv7-mJelg7on_ALbx
      });
    }
    // return this.socket; livechat-message
  }
  fetchSMSMessages() {
    let observable = new Observable((observer) => {
      this.socket.on(FETCH_SMS_EVENT, (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
  fetchLiveChatMessages() {
    let observable = new Observable((observer) => {
      this.socket.on(FETCH_LIVECHAT_MESSAGES_EVENT, (data) => {
        observer.next(data);
      });
    });
    return observable;
  }
  replyToLiveChatMessage(data) {
      this.socket.emit(REPLAYTO_LIVECHAT_MESSAGES_EVENT, (data)) 
  };
  joinLiveChatMessageRoom(data) {
    this.socket.emit(JOIN_BUDDY_CHATROOM_EVENT, (data)) 
};
  isAliveChatUpdated() {
    let observable = new Observable((observer) => {
      this.socket.on(LIVECHAT_THREAD_UPDATE_EVENT, (data) => {
        observer.next(data);
      });
    });
    return observable;
  };
  buddyChatIsTyping() {
    let observable = new Observable((observer) => {
      this.socket.on(BUDDYCHAT_TYPING_EVENT, (data) => {
        observer.next(data);
      });
    });
    return observable;
  };
  isThreadUpdated() {
    let observable = new Observable((observer) => {
      this.socket.on(SMS_THREAD_UPDATE_EVENT, (data) => {
        observer.next(data);
      });
    });
    return observable;
  }; 
  updatedThreadCrmEvent() {
    let observable = new Observable((observer) => {
      this.socket.on(UPATE_THREAD_CRM_EVENT, (data) => {
        observer.next(data);
      });
    });
    return observable;
  } 
}
