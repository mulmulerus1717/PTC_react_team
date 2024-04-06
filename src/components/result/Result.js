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

    const { resultListing, addResultAPI, popup, hidePopup, showPopup, statusSelect, addResultDetails, resultDetails, recordsFound, offsetListing, progressLoadingBar, searchPlayerVar } = useContext(ResultContext);
    const { opponentPlayerDetails, popupProfile, opponentPopup, opponentPopupShow } = useContext(OpponentContext);
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
    const listing = { 'limit': 10, 'offset': offsetListing, 'search': searchPlayerVar, 'status': statusSelect }

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
            const listingPlayerStatus = { 'limit': 10, 'offset': 0, 'search': searchPlayerVar, 'status': statusSelectDetails.value }
            resultListing(listingPlayerStatus);//load players profile
        }
    }

    //Search box
    const searchbox = (event) => {
        var searchPlayerVar = event.target.value;
        searchPlayerVar = searchPlayerVar.trim();
        const listingPlayerSearch = { 'limit': 10, 'offset': 0, 'search': searchPlayerVar, 'status':statusSelect }
        resultListing(listingPlayerSearch);//load players profile
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
                                <div className="showPlayersHome">
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
                                            <input type="search" name="search" className="form-control" defaultValue={searchPlayerVar} placeholder="Search Player Name" onChange={searchbox} />
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
                                                resultDetails.length > 0 ? resultDetails.map((player, i) => {
                                                    var resultText = "winner";
                                                    var resultTextPlayer = "winner";
                                                    if (player.opponent_result && player.opponent_result === 'draw') {
                                                        resultText = "result";
                                                    }

                                                    if (player.player_result && player.player_result === 'draw') {
                                                        resultTextPlayer = "result";
                                                    }

                                                    var resultNamePlayerStyle = { display: "none" }
                                                    var resultNameOpponentStyle = { display: "none" }

                                                    if (player.player_result && player.player_result !== '' && player.player_result !== null && player.player_result !== undefined) {
                                                        resultNamePlayerStyle = { display: "block" }
                                                    }

                                                    if (player.opponent_result && player.opponent_result !== '' && player.opponent_result !== null && player.opponent_result !== undefined) {
                                                        resultNameOpponentStyle = { display: "block" }
                                                    }

                                                    //won display
                                                    var showResult = { display: "none" }
                                                    var addResultBtn = { display: "block" }
                                                    var resultTextWinner = "Game result";
                                                    var pendingMessage = "Pending";
                                                    if (player.won && player.won !== "draw") {
                                                        resultTextWinner = "Winner is ";
                                                        showResult = { display: "block" }
                                                        addResultBtn = { display: "none" }
                                                        var pendingMessage = "";
                                                    }

                                                    //Match Status
                                                    var accept_status = "";
                                                    if((player.won !== "" && player.won !== 0) || player.draw !== 0){accept_status="Close"}
                                                    else if(player.accept_status === 0){accept_status="Pending"}
                                                    else if(player.accept_status === 1 && (player.won === "" || player.won === 0) && player.draw === 0){accept_status="Accepted"}
                                                    else if(player.accept_status === 2){accept_status="Decline"}
                                                    else if(player.accept_status === 3){accept_status="Complete"} 
                                                        return (<div className="col-sm-4 col-xs-4 col-md-4 col-lg-4" key={i}>
                                                            <div className="card-result">
                                                                <div className="pointerScore">{player.sports_name}</div>
                                                                <div className="scoreCard">
                                                                    <div className="scoreAlign" onClick={()=>opponentPopupShow(player.player_token)}><img src={!!player.player_profile ? (urlkey + "images/" + player.player_profile) : "default_player.png"} className="img-responsive playerImgScore" alt="player profile" /></div>
                                                                    <div className="nameText fontStyle" onClick={()=>opponentPopupShow(player.player_token)}>{capitalizeWords(player.playername)}</div>
                                                                    <div className="scoreAlign"><img src="vsIcon.png" className="img-responsive vsScore" alt="vs icon" /></div>
                                                                    <div className="scoreAlign" onClick={()=>opponentPopupShow(player.opponent_token)}><img src={!!player.opponent_profile ? (urlkey + "images/" + player.opponent_profile) : "default_player.png"} className="img-responsive playerImgScore" alt="player profile" /></div>
                                                                    <div className="nameText fontStyle" onClick={()=>opponentPopupShow(player.opponent_token)}>{capitalizeWords(player.opponentname)}</div>
                                                                </div>
                                                                <div className="container">
                                                                    <div className="scoreCard">
                                                                        <p className="scoreResult">
                                                                            {capitalizeWords(player.playername)} sent match challenge<br />

                                                                            <div className="matchText text text-success">{player.match_contest == 1 ? 'Prize money' : 'Friendly'} match invitation</div>
                                                                            <span className="matchStatus">Match status {accept_status}</span><br />
                                                                            {player.player_result !== null && player.opponent_result !== null && player.player_result !== player.opponent_result ? "Note: Match result not matching with opponent result!" : ""}
                                                                        </p>
                                                                    </div>

                                                                    <div align="center" className="pointerResult">Result</div>
                                                                    <div className="scoreCard">
                                                                        <div className="scoreAlign scoreLength" style={showResult}><img src={!!player.winner_image ? (urlkey + "images/" + player.winner_image) : "default_player.png"} className="img-responsive playerImgScore" alt="profile" /></div>
                                                                        <div className="scorePName" style={showResult}>{resultTextWinner + capitalizeWords(player.won)}<br /><small>Result date {dateFormat(player.result_date, "dd-mm-yyyy hh:mm TT")}</small></div>
                                                                        {player.draw !== 0 ? <div className="scorePName">Match Result Draw<br /><small>{player.draw !== 0 ? "Result date "+dateFormat(player.result_date, "dd-mm-yyyy hh:mm TT") : ""}</small></div> : ""}
                                                                        {pendingMessage ? (<b className="fontStyle" align="center" style={{width:"100%"}}>{pendingMessage}</b>) : ""}
                                                                    </div>

                                                                    <div align="center" className="pointerResult">Players added result</div>
                                                                    <div className="scoreCard row addedResultByPlayer noBorderBottom">
                                                                        <div className="col-sm-6 col-xs-6 col-md-6 col-lg-6">
                                                                            {!!player.player_result ? (<div align="center"><img src={!!player.player_profile ? (urlkey + "images/" + player.player_profile) : "default_player.png"} className="img-responsive playerImgScore" alt="player" /></div>) : (<div className="fontStyle" align="center"><b>Pending</b></div>)}
                                                                            <div className="nameText" align="center">{!!player.player_result ? (capitalizeWords(player.playername) + " added " + resultTextPlayer + " as ") : ""}<br /><span className="hilightName" style={resultNamePlayerStyle}>{!!player.player_result ? (capitalizeWords(player.player_result)) : ""}</span></div>
                                                                        </div>
                                                                        <div className="col-sm-6 col-xs-6 col-md-6 col-lg-6">
                                                                            {!!player.opponent_result ? (<div align="center"><img src={!!player.opponent_profile ? (urlkey + "images/" + player.opponent_profile) : "default_player.png"} className="img-responsive playerImgScore" alt="player" /></div>) : (<div className="fontStyle" align="center"><b>Pending</b></div>)}
                                                                            <div className="nameText"  align="center">{!!player.opponent_result ? (capitalizeWords(player.opponentname) + " added " + resultText + " as ") : ""}<br /><span className="hilightName" style={resultNameOpponentStyle}>{!!player.opponent_result ? (capitalizeWords(player.opponent_result)) : ""}</span></div>
                                                                        </div>
                                                                        {player.accept_status === 1 ? 
                                                                        <div className="col-sm-12 col-xs-12 col-md-12 col-lg-12">
                                                                            <br />
                                                                            <div align="center"><button className="btn btn-primary addResultScore" style={addResultBtn} onClick={() => showPopup(player.challenges_id, player.player_token, player.playername, player.player_profile, player.opponent_token, player.opponentname, player.opponent_profile)}>Add Result</button></div>
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
                                                            <td><input type="radio" id="playerMatch" name="result" value={addResultDetails.player_token} /></td>
                                                            <td>
                                                                <label htmlFor="playerMatch">
                                                                <img src={!!addResultDetails.player_profile ? (urlkey + "images/" + addResultDetails.player_profile) : "default_player.png"} className="img-responsive messageProfileimg" alt="playing_image" />
                                                                &nbsp;&nbsp;<b>{capitalizeWords(addResultDetails.playername)}</b> as winner
                                                                </label>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td><input type="radio" id="opponentMatch" name="result" value={addResultDetails.opponent_token} /></td>
                                                            <td>
                                                                <label htmlFor="opponentMatch">
                                                                <img src={!!addResultDetails.opponent_profile ? (urlkey + "images/" + addResultDetails.opponent_profile) : "default_player.png"} className="img-responsive messageProfileimg" alt="playing_image" />
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

export default Result; 