import React, { useContext, useEffect } from "react";
import SportsCityContext from "../../context/sportsCity/SportsCityContext"
import InfiniteScroll from 'react-infinite-scroll-component';

const SportsCity = () => {

    const { sportsCityListing, addSportsList, searchSport, sportsCityDetails, recordsFound, offsetListing } = useContext(SportsCityContext);
    const websiteName = process.env.REACT_APP_WEBSITE_NAME;

    //listing challenges With Filters
    const listing = { 'limit': 10, 'offset': offsetListing, 'search': searchSport }

    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        sportsCityListing(listing);//load sports
    },[websiteName])

    //fetch more challenges
    const fetchMoreData = () => {
        sportsCityListing(listing);//load sports
    }

    //add sport
    const addSports = (sport_id) => {
        addSportsList({'sport_id':sport_id});
    }   

    const searchbox = (event) => {
        var searchSportVar = event.target.value;
        searchSportVar = searchSportVar.trim();
        const listingSportsearch = { 'limit': 10, 'offset': 0, 'search': searchSportVar }
        sportsCityListing(listingSportsearch);//load teams sports
    }

    return (
        <>
            <div className="inner-sports">
                <div className="row sports-head">
                    <div className="col-sm-8 col-lg-8 col-md-8 col-xs-12 search-seeall">
                        <h5 className="sports-heading">Sports playing by other teams from your city.</h5>
                        <div className="linkSeeAll">{sportsCityDetails.length > 0 ? <span><a href="/sports">See all</a></span> : ""}</div>
                    </div>
                    <div className="col-sm-4 col-lg-4 col-md-4 col-xs-12">
                        <div className="searchbar"><input type="search" name="search" className="form-control" defaultValue={searchSport} placeholder="Search Sport Name" onChange={searchbox} /></div>
                    </div>
                </div>
                <InfiniteScroll
                    dataLength={sportsCityDetails.length}
                    next={() => fetchMoreData()}
                    hasMore={sportsCityDetails.length !== recordsFound && recordsFound !== undefined}
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="scrollableDiv"
                    className=""
                >
                    {
                        sportsCityDetails.length > 0 ? sportsCityDetails.map((sportsCity, i) => {
                            return (<div className="sports-child" key={i}>
                                    <div>
                                        <div className="sportify-child">
                                            <h4 className="fontStyle">{sportsCity.total}</h4>
                                            <p className="fontStyle">{sportsCity.name}</p>
                                            <button type="button" className="btn btn-sm btn-primary" onClick={() => addSports(sportsCity.sport_id)}>Add Sports</button>
                                        </div>
                                    </div>
                            </div>)
                        }) : "No one playing sports from your city, invite all!"
                    }
                </InfiniteScroll>
            </div>
        </>
    );
}

export default SportsCity; 