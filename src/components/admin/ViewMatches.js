import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import OperationContext from "../../context/common/OperationContext";
import LoadingBar from 'react-top-loading-bar';
import 'tippy.js/dist/tippy.css';
import SidebarAdmin from "./SidebarAdmin";
import capitalizeWords from '../common/CapitalizeWords';
import dateFormat from 'dateformat';
import TriggerToastify from "../../components/common/TriggerToastify";
import NavbarAdmin from "./NavbarAdmin";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const ViewMatches = () => {

    const { authorizeAdminUser } = useContext(AuthorizeContext);
    const { sidebarOpen } = useContext(OperationContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const [progressTopBar, setProgressTopBar] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const userToken = localStorage.getItem('userToken');
    const [teamsMatches, setTeamsMatches] = useState('');
    const [otherDetails, setOtherDetails] = useState('');

    //sidebar open close
    if (sidebarOpen === true) { var openSidebar = "toggled" } else { openSidebar = "" }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        authorizeAdminUser();//Check user authorize
        loadTeamsMatches();
        document.title = "View Matches | " + websiteName;
    }, [websiteName])

    
    const loadTeamsMatches = async () => {
        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const loginURL = urlkey+'search/all_matches';
        const response = await fetch(loginURL,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + userToken
            },
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status === true){
                if(json.total > 0){
                    const resultTeams = json.result;
                    setTeamsMatches(resultTeams);
                }
            }
        }
    }

    //Submit challenge
    const handleSubmitSave = async (event) => {//submit form with form data
        setErrorMessage('');
        event.preventDefault();
        const data = new FormData(event.target);
        setProgressTopBar(30)

        console.log(data.get('details'));
        const match_idForm = data.get('match_id').trim();
        const winner_nameForm = data.get('winner_name');
        const sports_nameForm = data.get('sport_name').trim();
        const linkForm = data.get('link').trim();
        const detailsForm = data.get('details');
        const errorSubmit = [];

        if (match_idForm === "" || match_idForm === undefined) {
            setErrorMessage("Please enter match id")
            errorSubmit.push(1)
        }
        
        if (sports_nameForm === "" || sports_nameForm === undefined) {
            setErrorMessage("Please select sport name")
            errorSubmit.push(1)
        }

        if (linkForm === "" || linkForm === undefined) {
            setErrorMessage("Please select link")
            errorSubmit.push(1)
        }
        
        //Submit form
        if (errorSubmit !== undefined && errorSubmit.length < 1) {

            var formDataJson = {
                'match_id': match_idForm,
                'winner_id': winner_nameForm,
                'sports_name':sports_nameForm,
                'link':linkForm,
                'details':detailsForm
            }
            
            var formBody = [];
            for (var property in formDataJson) {
                var encodedKeySignup = encodeURIComponent(property);
                var encodedValueSignup = encodeURIComponent(formDataJson[property]);
                formBody.push(encodedKeySignup + "=" + encodedValueSignup);
            }
            formBody = formBody.join("&");

            const urlkey = process.env.REACT_APP_NODE_BASE_URL;
            const loginURL = urlkey+'search/update_turf_matches';
            const response = await fetch(loginURL,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + userToken
                },
                body: formBody
            });
            const json = await response.json();
            if(json !== "" && json !== undefined){
                if(json.status){
                    setProgressTopBar(100)
                    TriggerToastify(json.message, "success");
                }else if(json.status === false){
                    if(json.errors !== undefined && json.errors.length > 0){
                        let errorAPiMessage = "";
                        for(let inc=0; inc < json.errors.length; inc++){
                            if(json.errors[inc].team_id !== "" && json.errors[inc].team_id !== undefined){
                                errorAPiMessage = json.errors[inc].team_id;
                            }
                        }
                        TriggerToastify(errorAPiMessage, "error");
                    }else{
                        TriggerToastify(json.message, "error");
                    }
                }
            }
        } else {
            setProgressTopBar(100)
        }
    }
    
    const deleteMatch = async (match_id) => {
        if (match_id !== '' && match_id !== undefined) {
            var formBody = [];
            formBody.push('match_id' + "=" + match_id);
            formBody = formBody.join("&");
            const urlkey = process.env.REACT_APP_NODE_BASE_URL;
            const loginURL = urlkey+'search/delete_match';
            const response = await fetch(loginURL,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + userToken
                },
                body: formBody
            });
            const json = await response.json();
            if(json !== "" && json !== undefined){
                if(json.status){
                    TriggerToastify(json.message, "success");
                    loadTeamsMatches();
                }
            }
        } 
    };

    return (
        <>
            <div className="container-fluid noMargin noPadding">
                <LoadingBar color='#f11946' height={2} shadow={true} progress={progressTopBar} onLoaderFinished={() => setProgressTopBar(0)} />
                <NavbarAdmin />
                <div id="wrapper" className={openSidebar}>
                    <div id="page-content-wrapper noMargin noPadding ">
                        <div className="container-fluid noMargin noPadding ">
                            <br /><br />
                            <div className="containDetails">
                                <SidebarAdmin />
                                <div id="page-content-wrapper noMargin noPadding">
                                    <br></br>
                                    <div className="container" align="center">
                                        <h3>View all matches</h3>
                                            <div className="row nomargin">
                                            {
                                                teamsMatches.length > 0 ? teamsMatches.map((team, i) => {
                                                    let defualtTeam = team.winner_id === team.team_id ? "checked" : "";
                                                    let defualtOpponentTeam = team.winner_id === team.opponent_id ? "checked" : "";
                                                    return (<div className="col-sm-4 col-xs-4 col-md-4 col-lg-4" key={i}>
                                                                <div className="card-result">
                                                                    <div className="pointerScore">{team.sport_name}</div>
                                                                    <div className="scoreCard">
                                                                        <div className="nameText fontStyle">{capitalizeWords(team.team_name)}</div>
                                                                        <div className="scoreAlign"><img src="vsIcon.png" className="img-responsive vsScore" alt="vs icon" /></div>
                                                                        <div className="nameText fontStyle">{capitalizeWords(team.opponent_team_name)}</div>
                                                                    </div>
                                                                    <div><small><b>Stream Link:</b> <br></br><a href={"https://team.playtoconquer.com/live_result?challenge_id="+ team.match_id + ""} target="_blank">https://team.playtoconquer.com/live_result?challenge_id={team.match_id}</a></small></div>
                                                                    <form action="#" className="form" onSubmit={handleSubmitSave}>
                                                                        <input type="hidden" name="details" value={otherDetails} />
                                                                        <div className="container">
                                                                            <div className="scoreCard" style={{"textAlign":"left"}}>
                                                                                <div className="scoreResult" style={{"textAlign":"left"}}>
                                                                                    <div className="matchText text"><b>Match Details:</b><br></br></div>
                                                                                    <CKEditor
                                                                                        editor={ ClassicEditor }
                                                                                        data={team.details}
                                                                                        config={{placeholder: "Add other details (Like match venue, timing, etc)"}} 
                                                                                        onChange={ ( event, editor ) => {
                                                                                            const data = editor.getData();
                                                                                            setOtherDetails(data)
                                                                                        } }
                                                                                        onReady={ editor => {
                                                                                            setOtherDetails(team.details)
                                                                                        } }
                                                                                    /><br></br>
                                                                                    <small><b>{dateFormat(team.date, "dd-mm-yyyy hh:mm TT")}</b></small>
                                                                                </div>
                                                                            </div>

                                                                            <div align="center" className="pointerResult">Result</div>
                                                                            <div className="scoreCard" style={{"fontSize":"12px"}}>
                                                                                <div><input type="radio" name="winner_name" defaultChecked={defualtTeam} value={team.team_id} />&nbsp;<b>{capitalizeWords(team.team_name)}</b></div>&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                <div><input type="radio" name="winner_name" defaultChecked={defualtOpponentTeam} value={team.team_opponent_id} />&nbsp;<b>{capitalizeWords(team.opponent_team_name)}</b></div>
                                                                            </div>

                                                                            <div align="center" className="pointerResult">Stream Details</div>
                                                                            <div className="scoreCard">
                                                                                <input type="hidden" name="match_id" value={team.match_id} />
                                                                                <input type="text" name="link" defaultValue={team.link} className="form-control" />
                                                                            </div>

                                                                            <div align="center" className="pointerResult">Sports</div>
                                                                            <div className="scoreCard">
                                                                                <input type="text" name="sport_name" defaultValue={team.sport_name} className="form-control" />
                                                                            </div>
                                                                            <br></br>
                                                                            {!!errorMessage ? (<span className="text text-danger">{errorMessage}</span>) : ""}
                                                                            <button className="btn btn-success">Save</button>&nbsp;&nbsp;
                                                                            <button className="btn btn-danger" onClick={()=>deleteMatch(team.match_id)}>Delete</button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>)
                                                }) : ""
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ViewMatches;