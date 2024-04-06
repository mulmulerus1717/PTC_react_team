import React, { useContext, useEffect, useState } from "react";
import Header from "../common/Header";
import SignupOTPContext from "../../context/signup/SignupOTPContext";
import SideImage from "../common/SideImage";
import { useSearchParams } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar'


const SignupOtp = () => {
    const [searchParams] = useSearchParams();
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const {submitOTP,successMessage,errorMessage,resendOTP,resendOTPEmailVerify,seconds,timeOutInterval,progressLoadingBar} = useContext(SignupOTPContext);
    const [urlEmail, setUrlEmail] = useState();
    const [styleCss, setStyleCss] = useState({display:'none'});
    const [styleCssResend, setStyleCssResend] = useState({display:'block',color:'blue',textDecoration: 'underline'});
    const [progressTopBar, setProgressTopBar] = useState(progressLoadingBar)

    useEffect(()=>{
        const currentParams = Object.fromEntries([...searchParams])
        resendOTPEmailVerify(currentParams.email);//check email already verify
        if(currentParams.email !== '' && currentParams.email !== undefined){
            setUrlEmail(currentParams.email);//get email id from url
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
        document.title = "Signup OTP | " + websiteName;

        //clear set interval
        if(seconds < 1){
            clearInterval(timeOutInterval);
            clearInterval(0);
            setStyleCss({display:'none'})
            setStyleCssResend({display:'block',color:'blue',textDecoration: 'underline'})
        }
        if(seconds < 30 && seconds > 0){
            setStyleCssResend({display:'none'})
            setStyleCss({display:'block'})
        }
    },[resendOTPEmailVerify,searchParams,websiteName,seconds,timeOutInterval])

    //resend OTP
    const resendOTPClick = () => {
        resendOTP(urlEmail);
    }

    const [errorOTP,setErrorOTP] = useState('');

    //OTP
    const [otp, setOTP] = useState("");
    const otpChange = (event) => {
        setOTP(event.target.value);
        setErrorOTP('')
    }

    const submitSignupOTP = () => {
        setProgressTopBar(30)//loading bar
        setErrorOTP('')//remove error

        const otpForm = otp.trim();

        const errorSubmit = [];
        
        if(otpForm === "" || otpForm === undefined){
            setErrorOTP("Please enter OTP, sent on your email")
            errorSubmit.push(1)
        }
        
        //Submit form
        if(errorSubmit !== undefined &&  errorSubmit.length < 1){
            
            var formData =  {
                'email': urlEmail,
                'otp': otpForm,
            };
            submitOTP(formData);
            setProgressTopBar(progressLoadingBar)//loading bar
        }else{
            setProgressTopBar(100)
        }
    }

    return (
        <>
            <Header />
            <div className="container-fluid noMargin noPadding backgroundDark">
            <LoadingBar color='#f11946' height={2} shadow={true} progress={progressTopBar} onLoaderFinished={() => setProgressTopBar(0)} />
                <div className="row noMargin">
                    <SideImage />
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noPadding">
                        <section className="containerForm box">
                            <header>Signup to {websiteName}</header>
                            <form action="#" className="form">
                                <div className="signupForm">
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="input-box">
                                                <input type="number" placeholder="Enter OTP Number" defaultValue={otp} onChange={otpChange} className="form-control" required />
                                                {!!errorOTP ? (<span className="text text-danger">{errorOTP}</span>) : ""}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <button type="button" className="btn btn-primary" onClick={submitSignupOTP}>Send</button>
                                            <br />
                                            {!!errorMessage ? (<><br /><div className="alert alert-danger">{errorMessage}</div></>) : ""}
                                            {!!successMessage ? (<><br /><div className="alert alert-success">{successMessage}</div></>) : ""}
                                            {!!urlEmail ? (<><br /><div><b>Note:</b> OTP sent on email <b>{urlEmail}</b></div></>) : ""}
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 linkInfo"></div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 linkInfo">
                                            <p align="right"><span style={styleCss}>Send next OTP in {seconds} seconds.</span> <span style={styleCssResend} onClick={resendOTPClick}>Want to resend OTP?</span></p>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignupOtp;