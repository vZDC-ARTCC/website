'use client';
import React from 'react';
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {Experimental_CssVarsProvider as CssVarsProvider} from "@mui/material/styles/CssVarsProvider";
import {theme} from "@/theme/theme";
import {CssBaseline} from "@mui/material";
import {GoogleTagManager} from "@next/third-parties/google";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {ToastContainer} from "react-toastify";
import ErrorCard from "@/components/Error/ErrorCard";

const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

function GlobalError({error}: { error: Error & { digest?: string } }) {
    return (
        <html lang="en">
        <body>
        <AppRouterCacheProvider>
            <CssVarsProvider theme={theme}>
                <CssBaseline/>
                <GoogleTagManager gtmId={googleAnalyticsId || ''}/>
                <div>
                    <Navbar/>
                    <ErrorCard heading="Unexpected Error" message={error.message}/>
                    <Footer/>
                    <ToastContainer/>
                </div>
            </CssVarsProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}

export default GlobalError;