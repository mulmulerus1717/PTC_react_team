import React, { useContext, useEffect, useState } from "react";
import LoadingBar from 'react-top-loading-bar';
import InfiniteScroll from 'react-infinite-scroll-component';
import capitalizeWords from '../common/CapitalizeWords';
import dateFormat from 'dateformat';
import OpponentContext from "../../context/profile/OpponentContext";
import TriggerToastify from "../../components/common/TriggerToastify";
import { useSearchParams } from 'react-router-dom';

const ChallengesLive = () => {
    const [searchParams] = useSearchParams();
    const { opponentTeamDetails, popupProfile, opponentPopup, opponentPopupShow } = useContext(OpponentContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const urlkey = process.env.REACT_APP_NODE_BASE_URL;
    var [resultDetails, setResultDetails] = useState([]);
    var [recordsFound, setRecordsFound] = useState([]);
    var [urlChallengeId, setUrlChallengeId] = useState("");
    var [urlChallengeURL, setUrlChallengeURL] = useState("");
    
    //listing challenges With Filters
    const listing = { 'limit': 10, 'offset': 0 }

    useEffect(() => {
        const currentParams = Object.fromEntries([...searchParams])
        if(currentParams.challenge_id !== '' && currentParams.challenge_id !== undefined){
            setUrlChallengeId(currentParams.challenge_id);//get challenge_id id from url
            resultListing({"challenge_id":currentParams.challenge_id});//load result profile
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
        document.title = "Live Match | " + websiteName;
    }, [websiteName])

    //fetch more challenges
    const fetchMoreData = () => {
        resultListing({"challenge_id":urlChallengeId});//load challenges
    }
    
    const resultListing = async (data) => {
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const chatURL = urlkey + 'search/live_match';
        const response = await fetch(chatURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        });
        const json = await response.json();
        if (json !== "" && json !== undefined) {
            if (json.status) {
                //append result
                for (var inc = 0; inc < json.result.length; inc++) {
                    resultDetails.push(json.result[inc])
                }
                setResultDetails(resultDetails);
                setUrlChallengeURL(json.result[0].link);

                //total records
                setRecordsFound(1);
            } else if (json.status === false) {
                if (json.errors !== undefined && json.errors.length > 0) {
                    let errorAPiMessage = "";
                    for (let inc = 0; inc < json.errors.length; inc++) {
                        if (json.errors[inc].authorization !== "" && json.errors[inc].authorization !== undefined) {
                            errorAPiMessage = json.errors[inc].authorization;
                        }
                        if (json.errors[inc].limit !== "" && json.errors[inc].limit !== undefined) {
                            errorAPiMessage = json.errors[inc].limit;
                        }
                        if (json.errors[inc].offset !== "" && json.errors[inc].offset !== undefined) {
                            errorAPiMessage = json.errors[inc].offset;
                        }
                    }
                    TriggerToastify(errorAPiMessage, "error");
                } else {
                    TriggerToastify(json.message, "error");
                }
            }
        }
    }
    return (
        <>
            <div className="container-fluid noMargin noPadding">
                <div id="wrapper">
                    <div id="page-content-wrapper noMargin noPadding ">
                        <div className="container-fluid noMargin noPadding">
                            <br /><br />
                            <div className="containDetails">

                                <iframe width="100%" height="415" src={urlChallengeURL} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

                                <div className="showTeamsHome">
                                    <div className="row noMargin">
                                        <InfiniteScroll
                                            dataLength={resultDetails.length}
                                            next={() => fetchMoreData()}
                                            hasMore={resultDetails.length !== recordsFound && recordsFound !== undefined}
                                            loader={<h4>Loading...</h4>}
                                            scrollableTarget="scrollableDiv"
                                            className="row"
                                        >
                                            {
                                                resultDetails.length > 0 ? resultDetails.map((team, i) => {
                                                    var resultText = "winner";
                                                    var resultTextteam = "winner";
                                                    if (team.opponent_result && team.opponent_result === 'draw') {
                                                        resultText = "result";
                                                    }

                                                    if (team.team_result && team.team_result === 'draw') {
                                                        resultTextteam = "result";
                                                    }

                                                    var resultNameteamStyle = { display: "none" }
                                                    var resultNameOpponentStyle = { display: "none" }

                                                    if (team.team_result && team.team_result !== '' && team.team_result !== null && team.team_result !== undefined) {
                                                        resultNameteamStyle = { display: "block" }
                                                    }

                                                    if (team.opponent_result && team.opponent_result !== '' && team.opponent_result !== null && team.opponent_result !== undefined) {
                                                        resultNameOpponentStyle = { display: "block" }
                                                    }

                                                    //won display
                                                    var showResult = { display: "none" }
                                                    var addResultBtn = { display: "block" }
                                                    var resultTextWinner = "Game result";
                                                    var pendingMessage = "Pending";
                                                    if (team.won && team.won !== "draw") {
                                                        resultTextWinner = "Winner is ";
                                                        showResult = { display: "block" }
                                                        addResultBtn = { display: "none" }
                                                        var pendingMessage = "";
                                                    }

                                                    //Match Status
                                                    var accept_status = "";
                                                    if((team.won !== "" && team.won !== 0) || team.draw !== 0){accept_status="Close"}
                                                    else if(team.accept_status === 0){accept_status="Pending"}
                                                    else if(team.accept_status === 1 && (team.won === "" || team.won === 0) && team.draw === 0){accept_status="Accepted"}
                                                    else if(team.accept_status === 2){accept_status="Decline"}
                                                    else if(team.accept_status === 3){accept_status="Complete"} 
                                                        return (<div className="col-sm-4 col-xs-4 col-md-4 col-lg-4" key={i}>
                                                            <div className="card-result">
                                                                <div className="pointerScore">{team.sports_name}</div>
                                                                <div className="scoreCard">
                                                                    <div className="scoreAlign" onClick={()=>opponentPopupShow(team.team_token)}><img src={!!team.team_profile ? (urlkey + "images/" + team.team_profile) : "default_team.png"} className="img-responsive teamImgScore" alt="team profile" /></div>
                                                                    <div className="nameText fontStyle" onClick={()=>opponentPopupShow(team.team_token)}>{capitalizeWords(team.teamname)}</div>
                                                                    <div className="scoreAlign"><img src="vsIcon.png" className="img-responsive vsScore" alt="vs icon" /></div>
                                                                    <div className="scoreAlign" onClick={()=>opponentPopupShow(team.opponent_token)}><img src={!!team.opponent_profile ? (urlkey + "images/" + team.opponent_profile) : "default_team.png"} className="img-responsive teamImgScore" alt="team profile" /></div>
                                                                    <div className="nameText fontStyle" onClick={()=>opponentPopupShow(team.opponent_token)}>{capitalizeWords(team.opponentname)}</div>
                                                                </div>
                                                                <div className="container">
                                                                    <div className="scoreCard">
                                                                        <div className="scoreResult">
                                                                            {capitalizeWords(team.teamname)} sent match challenge<br />

                                                                            <div className="matchText text">Match challenge: <b>{team.match_contest_name}</b> invitation</div>
                                                                            <div className="matchText text">Match playground: <b>{team.location_place}</b></div>
                                                                            {team.match_contest == 1 ? <div className="matchText text"> Losers pay amount: <b>Rs. {team.amount}</b> </div> : ""}
                                                                            <span className="matchStatus">Match status {accept_status}</span><br />
                                                                            {team.team_result !== null && team.opponent_result !== null && team.team_result !== team.opponent_result ? "Note: Match result not matching with opponent result!" : ""}
                                                                        </div>
                                                                    </div>

                                                                    <div align="center" className="pointerResult">Result</div>
                                                                    <div className="scoreCard">
                                                                        <div className="scoreAlign scoreLength" style={showResult}><img src={!!team.winner_image ? (urlkey + "images/" + team.winner_image) : "default_team.png"} className="img-responsive teamImgScore" alt="profile" /></div>
                                                                        <div className="scorePName" style={showResult}>{resultTextWinner + capitalizeWords(team.won)}<br /><small>Result date {dateFormat(team.result_date, "dd-mm-yyyy hh:mm TT")}</small></div>
                                                                        {team.draw !== 0 ? <div className="scorePName">Match Result Draw<br /><small>{team.draw !== 0 ? "Result date "+dateFormat(team.result_date, "dd-mm-yyyy hh:mm TT") : ""}</small></div> : ""}
                                                                        {pendingMessage ? (<b className="fontStyle" align="center" style={{width:"100%"}}>{pendingMessage}</b>) : ""}
                                                                    </div>

                                                                    <div align="center" className="pointerResult">teams added result</div>
                                                                    <div className="row addedResultByteam noBorderBottom">
                                                                        <div className="col-sm-6 col-xs-6 col-md-6 col-lg-6">
                                                                            {!!team.team_result ? (<div align="center"><img src={!!team.team_profile ? (urlkey + "images/" + team.team_profile) : "default_team.png"} className="img-responsive teamImgScore" alt="team" /></div>) : (<div className="fontStyle" align="center"><b>Pending</b></div>)}
                                                                            <div className="nameText" align="center">{!!team.team_result ? (capitalizeWords(team.teamname) + " added " + resultTextteam + " as ") : ""}<br /><span className="hilightName" style={resultNameteamStyle}>{!!team.team_result ? (capitalizeWords(team.team_result)) : ""}</span></div>
                                                                        </div>
                                                                        <div className="col-sm-6 col-xs-6 col-md-6 col-lg-6">
                                                                            {!!team.opponent_result ? (<div align="center"><img src={!!team.opponent_profile ? (urlkey + "images/" + team.opponent_profile) : "default_team.png"} className="img-responsive teamImgScore" alt="team" /></div>) : (<div className="fontStyle" align="center"><b>Pending</b></div>)}
                                                                            <div className="nameText"  align="center">{!!team.opponent_result ? (capitalizeWords(team.opponentname) + " added " + resultText + " as ") : ""}<br /><span className="hilightName" style={resultNameOpponentStyle}>{!!team.opponent_result ? (capitalizeWords(team.opponent_result)) : ""}</span></div>
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

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChallengesLive; 