import React,{useState} from "react";
import OperationContext from "./OperationContext";

const OperationState = (props) => {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [totalMessages, setTotalMessages] = useState(0);
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [totalChallenges, setTotalChallenges] = useState(0);
    const userToken = localStorage.getItem('userToken');

    const OperationTriggerSidebar = async () => {
        setSidebarOpen((toggled) => !toggled);
    }

    //Messages Count
    const messageCount = async (data) => {
        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const messageURL = urlkey+'chat/message_count';
        const response = await fetch(messageURL,{
            method: 'GET',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            }
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status){
                setTotalMessages(json.result);//count messages
            }
        }
    }

    
    //Challenges Count
    const challengesCount = async (data) => {

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const challengeURL = urlkey+'search/challenges_count';
        const response = await fetch(challengeURL,{
            method: 'GET',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            }
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status){
                setTotalChallenges(json.result);//count challenges
            }
        }
    }

    
    //Notification Count
    const notificationsTotal = async (data) => {

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const notificationURL = urlkey+'notification/notification_count';
        const response = await fetch(notificationURL,{
            method: 'GET',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            }
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status){
                setTotalNotifications(json.result);//count notification
            }
        }
    }

    return (
        <OperationContext.Provider value={{OperationTriggerSidebar, messageCount, challengesCount, notificationsTotal, sidebarOpen, totalMessages, totalChallenges, totalNotifications }}>
            {props.children}
        </OperationContext.Provider>
    );

}

export default OperationState;