import React, { useContext, useEffect, useState } from "react";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import OperationContext from "../../context/common/OperationContext";
import LoadingBar from 'react-top-loading-bar';
import 'tippy.js/dist/tippy.css';
import SidebarAdmin from "./SidebarAdmin";
import NavbarAdmin from "./NavbarAdmin";

const HomeAdmin = () => {

    const { authorizeAdminUser } = useContext(AuthorizeContext);
    const { sidebarOpen } = useContext(OperationContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const [progressTopBar, setProgressTopBar] = useState(0);
    const userToken = localStorage.getItem('userToken');
    const [totalTeams, setTotalTeams] = useState(0);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [totalMatches, setTotalMatches] = useState(0);

    //sidebar open close
    if (sidebarOpen === true) { var openSidebar = "toggled" } else { openSidebar = "" }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        authorizeAdminUser();//Check user authorize
        loadStats();
        document.title = "Dashboard | " + websiteName;
    }, [websiteName])

    const loadStats = async () => {

        const urlkey = process.env.REACT_APP_NODE_BASE_URL;
        const loginURL = urlkey+'search/admin_stats';
        const response = await fetch(loginURL,{
            method: 'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + userToken
            },
        });
        const json = await response.json();
        if(json !== "" && json !== undefined){
            if(json.status === true){
                const resultTeams = json.result;
                setTotalTeams(resultTeams[0].total_teams);
                setTotalPlayers(resultTeams[0].total_players);
                setTotalMatches(resultTeams[0].total_matches);
            }
        }
    }

    return (
        <>
            <div className="container-fluid noMargin noPadding">
                <LoadingBar color='#f11946' height={2} shadow={true} progress={progressTopBar} onLoaderFinished={() => setProgressTopBar(0)} />
                <NavbarAdmin />
                <div id="wrapper" className={openSidebar}>
                    <div id="page-content-wrapper noMargin noPadding ">
                        <div className="container-fluid noMargin noPadding ">
                            <br /><br />
                            <div className="containDetails">
                                <SidebarAdmin />
                                <div id="page-content-wrapper noMargin noPadding">
                                    <br></br>
                                    <div className="container">
                                        <h3>Dashboard</h3>
                                        <div className="row noMargin adminDashboard">
                                            <div className="col-sm-4 col-xs-12 col-md-4 col-lg-4">
                                                <a href="add_teams">
                                                    <div className="card text-white bg-primary mb-3" style={{"maxWidth": "18rem"}}>
                                                        <div className="card-header">Teams</div>
                                                        <div className="card-body">
                                                            <h5 className="card-title">{totalTeams}</h5>
                                                            <p className="card-text">Total Teams</p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div className="col-sm-4 col-xs-12 col-md-4 col-lg-4">
                                                <a href="players">
                                                    <div className="card text-white bg-secondary mb-3" style={{"maxWidth": "18rem"}}>
                                                        <div className="card-header">Players</div>
                                                        <div className="card-body">
                                                            <h5 className="card-title">{totalPlayers}</h5>
                                                            <p className="card-text">Total Players</p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            <div className="col-sm-4 col-xs-12 col-md-4 col-lg-4">
                                                <a href="view_matches">
                                                    <div className="card text-white bg-success mb-3" style={{"maxWidth": "18rem"}}>
                                                        <div className="card-header">Matches</div>
                                                        <div className="card-body">
                                                            <h5 className="card-title">{totalMatches}</h5>
                                                            <p className="card-text">Total Matches</p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
{/*                                             
                                            <div className="col-sm-3 col-xs-12 col-md-3 col-lg-3">
                                                <div className="card text-white bg-danger mb-3" style={{"maxWidth": "18rem"}}>
                                                    <div className="card-header">Header</div>
                                                    <div className="card-body">
                                                        <h5 className="card-title">Danger card title</h5>
                                                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-3 col-xs-12 col-md-3 col-lg-3">
                                                <div className="card text-dark bg-warning mb-3" style={{"maxWidth": "18rem"}}>
                                                    <div className="card-header">Header</div>
                                                    <div className="card-body">
                                                        <h5 className="card-title">Warning card title</h5>
                                                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-3 col-xs-12 col-md-3 col-lg-3">
                                                <div className="card text-dark bg-info mb-3" style={{"maxWidth": "18rem"}}>
                                                    <div className="card-header">Header</div>
                                                    <div className="card-body">
                                                        <h5 className="card-title">Info card title</h5>
                                                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-3 col-xs-12 col-md-3 col-lg-3">
                                                <div className="card text-white bg-dark mb-3" style={{"maxWidth": "18rem"}}>
                                                    <div className="card-header">Header</div>
                                                    <div className="card-body">
                                                        <h5 className="card-title">Dark card title</h5>
                                                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomeAdmin;