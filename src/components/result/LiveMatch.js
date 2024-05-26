import React, { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import capitalizeWords from '../common/CapitalizeWords';
import dateFormat from 'dateformat';
import TriggerToastify from "../common/TriggerToastify";
import { useSearchParams } from 'react-router-dom';

const LiveMatch = () => {
    const [searchParams] = useSearchParams();
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    var [resultDetails, setResultDetails] = useState([]);
    var [playersDetails, setPlayersDetails] = useState([]);
    var [opponentDetails, setOpponentDetails] = useState([]);
    var [recordsFound, setRecordsFound] = useState([]);
    var [urlChallengeId, setUrlChallengeId] = useState("");
    var [urlChallengeURL, setUrlChallengeURL] = useState("");

    useEffect(() => {
        const currentParams = Object.fromEntries([...searchParams])
        if (currentParams.challenge_id !== '' && currentParams.challenge_id !== undefined) {
            setUrlChallengeId(currentParams.challenge_id);//get challenge_id id from url
            resultListing({ "challenge_id": currentParams.challenge_id });//load result profile
            teamPlayerLoad({ "challenge_id": currentParams.challenge_id, "status": "team_id" })
            teamPlayerLoad({ "challenge_id": currentParams.challenge_id, "status": "opponent_id" })
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
        document.title = "Live Match | " + websiteName;
    }, [websiteName])

    //fetch more challenges
    const fetchMoreData = () => {
        resultListing({ "challenge_id": urlChallengeId });//load challenges
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
        const chatURL = urlkey + 'search/live_result';
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

    
    const teamPlayerLoad = async (data) => {
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const chatURL = urlkey + 'search/live_result_players';
        const response = await fetch(chatURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        });
        const json = await response.json();
        if (json !== "" && json !== undefined) {
            if(json.status){
                if(data.status == "team_id"){
                    setPlayersDetails(json.result);
                }else{
                    setOpponentDetails(json.result);
                }
            }
        }
    }
    return (
        <>
            <div className="container-fluid noMargin noPadding">
                <nav className="navbar navbar-expand navbar-dark navbarTop">
                    <div className="collapse navbar-collapse" id="navbarsExample02">
                        <a href="https://playtoconquer.com/" target="_blank">
                            <img src="playtoconquerblack.png" className="img-responsive logoimg" alt="website logo" />
                        </a>
                    </div>
                </nav>
                <div id="wrapper">
                    <div id="page-content-wrapper noMargin noPadding ">
                        <div className="container-fluid noMargin noPadding">
                            <br /><br />
                            <div className="containDetails">
                                {urlChallengeURL ? <iframe width="100%" height="415" src={urlChallengeURL} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> : ""}

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
                                                    return (<><div className="col-sm-4 col-xs-4 col-md-4 col-lg-4" key={i}>
                                                        <div className="card-result">
                                                            <div className="pointerScore">{team.sport_name}</div>
                                                            <div className="scoreCard">
                                                                <div className="nameText fontStyle" style={{ "width": "100%", "textAlign": "center" }}>{capitalizeWords(team.team_name)}</div>
                                                                <div className="scoreAlign"><img src="vsIcon.png" className="img-responsive vsScore" alt="vs icon" /></div>
                                                                <div className="nameText fontStyle" style={{ "width": "100%", "textAlign": "center" }}>{capitalizeWords(team.opponent_team_name)}</div>
                                                            </div>
                                                            <div className="container">

                                                                <div align="center" className="pointerResult">Result</div>
                                                                <div className="" align="center" style={{ "width": "100%" }}>
                                                                    <br></br>
                                                                    <div><b>{team.winner_id > 0 ? "Winner is " + capitalizeWords(team.winner_name) : "Pending"}</b><br />
                                                                        <small>Match date: {dateFormat(team.date, "dd-mm-yyyy hh:mm TT")}</small></div>
                                                                </div>

                                                                <div className="scoreCard">
                                                                    <div className="scoreResult">
                                                                        <div className="matchText text"><b>Match details:</b><br></br> 
                                                                        {team.details ? <div dangerouslySetInnerHTML={{ __html: team.details }} /> : ""}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="scoreCard">
                                                                    <div className="nameText fontStyle" style={{ "width": "100%", "textAlign": "center" }}>
                                                                        {capitalizeWords(team.team_name)}<br></br>
                                                                        {
                                                                            playersDetails.length > 0 ? playersDetails.map((player, i) => {
                                                                                return (<div key={i} style={{"marginBottom":"10px","border":"1px solid #000000","padding":"6px"}}>{i+1}. {player.name}</div>)
                                                                            }) : ""
                                                                        }
                                                                    </div>
                                                                    <div className="nameText fontStyle" style={{ "width": "100%", "textAlign": "center" }}>
                                                                        {capitalizeWords(team.opponent_team_name)}<br></br>
                                                                        {
                                                                            opponentDetails.length > 0 ? opponentDetails.map((opponent, i) => {
                                                                                return (<div key={i} style={{"marginBottom":"10px","border":"1px solid #000000","padding":"6px"}}>{i+1}. {opponent.name}</div>)
                                                                            }) : ""
                                                                        }
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div></>)
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

export default LiveMatch; 