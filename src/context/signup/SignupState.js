import React,{useState} from "react";
import SignupContext from "./SignupContext";
import { useNavigate } from 'react-router-dom';

const SignupState = (props) => {

    const [progressLoadingBar, setProgressLoadingBar] = useState(0)
    const [successMessage,setSuccessMessage] = useState();
    const [errorMessage,setErrorMessage] = useState("");
    const navigate = useNavigate();

    const saveTeam = async (data) => {
        setProgressLoadingBar(30)
        var formBody = [];
        for (var property in data) {
            if(property === 'sports_id'){
                for(let sportInc = 0; sportInc < data[property].length; sportInc++){
                    var encodedKey = encodeURIComponent('sport_id[]');
                    var encodedValue = encodeURIComponent(data[property][sportInc]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }
            }else{
                var encodedKeySignup = encodeURIComponent(property);
                var encodedValueSignup = encodeURIComponent(data[property]);
                formBody.push(encodedKeySignup + "=" + encodedValueSignup);
            }
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const signupUrl = urlkey+'signup';
        const response = await fetch(signupUrl,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body: formBody
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            setProgressLoadingBar(100)
            if(json.status){
                setSuccessMessage(json.message);
                navigate("/signup_otp?email="+data.email);
            }else if(json.status === false){
                if(json.errors !== undefined && json.errors.length > 0){
                    let errorAPiMessage = "";
                    for(let inc=0; inc < json.errors.length; inc++){
                        if(json.errors[inc].teamname !== "" && json.errors[inc].teamname !== undefined){
                            errorAPiMessage = json.errors[inc].teamname;
                        }
                        if(json.errors[inc].type !== "" && json.errors[inc].type !== undefined){
                            errorAPiMessage = json.errors[inc].type;
                        }
                        if(json.errors[inc].age_range !== "" && json.errors[inc].age_range !== undefined){
                            errorAPiMessage = json.errors[inc].age_range;
                        }
                        if(json.errors[inc].email !== "" && json.errors[inc].email !== undefined){
                            errorAPiMessage = json.errors[inc].email;
                        }
                        if(json.errors[inc].password !== "" && json.errors[inc].password !== undefined){
                            errorAPiMessage = json.errors[inc].password;
                        }
                        if(json.errors[inc].country_id !== "" && json.errors[inc].country_id !== undefined){
                            errorAPiMessage = json.errors[inc].country_id;
                        }
                        if(json.errors[inc].state_id !== "" && json.errors[inc].state_id !== undefined){
                            errorAPiMessage = json.errors[inc].state_id;
                        }
                        if(json.errors[inc].city_id !== "" && json.errors[inc].city_id !== undefined){
                            errorAPiMessage = json.errors[inc].city_id;
                        }
                        if(json.errors[inc].gender !== "" && json.errors[inc].gender !== undefined){
                            errorAPiMessage = json.errors[inc].gender;
                        }
                    }
                    setErrorMessage(errorAPiMessage);
                }else{
                    setErrorMessage(json.message)
                }
            }
        }
    }

    return (
        <SignupContext.Provider value={{saveTeam,successMessage,errorMessage,progressLoadingBar}}>
            {props.children}
        </SignupContext.Provider>
    );

}

export default SignupState;