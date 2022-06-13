import {useSelector} from 'react-redux'

const Action = (props) => {
    const { closeChat, deleteThread } = props;
  const { chattingWith } = useSelector((state) => state.global);
  return (
    <div>
      <section id="action-bar">
        <div className="container absolute bg-main">
          <div className="bar-header p-20 border-0 border-b-1 border-solid border-gray-500">
                      <p className="m-0 white font-medium">{chattingWith }</p>
          </div>
          <button className="bar-item blue-200 transparent btn-block" onClick={closeChat} style ={{cursor: "pointer"}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              className="icon left"
              viewBox="0 0 16 16"
            >
              <g transform="translate(-32 -650)">
                <path
                  id="Icon_material-chat-bubble"
                  data-name="Icon material-chat-bubble"
                  d="M17.4,3H4.6A1.6,1.6,0,0,0,3,4.6V19l3.2-3.2H17.4A1.6,1.6,0,0,0,19,14.2V4.6A1.6,1.6,0,0,0,17.4,3Z"
                  transform="translate(29 647)"
                  fill="#3bc9f5"
                />
                <path
                  id="Icon_open-arrow-thick-left"
                  data-name="Icon open-arrow-thick-left"
                  d="M3.5,0,0,3.535,3.5,7V4.667H9.333V2.333H3.5Z"
                  transform="translate(35.333 653)"
                  fill="#1e1e2f"
                />
              </g>
            </svg>
            <span className="white font-16">End Chat</span>
          </button>
          {/* <button className="bar-item blue-200 transparent btn-block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="17.1"
              className="icon left"
              viewBox="0 0 18 17.1"
            >
              <path
                d="M12,16.743,17.562,20.1l-1.476-6.327L21,9.516l-6.471-.549L12,3,9.471,8.967,3,9.516l4.914,4.257L6.438,20.1Z"
                transform="translate(-3 -3)"
                fill="#3bc9f5"
              />
            </svg>
            <span className="white font-16">Add to Starred</span>
          </button> */}
          <button className="bar-item blue-200 transparent btn-block" onClick = {deleteThread} style={{cursor: "pointer"}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="18"
              className="icon left"
              viewBox="0 0 14 18"
            >
              <path
                d="M8.5,20.5a2.006,2.006,0,0,0,2,2h8a2.006,2.006,0,0,0,2-2V8.5H8.5Zm2.46-7.12,1.41-1.41,2.13,2.12,2.12-2.12,1.41,1.41L15.91,15.5l2.12,2.12-1.41,1.41L14.5,16.91l-2.12,2.12-1.41-1.41,2.12-2.12ZM18,5.5l-1-1H12l-1,1H7.5v2h14v-2Z"
                transform="translate(-7.5 -4.5)"
                fill="currentColor"
              />
            </svg>
            <span className="white font-16">Delete Chat</span>
          </button>
        </div>
      </section>
    </div>
  );
};
export default Action;
