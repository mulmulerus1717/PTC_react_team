import React,{useState} from "react";
import SportsCityContext from "./SportsCityContext";
import TriggerToastify from "../../components/common/TriggerToastify";
import { useNavigate } from 'react-router-dom';

const SportsCityState = (props) => {

    const userToken = localStorage.getItem('userToken');
    const [recordsFound, setRecordsFound] = useState(0);
    var [sportsCityDetails, setSportsCityDetails] = useState([]);
    const [offsetListing, setOffsetListing] = useState(0);
    const [searchSport, setSearchSport] = useState("");
    const navigate = useNavigate();

    const sportsCityListing = async (data) => {
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const sportsCityURL = urlkey + 'search/city_sports/';
        const response = await fetch(sportsCityURL, {
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
                if (searchSport !== data.search) {
                    console.log(searchSport);
                    console.log(data.search);

                    sportsCityDetails = [];
                    setSearchSport(data.search);
                    setOffsetListing(10);
                }else{
                    setOffsetListing(offsetListing + 10);
                }
            
                //append messages
                for (var inc = 0; inc < json.result.length; inc++) {
                    sportsCityDetails.push(json.result[inc])
                }
                setSportsCityDetails(sportsCityDetails);

                //total records
                setRecordsFound(json.total_records);
            } else if (json.status === false) {
                if (json.errors !== undefined && json.errors.length > 0) {
                    let errorAPiMessage = "";
                    for (let inc = 0; inc < json.errors.length; inc++) {
                        if (json.errors[inc].authorization !== "" && json.errors[inc].authorization !== undefined) {
                            errorAPiMessage = json.errors[inc].authorization;
                        }
                        if (json.errors[inc].limit !== "" && json.errors[inc].limit !== undefined) {
                            errorAPiMessage = json.errors[inc].limit;
                        }
                        if (json.errors[inc].offset !== "" && json.errors[inc].offset !== undefined) {
                            errorAPiMessage = json.errors[inc].offset;
                        }
                    }
                    TriggerToastify(errorAPiMessage, "error");
                } 
            }
        }
    }

    
    const addSportsList = async (data) => {
        var formBody = [];
        for (var property in data) {
            var encodedKeySignup = encodeURIComponent(property);
            var encodedValueSignup = encodeURIComponent(data[property]);
            formBody.push(encodedKeySignup + "=" + encodedValueSignup);
        }
        formBody = formBody.join("&");

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const sportsCityURL = urlkey + 'search/add_sports/';
        const response = await fetch(sportsCityURL, {
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
                setTimeout(function() { navigate(0); }, 500);
                TriggerToastify(json.message, "success");
            } else if (json.status === false) {
                if (json.errors !== undefined && json.errors.length > 0) {
                    let errorAPiMessage = "";
                    for (let inc = 0; inc < json.errors.length; inc++) {
                        if (json.errors[inc].authorization !== "" && json.errors[inc].authorization !== undefined) {
                            errorAPiMessage = json.errors[inc].authorization;
                        }
                        if (json.errors[inc].sport_id !== "" && json.errors[inc].sport_id !== undefined) {
                            errorAPiMessage = json.errors[inc].sport_id;
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
        <SportsCityContext.Provider value={{sportsCityListing, addSportsList, searchSport, sportsCityDetails, recordsFound, offsetListing}}>
            {props.children}
        </SportsCityContext.Provider>
    );
}

export default SportsCityState;