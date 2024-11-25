import React from 'react';
import {Typography} from "@mui/material";
import {Roboto} from "next/font/google";

const headingFont = Roboto({subsets: ['latin'], weight: ['400']});

export default function HeaderText() {
    return (
        <>
            <Typography {...headingFont.style} variant="h3" sx={{mb: 1,}}>Virtual Washington
                ARTCC</Typography>
            {/* <Typography {...headingFont.style} variant="h4" sx={{mb: 1, display: {sm: 'none',},}}>Virtual
                            Washington
                            ARTCC</Typography> */}
            {/* <Box sx={{display: {xs: 'none', sm: 'flex',},}}>
                            <SvgIcon style={{
                                transform: 'rotate(45deg)',
                                fontSize: '1.5rem',
                                marginTop: '1rem',
                                marginRight: '0.25rem',
                            }}>
                                <path
                                    d="M12 6c-3.31 0-6.42 1.28-8.77 3.58l1.06 1.06C5.45 8.1 8.35 7 12 7s6.55 1.1 8.71 3.64l1.06-1.06C18.42 7.28 15.31 6 12 6zm0 3c-2.76 0-5.26 1.12-7.07 2.92l1.06 1.06C7.47 11.1 9.64 10 12 10s4.53 1.1 6.01 2.98l1.06-1.06C17.26 10.12 14.76 9 12 9zm0 3c-1.66 0-3.14.69-4.24 1.77l1.06 1.06C9.64 13.1 10.74 12 12 12s2.36 1.1 3.18 2.83l1.06-1.06C15.14 12.69 13.66 12 12 12zm0 3c-.79 0-1.58.3-2.12.88l1.06 1.06.71.71.71-.71 1.06-1.06c-.54-.58-1.33-.88-2.12-.88z"
                                    fill="green"/>
                            </SvgIcon>
                            <Typography {...headingFont.style} variant="h3"
                                        sx={{p: 0.5, borderTop: 2, borderLeft: 2, borderColor: 'orange',}}>
                                Virtual <div style={{display: 'inline-flex', flexWrap: 'nowrap',}}>
                                <span style={{
                                    borderRadius: '50%',
                                    backgroundColor: '#009dff',
                                    color: '#FFFFFF',
                                    padding: '5px 15px', // Add horizontal padding
                                    display: 'inline-block',
                                }}>W</span>
                                <span>ashington</span>
                            </div> ARTCC
                            </Typography>
                        </Box> */}
            <Typography {...headingFont.style} sx={{mt: 1,}}>A group of passionate virtual air
                traffic
                controllers dedicated to managing some of the busiest airspace in the United
                States.</Typography>
        </>
    );
}