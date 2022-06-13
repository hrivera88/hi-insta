import Header from "../header";
import './style.css';
import { Redirect } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const MonitorChat = (props) => {
  const messagesRef = useRef(null);
  const { messagesList } = useSelector((state) => state.global);
  const threadListingType = localStorage.getItem("threadListing") || 2
  const {
    toast,
    redirect,
    redirectDataObj,
    userData,
    thread_type,
    handleBack,
    assignChatToUsers,
    activeThread,
    ToastContainer,
    setredirect,
  } = props;
  console.log('here is the obj', redirectDataObj)
  useEffect(() => {
    messagesRef?.current?.scrollIntoView(true);
  }, [messagesList]);
  return (
    <div id="app-wrapper" className="grid h-full open-sans layout-grid w-full">
      <Header
        handleBack={handleBack}
        thread_id={activeThread?.thread_id}
        setredirect={setredirect}
        toast={toast}
      />
      {/* {redirect to monitor and chat view} */}
      {redirect === "ChatView" && (
        <Redirect
          to={{
            pathname: `/ChatView/${redirectDataObj.org_name}/${redirectDataObj.thread_id}`,
            state: redirectDataObj,
          }}
        />
      )}
      {redirect === "Home" && (
        <Redirect
          to={{
            pathname: `/${userData.shortCode}`,
            state: redirectDataObj,
          }}
        />
      )}
      <main className="bg-secondary fixed monitor-list-container w-full" style={{ overflow: "scroll" }}>
        <ToastContainer style={{'top': '80px'}} containerId="monitor-list-container" />
        <section id="mesage-list" className="h-full overflow-y-scroll w-full">
          <div className="conversation-bubbles p-20">
            {messagesList?.map((item, index) => (
              <div key={index}>
                {item.direction === "Inbound" ||
                (thread_type === "livechat" && !item.created_by) ? (
                  <div
                    className="visitor bubble-group"
                    key={item.message_content}
                  >
                    <div className="bubble" key={index}>
                      <p className="m-0">{item?.message_content}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="agent bubble-group"
                    key={item.message_content}
                  >
                    <div className="bubble" key={index}>
                      <p className="m-0">{item?.message_content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div ref={messagesRef}> </div>
        </section>
      </main>
     {!(parseInt(threadListingType) === 1 && redirectDataObj.thread_type === "livechat")  && <footer className="bg-secondary flex fixed flex-row w-full justify-center items-center p-10">
        <button
          title="Click here to start chatting"
          className="btn-pill extra outline primary"
          style={{ cursor: "pointer" }}
          onClick={assignChatToUsers}
        >
          BEGIN CHAT
        </button>
      </footer>
      }
    </div>

  );
};

export default MonitorChat;
