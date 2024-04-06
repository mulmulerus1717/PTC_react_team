import React,{useState} from "react";
import ChatContext from "./ChatContext";
import TriggerToastify from "../../components/common/TriggerToastify";

const ChatState = (props) => {

    const [progressLoadingBar, setProgressLoadingBar] = useState(0);
    const userToken = localStorage.getItem('userToken');
    const [recordsFound, setRecordsFound] = useState(0);
    var [chatDetails, setChatDetails] = useState([]);
    const [offsetListing, setOffsetListing] = useState(0);
    const [opponentDetails, setOpponentDetails] = useState([{}]);

    const chatListing = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const chatURL = urlkey + 'chat/chat_messages';
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
                setOffsetListing(offsetListing);
                
                //append messages
                for (var inc = 0; inc < json.result.length; inc++) {
                    chatDetails.push(json.result[inc])
                }
                setChatDetails(chatDetails);

                //set opponent details
                setOpponentDetails(json.opponent_details);

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

    const updateChatCount = async (data) => {
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

    const addNewMessage = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const chatURL = urlkey + 'chat/send_messages';
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
                //listing challenges With Filters
                const listing = { 'challenge_id': data.challenge_id, 'limit': 1000000, 'offset': 0 }
                chatListing(listing);//load messages
                setOffsetListing(offsetListing);
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
                        if (json.errors[inc].message !== "" && json.errors[inc].message !== undefined) {
                            errorAPiMessage = json.errors[inc].message;
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
        <ChatContext.Provider value={{chatListing, updateChatCount, addNewMessage, chatDetails, opponentDetails, recordsFound, offsetListing, progressLoadingBar}}>
            {props.children}
        </ChatContext.Provider>
    );
}

export default ChatState;