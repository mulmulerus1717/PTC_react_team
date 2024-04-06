import React,{useState} from "react";
import SignupOTPContext from "./SignupOTPContext";
import { useNavigate } from 'react-router-dom';

const SignupOTPState = (props) => {

    const [progressLoadingBar, setProgressLoadingBar] = useState(0)
    const [successMessage,setSuccessMessage] = useState('');
    const [errorMessage,setErrorMessage] = useState("");
    const [timeOutInterval, setTimeOutInterval] = useState('');
    const [seconds, setSeconds] = useState(30);
    const navigate = useNavigate();

    const resendOTP = async (email) => {
        var formBody = [];
        var encodedKeyResendOtp = encodeURIComponent('email');
        var encodedValueResendOtp = encodeURIComponent(email);
        formBody.push(encodedKeyResendOtp + "=" + encodedValueResendOtp);
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const signupUrl = urlkey+'signup/otp_resend?'+formBody;
        const response = await fetch(signupUrl,{
            method: 'GET',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            }
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status){
                setSuccessMessage(json.message);
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
                    setErrorMessage(errorAPiMessage);
                }else{
                    setErrorMessage(json.message)
                }
            }
        }
    }

    const resendOTPEmailVerify = async (email) => {
        var formBody = [];
        var encodedKeyResendOtp = encodeURIComponent('email');
        var encodedValueResendOtp = encodeURIComponent(email);
        formBody.push(encodedKeyResendOtp + "=" + encodedValueResendOtp);
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const signupUrl = urlkey+'signup/otp_resend_email_verify?'+formBody;
        const response = await fetch(signupUrl,{
            method: 'GET',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            }
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.redirect === 1){
                navigate("/");
            }
        }
    }

    const submitOTP = async (data) => {
        setProgressLoadingBar(40)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const signupOtpUrl = urlkey+'signup/otp_verification?'+formBody;
        const response = await fetch(signupOtpUrl,{
            method: 'GET',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            }
        });
        const json = await response.json();
        if(json !== "" && json !== "undefined"){
            setProgressLoadingBar(100)
            if(json.status){
                setSuccessMessage(json.message);
                navigate("/");
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
                    setErrorMessage(errorAPiMessage);
                }else{
                    setErrorMessage(json.message)
                }
            }
        }
    }

    return (
        <SignupOTPContext.Provider value={{submitOTP,successMessage,errorMessage,resendOTP,resendOTPEmailVerify,seconds,timeOutInterval,progressLoadingBar}}>
            {props.children}
        </SignupOTPContext.Provider>
    );

}

export default SignupOTPState;