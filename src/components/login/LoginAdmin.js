import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import Header from "../common/Header";
import LoginContext from "../../context/login/LoginContext";
import SideImage from "../common/SideImage";
import LoadingBar from 'react-top-loading-bar';
import { useCookies } from 'react-cookie';

const LoginAdmin = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const { unAuthorizeUser,unAuthorizeAdminUser } = useContext(AuthorizeContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const { loginUser, successMessage, successMessageForgot, errorMessage, errorMessageForgot, progressLoadingBar, popup, hidePopup, showPopup, sendForgotPassword, enterOTP, sendChangeForgotPassword, resendOTP, seconds, timeOutInterval,loginAdminUser } = useContext(LoginContext);
    const [progressTopBar, setProgressTopBar] = useState(progressLoadingBar);

    useEffect(()=>{
        //eslint-disable-next-line react-hooks/exhaustive-deps
        unAuthorizeAdminUser();//check user already login
        document.title = "Admin Login | " + websiteName;
    },[websiteName,seconds,timeOutInterval])

    //set error
    const [errorEmail,setErrorEmail] = useState('');
    const [errorPassword,setErrorPassword] = useState('');

    //Email
    var defaultEmailAdd = "";
    if(cookies.email !== undefined && cookies.email !== null && cookies.email !== ""){
        var defaultEmailAdd = cookies.email;
    }
    const [email, setEmail] = useState(defaultEmailAdd);
    const emailChange = (event) => {
        setEmail(event.target.value);
        setErrorEmail('')
    }

    //Password
    var defaultPasswordAdd = "";
    if(cookies.password !== undefined && cookies.password !== null && cookies.password !== ""){
        var defaultPasswordAdd = cookies.password;
    }
    const [password, setPassword] = useState(defaultPasswordAdd);
    const passwordChange = (event) => {
        setPassword(event.target.value);
        setErrorPassword('')
    }

    //Remember me
    var defaultRememberAdd = "";
    if(cookies.rememberme !== undefined && cookies.rememberme !== null && cookies.rememberme !== ""){
        var defaultRememberAdd = cookies.rememberme;
    }
    const [rememberme, setRememberme] = useState(defaultRememberAdd);
    const getChckeboxValue = (event) => {
        if (event.target.checked) {
            setRememberme(1);
        } else {
            setRememberme(0);
        }
    }

    const submitLogin = () => {
        setProgressTopBar(30)//loading bar

        const emailForm = email.trim();
        var isNumber = !isNaN(password);
        var passwordForm = password;
        if(!isNumber){
            var passwordForm = password.trim();
        }

        const errorSubmit = [];

        //validations
        if(emailForm === "" || emailForm === undefined){
            setErrorEmail("Please enter email")
            errorSubmit.push(1)
        }
        if(passwordForm === "" || passwordForm === undefined){
            setErrorPassword("Please enter password")
            errorSubmit.push(1)
        }

        //Submit form
        if(typeof errorSubmit != undefined &&  errorSubmit.length < 1){
            var formData =  {
                'email': emailForm,
                'password': passwordForm
            };
            loginAdminUser(formData);

            const current = new Date();
            const nextYear = new Date();
            nextYear.setFullYear(current.getFullYear() + 1);
            if(rememberme == 1){
                setCookie('email', emailForm, { path: '/', expires: nextYear });
                setCookie('password', passwordForm, { path: '/', expires: nextYear });
                setCookie('rememberme', rememberme, { path: '/', expires: nextYear });
            }else{
                removeCookie('email',{path:'/'});
                removeCookie('password',{path:'/'});
                removeCookie('rememberme',{path:'/'});
            }

            setProgressTopBar(progressLoadingBar);
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
                        <section className="containerForm box boxDesign fontStyle">
                            <div align="center"><img src="playtoconquer.png" className="img-responsive frontlogo" /></div><br/>
                            <header>Login to {websiteName}</header>
                            <form action="#" className="form">
                                <div className="loginForm">
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="input-box">
                                                <input type="email" placeholder="Enter Email Address" defaultValue={email} onChange={emailChange} className="form-control" required />
                                                {!!errorEmail ? (<span className="text text-danger">{errorEmail}</span>) : ""}
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="input-box">
                                            <input type="password" placeholder="Enter New Password" defaultValue={password} onChange={passwordChange} className="form-control" required />
                                                {!!errorPassword ? (<span className="text text-danger">{errorPassword}</span>) : ""}
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <label><input type="checkbox" name="remember_me" value="1" defaultChecked={cookies.rememberme == 1 ? "checked" : ""} onClick={getChckeboxValue.bind(this)} /> Remember Me</label>
                                        </div>

                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <br />
                                            {!!errorMessage ? (<div className="alert alert-danger">{errorMessage}</div>) : ""}
                                            {!!successMessage ? (<div className="alert alert-success">{successMessage}</div>) : ""}
                                            <button type="button" className="btn btn-primary" onClick={submitLogin}>Login</button>
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

export default LoginAdmin;