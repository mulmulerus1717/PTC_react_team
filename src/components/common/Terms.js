import HeadTag from "./HeadTag";
import React, { useEffect } from "react";

const Terms = () => {

    const websiteName = process.env.REACT_APP_WEBSITE_NAME;
    useEffect(()=>{
        //eslint-disable-next-line react-hooks/exhaustive-deps
        document.title = "Terms | " + websiteName;
    },[websiteName])

    return (
        <>
        <HeadTag />
        <br></br><br></br>
        <div className="container termsCondition">
            <h2>Terms of Service</h2>

            <b>Last Updated: 06-05-2024</b>

            <p>Welcome to Play to Conquer! These Terms of Service ("Terms") govern your use of the Play to Conquer website and any related services provided by us. By accessing or using our website, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our website.</p>

            <b>1. Acceptance of Terms</b>

            <p>By accessing or using the Play to Conquer website, you agree to abide by these Terms. If you do not agree to these Terms, you may not use our website.</p>

            <b>2. User Eligibility</b>

            <p>You must be at least 14 years old to use the Play to Conquer website. By accessing or using our website, you affirm that you are at least 14 years old.</p>

            <b>3. User Accounts</b>

            <p>Some features of the Play to Conquer website may require you to create a user account. When creating your account, you agree to provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

            <b>4. User Conduct</b>

            <p>You agree to use the Play to Conquer website in accordance with all applicable laws and regulations. You may not engage in any activity that:</p>

            <ul>
                <li>Violates these Terms</li>
                <li>Infringes upon the rights of others</li>
                <li>Harasses, intimidates, or discriminates against others</li>
                <li>Is unlawful, fraudulent, or deceptive</li>
                <li>Interferes with the operation of the website</li>
            </ul>

            <b>5. Intellectual Property</b>

            <p>All content on the Play to Conquer website, including but not limited to text, graphics, logos, and images, is the property of Play to Conquer or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works based on this content without our prior written consent.
            </p>
            <b>6. Privacy Policy</b>

            <p>Your use of the Play to Conquer website is subject to our Privacy Policy. By using our website, you consent to the collection, use, and disclosure of your personal information as described in our Privacy Policy.
            </p>

            <b>7. Third-Party Links</b>

            <p>The Play to Conquer website may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>

            <b>8. Limitation of Liability</b>

            <p>To the fullest extent permitted by law, Play to Conquer and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of the Play to Conquer website.
            </p>

            <b>9. Indemnification</b>

            <p>You agree to indemnify and hold harmless Play to Conquer and its affiliates, officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from: (i) your use of and access to the Play to Conquer website; (ii) your violation of any term of these Terms; or (iii) your violation of any third-party right, including without limitation any copyright, property, or privacy right.
            </p>

            <b>10. Termination</b>

            <p>We reserve the right to suspend or terminate your access to the Play to Conquer website at any time, with or without cause, and without notice or liability to you.
            </p>

            <b>11. Changes to Terms</b>

            <p>We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Play to Conquer website after any such changes constitutes your acceptance of the new Terms.
            </p>

            <b>12. Governing Law</b>

            <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>

            <b>13. Contact Information</b>

            <p>If you have any questions or concerns about these Terms, please contact us at 8530073922 and info@playtoconquer.com</p>
        </div>
        <br></br><br></br>
        </>
    );

}

export default Terms;