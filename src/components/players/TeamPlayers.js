import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import OperationContext from "../../context/common/OperationContext";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import LoadingBar from 'react-top-loading-bar';
import InfiniteScroll from 'react-infinite-scroll-component';
import TriggerToastify from "../common/TriggerToastify";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { useNavigate } from 'react-router-dom';

const TeamPlayers = () => {

    const { authorizeUser } = useContext(AuthorizeContext);
    const { sidebarOpen } = useContext(OperationContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const urlkey = process.env.REACT_APP_NODE_BASE_URL;
    const [offsetListing, setOffsetListing] = useState(0);
    const [progressTopBar, setProgressTopBar] = useState(0);
    const [playersFound, setPlayersFound] = useState(0);
    const userToken = localStorage.getItem('userToken');
    const [searchPlayerVar, setSearchPlayerVar] = useState("");
    const [genderSelect, setGenderSelect] = useState("");
    const [ageRangeSelect, setAgeRangeSelect] = useState("");
    const [sportsSelectPlain, setSportsSelectPlain] = useState("");
    var [playerState, setPlayerState] = useState([]);
    const animatedComponents = makeAnimated();
    const [filterSection, setFilterSection] = useState({ display: "none" });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    //sidebar open close
    if (sidebarOpen === true) { var openSidebar = "toggled" } else { openSidebar = "" }

    //Tooltip
    tippy('.filterIcon', {
        content: "Filters",
        animation: 'fade',
    });

    //filter data
    const genderList = [{ label: "All Gender", value: "" }, { label: "Male", value: "m" }, { label: "Female", value: "f" }, { label: "Other", value: "o" }];
    const [genderDetails, setGenderDetails] = useState(genderList);

    const ageList = [{ label: "All Age", value: "" }, { label: "5 to 12 Age", value: "5-12" }, { label: "13 to 18 Age", value: "13-18" }, { label: "19 to 35 Age", value: "19-35" }, { label: "36 to 48 Age", value: "36-48" }, { label: "49 to 60 Age", value: "49-60" }, { label: "61 and Above Age", value: "61" }];;
    const [ageDetails, setAgeDetails] = useState(ageList);

    //listing Players With Filters
    const listingPlayer = { 'limit': 12, 'offset': offsetListing, 'search': searchPlayerVar, 'gender': genderSelect, 'age': ageRangeSelect, 'sports': sportsSelectPlain }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        authorizeUser();//Check user authorize
        playersProfile(listingPlayer);//load players profile
        if (window.innerWidth > 720) {
            document.getElementById("filterIcon").click();
        }
        document.title = "Players Join Request | " + websiteName;
    }, [websiteName])

    //tooltip
    setTimeout(function () {
        tippy('.info_sports', {
            content: "Choose a sport or game for your challenge.",
            animation: 'fade',
        });

        tippy('.info_match', {
            content: "Choose friendly match or some prize money for your challenge",
            animation: 'fade',
        });

        tippy('.info_lp_amount', {
            content: "Add amount which losers will pay",
            animation: 'fade',
        });

        tippy('.info_place', {
            content: "Choose place where you want to play!",
            animation: 'fade',
        });

        tippy('.info_message', {
            content: "Let's set up a challenge message to discussed the time, location, etc and play together on the ground or in the arena.",
            animation: 'fade',
        });

    }, 3000);

    //Tooltip
    tippy('.tshirtNumberTooltip', {
        content: "T-Shirt Number",
        animation: 'fade',
    });

    tippy('.acceptButtonTooltip', {
        content: "Accept player request to join your team.",
        animation: 'fade',
    });

    tippy('.rejectButtonTooltip', {
        content: "Remove player your team.",
        animation: 'fade',
    });

    //fetch more profiles
    const fetchMoreData = () => {
        playersProfile(listingPlayer);//load players profile
    }

    const playersProfile = async (data) => {
        setProgressTopBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const homeURL = urlkey + 'teams/team_players';
        const response = await fetch(homeURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + userToken
            },
            body: formBody
        });
        const json = await response.json();
        if (json !== "" && json !== undefined) {
            setProgressTopBar(100)
            if (json.status) {
                if (searchPlayerVar !== data.search) {
                    playerState = [];
                    setSearchPlayerVar(data.search);
                    setOffsetListing(12);
                } else if (genderSelect !== data.gender) {
                    playerState = [];
                    setGenderSelect(data.gender);
                    setOffsetListing(12);
                } else if (ageRangeSelect !== data.age) {
                    playerState = [];
                    setAgeRangeSelect(data.age);
                    setOffsetListing(12);
                } else if (sportsSelectPlain !== data.sports) {
                    playerState = [];
                    setSportsSelectPlain(data.sports);
                    setOffsetListing(12);
                } else {
                    setOffsetListing(offsetListing + 12);
                }

                //append players
                for (var inc = 0; inc < json.result.length; inc++) {
                    playerState.push(json.result[inc])
                }
                setPlayerState(playerState);

                //total records
                setPlayersFound(json.total_records);
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

    const searchbox = (event) => {
        var searchPlayerVar = event.target.value;
        searchPlayerVar = searchPlayerVar.trim();
        setOffsetListing(0);
        const listingPlayerSearch = { 'limit': 12, 'offset': 0, 'search': searchPlayerVar, 'gender': genderSelect, 'age': ageRangeSelect, 'sports': sportsSelectPlain }
        playersProfile(listingPlayerSearch);//load players profile
    }

    //gender
    const genderChange = (genderSelectDetails) => {
        if (genderSelectDetails !== "" && genderSelectDetails.value !== undefined) {
            setGenderDetails(genderSelectDetails);
            setOffsetListing(0);
            const listingPlayerGender = { 'limit': 12, 'offset': 0, 'search': searchPlayerVar, 'gender': genderSelectDetails.value, 'age': ageRangeSelect, 'sports': sportsSelectPlain }
            playersProfile(listingPlayerGender);//load players profile
        }
    }

    //age
    const ageChange = (ageSelectDetails) => {
        if (ageSelectDetails !== "" && ageSelectDetails.value !== undefined) {
            setAgeDetails(ageSelectDetails);
            setOffsetListing(0);
            const listingPlayerAge = { 'limit': 12, 'offset': 0, 'search': searchPlayerVar, 'gender': genderSelect, 'age': ageSelectDetails.value, 'sports': sportsSelectPlain }
            playersProfile(listingPlayerAge);//load players profile
        }
    }

    //hide show filter
    const showFilter = () => {
        if (filterSection.display === "none") {
            setFilterSection({ display: "block" });
        } else {
            setFilterSection({ display: "none" });
        }
    }

    //Submit challenge
    const handleSubmitChallenge = (team_player_id) => {//submit form with form data
        setProgressTopBar(30)

        const errorSubmit = [];

        if (team_player_id === "" || team_player_id === undefined) {
            setErrorMessage("Please team player id")
            errorSubmit.push(1)
        }

        //Submit form
        if (errorSubmit !== undefined && errorSubmit.length < 1) {

            var formData = {
                'team_player_id': team_player_id
            }
            removePlayers(formData);//update details by API
        } else {
            setProgressTopBar(100)
        }

    }

    //send challenge
    const removePlayers = async (data) => {
        setProgressTopBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        var removePlayersUrl = urlkey + 'teams/reject_request';
        
        const response = await fetch(removePlayersUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + userToken
            },
            body: formBody
        });
        const json = await response.json();
        if (json !== "" && json !== undefined) {
            setProgressTopBar(100)
            if (json.status) {
                TriggerToastify(json.message, "success");
                setTimeout(function() { navigate(0); }, 1000);
            } else if (json.status === false) {
                if (json.errors !== undefined && json.errors.length > 0) {
                    let errorAPiMessage = "";
                    for (let inc = 0; inc < json.errors.length; inc++) {
                        if (json.errors[inc].opponent_token !== "" && json.errors[inc].opponent_token !== undefined) {
                            errorAPiMessage = json.errors[inc].opponent_token;
                        }
                        if (json.errors[inc].team_player_id !== "" && json.errors[inc].team_player_id !== undefined) {
                            errorAPiMessage = json.errors[inc].team_player_id;
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
                                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12 noPadding fontStyle">
                                            <div style={filterSection}>
                                                <div className="row noMargin">
                                                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4"><Select options={genderList} defaultValue={!!genderDetails && genderDetails.value > 0 ? genderDetails : { label: "All Gender", value: "" }} onChange={genderChange} placeholder="Gender" /></div>
                                                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4"><Select options={ageList} defaultValue={!!ageDetails && ageDetails.value > 0 ? ageDetails : { label: "All Age", value: "" }} onChange={ageChange} placeholder="Age Range" /></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-12 noPadding">
                                            <div className="iconStyle filterIcon" align="center" id="filterIcon" onClick={showFilter}>
                                                <span className="material-symbols-outlined filter">filter_alt</span>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12 noPadding searchBox">
                                            <input type="search" name="search" className="form-control" defaultValue={searchPlayerVar} placeholder="Search Player Name" onChange={searchbox} />
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
                                            <br />
                                            <h6 className="topHeadline">Total <b>{playersFound} players</b> in your team from your city.</h6>
                                        </div>
                                    </div>
                                    <div className="row noMargin">
                                        <InfiniteScroll
                                            dataLength={playerState.length}
                                            next={() => fetchMoreData()}
                                            hasMore={playerState.length !== playersFound && playersFound !== undefined}
                                            loader={<h4>Loading...</h4>}
                                            scrollableTarget="scrollableDiv"
                                            className="row"
                                        >
                                            {
                                                playerState.length > 0 ? playerState.map((player, i) => {
                                                    var last_matches = player.last_matches;
                                                    if (last_matches !== null) {
                                                        var last_matches = last_matches.split(',');
                                                    }
                                                    return (<div className="col-sm-3 col-xs-3 col-md-3 col-lg-3" key={i}>
                                                        <div className="card-player">
                                                            <div className="pointerplayer">{player.sport_name}</div>
                                                            <div className="playerCard noBorder">
                                                                <div className="tshirtNumber tshirtNumberTooltip">{!!player.tshirt_number ? player.tshirt_number : ""}<span className="ot-border">{!!player.tshirt_number ? player.tshirt_number : ""}</span></div>
                                                                <div className="nameText"><div>{player.firstname} {player.lastname}</div><span>Age {player.age} ({player.gender})</span></div>
                                                            </div>
                                                            <div className="playerCard playerCareer">
                                                                <div className="playerAlign"><img src={!!player.profile_img ? (urlkey + "images/" + player.profile_img) : "default_player.png"} className="img-responsive playerImgplayer" alt="Player profile" /></div>
                                                            </div>
                                                            <div className="container">
                                                                <div align="center" className="pointerResult">Career</div>
                                                                <div className="playerCard playerCareer noBorder noPadding">
                                                                    <div className="columns"><span>{player.matches}</span> <br />Played</div>
                                                                    <div className="columns"><span>{player.won}</span> <br />Won</div>
                                                                    <div className="columns"><span>{player.draw}</span> <br />Draw</div>
                                                                </div>
                                                                <div className="playerRecent noBorder noPadding">
                                                                    {player.last_matches ? <div className="columns recentMatches"><b>Recent matches</b></div> : ""}
                                                                    <div className="winStats">
                                                                        {player.last_matches ? last_matches.map((matches, inc) => {
                                                                            if (matches != undefined && matches !== "" && matches !== null) {
                                                                                var colorMatch = "";
                                                                                if (matches === "L") {
                                                                                    var colorMatch = "recentPoints colorRed";
                                                                                } else if (matches === "D") {
                                                                                    var colorMatch = "recentPoints colorOrange";
                                                                                } else if (matches === "W") {
                                                                                    var colorMatch = "recentPoints colorGreen";
                                                                                }
                                                                                return (<div key={inc} className={colorMatch}>{matches}</div>)
                                                                            }
                                                                        }) : ""
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div align="center">
                                                                    {errorMessage != "" ? '<div class="text text-danger">'+errorMessage+'</div>' : ""} 
                                                                    <div className="buttonsSet">
                                                                        <div className="buttonAction declineButton rejectButtonTooltip" onClick={() => handleSubmitChallenge(player.team_player_id)}>
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

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TeamPlayers;