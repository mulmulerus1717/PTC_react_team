import React,{useState} from "react";
import MessagesContext from "./MessagesContext";
import TriggerToastify from "../../components/common/TriggerToastify";

const MessagesState = (props) => {

    const [progressLoadingBar, setProgressLoadingBar] = useState(0);
    const userToken = localStorage.getItem('userToken');
    const [recordsFound, setRecordsFound] = useState(0);
    var [messagesDetails, setMessagesDetails] = useState([]);
    const [offsetListing, setOffsetListing] = useState(0);
    const [searchteamVar, setSearchteamVar] = useState("");

    const messagesListing = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const chatURL = urlkey + 'chat/';
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
                if (searchteamVar !== data.search) {
                    messagesDetails = [];
                    setSearchteamVar(data.search);
                    setOffsetListing(10);
                } else {
                    setOffsetListing(offsetListing + 10);
                }
                //append messages
                for (var inc = 0; inc < json.result.length; inc++) {
                    messagesDetails.push(json.result[inc])
                }
                setMessagesDetails(messagesDetails);

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

    const updateMessageCount = async (data) => {
        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const messageURL = urlkey+'chat/update_message_count';
        await fetch(messageURL,{
            method: 'GET',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            }
        });
    }

    return (
        <MessagesContext.Provider value={{messagesListing, updateMessageCount, messagesDetails, recordsFound, offsetListing, progressLoadingBar, searchteamVar}}>
            {props.children}
        </MessagesContext.Provider>
    );
}

export default MessagesState;