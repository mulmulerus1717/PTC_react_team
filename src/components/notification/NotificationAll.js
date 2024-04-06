import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import OperationContext from "../../context/common/OperationContext";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import Notification from "./Notification";

const NotificationAll = () => {

    const { authorizeUser } = useContext(AuthorizeContext);
    const { sidebarOpen } = useContext(OperationContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    
    //sidebar open close
    if (sidebarOpen === true) { var openSidebar = "toggled" } else { openSidebar = "" }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        authorizeUser();//Check user authorize
        document.title = "Notification | " + websiteName;
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
                                <Notification />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NotificationAll;