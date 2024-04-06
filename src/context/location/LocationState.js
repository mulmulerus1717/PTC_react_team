import React,{useState} from "react";
import LocationContext from "./locationContext";

const LocationState = (props) => {

    //Fetch Country
    const countryList = [];
    const [countryDetails, setCountryDetails] = useState(countryList);
    const getCountry = async () => {
        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const countryUrl = urlkey+'location/?name=countries&id=101';
        const response = await fetch(countryUrl,{
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            }
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status === true){
                if(json.total > 0){
                    const resultCountry = json.result;
                    let CountryArray = [];
                    resultCountry.map((country) => (
                        CountryArray.push({value:country.id, label:country.name})
                    ))
                    setCountryDetails(CountryArray);
                }
            }
        }
    }

    //Fetch State
    const stateList = [];
    const [stateDetails, setStateDetails] = useState(stateList);
    const getState = async (data) => {

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const stateUrl = urlkey+'location/?name=states&id='+data;
        const response = await fetch(stateUrl,{
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            }
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status === true){
                if(json.total > 0){
                    const resultState = json.result;
                    let StateArray = [];
                    resultState.map((state) => (
                        StateArray.push({value:state.id, label:state.name})
                    ))
                    setStateDetails(StateArray);
                }
            }else{
                setStateDetails(stateList);
            }
        }
    }

    //Fetch City
    const cityList = [];
    const [cityDetails, setCityDetails] = useState(cityList);
    const getCity = async (data) => {

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const cityUrl = urlkey+'location/?name=cities&id='+data;
        const response = await fetch(cityUrl,{
            method: 'GET',
            headers:{
                'Content-Type':'application/json'
            }
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status === true){
                if(json.total > 0){
                    const resultCity = json.result;
                    let CityArray = [];
                    resultCity.map((city) => (
                        CityArray.push({value:city.id, label:city.name})
                    ))
                    setCityDetails(CityArray);
                }
            }else{
                setCityDetails(cityList);
            }
        }
    }

    return (
        <LocationContext.Provider value={{countryDetails,getCountry,stateDetails,getState,cityDetails,getCity}}>
            {props.children}
        </LocationContext.Provider>
    )
}

export default LocationState;