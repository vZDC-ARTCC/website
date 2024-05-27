'use client';
import React from 'react';
import {User} from "next-auth";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import StaffingRequestForm from "@/components/StaffingRequest/StaffingRequestForm";

const RECAPTCHA_KEY = process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY || '';

export default function StaffingRequestFormWrapper({user}: { user: User }) {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_KEY}>
            <StaffingRequestForm user={user}/>
        </GoogleReCaptchaProvider>
    );
}