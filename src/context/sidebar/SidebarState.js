import React,{useState} from "react";
import SidebarContext from "./SidebarContext";
import TriggerToastify from "../../components/common/TriggerToastify";

const SidebarState = (props) => {

    const [teamBasicDetails,setTeamBasicDetails] = useState([{}]);
    const userToken = localStorage.getItem('userToken');

    const BasicProfileUser = async (data) => {
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const ProfileURL = urlkey+'profile/view_profile_basic?'+formBody;
        const response = await fetch(ProfileURL,{
            method: 'GET',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            }
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status){
                setTeamBasicDetails(json.result);
            }else if(json.status === false){
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].authorization !== "" && json.errors[inc].authorization !== undefined){
                            errorAPiMessage = json.errors[inc].authorization;
                        }
                    }
                    TriggerToastify(errorAPiMessage,"error");
                }else{
                    TriggerToastify(json.message,"error");
                }
            }
        }
    }

    
    //start update profile other details
    const updateTeamOtherDetails = async (data) => {

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const updateProfileOtherUrl = urlkey+'profile';

        const response = await fetch(updateProfileOtherUrl, {
            method: 'POST',
            headers:{
            'Authorization': 'Bearer '+userToken
            },
            body: data,
        })
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status){
                TriggerToastify(json.message,"success");
            }else if(json.status === false){
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].profile_img !== "" && json.errors[inc].profile_img !== undefined){
                            errorAPiMessage = json.errors[inc].profile_img;
                        }
                    }
                    TriggerToastify(errorAPiMessage,"error");
                }else{
                    TriggerToastify(json.message,"error");
                }
            }
        }
        
    }
    //end of update profile other details

    return (
        <SidebarContext.Provider value={{BasicProfileUser,teamBasicDetails,updateTeamOtherDetails}}>
            {props.children}
        </SidebarContext.Provider>
    );

}

export default SidebarState;