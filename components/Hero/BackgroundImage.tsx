import React from 'react';
import Image from "next/image";
import bg from "@/public/img/home-bg.png";
import {Box} from "@mui/material";

export default function BackgroundImage() {
    return (
        <Box sx={{zIndex: -10, overflow: 'hidden',}}>
            <Image src={bg} alt="vZDC" fill style={{objectFit: 'contain', opacity: 0.3,}}/>
        </Box>
    );
}