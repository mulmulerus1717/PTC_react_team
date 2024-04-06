import React,{useState} from "react";
import NotificationContext from "./NotificationContext";
import TriggerToastify from "../../components/common/TriggerToastify";
import { useNavigate } from 'react-router-dom';

const NotificationState = (props) => {

    const userToken = localStorage.getItem('userToken');
    const [recordsFound, setRecordsFound] = useState(0);
    var [notificationDetails, setNotificationDetails] = useState([]);
    const [offsetListing, setOffsetListing] = useState(0);
    const navigate = useNavigate();

    const notificationListing = async (data) => {
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const notificationURL = urlkey + 'notification/';
        const response = await fetch(notificationURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + userToken
            },
            body: formBody
        });
        const json = await response.json();
        if (json !== "" && json !== undefined) {
            if (json.status) {
                setOffsetListing(offsetListing + 10);
                //append messages
                for (var inc = 0; inc < json.result.length; inc++) {
                    notificationDetails.push(json.result[inc])
                }
                setNotificationDetails(notificationDetails);

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
    
    //Notification Seen
    const notificationSeenUpdate = async (data) => {
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");
        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const notificationURL = urlkey+'notification/notification_seen';
        const response = await fetch(notificationURL,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            },
            body: formBody
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status){
                navigate(data.link);
            }
        }
    }


    return (
        <NotificationContext.Provider value={{notificationListing, notificationSeenUpdate, notificationDetails, recordsFound, offsetListing}}>
            {props.children}
        </NotificationContext.Provider>
    );
}

export default NotificationState;