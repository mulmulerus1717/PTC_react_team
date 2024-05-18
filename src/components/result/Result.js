import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import OperationContext from "../../context/common/OperationContext";
import ResultContext from "../../context/result/ResultContext";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import LoadingBar from 'react-top-loading-bar';
import InfiniteScroll from 'react-infinite-scroll-component';
import capitalizeWords from '../common/CapitalizeWords';
import dateFormat from 'dateformat';
import Select from 'react-select';
import OpponentContext from "../../context/profile/OpponentContext";
import OpponentProfile from "../profile/OpponentProfile";

const Result = () => {

    const { resultListing, addResultAPI, popup, hidePopup, showPopup, statusSelect, addResultDetails, resultDetails, recordsFound, offsetListing, progressLoadingBar, searchteamVar } = useContext(ResultContext);
    const { opponentTeamDetails, popupProfile, opponentPopup, opponentPopupShow } = useContext(OpponentContext);
    const { authorizeUser } = useContext(AuthorizeContext);
    const { sidebarOpen } = useContext(OperationContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const urlkey = process.env.REACT_APP_NODE_BASE_URL;
    const [progressTopBar, setProgressTopBar] = useState(progressLoadingBar);
    const [errorMessage, setErrorMessage] = useState('');

    //sidebar open close
    if (sidebarOpen === true) { var openSidebar = "toggled" } else { openSidebar = "" }

    //filter data
    const matchStatusList = [{ label: "All Status", value: "" }, { label: "Pending", value: "pending" }, { label: "Accept", value: "accept" }, { label: "Decline", value: "decline" }, { label: "Complete", value: "complete" }];
    const [matchStatusDetails, setMatchStatusDetails] = useState(matchStatusList);

    //listing challenges With Filters
    const listing = { 'limit': 10, 'offset': offsetListing, 'search': searchteamVar, 'status': statusSelect }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        authorizeUser();//Check user authorize
        resultListing(listing);//load result profile
        document.title = "Result | " + websiteName;
    }, [websiteName])

    //fetch more challenges
    const fetchMoreData = () => {
        resultListing(listing);//load challenges
    }

    //Match Status Changes
    const matchStatusChange = (statusSelectDetails) => {
        if (statusSelectDetails !== "" && statusSelectDetails.value !== undefined) {
            setMatchStatusDetails(statusSelectDetails);
            const listingteamStatus = { 'limit': 10, 'offset': 0, 'search': searchteamVar, 'status': statusSelectDetails.value }
            resultListing(listingteamStatus);//load teams profile
        }
    }

    //Search box
    const searchbox = (event) => {
        var searchteamVar = event.target.value;
        searchteamVar = searchteamVar.trim();
        const listingteamSearch = { 'limit': 10, 'offset': 0, 'search': searchteamVar, 'status':statusSelect }
        resultListing(listingteamSearch);//load teams profile
    }

    //Submit challenge
    const handleSubmitChallenge = (event) => {//submit form with form data
        event.preventDefault();
        const data = new FormData(event.target);
        setProgressTopBar(30)

        const resultForm = data.get('result').trim();  // Reference by form input's `name` tag
        const challengeIdForm = data.get('challenge_id').trim();
        const errorSubmit = [];

        if (resultForm === "" || resultForm === undefined) {
            setErrorMessage("Please choose match result")
            errorSubmit.push(1)
        }

        if (challengeIdForm === "" || challengeIdForm === undefined) {
            setErrorMessage("challenge id not found")
            errorSubmit.push(1)
        }

        //Submit form
        if (errorSubmit !== undefined && errorSubmit.length < 1) {
            var formData = {
                'challenge_id': challengeIdForm,
                'result': resultForm
            }
            addResultAPI(formData);//update details by API
            setProgressTopBar(progressLoadingBar)
        } else {
            setProgressTopBar(100)
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
                        <div className="container-fluid noMargin noPadding">
                            <br /><br />
                            <div className="containDetails">
                                <div className="showTeamsHome">
                                    <div className="row noMargin">
                                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12 noPadding">
                                            <br />
                                            <h6 className="topHeadline">Total <b>{recordsFound} challenge results found!</b></h6>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 noPadding fontStyle">
                                            <Select options={matchStatusList} defaultValue={!!matchStatusDetails && matchStatusDetails.value > 0 ? matchStatusDetails : { label: "All Status", value: "" }} onChange={matchStatusChange} placeholder="Match Status" />
                                        </div>
                                        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-12 noPadding"></div>
                                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 noPadding searchBox">
                                            <input type="search" name="search" className="form-control" defaultValue={searchteamVar} placeholder="Search team Name" onChange={searchbox} />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row noMargin">
                                        <InfiniteScroll
                                            dataLength={resultDetails.length}
                                            next={() => fetchMoreData()}
                                            hasMore={resultDetails.length !== recordsFound && recordsFound !== undefined}
                                            loader={<h4>Loading...</h4>}
                                            scrollableTarget="scrollableDiv"
                                            className="row"
                                            endMessage={<p>No more data to load.</p>}
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
                                                                            {team.match_contest = 1 ? <div className="matchText text"> Losers pay amount: <b>Rs. {team.amount}</b> </div> : ""}
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
                                                                    <div className="scoreCard row addedResultByteam noBorderBottom">
                                                                        <div className="col-sm-6 col-xs-6 col-md-6 col-lg-6">
                                                                            {!!team.team_result ? (<div align="center"><img src={!!team.team_profile ? (urlkey + "images/" + team.team_profile) : "default_team.png"} className="img-responsive teamImgScore" alt="team" /></div>) : (<div className="fontStyle" align="center"><b>Pending</b></div>)}
                                                                            <div className="nameText" align="center">{!!team.team_result ? (capitalizeWords(team.teamname) + " added " + resultTextteam + " as ") : ""}<br /><span className="hilightName" style={resultNameteamStyle}>{!!team.team_result ? (capitalizeWords(team.team_result)) : ""}</span></div>
                                                                        </div>
                                                                        <div className="col-sm-6 col-xs-6 col-md-6 col-lg-6">
                                                                            {!!team.opponent_result ? (<div align="center"><img src={!!team.opponent_profile ? (urlkey + "images/" + team.opponent_profile) : "default_team.png"} className="img-responsive teamImgScore" alt="team" /></div>) : (<div className="fontStyle" align="center"><b>Pending</b></div>)}
                                                                            <div className="nameText"  align="center">{!!team.opponent_result ? (capitalizeWords(team.opponentname) + " added " + resultText + " as ") : ""}<br /><span className="hilightName" style={resultNameOpponentStyle}>{!!team.opponent_result ? (capitalizeWords(team.opponent_result)) : ""}</span></div>
                                                                        </div>
                                                                        {team.accept_status === 1 ? 
                                                                        <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12">
                                                                            <br />
                                                                            <div align="center"><button className="btn btn-primary addResultScore" style={addResultBtn} onClick={() => showPopup(team.challenges_id, team.team_token, team.teamname, team.team_profile, team.opponent_token, team.opponentname, team.opponent_profile)}>Add Result</button></div>
                                                                        </div>
                                                                        : ""}
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
                                <div id="popup" className="overlay" style={popup}>
                                    <div className="popup">
                                        <h4>Add Match Result</h4>
                                        <span className="close" onClick={hidePopup}>&times;</span>
                                        <div className="content">
                                            <form action="#" className="form" onSubmit={handleSubmitChallenge}>
                                                <input type="hidden" name="challenge_id" value={addResultDetails.challenges_id} />
                                                <table className="table table-responsive">
                                                    <tbody>
                                                        <tr>
                                                            <td><input type="radio" id="teamMatch" name="result" value={addResultDetails.team_token} /></td>
                                                            <td>
                                                                <label htmlFor="teamMatch">
                                                                <img src={!!addResultDetails.team_profile ? (urlkey + "images/" + addResultDetails.team_profile) : "default_team.png"} className="img-responsive messageProfileimg" alt="playing_image" />
                                                                &nbsp;&nbsp;<b>{capitalizeWords(addResultDetails.teamname)}</b> as winner
                                                                </label>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><input type="radio" id="opponentMatch" name="result" value={addResultDetails.opponent_token} /></td>
                                                            <td>
                                                                <label htmlFor="opponentMatch">
                                                                <img src={!!addResultDetails.opponent_profile ? (urlkey + "images/" + addResultDetails.opponent_profile) : "default_team.png"} className="img-responsive messageProfileimg" alt="playing_image" />
                                                                &nbsp;&nbsp;<b>{capitalizeWords(addResultDetails.opponentname)}</b> as winner
                                                                </label>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><input type="radio" id="drawMatch" name="result" value="draw" /></td>
                                                            <td><label htmlFor="drawMatch"><b>Draw</b></label></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                {!!errorMessage ? (<span className="text text-danger">{errorMessage}</span>) : ""}
                                                <button className="btn btn-primary">Send</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                {/* Popup Ends */}


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

export default Result; 