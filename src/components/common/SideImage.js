
const SideImage = () => {

    const websiteName = process.env.REACT_APP_WEBSITE_NAME;

    return (
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 posterFirst">
            <div align="center">
                <img src="https://staticg.sportskeeda.com/skm/assets/images/login-img.svg" className="img-responsive" alt="sidebar sports" />
                <p><b>{websiteName}</b> is a social networking platform where sports enthusiasts connect to play together.</p>
            </div>
        </div>
    )
}

export default SideImage;