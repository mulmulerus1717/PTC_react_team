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

const AddPlayer = () => {

    const { authorizeAdminUser } = useContext(AuthorizeContext);
    const { sidebarOpen } = useContext(OperationContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const [progressTopBar, setProgressTopBar] = useState(0);
    const [errorMessageTeam, setErrorMessageTeam] = useState('');
    const userToken = localStorage.getItem('userToken');
    const [teamsDetails, setTeamsDetails] = useState('');
    const [resultDetails, setResultDetails] = useState('');
    const [playerName, setPlayerName] = useState('');

    //sidebar open close
    if (sidebarOpen === true) { var openSidebar = "toggled" } else { openSidebar = "" }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        authorizeAdminUser();//Check user authorize
        loadteams();
        document.title = "Add Players | " + websiteName;
    }, [websiteName])
    
    const loadteams = async () => {

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
    const handleSubmitPlayer = async (event) => {//submit form with form data
        setErrorMessageTeam('');
        event.preventDefault();
        const data = new FormData(event.target);
        setProgressTopBar(30)

        const team_idForm = data.get('team_id').trim();
        const player_nameForm = data.get('player_name').trim();  // Reference by form input's `name` tag
        const errorSubmit = [];

        if (team_idForm === "" || team_idForm === undefined) {
            setErrorMessageTeam("Please select team")
            errorSubmit.push(1)
        }

        if (player_nameForm === "" || player_nameForm === undefined) {
            setErrorMessageTeam("Please select team")
            errorSubmit.push(1)
        }
        
        //Submit form
        if (errorSubmit !== undefined && errorSubmit.length < 1) {

            var formDataJson = {
                'team_id': team_idForm,
                'player_name':player_nameForm
            }
            
            var formBody = [];
            for (var property in formDataJson) {
                var encodedKeySignup = encodeURIComponent(property);
                var encodedValueSignup = encodeURIComponent(formDataJson[property]);
                formBody.push(encodedKeySignup + "=" + encodedValueSignup);
            }
            formBody = formBody.join("&");

            const urlkey = process.env.REACT_APP_NODE_BASE_URL;
            const loginURL = urlkey+'search/add_player';
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
                    viewPlayers({"value":team_idForm});
                    setPlayerName("");
                }else if(json.status === false){
                    if(json.errors !== undefined && json.errors.length > 0){
                        let errorAPiMessage = "";
                        for(let inc=0; inc < json.errors.length; inc++){
                            if(json.errors[inc].team_id !== "" && json.errors[inc].team_id !== undefined){
                                errorAPiMessage = json.errors[inc].team_id;
                            }
                            if(json.errors[inc].player_name !== "" && json.errors[inc].player_name !== undefined){
                                errorAPiMessage = json.errors[inc].player_name;
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

    
    const viewPlayers = async (team) => {
        if (team.value !== '' && team.value !== undefined) {
            var formBody = [];
            formBody.push('team_id' + "=" + team.value);
            formBody = formBody.join("&");
            const urlkey = process.env.REACT_APP_NODE_BASE_URL;
            const loginURL = urlkey+'search/all_teams_players';
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
                    setResultDetails(json.result);
                }
            }
        } 
    };

    
    const deletePlayer = async (player_id) => {
        if (player_id !== '' && player_id !== undefined) {
            var formBody = [];
            formBody.push('player_id' + "=" + player_id);
            formBody = formBody.join("&");
            const urlkey = process.env.REACT_APP_NODE_BASE_URL;
            const loginURL = urlkey+'search/delete_player';
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
                    window.location.reload();
                }
            }else{
                TriggerToastify(json.message, "error");
            }
        } 
    };
    
    const onInput = (e) => setPlayerName(e.target.value);

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
                                            <h3>Add Players in Team</h3>
                                            <form action="#" className="form" onSubmit={handleSubmitPlayer}>
                                                <Select name="team_id" onChange={viewPlayers} options={teamsDetails}  placeholder="Select Team" /><br></br>
                                                <input type="text" className="form-control" value={playerName} onInput={onInput} name="player_name" placeholder="Player Name" />
                                                {!!errorMessageTeam ? (<span className="text text-danger">{errorMessageTeam}</span>) : ""}
                                                <br></br>
                                                <button className="btn btn-success">Add Player</button>
                                            </form>
                                        </div>
                                        
                                        <div className="container" >
                                            <br></br>
                                            {resultDetails.length > 0 ? (<h3>Team Players</h3>) : ""}
                                        {
                                            resultDetails.length > 0 ? resultDetails.map((player, i) => {
                                                return (<div key={i} style={{"marginBottom":"10px","border":"1px solid #000000","padding":"6px"}}>{i+1}. {player.name} <div style={{"float":"right","display":"inline", "margin-top":"-3px"}}><button className="btn btn-sm btn-danger" onClick={()=>deletePlayer(player.id)} >Delete</button></div></div>)
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

export default AddPlayer;