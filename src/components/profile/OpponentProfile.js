import React from "react";
import capitalizeWords from '../common/CapitalizeWords';
import { useNavigate } from 'react-router-dom';
import TriggerToastify from "../../components/common/TriggerToastify";

const OpponentProfile = (props) => {
    var teamDetails = props.opponentDetails;
    const urlkey = process.env.REACT_APP_NODE_BASE_URL;
    const userToken = localStorage.getItem('userToken');
    const navigate = useNavigate();

    //Check gender from save
    var genderShow = "";
    if (teamDetails[0]['gender'] === "m") { genderShow = "Male"; }
    else if (teamDetails[0]['gender'] === "f") { genderShow = "Female"; }
    else if (teamDetails[0]['gender'] === "o") { genderShow = "Other"; }
    else if (teamDetails[0]['gender'] === "b") { genderShow = "Both Male & Female"; }
    else if (teamDetails[0]['gender'] === "a") { genderShow = "All"; }

    const block = (token_id) => {
        var data = {opponent_token_id:token_id}
        unblockOpponent(data);//unblock
    }
    
    //Unblock
    const unblockOpponent = async (data) => {
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const blockURL = urlkey + 'block/add';
        const response = await fetch(blockURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + userToken
            },
            body: formBody
        });
        const json = await response.json();
        if (json !== "" && json !== undefined) {
            if (json.status) {
                //redirect to same page in 2 sec
                setTimeout(function() { navigate(0); }, 1000);
                TriggerToastify(json.message, "success");
            } else if (json.status === false) {
                if (json.errors !== undefined && json.errors.length > 0) {
                    let errorAPiMessage = "";
                    for (let inc = 0; inc < json.errors.length; inc++) {
                        if (json.errors[inc].authorization !== "" && json.errors[inc].authorization !== undefined) {
                            errorAPiMessage = json.errors[inc].authorization;
                        }
                        if (json.errors[inc].opponent_token_id !== "" && json.errors[inc].opponent_token_id !== undefined) {
                            errorAPiMessage = json.errors[inc].opponent_token_id;
                        }
                    }
                    TriggerToastify(errorAPiMessage, "error");
                } else {
                    TriggerToastify(json.message, "error");
                }
            }
        }
    }

    return (
        <>
            <div className="profileBox">
                <div className="row noMargin noPadding profileTop">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noPadding">
                        <div align="center">
                            <div className="membr-details-img position-relative">
                                <img src={!!teamDetails[0]['profile_img'] ? (urlkey + "images/" + teamDetails[0]['profile_img']) : "default_team.png"} className="profileImgBox" alt="playing team" />
                                <div className="teamnameTshirt">
                                    <h1>{!!teamDetails[0]['teamname'] ? (capitalizeWords(teamDetails[0]['teamname'])) : ""}</h1>
                                    {!!teamDetails[0]['tshirt_number'] ? (<span>TShirt No.: {teamDetails[0]['tshirt_number']}</span>) : ""}
                                </div>
                            </div>
                        </div>
                        <div className="contentProfileGredent"></div>
                        <br /><br />
                        {teamDetails[0]['block'] === 0 ? <button className="btn btn-primary btn-sm" onClick={()=>block(teamDetails[0]['token_id'])}>Block</button> : ""}
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noPadding">
                        <div className="teamOverview">
                            <h4><i>Team Overview</i></h4>
                            <table>
                                <tbody>
                                <tr>
                                    <td><span>{!!teamDetails[0]['matches'] ? (teamDetails[0]['matches']) : 0}</span><br />Match</td>
                                    <td><span>{!!teamDetails[0]['won'] ? (teamDetails[0]['won']) : 0}</span><br />Won</td>
                                </tr>
                                <tr>
                                    <td><span>{!!teamDetails[0]['draw'] ? (teamDetails[0]['draw']) : 0}</span><br />Draw</td>
                                    <td><span>{!!teamDetails[0]['team_type_name'] ? (teamDetails[0]['team_type_name']) : 0}</span><br />Team Type</td>
                                </tr>
                                <tr>
                                    <td><span>{!!teamDetails[0]['age_range_name'] ? (teamDetails[0]['age_range_name']) : 0}</span><br />Age Range</td>
                                    <td><span>{genderShow}</span><br />Gender</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}><span>{!!teamDetails[0]['sports_list'] ? (teamDetails[0]['sports_list']) : ""}</span><br />Sports</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OpponentProfile;