'use client';
import {experimental_extendTheme as extendTheme} from "@mui/material";

export const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                mode: "light",
                primary: {
                    main: '#500E0E',
                    contrastText: '#EDEDF5',
                },
            },
        },
        dark: {
            palette: {
                mode: "dark",
                primary: {
                    main: '#500E0E',
                    contrastText: '#EDEDF5',
                },
            }
        },
    }
})