import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import OperationContext from "../../context/common/OperationContext";
import BlockContext from "../../context/block/BlockContext";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import LoadingBar from 'react-top-loading-bar';
import InfiniteScroll from 'react-infinite-scroll-component';
import capitalizeWords from '../common/CapitalizeWords';
import dateFormat from 'dateformat';
import OpponentContext from "../../context/profile/OpponentContext";
import OpponentProfile from "../profile/OpponentProfile";

const Block = () => {

    const { blockListing, unblockOpponent, blockDetails, recordsFound, offsetListing, progressLoadingBar, searchTeamVar } = useContext(BlockContext);
    const { opponentTeamDetails, popupProfile, opponentPopup, opponentPopupShow } = useContext(OpponentContext);
    const { authorizeUser } = useContext(AuthorizeContext);
    const { sidebarOpen } = useContext(OperationContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const urlkey = process.env.REACT_APP_NODE_BASE_URL;
    const [progressTopBar, setProgressTopBar] = useState(progressLoadingBar);

    //sidebar open close
    if (sidebarOpen === true) { var openSidebar = "toggled" } else { openSidebar = "" }

    //listing challenges With Filters
    const listing = { 'limit': 10, 'offset': offsetListing, 'search': searchTeamVar }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        authorizeUser();//Check user authorize
        blockListing(listing);//load challenges profile
        document.title = "Block | " + websiteName;
    },[websiteName])

    //fetch more challenges
    const fetchMoreData = () => {
        blockListing(listing);//load challenges
    }

    //Search box
    const searchbox = (event) => {
        var searchTeamVar = event.target.value;
        searchTeamVar = searchTeamVar.trim();
        const listingTeamSearch = { 'limit': 10, 'offset': 0, 'search': searchTeamVar }
        blockListing(listingTeamSearch);//load Teams profile
    }

    const unblock = (opponent_token) => {
        var data = {opponent_token_id:opponent_token}
        unblockOpponent(data);//unblock opponent
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
                                            <h6 className="topHeadline">Total <b>{recordsFound} block opponent found!</b></h6>
                                        </div>
                                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12 noPadding searchBox">
                                            <input type="search" name="search" className="form-control" defaultValue={searchTeamVar} placeholder="Search Team Name" onChange={searchbox} />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row noMargin">
                                        <InfiniteScroll
                                            dataLength={blockDetails.length}
                                            next={() => fetchMoreData()}
                                            hasMore={blockDetails.length !== recordsFound && recordsFound !== undefined}
                                            loader={<h4>Loading...</h4>}
                                            scrollableTarget="scrollableDiv"
                                            className="row"
                                            endMessage={<p>No more data to load.</p>}
                                        >
                                            {
                                                blockDetails.length > 0 ? blockDetails.map((team, i) => {
                                                    var messageListDark = "";
                                                    {team.total_messages > 0 ? messageListDark = "messageListDark" : messageListDark = "" }
                                                    return (<div key={i}>
                                                            <div className={"card-message "+messageListDark}>
                                                                <div className="messageCard">
                                                                    <div className="scoreMessage" onClick={()=>opponentPopupShow(team.opponent_token_id)}><img src={!!team.profile_img ? (urlkey + "images/" + team.profile_img) : "default_team.png"} className="img-responsive teamImgMessage" alt="team profile" /></div>
                                                                    <div className="nameText">
                                                                        <span className="fontStyle" onClick={()=>opponentPopupShow(team.opponent_token_id)}>{capitalizeWords(team.opponent_name)}</span> <span className="datetime">{dateFormat(team.date, "dd-mm-yyyy hh:mm:ss TT")}</span>
                                                                        <p className="messageText">
                                                                        <button className="btn btn-primary btn-sm unblockBtn" onClick={()=>unblock(team.opponent_token_id)}>Unblock</button>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                    </div>)
                                                }) : ""

                                            }
                                        </InfiniteScroll>
                                    </div>
                                </div>
                                
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

export default Block; 