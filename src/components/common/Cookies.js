import HeadTag from "./HeadTag";
import React, { useEffect } from "react";

const Cookies = () => {

    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    useEffect(()=>{
        //eslint-disable-next-line react-hooks/exhaustive-deps
        document.title = "Cookies Policy | " + websiteName;
    },[websiteName])

    return (
        <>
        <HeadTag />
        <br></br><br></br>
        <div className="container termsCondition">
            
        <h2>Cookies Policy</h2>

        <b>Last Updated: 06-05-2024</b>

        <p>Welcome to Play to Conquer! This Cookies Policy describes how Play to Conquer ("<b>we</b>," "<b>us</b>," or "<b>our</b>") uses cookies and similar tracking technologies on our website and any related services (collectively, the "<b>Services</b>").</p>

        <b>1. What Are Cookies?</b>

        <p>Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.</p>

        <b>2. How We Use Cookies</b>

        <p>We use cookies and similar tracking technologies for the following purposes:</p>
        <ul>
            <li><b>Essential Cookies:</b> These cookies are necessary for the operation of our website and cannot be disabled in our systems. They are usually set in response to actions made by you, such as setting your privacy preferences, logging in, or filling in forms.</li>
            <li><b>Analytics Cookies:</b> These cookies allow us to analyze how users interact with our website, so we can measure and improve the performance of our Services.</li>
            <li><b>Advertising Cookies:</b> These cookies are used to deliver advertisements that are relevant to you and your interests. They may be used by third-party advertisers to track your browsing activity across different websites.</li>
        </ul>

        <b>3. Your Choices Regarding Cookies</b>

        <p>You have the following options regarding the use of cookies on our website:</p>
        <ul>
            <li><b>Accept Cookies:</b> By continuing to use our website, you consent to the use of cookies as described in this Cookies Policy.</li>
            <li><b>Change Cookie Settings:</b> You can change your cookie settings at any time by adjusting your browser settings. Please note that disabling cookies may affect the functionality of our website.</li>
            <li><b>Opt Out of Targeted Advertising:</b> You can opt out of targeted advertising by visiting the Network Advertising Initiative (NAI) opt-out page or the Digital Advertising Alliance (DAA) opt-out page.</li>
        </ul>

        <b>4. Third-Party Cookies</b>

        <p>We may allow third-party service providers to use cookies and similar tracking technologies on our website. These providers may collect information about your online activities over time and across different websites.</p>

        <b>5. Updates to This Cookies Policy</b>

        <p>We reserve the right to update or modify this Cookies Policy at any time without prior notice. Any changes will be effective immediately upon posting the updated Cookies Policy on our website.</p>

        <b>6. Contact Us</b>

        <p>If you have any questions or concerns about this Cookies Policy, please contact us at 8530073922 and info@playtoconquer.com</p>

        </div>
        <br></br><br></br>
        </>
    );

}

export default Cookies;