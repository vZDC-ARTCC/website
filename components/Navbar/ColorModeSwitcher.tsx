'use client';
import {useColorScheme} from '@mui/material/styles';
import {IconButton, Tooltip} from "@mui/material";
import {useEffect, useState} from "react";
import {DarkMode, LightMode} from "@mui/icons-material";

export default function ColorModeSwitcher() {
    const {colorScheme, setColorScheme} = useColorScheme();
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // If the component is not mounted, we don't want to render anything
        // This prevents a hydration mismatch error between the server and the client
        return null;
    }

    return (
        <Tooltip title="Toggle light/dark mode">
            <IconButton
                color="inherit"
                onClick={() => {
                    if (colorScheme === 'light') {
                        setColorScheme('dark');
                    } else {
                        setColorScheme('light');
                    }
                }}
            >
                {colorScheme === 'light' ? <DarkMode/> : <LightMode/>}
            </IconButton>
        </Tooltip>
    );
};
