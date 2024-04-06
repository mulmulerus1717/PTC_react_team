import { useContext, useEffect, useState } from "react";
import OperationContext from "../../context/common/OperationContext";
import Notification from "../notification/Notification";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const Navbar = () => {

    const { OperationTriggerSidebar, messageCount, challengesCount, notificationsTotal, totalMessages, totalChallenges, totalNotifications } = useContext(OperationContext);
    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        messageCount();//message count
        challengesCount();
        notificationsTotal();
    })

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
    };

    //Tooltip
    tippy('.nav_challenges', {
        content: "Challenges",
        animation: 'fade',
    });
    
    tippy('.nav_messages', {
        content: "Messages",
        animation: 'fade',
    });
    
    tippy('.nav_results', {
        content: "Results",
        animation: 'fade',
    });

    tippy('.nav_notification', {
        content: "Notifications",
        animation: 'fade',
    });
    
    return (
        <>
            <nav className="navbar navbar-expand navbar-dark navbarTop">
                <span onClick={() => OperationTriggerSidebar()} id="menu-toggle" className="navbar-brand"><span className="material-symbols-outlined menuNavbar">menu</span></span>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample02" aria-controls="navbarsExample02" aria-expanded="false" aria-label="Toggle navigation"> <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarsExample02">
                    <a href="/home">
                        <img src="playtoconquerblack.png" className="img-responsive logoimg" alt="website logo" />
                    </a>
                    <div className="menuAlign">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item dropdown"> 
                                <a className="nav-link setPointer" onClick={handleOpen}><span className="material-symbols-outlined notifications nav_notification">notifications</span> {totalNotifications > 0 ? <span className="badge badge-danger">{totalNotifications}</span> : ""}</a> 
                                {open ? <div className="notificationBlock"><Notification /></div> : ""}
                            </li>
                            <li className="nav-item"> <a className="nav-link" href="/result"><span className="material-symbols-outlined trophy nav_results">trophy</span></a> </li>
                            <li className="nav-item"> <a className="nav-link" href="/messages"><span className="material-symbols-outlined mail nav_messages">mail</span> {totalMessages > 0 ? <span className="badge badge-danger">{totalMessages}</span> : ""}</a> </li>
                            <li className="nav-item"> <a className="nav-link" href="/challenges"><span className="material-symbols-outlined person_check nav_challenges">person_check</span> {totalChallenges > 0 ? <span className="badge badge-danger">{totalChallenges}</span> : ""}</a> </li>
                        </ul>
                    </div>
                    <form className="form-inline my-2 my-md-0"> </form>
                </div>
            </nav>
        </>
    );
}

export default Navbar;