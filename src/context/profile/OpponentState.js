import React, { useState } from "react";
import OpponentContext from "./OpponentContext";

const OpponentState = (props) => {

    const userToken = localStorage.getItem('userToken');
    const [opponentTeamDetails, setOpponentTeamDetails] = useState([{}]);
    const [popupProfile, setPopupProfile] = useState({ visibility: "hidden", opacity: 0, display:"none" });

    const OpponentUser = async (data) => {
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const ProfileURL = urlkey+'profile/view_profile';
        const response = await fetch(ProfileURL,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            },
            body: formBody,
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status){
                setOpponentTeamDetails(json.result);
            }else if(json.status === false){
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].authorization !== "" && json.errors[inc].authorization !== undefined){
                            errorAPiMessage = json.errors[inc].authorization;
                        }
                    }
                }
            }
        }
    }

    //hide Popup
    const opponentPopup = () => {
        setPopupProfile({ visibility: "hidden", opacity: 0, display:"none" });
    }

    //Show Popup
    const opponentPopupShow = (token) => {
        var data = {token_id : token}
        OpponentUser(data);//set Team token for API fetch
        setPopupProfile({ visibility: "visible", opacity: 1, display:"block" });
    }

    return (
        <OpponentContext.Provider value={{opponentTeamDetails, popupProfile, opponentPopup, opponentPopupShow}}>
            {props.children}
        </OpponentContext.Provider>
    );

}

export default OpponentState;