import {ReactNode} from "react";
import type {Metadata} from "next";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {Container, CssBaseline, Experimental_CssVarsProvider as CssVarsProvider} from "@mui/material";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import {theme} from "@/theme/theme";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {ToastContainer} from "react-toastify";
import {GoogleTagManager} from "@next/third-parties/google";
import {NextSSRPlugin} from "@uploadthing/react/next-ssr-plugin";
import {extractRouterConfig} from "uploadthing/server";
import {fileRouter} from "@/app/api/uploadthing/core";

export const metadata: Metadata = {
    title: "Virtual Washington ARTCC",
    description: "The Virtual Washington ARTCC is a community of pilots and air traffic controllers on VATSIM who come together to enjoy the art of flight simulation.",
};

const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export default function RootLayout({
  children,
}: Readonly<{
    children: ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
    <AppRouterCacheProvider>
        <CssVarsProvider theme={theme}>
            <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)}/>
            <CssBaseline/>
            <GoogleTagManager gtmId={googleAnalyticsId || ''}/>
            <div>
                <Navbar/>
                <Container maxWidth="xl" sx={{marginTop: 5,}}>
                    {children}
                </Container>
                <Footer/>
                <ToastContainer/>
            </div>
        </CssVarsProvider>
    </AppRouterCacheProvider>
    </body>
    </html>
  );
}
