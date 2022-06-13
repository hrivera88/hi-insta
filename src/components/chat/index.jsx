import Header from "../header";
import "./style.css";
import { useEffect, useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import ChatInput from "../chatInput";
import { useSelector } from "react-redux";
import ActionBar from "../action-bar";

const Chat = (props) => {
  const { messagesList } = useSelector((state) => state.global);
  const [actionBar, setactionBar] = useState(false);
  const messagesRef = useRef(null);
  const { handleBack, toast, redirect, userData, thread_type, activeThread, ToastContainer, closeChat, deleteThread, setredirect,firstMessageElementRef , limit} = props;
  useEffect(() => {
    messagesRef?.current?.scrollIntoView(true);
  }, [messagesList]);
  // console.log('active thread', activeThread);
  const actionBarFun = () => {
    // console.log("action bar", actionBar)
    setactionBar(!actionBar);
  };
  console.log("redirect", redirect);
  return (
    <div
      id="app-wrapper"
      className="grid  h-full w-full open-sans layout-grid"
      style={{ position: "fixed", top: 0}}
    >
      <Header
        handleBack={handleBack}
        thread_id={activeThread?.thread_id}
        toast={toast}
        actionBar={actionBarFun}
        setredirect={setredirect}
      />
      {/* <ToastContainer/> */}
      {redirect === "Home" && (
        <Redirect
          to={{
            pathname: `/${userData.shortCode}`,
          }}
        />
      )}
      <main id="message-list-container" className="bg-secondary fixed message-list-container w-full">
        <ToastContainer style={{'top': '80px'}} containerId="message-list-container" />
        <section id="message-list" className="h-full overflow-y-scroll w-full">
          <div className="conversation-bubbles p-20">
            {messagesList?.map((item, index) => (
              <div key={index} ref = {(index === 1)?firstMessageElementRef: null}>
                
                {item.direction === "Inbound" ||
                (thread_type === "livechat" && !item.created_by) ? (
                  <div className="visitor bubble-group" key={index}>
                    <div className="bubble" key={index}>
                      <p className="m-0">{item?.message_content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="agent bubble-group" key={index}>
                    <div className="bubble" key={item.created_at}>
                      <p className="m-0">{item?.message_content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div ref={limit<=20? messagesRef : null}> </div>
        </section>
      </main>
        <ChatInput activeThread={activeThread} />
      {actionBar && (
        <ActionBar closeChat={closeChat} deleteThread={deleteThread} />
      )}
    </div>
  );
};

export default Chat;
