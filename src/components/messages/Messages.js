import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import OperationContext from "../../context/common/OperationContext";
import MessagesContext from "../../context/messages/MessagesContext";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import LoadingBar from 'react-top-loading-bar';
import InfiniteScroll from 'react-infinite-scroll-component';
import capitalizeWords from '../common/CapitalizeWords';
import dateFormat from 'dateformat';

const Messages = () => {

    const { messagesListing, updateMessageCount, messagesDetails, recordsFound, offsetListing, progressLoadingBar, searchteamVar } = useContext(MessagesContext);
    const { authorizeUser } = useContext(AuthorizeContext);
    const { sidebarOpen } = useContext(OperationContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const urlkey = process.env.REACT_APP_NODE_BASE_URL;
    const [progressTopBar, setProgressTopBar] = useState(progressLoadingBar);

    //sidebar open close
    if (sidebarOpen === true) { var openSidebar = "toggled" } else { openSidebar = "" }

    //listing challenges With Filters
    const listing = { 'limit': 10, 'offset': offsetListing, 'search': searchteamVar }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        authorizeUser();//Check user authorize
        messagesListing(listing);//load challenges profile
        updateMessageCount();//update messages seen count
        document.title = "Messages | " + websiteName;
    },[websiteName])

    //fetch more challenges
    const fetchMoreData = () => {
        messagesListing(listing);//load challenges
    }

    //Search box
    const searchbox = (event) => {
        var searchteamVar = event.target.value;
        searchteamVar = searchteamVar.trim();
        const listingteamSearch = { 'limit': 10, 'offset': 0, 'search': searchteamVar }
        messagesListing(listingteamSearch);//load teams profile
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

                                <div className="showTeamsHome">
                                    <div className="row noMargin">
                                        <div className="col-lg-9 col-md-9 col-sm-9 col-xs-12 noPadding">
                                            <br />
                                            <h6 className="topHeadline">Total <b>{recordsFound} messages found!</b></h6>
                                        </div>
                                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12 noPadding searchBox">
                                            <input type="search" name="search" className="form-control" defaultValue={searchteamVar} placeholder="Search team Name" onChange={searchbox} />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row noMargin">
                                        <InfiniteScroll
                                            dataLength={messagesDetails.length}
                                            next={() => fetchMoreData()}
                                            hasMore={messagesDetails.length !== recordsFound && recordsFound !== undefined}
                                            loader={<h4>Loading...</h4>}
                                            scrollableTarget="scrollableDiv"
                                            className="row"
                                            endMessage={<p>No more data to load.</p>}
                                        >
                                            {
                                                messagesDetails.length > 0 ? messagesDetails.map((team, i) => {
                                                    var messageListDark = "";
                                                    {team.total_messages > 0 ? messageListDark = "messageListDark" : messageListDark = "" }
                                                    return (<div key={i}>
                                                        <a href={"/chat?challenge_id="+team.challenges_id} className="cardLink">
                                                            <div className={"card-message "+messageListDark}>
                                                                <div className="pointerMessage">{team.sportname}</div>
                                                                <div className="messageCard">
                                                                    <div className="scoreMessage"><img src={!!team.profile_img ? (urlkey + "images/" + team.profile_img) : "default_team.png"} className="img-responsive teamImgMessage" alt="team profile" /></div>
                                                                    <div className="nameText">
                                                                        <span className="fontStyle">{capitalizeWords(team.opponent_team_name)}</span> {team.total_messages > 0 ? <span className="badge badge-danger">{team.total_messages}</span> : ""} <span className="datetime">{dateFormat(team.date, "dd-mm-yyyy hh:mm:ss TT")}</span>
                                                                        <p className="messageText">
                                                                        {team.sent_by !== "you" ? capitalizeWords(team.opponent_team_name) : team.sent_by}: {team.last_msg}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                          </div>
                                                        </a>
                                                    </div>)
                                                }) : ""
                                            }
                                        </InfiniteScroll>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Messages; 