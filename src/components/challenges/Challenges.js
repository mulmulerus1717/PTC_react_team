import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import OperationContext from "../../context/common/OperationContext";
import ChallengeContext from "../../context/challenges/ChallengesContext";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import LoadingBar from 'react-top-loading-bar';
import InfiniteScroll from 'react-infinite-scroll-component';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import dateFormat from 'dateformat';
import OpponentContext from "../../context/profile/OpponentContext";
import OpponentProfile from "../profile/OpponentProfile";
import capitalizeWords from '../common/CapitalizeWords';

const Challenges = () => {

    const { challengeListing, challengeAccpet, challengeReject, updateChallengesCount, challengeDetails, recordsFound, offsetListing, progressLoadingBar } = useContext(ChallengeContext);
    const { opponentPlayerDetails, popupProfile, opponentPopup, opponentPopupShow } = useContext(OpponentContext);
    const { authorizeUser } = useContext(AuthorizeContext);
    const { sidebarOpen } = useContext(OperationContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const urlkey = process.env.REACT_APP_NODE_BASE_URL;
    const [progressTopBar, setProgressTopBar] = useState(progressLoadingBar);

    setTimeout(()=>{
        //Tooltip
        tippy('.acceptButtonTooltip', {
            content: "Accept Challenge",
            animation: 'fade',
        });

        //Tooltip
        tippy('.rejectButtonTooltip', {
            content: "Reject Challenge",
            animation: 'fade',
        });

        //Tooltip
        tippy('.tshirtNumberTooltip', {
            content: "T-Shirt Number",
            animation: 'fade',
        });
    },3000)

    //sidebar open close
    if (sidebarOpen === true) { var openSidebar = "toggled" } else { openSidebar = "" }

    //listing challenges With Filters
    const listing = { 'limit': 10, 'offset': offsetListing }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        authorizeUser();//Check user authorize
        challengeListing(listing);//load challenges profile
        updateChallengesCount();//Count Challenges
        document.title = "Challenges | " + websiteName;
    },[websiteName])

    //fetch more challenges
    const fetchMoreData = () => {
        challengeListing(listing);//load challenges
    }

    //accept Button
    const acceptButton = (challenge_id) => {
        var dataAccept = { "challenge_id": challenge_id }
        challengeAccpet(dataAccept);//Accept Challenege API
    }

    //Reject Button
    const rejectButton = (challenge_id) => {
        var dataAccept = { "challenge_id": challenge_id }
        challengeReject(dataAccept);//reject Challenege API
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

                                <div className="showPlayersHome">
                                    <div className="row noMargin">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
                                            <br />
                                            <h6 className="topHeadline">Total <b>{recordsFound} challenges found!</b></h6>
                                        </div>
                                    </div>
                                    <div className="row noMargin">
                                        <InfiniteScroll
                                            dataLength={challengeDetails.length}
                                            next={() => fetchMoreData()}
                                            hasMore={challengeDetails.length !== recordsFound && recordsFound !== undefined}
                                            loader={<h4>Loading...</h4>}
                                            scrollableTarget="scrollableDiv"
                                            className="row"
                                            endMessage={<p>No more data to load.</p>}
                                        >
                                            {
                                                challengeDetails.length > 0 ? challengeDetails.map((player, i) => {
                                                    return (<div className="col-sm-3 col-xs-3 col-md-3 col-lg-3" key={i}>
                                                        <div className="card-challenge">
                                                            <div className="pointerchallenge">{player.sport_name}</div>
                                                              <div className="challengeCard noBorder">
                                                                  <div className="tshirtNumber tshirtNumberTooltip">{!!player.tshirt_number ? player.tshirt_number : ""}<span className="ot-border">{!!player.tshirt_number ? player.tshirt_number : ""}</span></div>
                                                                  <div className="nameText" onClick={()=>opponentPopupShow(player.opponent_token_id)}><div>{capitalizeWords(player.firstname)} {capitalizeWords(player.lastname)}</div><span>Age {player.age} ({player.gender == "m" ? "Male" : ""} {player.gender == "f" ? "Female" : ""} {player.gender == "o" ? "Other" : ""})</span></div>
                                                              </div>
                                                              <div align="center" className="pointerResult">Players career</div>
                                                              <div className="challengeCard challengeCareer noBorder noPadding">
                                                                  <div className="columns"><span>{player.matches}</span> <br />Played</div>
                                                                  <div className="columns"><span>{player.won}</span> <br />Won</div>
                                                                  <div className="columns"><span>{player.draw}</span> <br />Draw</div>
                                                              </div>
                                                              <div className="challengeCard challengeCareer">
                                                                  <div className="challengeAlign"><img src={!!player.profile_img ? (urlkey + "images/" + player.profile_img) : "default_player.png"} className="img-responsive challengeImgplayer" /></div>
                                                              </div>
                                                              <div className="container">
                                                                  <div className="challengeRecent noBorder noPadding">
                                                                      <div className="columns recentMatches"><b>Challenge Message:</b><div className="matchText text text-success">({player.match_contest == 1 ? 'Prize money match' : 'Friendly match'})</div></div>
                                                                      <p>{player.challenge_message}</p>
                                                                      <span>{dateFormat(player.date, "dd-mm-yyyy hh:mm:ss TT")}</span>
                                                                  </div>
                                                                  <div align="center">
                                                                    <div className="buttonsSet">
                                                                        <div className="buttonAction acceptButton acceptButtonTooltip" onClick={() => acceptButton(player.challenge_id)}>
                                                                            <span className="material-symbols-outlined done">done</span>
                                                                        </div>
                                                                        <div className="buttonAction declineButton rejectButtonTooltip" onClick={() => rejectButton(player.challenge_id)}>
                                                                            <span className="material-symbols-outlined close">close</span>
                                                                        </div>
                                                                    </div>
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
                                            <OpponentProfile opponentDetails={opponentPlayerDetails} />
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

export default Challenges;