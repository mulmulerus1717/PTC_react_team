import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import OperationContext from "../../context/common/OperationContext";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import SportsCity from "./SportsCity";

const SportsCityAll = () => {

    const { authorizeUser } = useContext(AuthorizeContext);
    const { sidebarOpen } = useContext(OperationContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    
    //sidebar open close
    if (sidebarOpen === true) { var openSidebar = "toggled" } else { openSidebar = "" }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        authorizeUser();//Check user authorize
        document.title = "Sports City | " + websiteName;
    },[websiteName])

    return (
        <>
            <div className="container-fluid noMargin noPadding">
                <Navbar />
                <div id="wrapper" className={openSidebar}>
                    <Sidebar />
                    <div id="page-content-wrapper noMargin noPadding ">
                        <div className="container">
                            <br /><br /><br />
                            <div className="containDetails">
                                <SportsCity />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SportsCityAll;