import React, { useContext, useEffect, useState, useRef } from "react";
import SidebarContext from "../../context/sidebar/SidebarContext";
import AuthorizeContext from "../../context/common/AuthorizeContext";
import TriggerToastify from "./TriggerToastify";
import tippy from 'tippy.js';

const Sidebar = () => {

    const { logoutAPI } = useContext(AuthorizeContext);

    const { BasicProfileUser,playerBasicDetails,updatePlayerOtherDetails } = useContext(SidebarContext);
    const playerToken = { 'token': '' };
    const inputFileRef = useRef( null );
    const formFileRef = useRef( null );

    //choose the screen size 
    const handleResize = () => {
        if (window.innerWidth < 720) {
            document.getElementById("menu-toggle").click();
        } 
    }


    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        BasicProfileUser(playerToken);
        handleResize();
    },[])

    //Tooltip
    tippy('.imageInfo', {
        content: "Please provide a transparent image to enhance the user interface.",
        animation: 'fade',
    });

    const urlkey = process.env.REACT_APP_NODE_BASE_URL;

    //profile image upload
    const [fileProfileImage, setFileProfileImage] = useState({ preview: '', data: '' });
    function profileImageChange(e) {
        var profileImageDetails = e.target.files;
        var profileImageType = profileImageDetails[0].type;
        if (profileImageType === 'image/png' || profileImageType === 'image/jpg' || profileImageType === 'image/jpeg') {
            if(e.target.files[0] !== ""){
                setFileProfileImage(
                    {
                        preview: URL.createObjectURL(e.target.files[0]),
                        data: e.target.files[0],
                    }
                );
                setTimeout(() => {
                    formFileRef.current.click();
                }, 1000);
            }
        } else {
            TriggerToastify("Image type must be png,jpg,jpeg!","error");
        }
    }

    //upload profile picture
    const handleSubmitProfileImage = async (e) => {
        e.preventDefault()
        let formData = new FormData()
        formData.append('file', fileProfileImage.data)
        const errorSubmit = [];
        //Submit form
        if (errorSubmit !== undefined && errorSubmit.length < 1) {
            updatePlayerOtherDetails(formData);//update details by API 
            setTimeout(() => {
                BasicProfileUser(playerToken);//re-fetch all profile data
            }, 2000);
        }
    }

    const onBtnClick = () => {
        /*Collecting node-element and performing click*/
        inputFileRef.current.click();
    } 

    const logout = () => {
        logoutAPI();//logout user
    }

    return (
        <>
            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <br /><br /><br />
                    <li>
                        <div align="center">
                            <div className="profileImgOuterCover">
                                <span className="material-symbols-outlined imageInfo">info</span>
                                <img src={!!playerBasicDetails[0]['profile_img'] ? (urlkey + "images/" + playerBasicDetails[0]['profile_img']) : "default_player.png"} className="img-responsive profileimg" alt="player profile" />
                                <div className="uploadImage" onClick={onBtnClick}>
                                    <div align="center">
                                        <span className="material-symbols-outlined">add_a_photo</span>
                                    </div>
                                </div>
                                <form action="#" method="post" className="form" onSubmit={handleSubmitProfileImage} encType="multipart/form-data">
                                <input type='file' name='file' ref={inputFileRef} onChange={profileImageChange} style={{display:'none'}} accept="image/*" /> 
                                <button type="submit" ref={formFileRef} className="btn btn-primary" style={{display:'none'}}>Update</button>
                                </form>
                            </div>
                            <div className="profileName noHref noPointer" style={{ textTransform: 'capitalize' }}>{!!playerBasicDetails[0]['firstname'] ? playerBasicDetails[0]['firstname'] : ""} {!!playerBasicDetails[0]['lastname'] ? playerBasicDetails[0]['lastname'] : ""}</div>
                        </div>
                    </li>
                    <li> <a href="/home"><span className="material-symbols-outlined">home</span> Home</a> </li>
                    <li> <a href="/profile"><span className="material-symbols-outlined">person</span> Profile</a> </li>
                    <li> <a href="/block"><span className="material-symbols-outlined">block</span> Block</a> </li>
                    <li className="noHref" onClick={logout}><span className="material-symbols-outlined">logout</span> Logout</li>
                </ul>
            </div>
        </>
    );

}

export default Sidebar;