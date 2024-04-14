import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import OperationContext from "../../context/common/OperationContext";
import ChatContext from "../../context/chat/ChatContext";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import LoadingBar from 'react-top-loading-bar';
import ScrollToBottom from 'react-scroll-to-bottom';
import capitalizeWords from '../common/CapitalizeWords';
import dateFormat from 'dateformat';
//import io from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import OpponentContext from "../../context/profile/OpponentContext";
import OpponentProfile from "../profile/OpponentProfile";
//const socket = io.connect(process.env.REACT_APP_SOCKET_URL);

const Chat = () => {

  const { chatListing, updateChatCount, chatDetails, addNewMessage, opponentDetails, recordsFound, offsetListing, progressLoadingBar } = useContext(ChatContext);
  const { opponentTeamDetails, popupProfile, opponentPopup, opponentPopupShow } = useContext(OpponentContext);
  const { authorizeUser } = useContext(AuthorizeContext);
  const { sidebarOpen } = useContext(OperationContext);
  const websiteName = process.env.REACT_APP_WEBSITE_NAME;
  const [progressTopBar, setProgressTopBar] = useState(progressLoadingBar);
  const query = new URLSearchParams(window.location.search);
  const challenge_id = query.get('challenge_id')
  const urlkey = process.env.REACT_APP_NODE_BASE_URL;
  const navigate = useNavigate();

  if (challenge_id === undefined || challenge_id === "" || challenge_id === null) { navigate("/messages"); }

  // socket.emit("join_room", challenge_id);

  //sidebar open close
  if (sidebarOpen === true) { var openSidebar = "toggled" } else { openSidebar = "" }

  //listing challenges With Filters
  const listing = { 'challenge_id': challenge_id, 'limit': 1000000, 'offset': offsetListing }


  useEffect(() => {
    //eslint-disable-next-line react-hooks/exhaustive-deps
    authorizeUser();//Check user authorize
    chatListing(listing);//load messages
    updateChatCount();//update messages seen count
    document.title = "Messages | " + websiteName;
  }, [websiteName])


  useEffect(() => {
    //eslint-disable-next-line react-hooks/exhaustive-deps
    // socket.on("receive_message", (data) => {
    //   chatListing(listing);//load messages
    // })

  })//, [socket]


  //send Message
  const [enterMessage, setEnterMessage] = useState("");
  const typeMessage = (event) => {
    setEnterMessage(event.target.value);
  }

  const sendMessage = async () => {
    if (enterMessage !== "" && enterMessage !== undefined) {
      addNewMessage({ challenge_id: challenge_id, message: enterMessage })
      setEnterMessage("");
      // const message = {
      //   "room": challenge_id,
      //   "msg": enterMessage
      // }
      // await socket.emit("send_message", message);
    }
  }

  return (
    <>
      <div className="container-fluid noMargin noPadding">
        <LoadingBar color='#f11946' height={2} shadow={true} progress={progressTopBar} onLoaderFinished={() => setProgressTopBar(0)} />
        <Navbar />
        <div id="wrapper" className={openSidebar}>
          <Sidebar />
          <div id="page-content-wrapper noMargin noPadding ">
            <div className="container-fluid noMargin noPadding ">
              <br /><br />
              <div className="containDetails">
                {/* Chat start */}
                <section className="msger">
                  <header className="msger-header">
                    <div className="msger-header-title">
                      <a href="/messages"><span className="material-symbols-outlined arrowLeft">chevron_left</span></a>
                      <div className="chat_name" onClick={()=>opponentPopupShow(opponentDetails[0].opponent_token_id)}>{!!opponentDetails && opponentDetails[0].opponent_name !== undefined ? capitalizeWords(opponentDetails[0].opponent_name) + " (" + capitalizeWords(opponentDetails[0].sports_name) + ")" : ""}</div>
                    </div>
                  </header>
                  <ScrollToBottom className="scrollmeAuto" id="scrollableDiv">
                    <main className="msger-chat">
                      {
                        chatDetails.length > 0 ? chatDetails.map((message, i) => {
                          var sender = "";
                          var seenColor = "";
                          var profileImg = "";
                          { message.sent_by === "you" ? sender = "right-msg" : sender = "left-msg" }
                          { message.sent_by === "you" && message.profile_img ? profileImg = (urlkey + "images/" + message.profile_img) : profileImg = "default_team.png" }
                          { message.seen === 0 ? seenColor = "#000" : seenColor = "#0000FF" }
                          return (<div key={i} className={"msg " + sender}>
                            <div
                              className="msg-img"
                              style={{ backgroundImage: "url(" + profileImg + ")" }}
                            ></div>
                            <div className="msg-bubble">
                              <div className="msg-info">
                                <div className="msg-info-name">{capitalizeWords(message.send_name)}</div>
                                <div className="msg-info-time">{dateFormat(message.date, "dd, mm, yyyy hh:mm:ss TT")}</div>
                              </div>

                              <div className="msg-text">
                                {message.msg}
                                {message.sent_by === "you" ? <span className="material-symbols-outlined" style={{ color: seenColor }}>done_all</span> : ""}
                              </div>
                            </div>
                          </div>)
                        }) : ""
                      }

                    </main>
                  </ScrollToBottom>
                  <div className="msger-inputarea">
                    <input type="text" className="msger-input" value={enterMessage} onChange={typeMessage} placeholder="Enter your message..." />
                    <button type="button" className="msger-send-btn" onClick={sendMessage}>Send</button>
                  </div>
                </section>
                {/* Chat ends */}

                {/* Popup Start */}
                <div id="popupProfile" className="overlay" style={popupProfile}>
                  <div className="popup popupProfile">
                    <span className="close" onClick={opponentPopup}>&times;</span>
                    <div className="content">
                      <OpponentProfile opponentDetails={opponentTeamDetails} />
                    </div>
                  </div>
                </div>
                {/* Popup Ends */}

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat; 