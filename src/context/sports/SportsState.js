import React,{useState} from "react";
import SportsContext from "./SportsContext";

const SportState = (props) => {
    
    const sportsList = [];

    const [sportsDetails, setSportsDetails] = useState(sportsList);
    const [popup, setPopup] = useState({ visibility: "hidden", opacity: 0 });
    const [successMessageSports,setSuccessMessageSports] = useState("");
    const [errorMessageSports,setErrorMessageSports] = useState("");

    const getSports = async () => {

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const SportUrl = urlkey+'sports';
        const response = await fetch(SportUrl,{
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            }
        });
        const json = await response.json();
        if(json !== "" && json !== "undefined"){
            if(json.status === true){
                if(json.total_record > 0){
                    const resultSport = json.result;
                    let SportsArray = [];
                    resultSport.map((sport) => (
                        SportsArray.push({value:sport.id, label:sport.name})
                    ))
                    setSportsDetails(SportsArray);
                }
            }
        }
    }

     //hide Popup
     const hidePopup = () => {
        setPopup({ visibility: "hidden", opacity: 0 });
    }

    //Show Popup
    const showPopup = () => {
        setPopup({ visibility: "visible", opacity: 1 });
    }

    //Add New Sports
    const sendAddNewSports = async (data) => {
        //set unset
        setErrorMessageSports("");
        setSuccessMessageSports("");
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const urlPlayerkey = process.env.REACT_APP_NODE_BASE_PLAYER_URL;
        const loginURL = urlkey+'sports/add_sports';
        const loginPlayerURL = urlPlayerkey+'sports/add_sports';

        /* Start Team add new sports */
        await fetch(loginPlayerURL,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body: formBody
        });
        /* End Team add new sports */

        const response = await fetch(loginURL,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body: formBody
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status){
                getSports();
                setSuccessMessageSports(json.message);
            }else if(json.status === false){
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].sport !== "" && json.errors[inc].sport !== undefined){
                            errorAPiMessage = json.errors[inc].sport;
                        }
                    }
                    setErrorMessageSports(errorAPiMessage);
                }else{
                    setErrorMessageSports(json.message);
                }
            }
        }
    }

    return (
        <SportsContext.Provider value={{getSports,sportsDetails,errorMessageSports,successMessageSports,showPopup,popup,hidePopup,sendAddNewSports}}>
            {props.children}
        </SportsContext.Provider>
    );
}

export default SportState;