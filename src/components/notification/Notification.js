import React, { useContext, useEffect, useState } from "react";
import NotificationContext from "../../context/notification/NotificationContext"
import InfiniteScroll from 'react-infinite-scroll-component';
import dateFormat from 'dateformat';

const Notification = () => {

    const { notificationListing, notificationSeenUpdate, notificationDetails, recordsFound, offsetListing } = useContext(NotificationContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    const urlkey = process.env.REACT_APP_NODE_BASE_URL;

    //listing challenges With Filters
    const listing = { 'limit': 10, 'offset': offsetListing }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        notificationListing(listing);//load challenges profile
    },[websiteName])

    //fetch more challenges
    const fetchMoreData = () => {
        notificationListing(listing);//load challenges
    }
    
    //update seen notification
    const notificationSeen = (notification) => {
        var notification_request = { "notification_id":notification['notification'].notification_id, "link":notification['notification'].link }
        notificationSeenUpdate(notification_request);
    }

    return (
        <>
            <div className="inner-notification">
                <div className="notification-head">
                    <h5 className="notification-heading">Notifications</h5>
                    {notificationDetails.length > 0 ? <span><a href="/notification">See all</a></span> : ""}
                </div>
                <InfiniteScroll
                    dataLength={notificationDetails.length}
                    next={() => fetchMoreData()}
                    hasMore={notificationDetails.length !== recordsFound && recordsFound !== undefined}
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="scrollableDiv"
                    className=""
                >
                    {
                        notificationDetails.length > 0 ? notificationDetails.map((notification, i) => {
                            return (<div className="notification-child" key={i}>
                                    <div onClick={() => notificationSeen({notification})}>
                                        <div className="notify-child">
                                            <img src={!!notification.profile_img ? (urlkey + "images/" + notification.profile_img) : "default_player.png"} />
                                            <p>{notification.description}</p>
                                            {notification.seen == 0 ? <span className="seenIcon"></span> : ""}
                                        </div>
                                        <div className="dateFormat">{dateFormat(notification.date, "dd-mm-yyyy hh:mm TT")}</div>
                                    </div>
                            </div>)
                        }) : "No notifications."
                    }
                </InfiniteScroll>
            </div>
        </>
    );
}

export default Notification; 