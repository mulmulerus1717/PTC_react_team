import React from "react";
import AuthorizeContext from "./AuthorizeContext";
import { useNavigate } from 'react-router-dom';

const AuthorizeState = (props) => {

    const navigate = useNavigate();
    const userToken = localStorage.getItem('userToken');

    const authorizeUser = async () => {
        if(userToken === undefined || userToken === ''){
            navigate("/login");//navigate login
        }else{
            const urlkey = process.env.REACT_APP_NODE_BASE_URL;
            const loginURL = urlkey+'authorize/';
            const response = await fetch(loginURL,{
                method: 'GET',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer '+userToken
                }
            });
            const json = await response.json();
            if(json !== "" && json !== undefined){
                if(json.status === false || json.status ===undefined){
                    localStorage.removeItem('userToken');//destroy token
                    navigate("/");//navigate login
                }
            }
        }
    }

    const unAuthorizeUser = async () => {
        if(userToken !== undefined && userToken !== '' && userToken !== null){
            navigate("/home");//navigate login
        }
    }

    //start logout
    const logoutAPI = async () => {

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const logoutUrl = urlkey+'authorize/destroy';

        const response = await fetch(logoutUrl, {
            method: 'GET',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer '+userToken
                }
        })
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status){
                localStorage.removeItem('userToken');//destroy token
                navigate("/");//navigate login
            }else if(json.status === false){
                //error message
            }
        }
        
    }
    //end of logout

    //start logout
    const logoutAdminAPI = async () => {

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const logoutUrl = urlkey+'authorize/destroy_admin';

        const response = await fetch(logoutUrl, {
            method: 'GET',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer '+userToken
                }
        })
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status){
                localStorage.removeItem('userToken');//destroy token
                navigate("/admin_login");//navigate login
            }
        }
        
    }
    //end of logout
    
    const authorizeAdminUser = async () => {
        if(userToken === undefined || userToken === ''){
            navigate("/login_admin");//navigate login
        }else{
            const urlkey = process.env.REACT_APP_NODE_BASE_URL;
            const loginURL = urlkey+'authorize/admin';
            const response = await fetch(loginURL,{
                method: 'GET',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer '+userToken
                }
            });
            const json = await response.json();
            if(json !== "" && json !== undefined){
                if(json.status === false || json.status ===undefined){
                    localStorage.removeItem('userToken');//destroy token
                    navigate("/admin_login");//navigate login
                }
            }
        }
    }

    const unAuthorizeAdminUser = async () => {
        if(userToken !== undefined && userToken !== '' && userToken !== null){
            navigate("/home_admin");//navigate login
        }
    }

    return (
        <AuthorizeContext.Provider value={{authorizeUser,unAuthorizeUser,unAuthorizeAdminUser,logoutAPI,authorizeAdminUser,logoutAdminAPI}}>
            {props.children}
        </AuthorizeContext.Provider>
    );

}

export default AuthorizeState;