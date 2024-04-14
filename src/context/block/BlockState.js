import React,{useState} from "react";
import BlockContext from "./BlockContext";
import TriggerToastify from "../../components/common/TriggerToastify";
import { useNavigate } from 'react-router-dom';

const BlockState = (props) => {

    const [progressLoadingBar, setProgressLoadingBar] = useState(0);
    const userToken = localStorage.getItem('userToken');
    const [recordsFound, setRecordsFound] = useState(0);
    var [blockDetails, setBlockDetails] = useState([]);
    const [offsetListing, setOffsetListing] = useState(0);
    const [searchTeamVar, setSearchTeamVar] = useState("");
    const navigate = useNavigate();

    const blockListing = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const blockURL = urlkey + 'block/';
        const response = await fetch(blockURL, {
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
                if (searchTeamVar !== data.search) {
                    blockDetails = [];
                    setSearchTeamVar(data.search);
                    setOffsetListing(10);
                } else {
                    setOffsetListing(offsetListing + 10);
                }
                //append messages
                for (var inc = 0; inc < json.result.length; inc++) {
                    blockDetails.push(json.result[inc]);
                }
                setBlockDetails(blockDetails);
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
    
    //Unblock
    const unblockOpponent = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const blockURL = urlkey + 'block/unblock';
        const response = await fetch(blockURL, {
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
                //redirect to same page in 2 sec
                setTimeout(function() { navigate(0); }, 1000);
                TriggerToastify(json.message, "success");
            } else if (json.status === false) {
                if (json.errors !== undefined && json.errors.length > 0) {
                    let errorAPiMessage = "";
                    for (let inc = 0; inc < json.errors.length; inc++) {
                        if (json.errors[inc].authorization !== "" && json.errors[inc].authorization !== undefined) {
                            errorAPiMessage = json.errors[inc].authorization;
                        }
                        if (json.errors[inc].opponent_token_id !== "" && json.errors[inc].opponent_token_id !== undefined) {
                            errorAPiMessage = json.errors[inc].opponent_token_id;
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
        <BlockContext.Provider value={{blockListing, unblockOpponent, blockDetails, recordsFound, offsetListing, progressLoadingBar, searchTeamVar}}>
            {props.children}
        </BlockContext.Provider>
    );
}

export default BlockState;