import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import OperationContext from "../../context/common/OperationContext";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import LocationContext from "../../context/location/locationContext";
import SportsContext from "../../context/sports/SportsContext";
import ProfileContext from "../../context/profile/ProfileContext";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import LoadingBar from 'react-top-loading-bar';

const Profile = () => {

    const { authorizeUser } = useContext(AuthorizeContext);
    const { sidebarOpen } = useContext(OperationContext);
    const { getSports, sportsDetails } = useContext(SportsContext);
    const { countryDetails, getCountry, stateDetails, getState, cityDetails, getCity } = useContext(LocationContext);
    const { ProfileUser, updatePlayer, updatePlayerEmail, updatePlayerEmailOTP, updatePlayerPassword, updatePlayerAccountSetting, playerDetails, successMessage, errorMessage, successMessageEmail, errorMessageEmail, successMessagePassword, errorMessagePassword, errorMessageAccountSettings,successMessageAccountSetting, progressLoadingBar, ProfileUserSports, playerSportsDetails, emailSubmitStyle } = useContext(ProfileContext);
    const [progressTopBar, setProgressTopBar] = useState(progressLoadingBar);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    var openSidebar = "";
    if (sidebarOpen === true) { openSidebar = "toggled"; }
    const playerToken = { 'token': '' };

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        authorizeUser();//Check user authorize
        getSports();//fetch sports
        getCountry();//fetch country
        document.title = "Profile | " + websiteName;
        ProfileUser(playerToken);
        ProfileUserSports(playerToken);
    },[websiteName])

    const urlkey = process.env.REACT_APP_NODE_BASE_URL;

    const animatedComponents = makeAnimated();

    //set error
    const [errorFirstname, setErrorFirstname] = useState('');
    const [errorLastname, setErrorLastname] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorCountry, setErrorCountry] = useState('');
    const [errorState, setErrorState] = useState('');
    const [errorCity, setErrorCity] = useState('');
    const [errorSport, setErrorSport] = useState('');
    const [errorBirthday, setErrorBirthday] = useState('');
    const [errorGender, setErrorGender] = useState('');
    const [errorTshirtNumber, setErrorTshirtNumber] = useState('');
    const [errorAccountSettings, setErrorAccountSettings] = useState('');

    //Check gender from save
    var genderShow = "";
    if (playerDetails[0]['gender'] === "m") { genderShow = "Male"; }
    else if (playerDetails[0]['gender'] === "f") { genderShow = "Female"; }
    else if (playerDetails[0]['gender'] === "o") { genderShow = "Other"; }

    //Tshirt Number
    const [tshirtNumber, setTshirtNumber] = useState("");
    const tshirtNumberChange = (event) => {
        setTshirtNumber(event.target.value);
        setErrorTshirtNumber('')
    }

    //Firstname
    const [firstname, setFirstname] = useState("");
    const firtnameChange = (event) => {
        setFirstname(event.target.value);
        setErrorFirstname('')
    }

    //Lastname
    const [lastname, setLastname] = useState("");
    const lastnameChange = (event) => {
        setLastname(event.target.value);
        setErrorLastname('')
    }

    //Email
    const [email, setEmail] = useState("");
    const emailChange = (event) => {
        setEmail(event.target.value);
        setErrorEmail('')
    }

    //Email OTP
    const [email_otp, setEmail_otp] = useState("");
    const emailOTPChange = (event) => {
        setEmail_otp(event.target.value);
        setErrorEmail('')
    }

    //Password
    const [old_password, setOld_password] = useState("");
    const passwordChange = (event) => {
        setOld_password(event.target.value);
        setErrorPassword('')
    }

    //Password New
    const [new_password, setNew_password] = useState("");
    const newPasswordChange = (event) => {
        setNew_password(event.target.value);
        setErrorPassword('')
    }

    //Password Confirm
    const [confirm_password, setConfirm_password] = useState("");
    const confirmPasswordChange = (event) => {
        setConfirm_password(event.target.value);
        setErrorPassword('')
    }
    
    //Account settings
    const [account_setting, setAccount_setting] = useState("");
    const accountsChange = (event) => {
        setAccount_setting(event.target.value);
        setErrorPassword('')
    }

    //Country options
    const [selectedOptionsCountry, setSelectedOptionsCountry] = useState({});
    const countryChange = (countryOptions) => {
        setSelectedOptionsCountry(countryOptions);
        if (countryOptions.value !== '' && countryOptions.value !== undefined) { getState(countryOptions.value) }
        setErrorCountry('')
    };

    //State options
    const [selectedOptionsState, setSelectedOptionsState] = useState([]);
    const stateChange = (stateOptions) => {
        setSelectedOptionsState(stateOptions);
        if (stateOptions.value !== '' && stateOptions.value !== undefined) { getCity(stateOptions.value) }
        setErrorState('')
    };

    //City options
    const [selectedOptionsCity, setSelectedOptionsCity] = useState([]);
    const cityChange = (cityOptions) => {
        setSelectedOptionsCity(cityOptions);
        setErrorCity('')
    };

    //Sports options
    const [selectedOptionsSport, setSelectedOptionsSport] = useState([]);
    const sportChange = (sportOptions) => {
        setSelectedOptionsSport(sportOptions);
        setErrorSport('')
    };

    //Birthday
    const [birthday, setBirthday] = useState("");
    const birthdayChange = (event) => {
        setBirthday(event.target.value);
        setErrorBirthday('')
    }

    //Gender
    const genderChange = (event) => {
        setErrorGender('')
    }

    const handleSubmit = (event) => {//submit form with form data
        event.preventDefault();
        const data = new FormData(event.target);
        setProgressTopBar(30)

        const firstnameForm = data.get('firstname').trim();  // Reference by form input's `name` tag
        const lastnameForm = data.get('lastname').trim();
        const countryForm = data.get('country');
        const stateForm = data.get('state');
        const cityForm = data.get('city');
        const sportForm = data.getAll('sports[]');
        const birthdayForm = data.get('dob').trim();
        const genderForm = data.get('gender').trim();
        const tshirtNumberForm = data.get('tshirt_number').trim();

        const errorSubmit = [];

        if (firstnameForm === "" || firstnameForm === undefined) {
            setErrorFirstname("Please enter firstname")
            errorSubmit.push(1)
        }
        if (lastnameForm === "" || lastnameForm === undefined) {
            setErrorLastname("Please enter lastname")
            errorSubmit.push(1)
        }
        if (countryForm === "" || countryForm === undefined || countryForm.length < 1) {
            setErrorCountry("Please enter country")
            errorSubmit.push(1)
        }
        if (stateForm === "" || stateForm === undefined || stateForm.length < 1) {
            setErrorState("Please enter state")
            errorSubmit.push(1)
        }
        if (cityForm === "" || cityForm === undefined || cityForm.length < 1) {
            setErrorCity("Please enter city")
            errorSubmit.push(1)
        }
        if (sportForm === "" || sportForm === undefined || sportForm.length < 1) {
            setErrorSport("Please select sport")
            errorSubmit.push(1)
        }
        if (sportForm !== "" && sportForm !== undefined && sportForm.length > 5) {
            setErrorSport("Sport cannot be more than 5")
            errorSubmit.push(1)
        }
        if (birthdayForm === "" || birthdayForm === undefined) {
            setErrorBirthday("Please enter birth date")
            errorSubmit.push(1)
        }
        if (genderForm === "" || genderForm === undefined) {
            setErrorGender("Please enter gender")
            errorSubmit.push(1)
        }
        if (tshirtNumberForm !== "" && tshirtNumberForm !== 0 && tshirtNumberForm === undefined && isNaN(tshirtNumberForm) === true) {
            setErrorFirstname("Please enter Tshirt number in numbers")
            errorSubmit.push(1)
        }

        //Submit form
        if (errorSubmit !== undefined && errorSubmit.length < 1) {

            const sportsarray = [];//sports array
            for (let inc = 0; inc < sportForm.length; inc++) {
                sportsarray.push(sportForm[inc])
            }

            var formData = {
                'firstname': firstnameForm,
                'lastname': lastnameForm,
                'country_id': countryForm,
                'state_id': stateForm,
                'city_id': cityForm,
                'dob': birthdayForm,
                'gender': genderForm,
                'sports_id': sportsarray,
                'tshirt_number': tshirtNumberForm,
            };
            updatePlayer(formData);//update details by API
            ProfileUser(playerToken);//re-fetch all profile data
            setProgressTopBar(progressLoadingBar)//loading bar 
        } else {
            setProgressTopBar(100)
        }

    }

    const handleSubmitEmail = (event) => {//submit form with form data
        event.preventDefault();
        const data = new FormData(event.target);
        setProgressTopBar(30)

        const emailForm = data.get('email').trim();  // Reference by form input's `name` tag
        const errorSubmit = [];

        if (emailForm === "" || emailForm === undefined) {
            setErrorEmail("Please enter email")
            errorSubmit.push(1)
        }

        //Submit form
        if (errorSubmit !== undefined && errorSubmit.length < 1) {

            var formData = {
                'email': emailForm
            };
            updatePlayerEmail(formData);//update details by API
            setProgressTopBar(progressLoadingBar)//loading bar 
        } else {
            setProgressTopBar(100)
        }

    }

    const handleSubmitEmailOTP = (event) => {//submit form with form data
        event.preventDefault();
        const data = new FormData(event.target);
        setProgressTopBar(30)

        const emailOTPForm = data.get('email_otp').trim();  // Reference by form input's `name` tag
        const errorSubmit = [];

        if (emailOTPForm === "" || emailOTPForm === undefined) {
            setErrorEmail("Please enter email OTP")
            errorSubmit.push(1)
        }

        //Submit form
        if (errorSubmit !== undefined && errorSubmit.length < 1) {

            var formData = {
                'email': email,
                'otp': emailOTPForm
            };
            updatePlayerEmailOTP(formData);//update details by API
            ProfileUser(playerToken);//re-fetch all profile data
            setProgressTopBar(progressLoadingBar)//loading bar 
        } else {
            setProgressTopBar(100)
        }

    }

    //submit password start
    const handleSubmitPassword = (event) => {//submit form with form data
        event.preventDefault();
        const data = new FormData(event.target);
        setProgressTopBar(30)

        const old_passwordForm = data.get('old_password').trim();  // Reference by form input's `name` tag
        const new_passwordForm = data.get('new_password').trim();
        const confirm_passwordForm = data.get('confirm_password').trim();
        const errorSubmit = [];

        if (confirm_passwordForm === "" || confirm_passwordForm === undefined) {
            setErrorPassword("Please enter confirm password")
            errorSubmit.push(1)
        }

        if (new_passwordForm === "" || new_passwordForm === undefined) {
            setErrorPassword("Please enter new password")
            errorSubmit.push(1)
        }

        if (old_passwordForm === "" || old_passwordForm === undefined) {
            setErrorPassword("Please enter old password")
            errorSubmit.push(1)
        }

        //Submit form
        if (errorSubmit !== undefined && errorSubmit.length < 1) {

            var formData = {
                'old_password': old_passwordForm,
                'new_password': new_passwordForm,
                'confirm_password': confirm_passwordForm
            }
            updatePlayerPassword(formData);//update details by API
            ProfileUser(playerToken);//re-fetch all profile data
            setProgressTopBar(progressLoadingBar)//loading bar 
        } else {
            setProgressTopBar(100)
        }

    }
    //submit password ends

    const handleSubmitAccountSetting = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        setProgressTopBar(30)

        const account_setting = data.get('account_deactive').trim();
        const errorSubmit = [];

        if (account_setting === "" || account_setting === undefined) {
            setErrorAccountSettings("Please choose accounts setting")
            errorSubmit.push(1)
        }

        //Submit form
        if (errorSubmit !== undefined && errorSubmit.length < 1) {

            var formData = {
                'account_setting': account_setting
            }
            updatePlayerAccountSetting(formData);//update details by API
            setProgressTopBar(progressLoadingBar)//loading bar 
        } else {
            setProgressTopBar(100)
        }
    }

    return (
        <>
            <div className="container-fluid noMargin noPadding">
                <LoadingBar color='#f11946' height={2} shadow={true} progress={progressTopBar} onLoaderFinished={() => setProgressTopBar(0)} />
                <Navbar />
                <div id="wrapper" className={openSidebar}>
                    <Sidebar />
                    <div id="page-content-wrapper noMargin noPadding">
                        <div className="container-fluid noMargin noPadding ">
                            <br /><br />
                            <div className="containDetails">

                                <div className="profileBox">
                                    <div className="row noMargin noPadding profileTop fontStyle">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noPadding">
                                            <div align="center">
                                                <div className="membr-details-img position-relative">
                                                    <img src={!!playerDetails[0]['profile_img'] ? (urlkey + "images/" + playerDetails[0]['profile_img']) : "default_player.png"} className="profileImgBox" alt="playing player" />
                                                    <div className="playernameTshirt">
                                                        <h1>{!!playerDetails[0]['firstname'] ? (playerDetails[0]['firstname']) : ""} {!!playerDetails[0]['lastname'] ? (playerDetails[0]['lastname']) : ""}</h1>
                                                        {!!playerDetails[0]['tshirt_number'] ? (<span>TShirt No.: {playerDetails[0]['tshirt_number']}</span>) : ""}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="contentProfileGredent"></div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noPadding">
                                            <div className="playerOverview">
                                                <h4><i>Player Overview</i></h4>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td><span>{!!playerDetails[0]['matches'] ? (playerDetails[0]['matches']) : 0}</span><br />Match</td>
                                                            <td><span>{!!playerDetails[0]['won'] ? (playerDetails[0]['won']) : 0}</span><br />Won</td>
                                                        </tr>
                                                        <tr>
                                                            <td><span>{!!playerDetails[0]['draw'] ? (playerDetails[0]['draw']) : 0}</span><br />Draw</td>
                                                            <td><span>{!!playerDetails[0]['age'] ? (playerDetails[0]['age']) : 0}</span><br />Age</td>
                                                        </tr>
                                                        <tr>
                                                            <td><span>{!!playerDetails[0]['dob'] ? (playerDetails[0]['dob']) : ""}</span><br />Date of Birth</td>
                                                            <td><span>{genderShow}</span><br />Gender</td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={2}><span>{!!playerDetails[0]['sports_list'] ? (playerDetails[0]['sports_list']) : ""}</span><br />Sports</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="profileDetails fontStyle">
                                    <section className="containerForm box noPadding noVH">
                                        <header>Update Personal Details</header>
                                        <form action="#" className="form" onSubmit={handleSubmit}>
                                            <div className="signupForm">
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-box">
                                                            <input type="text" placeholder="Enter First Name" name="firstname" defaultValue={!!firstname ? (firstname) : playerDetails[0]['firstname']} onChange={firtnameChange} className="form-control" required />
                                                            {!!errorFirstname ? (<span className="text text-danger">{errorFirstname}</span>) : ""}
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-box">
                                                            <input type="text" placeholder="Enter Last Name" name="lastname" defaultValue={!!lastname ? (lastname) : playerDetails[0]['lastname']} onChange={lastnameChange} className="form-control" required />
                                                            {!!errorLastname ? (<span className="text text-danger">{errorLastname}</span>) : ""}
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-box address">
                                                            <div className="select-box">
                                                                {!!playerDetails[0]['country_id'] && playerDetails[0]['country_id'] > 0 ? <Select name="country" options={countryDetails} defaultValue={!!selectedOptionsCountry && selectedOptionsCountry.value > 0 ? selectedOptionsCountry : ({ value: playerDetails[0]['country_id'], label: playerDetails[0]['country_name'] })} placeholder="Country" onChange={countryChange} /> : ""}
                                                                {!!errorCountry ? (<span className="text text-danger">{errorCountry}</span>) : ""}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-box address">
                                                            <div className="select-box">
                                                                {!!playerDetails[0]['state_id'] && playerDetails[0]['state_id'] > 0 ? <Select name="state" options={selectedOptionsCountry.value === undefined && stateDetails.length === 0 ? getState(playerDetails[0]['country_id']) : stateDetails} defaultValue={!!selectedOptionsState && selectedOptionsState.value > 0 ? selectedOptionsState : ({ value: playerDetails[0]['state_id'], label: playerDetails[0]['state_name'] })} onChange={stateChange} placeholder="State" /> : ""}
                                                                {!!errorState ? (<span className="text text-danger">{errorState}</span>) : ""}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-box address">
                                                            <div className="select-box">
                                                                {!!playerDetails[0]['city_id'] && playerDetails[0]['city_id'] > 0 ? <Select name="city" options={selectedOptionsState.value === undefined && cityDetails.length === 0 ? getCity(playerDetails[0]['state_id']) : cityDetails} defaultValue={!!selectedOptionsCity && selectedOptionsCity.value > 0 ? selectedOptionsCity : ({ value: playerDetails[0]['city_id'], label: playerDetails[0]['city_name'] })} onChange={cityChange} placeholder="City" /> : ""}
                                                                {!!errorCity ? (<span className="text text-danger">{errorCity}</span>) : ""}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                        <div className="input-box address">
                                                            <div className="select-box">
                                                                {playerSportsDetails.length > 0 ? <Select name="sports[]" closeMenuOnSelect={false} components={animatedComponents} isMulti options={sportsDetails} defaultValue={!!selectedOptionsSport.length > 0 ? selectedOptionsSport : playerSportsDetails} onChange={sportChange} placeholder="Sports" /> : ""}
                                                                {!!errorSport ? (<span className="text text-danger">{errorSport}</span>) : ""}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-box">
                                                            <label>Birth Date</label>
                                                            <input type="date" name="dob" placeholder="Enter birth date" defaultValue={!!birthday ? birthday : playerDetails[0]['dob']} onChange={birthdayChange} className="form-control" required />
                                                            {!!errorBirthday ? (<span className="text text-danger">{errorBirthday}</span>) : ""}
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="gender-box">
                                                            <label>Gender</label>
                                                            <div className="gender-option">
                                                                <div className="gender">
                                                                    {!!playerDetails[0]['gender'] ? <input type="radio" id="check-male" name="gender" value="m" defaultChecked={playerDetails[0]['gender'] === "m"} onClick={genderChange} /> : ""}
                                                                    <label htmlFor="check-male">Male</label>
                                                                </div>
                                                                <div className="gender">
                                                                    {!!playerDetails[0]['gender'] ? <input type="radio" id="check-female" name="gender" value="f" defaultChecked={playerDetails[0]['gender'] === "f"} onClick={genderChange} /> : ""}
                                                                    <label htmlFor="check-female">Female</label>
                                                                </div>
                                                                <div className="gender">
                                                                    {!!playerDetails[0]['gender'] ? <input type="radio" id="check-other" name="gender" value="o" defaultChecked={playerDetails[0]['gender'] === "o"} onClick={genderChange} /> : ""}
                                                                    <label htmlFor="check-other">Other</label>
                                                                </div>
                                                            </div>
                                                            {!!errorGender ? (<span className="text text-danger">{errorGender}</span>) : ""}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="input-box">
                                                            <label>TShirt Number:</label>
                                                            <input type="number" placeholder="Enter Tshirt Number" name="tshirt_number" defaultValue={!!tshirtNumber ? (tshirtNumber) : playerDetails[0]['tshirt_number']} onChange={tshirtNumberChange} className="form-control" />
                                                            {!!errorTshirtNumber ? (<span className="text text-danger">{errorTshirtNumber}</span>) : ""}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        <br />
                                                        {!!errorMessage ? (<div className="alert alert-danger">{errorMessage}</div>) : ""}
                                                        {!!successMessage ? (<div className="alert alert-success">{successMessage}</div>) : ""}
                                                        <button className="btn btn-primary">Update</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </section>
                                    <br />
                                    <section className="containerForm box noPadding noVH">
                                        <header>Update Email Details</header>
                                        <div style={emailSubmitStyle}>
                                            <form action="#" className="form" onSubmit={handleSubmitEmail}>
                                                <div className="signupForm">
                                                    <div className="row">
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <div className="input-box">
                                                                <input type="email" name="email" defaultValue={!!email ? (email) : playerDetails[0]['email']} onChange={emailChange} placeholder="Enter Email Address" className="form-control" required />
                                                                {!!errorEmail ? (<span className="text text-danger">{errorEmail}</span>) : ""}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <br />
                                                            {!!errorMessageEmail ? (<div className="alert alert-danger">{errorMessageEmail}</div>) : ""}
                                                            {!!successMessageEmail ? (<div className="alert alert-success">{successMessageEmail}</div>) : ""}
                                                            <button className="btn btn-primary">Update</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div style={emailSubmitStyle.display === "none" ? { display: "block" } : { display: "none" }}>
                                            <form action="#" className="form" onSubmit={handleSubmitEmailOTP}>
                                                <div className="signupForm">
                                                    <div className="row">
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <div className="input-box">
                                                                <input type="number" name="email_otp" defaultValue={email_otp} onChange={emailOTPChange} placeholder="Enter Email OTP" className="form-control" required />
                                                                {!!errorEmail ? (<span className="text text-danger">{errorEmail}</span>) : ""}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                            <br />
                                                            {!!errorMessageEmail ? (<div className="alert alert-danger">{errorMessageEmail}</div>) : ""}
                                                            {!!successMessageEmail ? (<div className="alert alert-success">{successMessageEmail}</div>) : ""}
                                                            <button className="btn btn-primary">Update</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </section>
                                    <br />
                                    <section className="containerForm box noPadding noVH">
                                        <header>Update Password Details</header>
                                        <form action="#" className="form" onSubmit={handleSubmitPassword}>
                                            <div className="signupForm">
                                                <div className="row">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        <div className="input-box">
                                                            <input type="password" name="old_password" defaultValue={old_password} onChange={passwordChange} placeholder="Enter Old Password" className="form-control" required />
                                                        </div>
                                                        <div className="input-box">
                                                            <input type="password" name="new_password" defaultValue={new_password} onChange={newPasswordChange} placeholder="Enter New Password" className="form-control" required />
                                                        </div>
                                                        <div className="input-box">
                                                            <input type="password" name="confirm_password" defaultValue={confirm_password} onChange={confirmPasswordChange} placeholder="Enter Confirm Password" className="form-control" required />
                                                        </div>
                                                        {!!errorPassword ? (<span className="text text-danger">{errorPassword}</span>) : ""}
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        <br />
                                                        {!!errorMessagePassword ? (<div className="alert alert-danger">{errorMessagePassword}</div>) : ""}
                                                        {!!successMessagePassword ? (<div className="alert alert-success">{successMessagePassword}</div>) : ""}
                                                        <button className="btn btn-primary">Update</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </section>
                                    <br />
                                    <section className="containerForm box noPadding noVH">
                                        <header>Account settings</header>
                                        <form action="#" className="form" onSubmit={handleSubmitAccountSetting}>
                                            <div className="signupForm">
                                                <div className="row">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <label>Deactivate Account</label>
                                                        <div className="account-option">
                                                            <div className="account">
                                                                {!!playerDetails[0]['account_deactive'] ? <input type="radio" id="check-yes" name="account_deactive" value="1" defaultChecked={playerDetails[0]['account_deactive'] === "yes"} onClick={accountsChange} /> : ""}
                                                                <label htmlFor="check-yes">Yes</label>
                                                            </div>
                                                            <div className="account">
                                                                {!!playerDetails[0]['account_deactive'] ? <input type="radio" id="check-no" name="account_deactive" value="0" defaultChecked={playerDetails[0]['account_deactive'] === "no"} onClick={accountsChange} /> : ""}
                                                                <label htmlFor="check-no">No</label>
                                                            </div>
                                                        </div>
                                                        {!!errorAccountSettings ? (<span className="text text-danger">{errorAccountSettings}</span>) : ""}
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        <br />
                                                        {!!errorMessageAccountSettings ? (<div className="alert alert-danger">{errorMessageAccountSettings}</div>) : ""}
                                                        {!!successMessageAccountSetting ? (<div className="alert alert-success">{successMessageAccountSetting}</div>) : ""}
                                                        <button className="btn btn-primary">Update</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;