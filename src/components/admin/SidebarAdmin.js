import React, { useContext, useEffect, useState, useRef } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import tippy from 'tippy.js';

const SidebarAdmin = () => {

    const { logoutAdminAPI } = useContext(AuthorizeContext);

    //choose the screen size 
    const handleResize = () => {
        if (window.innerWidth < 720) {
            document.getElementById("menu-toggle").click();
        } 
    }


    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        handleResize();
    },[])

    //Tooltip
    tippy('.imageInfo', {
        content: "Please provide a transparent image to enhance the user interface.",
        animation: 'fade',
    });

    const logoutAdmin = () => {
        logoutAdminAPI();//logout user
    }

    return (
        <>
            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <a href="home_admin" className="noTextDecoration"><li className="adminHref"><span className="material-symbols-outlined">home</span> Home</li></a>
                    <a href="add_teams" className="noTextDecoration"><li className="adminHref"><span className="material-symbols-outlined">group_add</span> Team</li></a>
                    <a href="add_player" className="noTextDecoration"><li className="adminHref"><span className="material-symbols-outlined">person_add</span> Players</li></a>
                    <a href="create_match" className="noTextDecoration"><li className="adminHref"><span className="material-symbols-outlined">partner_exchange</span> Create Match</li></a>
                    <a href="view_matches" className="noTextDecoration"><li className="adminHref"><span className="material-symbols-outlined">visibility</span> View Match</li></a>
                    <li className="adminHref" onClick={logoutAdmin}><span className="material-symbols-outlined">logout</span> Logout</li>
                </ul>
            </div>
        </>
    );

}

export default SidebarAdmin;