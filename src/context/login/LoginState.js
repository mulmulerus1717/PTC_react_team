import React,{useState} from "react";
import LoginContext from "./LoginContext";
import { useNavigate } from 'react-router-dom';
import TriggerToastify from "../../components/common/TriggerToastify";

const LoginState = (props) => {

    const [progressLoadingBar, setProgressLoadingBar] = useState(0)
    const [successMessage,setSuccessMessage] = useState();
    const [successMessageForgot,setSuccessMessageForgot] = useState("");
    const [errorMessage,setErrorMessage] = useState("");
    const [errorMessageForgot,setErrorMessageForgot] = useState("");
    const navigate = useNavigate();
    const [popup, setPopup] = useState({ visibility: "hidden", opacity: 0 });
    const [enterOTP, setEnterOTP] = useState({ display: 'none'});
    const [seconds, setSeconds] = useState(30);
    const [timeOutInterval, setTimeOutInterval] = useState('');

    const loginUser = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const loginURL = urlkey+'login';
        const response = await fetch(loginURL,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body: formBody
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            setProgressLoadingBar(100)
            if(json.status){
                if(json.token !== undefined && json.token !== ''){
                    localStorage.setItem('userToken', json.token)//store token
                }
                setSuccessMessage(json.message);
                navigate("/home");
            }else if(json.status === false){
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].email !== "" && json.errors[inc].email !== undefined){
                            errorAPiMessage = json.errors[inc].email;
                        }
                        if(json.errors[inc].password !== "" && json.errors[inc].password !== undefined){
                            errorAPiMessage = json.errors[inc].password;
                        }
                    }
                    setErrorMessage(errorAPiMessage);
                }else{
                    setErrorMessage(json.message)
                }
            }
        }
    }

    //forgot password
    const sendForgotPassword = async (data) => {
        setProgressLoadingBar(30)
        //set unset
        setErrorMessageForgot("");
        setSuccessMessageForgot("");
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const loginURL = urlkey+'login/forget_password';
        const response = await fetch(loginURL,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body: formBody
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            setProgressLoadingBar(100)
            if(json.status){
                setEnterOTP({ display: 'block'});
                setSuccessMessageForgot(json.message);
            }else if(json.status === false){
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].email !== "" && json.errors[inc].email !== undefined){
                            errorAPiMessage = json.errors[inc].email;
                        }
                    }
                    setErrorMessageForgot(errorAPiMessage);
                }else{
                    setErrorMessageForgot(json.message)
                }
            }
        }
    }

    //change forgot password's password
    const sendChangeForgotPassword = async (data) => {
        setProgressLoadingBar(30)
        //set unset
        setErrorMessageForgot("");
        setSuccessMessageForgot("");
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const loginURL = urlkey+'login/change_password';
        const response = await fetch(loginURL,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body: formBody
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            setProgressLoadingBar(100)
            if(json.status){
                hidePopup();//hide popup
                setSuccessMessageForgot(json.message);
                TriggerToastify(json.message,"success");
            }else if(json.status === false){
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
                    setErrorMessageForgot(errorAPiMessage);
                }else{
                    setErrorMessageForgot(json.message)
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

    const resendOTP = async (email) => {
        setSuccessMessage("");
        setErrorMessage("");
        var formBody = [];
        var encodedKeyResendOtp = encodeURIComponent('email');
        var encodedValueResendOtp = encodeURIComponent(email);
        formBody.push(encodedKeyResendOtp + "=" + encodedValueResendOtp);
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const loginUrl = urlkey+'login/otp_resend?'+formBody;
        const response = await fetch(loginUrl,{
            method: 'GET',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            }
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status){
                setSuccessMessageForgot(json.message);
                if(seconds === 0){setSeconds(30);}
                const interval = setInterval(() => {
                    setSeconds(seconds => seconds - 1);
                }, 1000);
                setTimeOutInterval(interval)
            }else if(json.status === false){
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].email !== "" && json.errors[inc].email !== undefined){
                            errorAPiMessage = json.errors[inc].email;
                        }
                    }
                    setErrorMessageForgot(errorAPiMessage);
                }else{
                    setErrorMessageForgot(json.message);
                }
            }
        }
    }


    return (
        <LoginContext.Provider value={{ loginUser, successMessage, successMessageForgot, errorMessage, errorMessageForgot, progressLoadingBar, popup, hidePopup, showPopup, sendForgotPassword, enterOTP, sendChangeForgotPassword, resendOTP, seconds, timeOutInterval }}>
            {props.children}
        </LoginContext.Provider>
    );

}

export default LoginState;