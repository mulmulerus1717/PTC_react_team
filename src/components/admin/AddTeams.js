import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import OperationContext from "../../context/common/OperationContext";
import LoadingBar from 'react-top-loading-bar';
import 'tippy.js/dist/tippy.css';
import SidebarAdmin from "./SidebarAdmin";
import TriggerToastify from "../../components/common/TriggerToastify";
import NavbarAdmin from "./NavbarAdmin";

const AddTeams = () => {

    const { authorizeAdminUser } = useContext(AuthorizeContext);
    const { sidebarOpen } = useContext(OperationContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const [progressTopBar, setProgressTopBar] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const userToken = localStorage.getItem('userToken');
    const [teams, setTeams] = useState('');
    const [teamName, setTeamName] = useState('');

    //sidebar open close
    if (sidebarOpen === true) { var openSidebar = "toggled" } else { openSidebar = "" }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        authorizeAdminUser();//Check user authorize
        loadteams();
        document.title = "Add Teams | " + websiteName;
    }, [websiteName])

    //Submit challenge
    const handleSubmit = (event) => {//submit form with form data
        setErrorMessage('');
        event.preventDefault();
        const data = new FormData(event.target);
        setProgressTopBar(30)

        const teamnameForm = data.get('teamname').trim();  // Reference by form input's `name` tag
        const errorSubmit = [];

        if (teamnameForm === "" || teamnameForm === undefined) {
            setErrorMessage("Please select team name")
            errorSubmit.push(1)
        }
        
        //Submit form
        if (errorSubmit !== undefined && errorSubmit.length < 1) {

            var formDataJson = {
                'teamname': teamnameForm
            }
            addTeam(formDataJson);
        } else {
            setProgressTopBar(100)
        }
    }

    const addTeam = async (data) => {
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const loginURL = urlkey+'search/add_team';
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
                setTeamName("");
                loadteams();
            }else if(json.status === false){
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].teamname !== "" && json.errors[inc].teamname !== undefined){
                            errorAPiMessage = json.errors[inc].teamname;
                        }
                    }
                    TriggerToastify(errorAPiMessage, "error");
                }else{
                    TriggerToastify(json.message, "error");
                }
            }
        }
    }

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
                const resultTeams = json.result;
                setTeams(resultTeams);
            }
        }
    }

    
    const deleteTeam = async (team_id) => {
        if (team_id !== '' && team_id !== undefined) {
            var formBody = [];
            formBody.push('team_id' + "=" + team_id);
            formBody = formBody.join("&");
            const urlkey = process.env.REACT_APP_NODE_BASE_URL;
            const loginURL = urlkey+'search/delete_team';
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
                    loadteams();
                }
            }else{
                TriggerToastify(json.message, "error");
            }
        } 
    };

    const onInput = (e) => setTeamName(e.target.value);

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
                                        <div className="container">
                                            <br></br>
                                            <h3>Add Teams</h3>
                                            <form action="#" className="form" onSubmit={handleSubmit}>
                                                <input type="text" className="form-control" name="teamname" value={teamName} onInput={onInput} placeholder="Add Team Name" />
                                                {!!errorMessage ? (<span className="text text-danger">{errorMessage}</span>) : ""}
                                                {!!successMessage ? (<span className="text text-success">{successMessage}</span>) : ""}
                                                <br></br>
                                                <button className="btn btn-success">Add Team</button>
                                            </form>
                                        </div>
                                        <div className="container">
                                        <br></br>
                                            <div className="row noMargin">
                                            {teams.length > 0 ? (<h3>All Teams</h3>) : ""}
                                            {
                                                teams.length > 0 ? teams.map((team, i) => {
                                                    return (<div className="col-sm-3 col-xs-3 col-md-3 col-lg-3" key={i}>
                                                        <div className="card-team">
                                                            <div className="teamCard noBorder">
                                                                <div className="nameText">
                                                                    <div>{team.name}</div>
                                                                    <button className="btn btn-sm btn-danger" onClick={()=>deleteTeam(team.id)} >Delete</button>
                                                                </div>
                                                            </div>
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
            </div>
        </>
    );
}

export default AddTeams;