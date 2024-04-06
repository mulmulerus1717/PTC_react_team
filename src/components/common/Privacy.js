import HeadTag from "./HeadTag";
import React, { useEffect } from "react";

const Privacy = () => {

    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    useEffect(()=>{
        //eslint-disable-next-line react-hooks/exhaustive-deps
        document.title = "Privacy Policy | " + websiteName;
    },[websiteName])

    return (
        <>
        <HeadTag />
        <br></br><br></br>
        <div className="container termsCondition">
            <h2>Privacy Policy</h2>

            <b>Last Updated: 06-05-2024</b>

            <p>Welcome to Play to Conquer! This Privacy Policy describes how Play to Conquer ("we," "us," or "our") collects, uses, and shares your personal information when you use our website and any related services (collectively, the "Services").</p>

            <b>1. Information We Collect</b>

            <p>We may collect personal information from you when you use our website, including but not limited to:
            </p>

            <ul>
                <li>Information you provide to us, such as when you create an account or contact us for support;</li>
                <li>Automatically collected information, such as your IP address, browser type, and operating system;</li>
                <li>Cookies and similar tracking technologies, which may be used to enhance your experience on our website.</li>
            </ul>

            <b>2. How We Use Your Information</b>

            <p>We may use your personal information for the following purposes:</p>

            <ul>
                <li>To provide and maintain our Services;</li>
                <li>To personalize your experience on our website;</li>
                <li>To communicate with you, including responding to your inquiries and providing customer support;</li>
                <li>To analyze how our website is used and improve our Services;</li>
                <li>To comply with legal obligations.</li>
            </ul>

            <b>3. How We Share Your Information</b>

            <p>We may share your personal information with third parties in the following circumstances:</p>

            <ul>
                <li>With service providers who help us operate our website and provide our Services;</li>
                <li>With our affiliates and partners for marketing and promotional purposes, with your consent;</li>
                <li>In response to a legal request or to comply with applicable laws and regulations;</li>
                <li>In connection with a merger, acquisition, or sale of assets, if applicable.</li>
            </ul>

            <b>4. Your Choices</b>

            <p>You may have the following choices regarding your personal information:</p>

            <ul>
                <li>You can review and update your account information at any time by logging into your account settings;</li>
                <li>You can opt out of receiving promotional communications from us by following the instructions provided in such communications;</li>
                <li>You can disable cookies in your browser settings, although this may affect your experience on our website.</li>
            </ul>

            <b>5. Data Security</b>

            <p>We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>

            <b>6. Children's Privacy</b>

            <p>Our website is not directed to children under the age of 13, and we do not knowingly collect personal information from children under the age of 13. If you believe that we have collected personal information from a child under the age of 13, please contact us immediately.</p>

            <b>7. Changes to This Privacy Policy</b>

            <p>We reserve the right to update or modify this Privacy Policy at any time without prior notice. Any changes will be effective immediately upon posting the updated Privacy Policy on our website.</p>

            <b>8. Contact Us</b>

            <p>If you have any questions or concerns about this Privacy Policy, please contact us at 8530073922 and info@playtoconquer.com.</p>
        </div>
        <br></br><br></br>
        </>
    );

}

export default Privacy;