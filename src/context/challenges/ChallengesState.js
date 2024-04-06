import React,{useState} from "react";
import ChallengeContext from "./ChallengesContext";
import TriggerToastify from "../../components/common/TriggerToastify";

const ChallengeState = (props) => {

    const [progressLoadingBar, setProgressLoadingBar] = useState(0);
    const userToken = localStorage.getItem('userToken');
    const [recordsFound, setRecordsFound] = useState(0);
    var [challengeDetails, setChallengeDetails] = useState([]);
    const [offsetListing, setOffsetListing] = useState(0);

    const challengeListing = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const homeURL = urlkey + 'search/receive_challenge';
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
            setProgressLoadingBar(100)
            if (json.status) {
                //append players
                for (var inc = 0; inc < json.result.length; inc++) {
                    challengeDetails.push(json.result[inc])
                }
                setChallengeDetails(challengeDetails);
                setOffsetListing(offsetListing + 10);
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

    const challengeAccpet = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const homeURL = urlkey + 'search/accept_challenge';
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
            setProgressLoadingBar(100)
            if (json.status) {
                challengeDetails = [];
                setChallengeDetails(challengeDetails);
                const listing = { 'limit': 10, 'offset': 0 }
                challengeListing(listing);
                TriggerToastify(json.message,"success");
            } else if (json.status === false) {
                if (json.errors !== undefined && json.errors.length > 0) {
                    let errorAPiMessage = "";
                    for (let inc = 0; inc < json.errors.length; inc++) {
                        if (json.errors[inc].authorization !== "" && json.errors[inc].authorization !== undefined) {
                            errorAPiMessage = json.errors[inc].authorization;
                        }
                        if (json.errors[inc].challenge_id !== "" && json.errors[inc].challenge_id !== undefined) {
                            errorAPiMessage = json.errors[inc].challenge_id;
                        }
                    }
                    TriggerToastify(errorAPiMessage, "error");
                } else {
                    TriggerToastify(json.message, "error");
                }
            }
        }
    }

    const challengeReject = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const searchURL = urlkey + 'search/reject_challenge';
        const response = await fetch(searchURL, {
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
                challengeDetails = [];
                setChallengeDetails(challengeDetails);
                const listing = { 'limit': 10, 'offset': 0 }
                challengeListing(listing);
                TriggerToastify(json.message,"success");
            } else if (json.status === false) {
                if (json.errors !== undefined && json.errors.length > 0) {
                    let errorAPiMessage = "";
                    for (let inc = 0; inc < json.errors.length; inc++) {
                        if (json.errors[inc].authorization !== "" && json.errors[inc].authorization !== undefined) {
                            errorAPiMessage = json.errors[inc].authorization;
                        }
                        if (json.errors[inc].challenge_id !== "" && json.errors[inc].challenge_id !== undefined) {
                            errorAPiMessage = json.errors[inc].challenge_id;
                        }
                    }
                    TriggerToastify(errorAPiMessage, "error");
                } else {
                    TriggerToastify(json.message, "error");
                }
            }
        }
    }

    const updateChallengesCount = async (data) => {
        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const challengeURL = urlkey+'search/update_challenges_count';
        await fetch(challengeURL,{
            method: 'GET',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            }
        });
    }

    return (
        <ChallengeContext.Provider value={{ challengeListing, challengeAccpet, challengeReject, updateChallengesCount, challengeDetails, recordsFound, offsetListing, progressLoadingBar }}>
            {props.children}
        </ChallengeContext.Provider>
    );
}

export default ChallengeState;