import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import Header from "../common/Header";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import LocationContext from "../../context/location/locationContext";
import SportsContext from "../../context/sports/SportsContext";
import SignupContext from "../../context/signup/SignupContext";
import SideImage from "../common/SideImage";
import LoadingBar from 'react-top-loading-bar';
import tippy from 'tippy.js';

const Signup = () => {

    const { unAuthorizeUser } = useContext(AuthorizeContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const {getSports,sportsDetails,errorMessageSports,successMessageSports,showPopup,popup,hidePopup,sendAddNewSports}  = useContext(SportsContext);
    const {countryDetails,getCountry,stateDetails,getState,cityDetails,getCity}  = useContext(LocationContext);
    const {saveTeam,successMessage,errorMessage,progressLoadingBar} = useContext(SignupContext);
    const [progressTopBar, setProgressTopBar] = useState(progressLoadingBar)

    useEffect(()=>{
        //eslint-disable-next-line react-hooks/exhaustive-deps
        unAuthorizeUser();//check user already login
        getSports();//fetch sports
        getCountry();//fetch country
        document.title = "Signup | " + websiteName;
    },[websiteName])

    const animatedComponents = makeAnimated();

    //Tooltip
    tippy('.addNewSportsLink', {
        content: "Add new sports or games which are not found in above list.",
        animation: 'fade',
    });

    //set error
    const [errorTeamname,setErrorTeamname] = useState('');
    const [errorTeamType,setErrorTeamType] = useState('');
    const [errorTeamAgeRange,setErrorTeamAgeRange] = useState('');
    const [errorEmail,setErrorEmail] = useState('');
    const [errorPassword,setErrorPassword] = useState('');
    const [errorCountry,setErrorCountry] = useState('');
    const [errorState,setErrorState] = useState('');
    const [errorCity,setErrorCity] = useState('');
    const [errorSport,setErrorSport] = useState('');
    const [errorBirthday,setErrorBirthday] = useState('');
    const [errorGender,setErrorGender] = useState('');

    //Firstname
    const [teamname, setTeamname] = useState("");
    const teamnameChange = (event) => {
        setTeamname(event.target.value);
        setErrorTeamname('')
    }

    //Email
    const [email, setEmail] = useState("");
    const emailChange = (event) => {
        setEmail(event.target.value);
        setErrorEmail('')
    }

    //Password
    const [password, setPassword] = useState("");
    const passwordChange = (event) => {
        setPassword(event.target.value);
        setErrorPassword('')
    }
    
    //Country options
    const [selectedOptionsCountry, setSelectedOptionsCountry] = useState([]);
    const countryChange = (countryOptions) => {
        setSelectedOptionsCountry(countryOptions);
        if(countryOptions.value !== '' && countryOptions.value !== undefined){getState(countryOptions.value)}
        setErrorCountry('')
    };

    //State options
    const [selectedOptionsState, setSelectedOptionsState] = useState([]);
    const stateChange = (stateOptions) => {
        setSelectedOptionsState(stateOptions);
        if(stateOptions.value !== '' && stateOptions.value !== undefined){getCity(stateOptions.value)}
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

    //Gender
    const [gender, setGender] = useState("m");
    const genderChange = (event) => {
        setGender(event.target.value);
        setErrorGender('')
    }

    //Team type
    const teamtype = [{value:1, label:"Local Team"},{value:2, label:"Corporate Team"},{value:3, label:"Organization Or NGO Team"},{value:4, label:"College Team"},{value:5, label:"School Team"},{value:6, label:"Other Team"}];
    const [selectedOptionsTeamType, setSelectedOptionsTeamType] = useState([]);
    const TeamTypeChange = (TeamTypeOptions) => {
        setSelectedOptionsTeamType(TeamTypeOptions);
        setErrorTeamType('')
    };

    //Team Age Range
    const teamAgeRange = [{value:1, label:"Local Team"},{value:2, label:"Corporate Team"},{value:3, label:"Organization Or NGO Team"},{value:4, label:"College Team"},{value:5, label:"School Team"},{value:6, label:"Other Team"}];
    const [selectedOptionsTeamAgeRange, setSelectedOptionsTeamAgeRange] = useState([]);
    const TeamAgeRangeChange = (TeamAgeRangeOptions) => {
        setSelectedOptionsTeamAgeRange(TeamAgeRangeOptions);
        setErrorTeamAgeRange('')
    };

    const submitSignup = () => {
        setProgressTopBar(30)
        const teamnameForm = teamname.trim();
        const emailForm = email.trim();
        const passwordForm = password.trim();
        const countryForm = selectedOptionsCountry;
        const stateForm = selectedOptionsState;
        const cityForm = selectedOptionsCity;
        const sportForm = selectedOptionsSport;
        const genderForm = gender.trim();

        const errorSubmit = [];
        
        if(teamnameForm === "" || teamnameForm === undefined){
            setErrorTeamname("Please enter teamname")
            errorSubmit.push(1)
        }
        if(emailForm === "" || emailForm === undefined){
            setErrorEmail("Please enter email")
            errorSubmit.push(1)
        }
        if(passwordForm === "" || passwordForm === undefined){
            setErrorPassword("Please enter password")
            errorSubmit.push(1)
        }
        if(countryForm === "" || countryForm === undefined || countryForm.length < 1){
            setErrorCountry("Please enter country")
            errorSubmit.push(1)
        }
        if(stateForm === "" || stateForm === undefined || stateForm.length < 1){
            setErrorState("Please enter state")
            errorSubmit.push(1)
        }
        if(cityForm === "" || cityForm === undefined || cityForm.length < 1){
            setErrorCity("Please enter city")
            errorSubmit.push(1)
        }
        if(sportForm === "" || sportForm === undefined || sportForm.length < 1){
            setErrorSport("Please select sport")
            errorSubmit.push(1)
        }
        if(sportForm !== "" && sportForm !== undefined && sportForm.length > 5){
            setErrorSport("Sport cannot be more than 5")
            errorSubmit.push(1)
        }
        if(genderForm === "" || genderForm === undefined){
            setErrorGender("Please enter gender")
            errorSubmit.push(1)
        }
        
        //Submit form
        if(typeof errorSubmit != undefined &&  errorSubmit.length < 1){

            const sportsarray = [];//sports array
            for(let inc=0; inc < sportForm.length; inc++){
                sportsarray.push(sportForm[inc].value)
            }
            
            var formData =  {
                'teamname': teamnameForm,
                'email': emailForm,
                'password': passwordForm,
                'country_id': countryForm.value,
                'state_id': stateForm.value,
                'city_id': cityForm.value,
                'gender': genderForm,
                'sports_id' : sportsarray
            };
            saveTeam(formData);
            setProgressTopBar(progressLoadingBar);
        }else{
            setProgressTopBar(100)
        }
    }
    
    //Add New Sports 
    const [sportsNew, setSportsNew] = useState("");
    const [errorSports, setErrorSports] = useState("");
    const newSportsChange = (event) => {
        setSportsNew(event.target.value);
        setErrorSports("");
    }

    //Submit forgot password
    const handleSubmitSports = () => {//submit form with form data
        setProgressTopBar(30)
        const errorSubmit = [];

        if (sportsNew === "" || sportsNew === undefined) {
            setErrorSports("Please enter new sports")
            errorSubmit.push(1)
        }

        //Submit form
        if (errorSubmit !== undefined && errorSubmit.length < 1) {

            var formData = {
                'sport': sportsNew
            }
            sendAddNewSports(formData);//update details by API
            setProgressTopBar(progressLoadingBar);
        } else {
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
                        <div align="center"><img src="playtoconquer.png" width="140" height="60" className="img-responsive" /></div><br/>
                            <header>Signup to {websiteName}</header>
                            <form action="#" className="form">
                                <div className="signupForm">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-box">
                                                <input type="text" placeholder="Enter Team Name" defaultValue={teamname} onChange={teamnameChange} className="form-control" required />
                                                {!!errorTeamname ? (<span className="text text-danger">{errorTeamname}</span>) : ""}
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-box address">
                                                <div className="select-box">
                                                    <Select options={teamtype} value={selectedOptionsTeamType} placeholder="Team Type" onChange={TeamTypeChange} />
                                                    {!!errorTeamType ? (<span className="text text-danger">{errorTeamType}</span>) : ""}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-box address">
                                                <div className="select-box">
                                                    <Select options={teamAgeRange} value={selectedOptionsTeamAgeRange} placeholder="Team Age Range" onChange={TeamAgeRangeChange} />
                                                    {!!errorTeamAgeRange ? (<span className="text text-danger">{errorTeamAgeRange}</span>) : ""}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-box">
                                                <input type="email" placeholder="Enter Email Address" defaultValue={email} onChange={emailChange} className="form-control" required />
                                                {!!errorEmail ? (<span className="text text-danger">{errorEmail}</span>) : ""}
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-box">
                                                <input type="password" placeholder="Enter New Password" defaultValue={password} onChange={passwordChange} className="form-control" required />
                                                {!!errorPassword ? (<span className="text text-danger">{errorPassword}</span>) : ""}
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-box address">
                                                <div className="select-box">
                                                    <Select options={countryDetails} value={selectedOptionsCountry} placeholder="Country" onChange={countryChange} />
                                                    {!!errorCountry ? (<span className="text text-danger">{errorCountry}</span>) : ""}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-box address">
                                                <div className="select-box">
                                                    <Select options={stateDetails} value={selectedOptionsState} onChange={stateChange} placeholder="State" />
                                                    {!!errorState ? (<span className="text text-danger">{errorState}</span>) : ""}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-box address">
                                                <div className="select-box">
                                                    <Select options={cityDetails} value={selectedOptionsCity} onChange={cityChange} placeholder="City" />
                                                    {!!errorCity ? (<span className="text text-danger">{errorCity}</span>) : ""}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            <div className="input-box address">
                                                <div className="select-box">
                                                    <Select closeMenuOnSelect={false} components={animatedComponents} isMulti options={sportsDetails} value={selectedOptionsSport} onChange={sportChange} placeholder="Sports" />
                                                    <div className="addSports" align="right"><span className="addNewSportsLink" onClick={showPopup}>Add Sports</span></div>
                                                    {!!errorSport ? (<span className="text text-danger">{errorSport}</span>) : ""}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="gender-box">
                                                <label>Team Gender</label>
                                                <div className="gender-option">
                                                    <div className="gender">
                                                        <input type="radio" id="check-male" name="gender" value="m" defaultChecked onClick={genderChange} />
                                                        <label htmlFor="check-male">Male</label>
                                                    </div>
                                                    <div className="gender">
                                                        <input type="radio" id="check-female" name="gender" value="f" onClick={genderChange} />
                                                        <label htmlFor="check-female">Female</label>
                                                    </div>
                                                    <div className="gender">
                                                        <input type="radio" id="check-both" name="gender" value="b" onClick={genderChange} />
                                                        <label htmlFor="check-both">Both</label>
                                                    </div>
                                                    <div className="gender">
                                                        <input type="radio" id="check-other" name="gender" value="o" onClick={genderChange} />
                                                        <label htmlFor="check-other">Other</label>
                                                    </div>
                                                </div>
                                                {!!errorGender ? (<span className="text text-danger">{errorGender}</span>) : ""}
                                            </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <br />
                                            {!!errorMessage ? (<div className="alert alert-danger">{errorMessage}</div>) : ""}
                                            {!!successMessage ? (<div className="alert alert-success">{successMessage}</div>) : ""}
                                            <button type="button" className="btn btn-primary" onClick={submitSignup}>Signup</button>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 linkInfo">
                                            <p>Have an account? <a href="/">Login</a></p>
                                        </div>
                                        <div><p><small>By clicking Sign Up, you agree to our <a href="/terms" target="_blank">Terms</a>, <a href="/privacy" target="_blank">Privacy Policy</a> and <a href="/cookies" target="_blank">Cookies Policy</a>. You may receive SMS notifications from us and can opt out at any time.</small></p></div>
                                    </div>
                                </div>
                            </form>
                        </section>

                        {/* Popup Start */}
                        <div id="popupAddSports" className="overlay" style={popup}>
                            <div className="popup popupAddSports">
                                <h4>Add Sports</h4>
                                <span className="close" onClick={hidePopup}>&times;</span>
                                <div className="content">
                                    <input type="text" name="new_sports" className="form-control" onChange={newSportsChange} placeholder="Add new sports" required />
                                    {!!errorMessageSports ? (<div className="alert alert-danger">{errorMessageSports}</div>) : ""}
                                    {!!successMessageSports ? (<div className="alert alert-success">{successMessageSports}</div>) : ""}
                                    {!!errorSports ? (<div className="alert alert-danger">{errorSports}</div>) : ""}
                                    <button className="btn btn-primary" onClick={handleSubmitSports}>Add</button>
                                </div>
                            </div>
                        </div>
                        {/* Popup Ends */}


                    </div>
                </div>
            </div>
        </>
    );
}

export default Signup;