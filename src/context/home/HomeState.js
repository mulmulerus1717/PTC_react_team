import React,{useState} from "react";
import HomeContext from "./HomeContext";
import TriggerToastify from "../../components/common/TriggerToastify";

const HomeState = (props) => {

    const [progressLoadingBar, setProgressLoadingBar] = useState(0);
    const [errorMessage,setErrorMessage] = useState("");
    const [teamsDetails,setteamsDetails] = useState([{}]);
    const [teamsFound,setteamsFound] = useState("0 teams");
    const userToken = localStorage.getItem('userToken');

    const teamsProfile = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const ProfileURL = urlkey+'search';
        const response = await fetch(ProfileURL,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+userToken
            },
            body:formBody
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            setProgressLoadingBar(100)
            if(json.status){
                setteamsDetails(json.result);
                setteamsFound(json.message);
            }else if(json.status === false){
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].authorization !== "" && json.errors[inc].authorization !== undefined){
                            errorAPiMessage = json.errors[inc].authorization;
                        }
                        if(json.errors[inc].limit !== "" && json.errors[inc].limit !== undefined){
                            errorAPiMessage = json.errors[inc].limit;
                        }
                        if(json.errors[inc].offset !== "" && json.errors[inc].offset !== undefined){
                            errorAPiMessage = json.errors[inc].offset;
                        }
                    }
                    setErrorMessage(errorAPiMessage);
                    TriggerToastify(errorAPiMessage,"error");
                }else{
                    setErrorMessage(json.message);
                    TriggerToastify(json.message,"error");
                }
            }
        }
    }

    return (
        <HomeContext.Provider value={{teamsProfile,teamsDetails,teamsFound,errorMessage,progressLoadingBar}}>
            {props.children}
        </HomeContext.Provider>
    );

}

export default HomeState;