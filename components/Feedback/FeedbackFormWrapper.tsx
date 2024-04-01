'use client';
import React from 'react';
import {User} from "next-auth";
import FeedbackForm from "@/components/Feedback/FeedbackForm";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";

const RECAPTCHA_KEY = process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY || '';

function FeedbackFormWrapper({controllers}: { controllers: User[], }) {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_KEY}>
            <FeedbackForm controllers={controllers}/>
        </GoogleReCaptchaProvider>
    );
}

export default FeedbackFormWrapper;