import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import OperationContext from "../../context/common/OperationContext";
import LoadingBar from 'react-top-loading-bar';
import 'tippy.js/dist/tippy.css';
import SidebarAdmin from "./SidebarAdmin";
import Select from 'react-select';
import capitalizeWords from '../common/CapitalizeWords';
import TriggerToastify from "../../components/common/TriggerToastify";
import NavbarAdmin from "./NavbarAdmin";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CreateMatch = () => {

    const { authorizeAdminUser } = useContext(AuthorizeContext);
    const { sidebarOpen } = useContext(OperationContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const [progressTopBar, setProgressTopBar] = useState(0);
    const [errorMessageTeamMatch, setErrorMessageTeamMatch] = useState('');
    const userToken = localStorage.getItem('userToken');
    const [teamsDetails, setTeamsDetails] = useState('');
    const [otherDetails, setOtherDetails] = useState('');

    //sidebar open close
    if (sidebarOpen === true) { var openSidebar = "toggled" } else { openSidebar = "" }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        authorizeAdminUser();//Check user authorize
        loadteams();
        document.title = "Create Match | " + websiteName;
    }, [websiteName])

    const loadteams = async (data) => {

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const loginURL = urlkey+'search/all_teams';
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
                    let TeamsArray = [];
                    resultTeams.map((team) => (
                        TeamsArray.push({value:team.id, label:capitalizeWords(team.name)})
                    ))
                    setTeamsDetails(TeamsArray);
                }
            }
        }
    }
    
    //Submit challenge
    const handleSubmitMatch = async (event) => {//submit form with form data
        event.preventDefault();
        const data = new FormData(event.target);
        setProgressTopBar(30)

        const team_idForm = data.get('team_id').trim();
        const opponent_idForm = data.get('opponent_id').trim();
        const sports_nameForm = data.get('sports_name').trim();
        const linkForm = data.get('link').trim();
        const detailsForm = otherDetails;
        const errorSubmit = [];

        if (team_idForm === "" || team_idForm === undefined) {
            setErrorMessageTeamMatch("Please select team")
            errorSubmit.push(1)
        }

        if (opponent_idForm === "" || opponent_idForm === undefined) {
            setErrorMessageTeamMatch("Please select opponent team")
            errorSubmit.push(1)
        }
        
        if (sports_nameForm === "" || sports_nameForm === undefined) {
            setErrorMessageTeamMatch("Please select sport name")
            errorSubmit.push(1)
        }

        if (linkForm === "" || linkForm === undefined) {
            setErrorMessageTeamMatch("Please select link")
            errorSubmit.push(1)
        }
        
        //Submit form
        if (errorSubmit !== undefined && errorSubmit.length < 1) {

            var formDataJson = {
                'team_id': team_idForm,
                'opponent_id':opponent_idForm,
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
            const loginURL = urlkey+'search/add_turf_matches';
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
                    setInterval(function () {window.location.reload();}, 1000);
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
                                    <div className="addPlayer">
                                    <br></br>
                                        <div className="container" align="center">
                                            <h3>Create Team Match</h3>
                                            <form action="#" className="form" onSubmit={handleSubmitMatch}>
                                                <div className="row noMargin">
                                                    <div className="col-sm-6 col-xs-12 col-md-6 col-lg-6">
                                                        <Select name="team_id" options={teamsDetails}  placeholder="Select Team" /><br></br>
                                                    </div>
                                                    <div className="col-sm-6 col-xs-12 col-md-6 col-lg-6">
                                                        <Select name="opponent_id" options={teamsDetails}  placeholder="Select Opponent Team" /><br></br>
                                                    </div>
                                                </div>
                                                <input type="text" className="form-control" name="sports_name" placeholder="Sports Name" /><br></br>
                                                <textarea name="link" className="form-control challengeBox" placeholder="Add Link"></textarea><br></br>
                                                <CKEditor
                                                editor={ ClassicEditor }
                                                name="details" 
                                                config={{placeholder: "Add other details (Like match venue, timing, etc)"}} 
                                                onChange={ ( event, editor ) => {
                                                    const data = editor.getData();
                                                    setOtherDetails(data)
                                                } }
                                            /><br></br>
                                                {!!errorMessageTeamMatch ? (<div><span className="text text-danger">{errorMessageTeamMatch}</span></div>) : ""}
                                                <button className="btn btn-success">Create Match</button>
                                            </form>
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

export default CreateMatch;