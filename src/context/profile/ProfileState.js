import React,{useState} from "react";
import ProfileContext from "./ProfileContext";
import { useNavigate } from 'react-router-dom';
import TriggerToastify from "../../components/common/TriggerToastify";

const ProfileState = (props) => {

    const [progressLoadingBar, setProgressLoadingBar] = useState(0);
    const [successMessage,setSuccessMessage] = useState("");
    const [errorMessage,setErrorMessage] = useState("");
    const [successMessageEmail,setSuccessMessageEmail] = useState("");
    const [errorMessageEmail,setErrorMessageEmail] = useState("");
    const [successMessagePassword,setSuccessMessagePassword] = useState("");
    const [successMessageAccountSetting,setSuccessMessageAccountSetting] = useState("");
    const [errorMessagePassword,setErrorMessagePassword] = useState("");
    const [errorMessageAccountSettings,setErrorMessageAccountSettings] = useState("");
    const [teamDetails,setTeamDetails] = useState([{}]);
    const [teamSportsDetails,setTeamSportsDetails] = useState([]);
    const [emailSubmitStyle, setEmailSubmitStyle] = useState({
        display:"block"
    });
    const userToken = localStorage.getItem('userToken');
    const navigate = useNavigate();

    const ProfileUser = async (data) => {
        setProgressLoadingBar(30);
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const ProfileURL = urlkey+'profile/view_profile?'+formBody;
        const response = await fetch(ProfileURL,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            }
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            setProgressLoadingBar(100)
            if(json.status){
                setTeamDetails(json.result);
            }else if(json.status === false){
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].authorization !== "" && json.errors[inc].authorization !== undefined){
                            errorAPiMessage = json.errors[inc].authorization;
                        }
                    }
                    setErrorMessage(errorAPiMessage);
                }else{
                    setErrorMessage(json.message);
                }
            }
        }
    }

    //start team sports fetch
    const ProfileUserSports = async (data) => {
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const ProfileURL = urlkey+'profile/view_profile_sports?'+formBody;
        const response = await fetch(ProfileURL,{
            method: 'GET',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            }
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status){
                var resultSport = json.result;
                let SportsArray = [];
                resultSport.map(sport => (
                    SportsArray.push({value:sport.sport_id, label:sport.name})
                ))
                setTeamSportsDetails(SportsArray);
            }
        }
    }
    //end team sports fetch

    //start update profile details
    const updateteam = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            if(property === 'sports_id'){
                for(let sportInc = 0; sportInc < data[property].length; sportInc++){
                    var encodedKey = encodeURIComponent('sport_id[]');
                    var encodedValue = encodeURIComponent(data[property][sportInc]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }
            }else{
                var encodedKeySignup = encodeURIComponent(property);
                var encodedValueSignup = encodeURIComponent(data[property]);
                formBody.push(encodedKeySignup + "=" + encodedValueSignup);
            }
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const profileUrl = urlkey+'profile/edit_profile';
        const response = await fetch(profileUrl,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            },
            body: formBody
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            setProgressLoadingBar(100)
            if(json.status){
                setErrorMessage("");
                setSuccessMessage(json.message);
                TriggerToastify(json.message,"success");
            }else if(json.status === false){
                setSuccessMessage("");
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].teamname !== "" && json.errors[inc].teamname !== undefined){
                            errorAPiMessage = json.errors[inc].teamname;
                        }
                        if(json.errors[inc].country_id !== "" && json.errors[inc].country_id !== undefined){
                            errorAPiMessage = json.errors[inc].country_id;
                        }
                        if(json.errors[inc].state_id !== "" && json.errors[inc].state_id !== undefined){
                            errorAPiMessage = json.errors[inc].state_id;
                        }
                        if(json.errors[inc].city_id !== "" && json.errors[inc].city_id !== undefined){
                            errorAPiMessage = json.errors[inc].city_id;
                        }
                        if(json.errors[inc].gender !== "" && json.errors[inc].gender !== undefined){
                            errorAPiMessage = json.errors[inc].gender;
                        }
                        if(json.errors[inc].tshirt_number !== "" && json.errors[inc].tshirt_number !== undefined){
                            errorAPiMessage = json.errors[inc].tshirt_number;
                        }
                    }
                    setErrorMessage(errorAPiMessage);
                    TriggerToastify(errorAPiMessage,"error");
                }else{
                    setErrorMessage(json.message);
                    TriggerToastify(json.message,"error");
                }
            }
        }
        
    }
    //end of update profile details

    //start update profile Email details
    const updateteamEmail = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const updateEmailUrl = urlkey+'profile/edit_profile_email';
        const response = await fetch(updateEmailUrl,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            },
            body: formBody
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            setProgressLoadingBar(100)
            if(json.status){
                setErrorMessageEmail("");
                setEmailSubmitStyle({display:"none"})
                setSuccessMessageEmail(json.message);
                TriggerToastify(json.message,"success");
            }else if(json.status === false){
                setSuccessMessageEmail("");
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].email !== "" && json.errors[inc].email !== undefined){
                            errorAPiMessage = json.errors[inc].email;
                        }
                    }
                    setErrorMessageEmail(errorAPiMessage);
                    TriggerToastify(errorAPiMessage,"error");
                }else{
                    setErrorMessageEmail(json.message);
                    TriggerToastify(json.message,"error");
                }
            }
        }
        
    }
    //end of update profile email details


    //start update profile Email OTP details
    const updateteamEmailOTP = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const updateEmailOTPUrl = urlkey+'profile/verify_profile_email';
        const response = await fetch(updateEmailOTPUrl,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            },
            body: formBody
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            setProgressLoadingBar(100)
            if(json.status){
                setErrorMessageEmail("");
                setEmailSubmitStyle({display:"block"})
                setSuccessMessageEmail(json.message);
                TriggerToastify(json.message,"success");
            }else if(json.status === false){
                setSuccessMessageEmail("");
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].email !== "" && json.errors[inc].email !== undefined){
                            errorAPiMessage = json.errors[inc].email;
                        }
                        if(json.errors[inc].otp !== "" && json.errors[inc].otp !== undefined){
                            errorAPiMessage = json.errors[inc].otp;
                        }
                    }
                    setErrorMessageEmail(errorAPiMessage);
                    TriggerToastify(errorAPiMessage,"error");
                }else{
                    setErrorMessageEmail(json.message);
                    TriggerToastify(json.message,"error");
                }
            }
        }
        
    }
    //end of update profile email OTP details

    //start update profile password details
    const updateteamPassword = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const updatePasswordUrl = urlkey+'profile/change_profile_password';
        const response = await fetch(updatePasswordUrl,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            },
            body: formBody
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            setProgressLoadingBar(100)
            if(json.status){
                setErrorMessagePassword("");
                setSuccessMessagePassword(json.message);
                TriggerToastify(json.message,"success");
                navigate("/profile");
            }else if(json.status === false){
                setSuccessMessagePassword("");
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].old_password !== "" && json.errors[inc].old_password !== undefined){
                            errorAPiMessage = json.errors[inc].old_password;
                        }
                        if(json.errors[inc].new_password !== "" && json.errors[inc].new_password !== undefined){
                            errorAPiMessage = json.errors[inc].new_password;
                        }
                        if(json.errors[inc].confirm_password !== "" && json.errors[inc].confirm_password !== undefined){
                            errorAPiMessage = json.errors[inc].confirm_password;
                        }
                    }
                    setErrorMessagePassword(errorAPiMessage);
                    TriggerToastify(errorAPiMessage,"error");
                }else{
                    setErrorMessagePassword(json.message);
                    TriggerToastify(json.message,"error");
                }
            }
        }
        
    }
    //end of update profile password details
    
    //start update profile account setting
    const updateteamAccountSetting = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const updatePasswordUrl = urlkey+'profile/change_profile_account_setting';
        const response = await fetch(updatePasswordUrl,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            },
            body: formBody
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            setProgressLoadingBar(100)
            if(json.status){
                setErrorMessageAccountSettings("");
                setSuccessMessageAccountSetting(json.message);
                TriggerToastify(json.message,"success");
                navigate("/profile");
            }else if(json.status === false){
                setSuccessMessageAccountSetting("");
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].account_setting !== "" && json.errors[inc].account_setting !== undefined){
                            errorAPiMessage = json.errors[inc].account_setting;
                        }
                    }
                    setErrorMessageAccountSettings(errorAPiMessage);
                    TriggerToastify(errorAPiMessage,"error");
                }else{
                    setErrorMessageAccountSettings(json.message);
                    TriggerToastify(json.message,"error");
                }
            }
        }
        
    }
    //end of update profile account setting

    return (
        <ProfileContext.Provider value={{ProfileUser,updateteam,updateteamEmail,updateteamEmailOTP,updateteamPassword,updateteamAccountSetting,teamDetails,successMessage,errorMessage,successMessageEmail,errorMessageEmail,errorMessagePassword,successMessagePassword,errorMessageAccountSettings,successMessageAccountSetting,progressLoadingBar,ProfileUserSports,teamSportsDetails,emailSubmitStyle}}>
            {props.children}
        </ProfileContext.Provider>
    );

}

export default ProfileState;