import React from "react";
import capitalizeWords from '../common/CapitalizeWords';
import { useNavigate } from 'react-router-dom';
import TriggerToastify from "../../components/common/TriggerToastify";

const OpponentProfile = (props) => {
    var playerDetails = props.opponentDetails;
    const urlkey = process.env.REACT_APP_NODE_BASE_URL;
    const userToken = localStorage.getItem('userToken');
    const navigate = useNavigate();

    //Check gender from save
    var genderShow = "";
    if (playerDetails[0]['gender'] === "m") { genderShow = "Male"; }
    else if (playerDetails[0]['gender'] === "f") { genderShow = "Female"; }
    else if (playerDetails[0]['gender'] === "o") { genderShow = "Other"; }

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
                                <img src={!!playerDetails[0]['profile_img'] ? (urlkey + "images/" + playerDetails[0]['profile_img']) : "default_player.png"} className="profileImgBox" alt="playing player" />
                                <div className="playernameTshirt">
                                    <h1>{!!playerDetails[0]['firstname'] ? (capitalizeWords(playerDetails[0]['firstname'])) : ""} {!!playerDetails[0]['lastname'] ? (capitalizeWords(playerDetails[0]['lastname'])) : ""}</h1>
                                    {!!playerDetails[0]['tshirt_number'] ? (<span>TShirt No.: {playerDetails[0]['tshirt_number']}</span>) : ""}
                                </div>
                            </div>
                        </div>
                        <div className="contentProfileGredent"></div>
                        {playerDetails[0]['block'] === 0 ? <button className="btn btn-primary btn-sm" onClick={()=>block(playerDetails[0]['token_id'])}>Block</button> : ""}
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
        </>
    );
}

export default OpponentProfile;