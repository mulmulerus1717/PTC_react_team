import { useContext } from "react";
import OperationContext from "../../context/common/OperationContext";

const NavbarAdmin = () => {

    const { OperationTriggerSidebar } = useContext(OperationContext);

    return (
        <>
            <nav className="navbar navbar-expand navbar-dark navbarTop">
                <span onClick={() => OperationTriggerSidebar()} id="menu-toggle" className="navbar-brand"><span className="material-symbols-outlined menuNavbar">menu</span></span>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample02" aria-controls="navbarsExample02" aria-expanded="false" aria-label="Toggle navigation"> <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarsExample02">
                    <a href="/home_admin">
                        <img src="playtoconquerblack.png" className="img-responsive logoimg" alt="website logo" />
                    </a>
                </div>
            </nav>
        </>
    );
}

export default NavbarAdmin;