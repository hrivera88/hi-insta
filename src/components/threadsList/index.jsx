import Header from "../header";
import './style.css';
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const ThreadList = (props) => {
  const { threadListing:threadList } = useSelector((state) => state.global);
  const { redirectDataObj, redirect, threadListingType, fetchThreadList, chatAssignCheck,ToastContainer, lastBookElementRef } = props;
  return (
    <div id="app-wrapper" className="h-full open-sans">
    {<Header pageType={1} threadsList={ threadList} threadListingType = { threadListingType}/>}
    {/* {redirect to monitor and chat view} */}
    {redirect === "ChatView" && (
      <Redirect
        to={{
          pathname: `/ChatView/${redirectDataObj.org_name}/${redirectDataObj.thread_id}`,
          state: redirectDataObj,
        }}
      />
    )}
    {redirect === "MonitorView" && (
      <Redirect
        to={{
          pathname: `/MonitorView/${redirectDataObj.org_name}/${redirectDataObj.thread_id}`,
          state: redirectDataObj,
        }}
      />
    )}

      <div className="bg-secondary fixed thread-list-container w-full" style={{ overflow: "scroll" }}>
        <ToastContainer/>
        <section
          id="active-threads"
          className="h-full overflow-y-scroll w-full"
        >
          {threadList.length > 0 &&
            threadList.map((item, index) => (
              <div
                ref = {(threadList.length === index + 1)?lastBookElementRef: null}
                className="thread border-solid border-0 border-gray-500 border-b-1 p-20 flex flex-row items-center w-full"
                key={item.thread_id}
                style={{cursor: "pointer"}}
                onClick={() =>
                  chatAssignCheck({
                    thread_id: item?.thread_id,
                    org_name: item?.org_name,
                    thread_type: item?.thread_type,
                    platform: item?.platform,
                  })
                }
              >
                <div className="profile-image flex flex-col items-center justify-center mr-10 blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="45"
                    height="45"
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
                <div className="user-info flex flex-col">
                  <p className="user-name white font-medium font-16 m-0 mb-10">
                    {item.phone_mobile ||
                      item?.crmData?.email ||
                      (item?.crmData?.first_name,
                      " ",
                      item?.crmData?.last_name) ||
                      "Visitor"}
                  </p>
                  <p className="breadcrumb blue-400 font-normal font-14 m-0">
                    {item?.thread_type === "sms" && item?.platform !== "FB"
                      ? "via SMS"
                      : item?.platform === "FB"
                      ? "via Facebook"
                      : "via LiveChat"}
                  </p>
                </div>
                {item.thread_type === "livechat" &&
                parseInt(threadListingType) === 2 ? (
                  <div className="thread-info ml-auto mt-5 self-start">
                    <div className="active-status flex flex-row items-center red-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8.251"
                        height="17.201"
                        viewBox="0 0 8.251 17.201"
                      >
                        <path
                          d="M1.5,10.231l1.564,1.564a9.952,9.952,0,0,1,14.073,0L18.7,10.231A12.17,12.17,0,0,0,1.5,10.231Zm3.127,3.127,1.564,1.564a5.531,5.531,0,0,1,7.819,0l1.564-1.564A7.749,7.749,0,0,0,4.627,13.358Z"
                          transform="translate(-6.671 18.701) rotate(-90)"
                          fill="currentColor"
                        />
                      </svg>
                      <p className=" m-0 ml-5 font-12 font-bold">ACTIVE NOW</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="thread-info mt-5 flex flex-row items-start self-start ml-auto">
                      <div className="timestamp">
                        <p className="font-bold blue-400 m-0 font-14">
                          {parseInt(threadListingType) === 2
                            ? item?.last_active_time
                            : item.history_thread_timestamp}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          {/* <div className="thread border-solid border-0 border-gray-500 border-b-1 p-20 flex flex-row items-center w-full">
            <div className="profile-image flex flex-col items-center justify-center mr-10 blue-100">
              <div className="image-container">
                <img
                  src="https://randomuser.me/api/portraits/women/90.jpg"
                  alt="profile image"
                  srcset=""
                />
              </div>
            </div>
            <div className="user-info flex flex-col">
              <p className="user-name white font-medium font-16 m-0 mb-10">
                malreynolds@aol.com
              </p>
              <p className="breadcrumb blue-400 font-normal font-14 m-0">
                via Facebook Messenger
              </p>
            </div>
            <div className="thread-info mt-5 flex flex-row items-start self-start ml-auto">
              <div className="timestamp">
                <p className="font-bold blue-400 m-0 font-14">2 min ago</p>
              </div>
            </div>
          </div>
          <div className="thread border-solid border-0 border-gray-500 border-b-1 p-20 flex flex-row items-center w-full">
            <div className="profile-image flex flex-col items-center justify-center mr-10 blue-100">
              <div className="image-container">
                <img
                  src="https://randomuser.me/api/portraits/men/11.jpg"
                  alt="profile image"
                  srcset=""
                />
              </div>
            </div>
            <div className="user-info flex flex-col">
              <p className="user-name white font-medium font-16 m-0 mb-10">
                Joel Miller
              </p>
              <p className="breadcrumb blue-400 font-normal font-14 m-0">
                via Google Business Manager
              </p>
            </div>
            <div className="thread-info mt-5 flex flex-row items-start self-start ml-auto">
              <div className="timestamp">
                <p className="font-bold blue-400 m-0 font-14">3 hr ago</p>
              </div>
            </div>
          </div> */}
        </section>
    </div>
    <footer className="bg-main flex fixed flex-row w-full justify-around items-center p-10">
      <button
        className={
          parseInt(threadListingType) === 2
            ? "btn-col transparent gray items-center justify-center active"
            : "btn-col transparent gray items-center justify-center"
        }
        type="button"
        onClick={() => {
          fetchThreadList(2);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24.005"
          viewBox="0 0 29 29.005"
        >
          <g transform="translate(-68 -8.252)">
            <g transform="translate(68 8.252)">
              <path
                d="M29.946,11.981H14.365a2.683,2.683,0,0,0-2.679,2.679V25.509a2.677,2.677,0,0,0,2.679,2.672H23.28a.768.768,0,0,1,.534.225l4.43,4.085c.246.239.654.141.654-.2V28.73c0-.422.267-.555.689-.555h.07a2.927,2.927,0,0,0,2.96-2.672V14.66A2.668,2.668,0,0,0,29.946,11.981Z"
                transform="translate(-3.618 -3.618)"
                fill="currentColor"
              />
              <path
                d="M12.262,10.259H24.736V5.667a2.293,2.293,0,0,0-2.292-2.292H5.667A2.293,2.293,0,0,0,3.375,5.667V17.283a2.293,2.293,0,0,0,2.292,2.292h4.3V12.551A2.3,2.3,0,0,1,12.262,10.259Z"
                transform="translate(-3.375 -3.375)"
                fill="currentColor"
              />
            </g>
          </g>
        </svg>
        <span className="font-12 font-normal">ACTIVE</span>
      </button>
      <button
        className={
          parseInt(threadListingType) === 1
            ? "btn-col transparent gray items-center justify-center active"
            : "btn-col transparent gray items-center justify-center "
        }
        type="button"
        onClick={() => {
          fetchThreadList(1);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24.94"
          height="24.94"
          viewBox="0 0 22.94 22.94"
        >
          <path
            d="M23.5,12.011A11.47,11.47,0,0,1,4.834,20.963a1.109,1.109,0,0,1-.085-1.647l.521-.521A1.112,1.112,0,0,1,6.745,18.7,8.51,8.51,0,1,0,6.2,5.832L8.549,8.179a.74.74,0,0,1-.523,1.263H1.3a.74.74,0,0,1-.74-.74V1.979a.74.74,0,0,1,1.263-.523L4.109,3.739A11.47,11.47,0,0,1,23.5,12.011Zm-8.367,3.644.454-.584a1.11,1.11,0,0,0-.195-1.558l-1.882-1.464V7.222a1.11,1.11,0,0,0-1.11-1.11h-.74a1.11,1.11,0,0,0-1.11,1.11V13.5l3.025,2.353a1.11,1.11,0,0,0,1.558-.195Z"
            transform="translate(-0.563 -0.563)"
            fill="currentColor"
          />
        </svg>
        <span className="font-12 font-normal">HISTORY</span>
      </button>
    </footer>
  </div>
  );
};

export default ThreadList;
