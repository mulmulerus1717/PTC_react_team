import React,{useState} from "react";
import ResultContext from "./ResultContext";
import TriggerToastify from "../../components/common/TriggerToastify";
import { useNavigate } from 'react-router-dom';

const ResultState = (props) => {

    const [progressLoadingBar, setProgressLoadingBar] = useState(0);
    const userToken = localStorage.getItem('userToken');
    const [recordsFound, setRecordsFound] = useState(0);
    var [resultDetails, setResultDetails] = useState([]);
    const [offsetListing, setOffsetListing] = useState(0);
    const [searchPlayerVar, setSearchPlayerVar] = useState("");
    const [popup, setPopup] = useState({ visibility: "hidden", opacity: 0 });
    const [addResultDetails, setAddResultDetails] = useState({ challenges_id: "", player_token: "", playername: "", player_profile: "", opponent_token: "", opponentname: "", opponent_profile: "" });
    const navigate = useNavigate();
    const [statusSelect, setStatusSelect] = useState("");

    const resultListing = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const chatURL = urlkey + 'result/all_result';
        const response = await fetch(chatURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + userToken
            },
            body: formBody
        });
        const json = await response.json();
        if (json !== "" && json !== undefined) {
            setProgressLoadingBar(100)
            if (json.status) {
                if (searchPlayerVar !== data.search) {
                    resultDetails = [];
                    setSearchPlayerVar(data.search);
                    setOffsetListing(10);
                } else if (statusSelect !== data.status) {
                    resultDetails = [];
                    setStatusSelect(data.status);
                    setOffsetListing(10);
                } else {
                    setOffsetListing(offsetListing + 10);
                }
                //append result
                for (var inc = 0; inc < json.result.length; inc++) {
                    resultDetails.push(json.result[inc])
                }
                setResultDetails(resultDetails);

                //total records
                setRecordsFound(json.total_records);
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

    //Add result
    const addResultAPI = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const resultUrl = urlkey + 'result/add';
        const response = await fetch(resultUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + userToken
            },
            body: formBody
        });
        const json = await response.json();
        if (json !== "" && json !== undefined) {
            setProgressLoadingBar(100);
            if (json.status) {
                hidePopup();//hide popup and set undefine variables
                //redirect to same page in 2 sec
                setTimeout(function() { navigate(0); }, 1000);
                TriggerToastify(json.message, "success");
            } else if (json.status === false) {
                if (json.errors !== undefined && json.errors.length > 0) {
                    let errorAPiMessage = "";
                    for (let inc = 0; inc < json.errors.length; inc++) {
                        if (json.errors[inc].challenge_id !== "" && json.errors[inc].challenge_id !== undefined) {
                            errorAPiMessage = json.errors[inc].challenge_id;
                        }
                        if (json.errors[inc].result !== "" && json.errors[inc].result !== undefined) {
                            errorAPiMessage = json.errors[inc].result;
                        }
                    }
                    TriggerToastify(errorAPiMessage, "error");
                } else {
                    TriggerToastify(json.message, "error");
                }
            }
        }
    }

    //hide Popup
    const hidePopup = () => {
        setAddResultDetails({ challenges_id: "", player_token: "", playername: "", player_profile: "", opponent_token: "", opponentname: "", opponent_profile: "" });//unset details
        setPopup({ visibility: "hidden", opacity: 0 });
    }

    //Show Popup
    const showPopup = (challenges_id, player_token, playername, player_profile, opponent_token, opponentname, opponent_profile) => {
        setAddResultDetails({ challenges_id: challenges_id, player_token: player_token, playername: playername, player_profile: player_profile, opponent_token: opponent_token, opponentname: opponentname, opponent_profile: opponent_profile });
        setPopup({ visibility: "visible", opacity: 1 });
    }

    return (
        <ResultContext.Provider value={{resultListing, addResultAPI, popup, hidePopup, showPopup, statusSelect, addResultDetails, resultDetails, recordsFound, offsetListing, progressLoadingBar, searchPlayerVar }}>
            {props.children}
        </ResultContext.Provider>
    );
}

export default ResultState;