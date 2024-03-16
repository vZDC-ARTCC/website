'use client';
import React, {MouseEventHandler, ReactNode} from 'react';
import {ArrowDropDown, ArrowDropUp} from "@mui/icons-material";
import {Button} from "@mui/material";

export default function NavButton({icon, text, onClick, isDropdown, dropdownOpen}: {
    icon: ReactNode,
    text: string,
    onClick?: MouseEventHandler,
    isDropdown?: boolean,
    dropdownOpen?: boolean,
}) {

    return (
        <Button
            color="inherit"
            size="large"
            startIcon={icon}
            endIcon={isDropdown && getDropdownIcon(dropdownOpen)}
            onClick={onClick}
            sx={{display: {xs: 'none', xl: 'flex',},}}
        >
            {text}
        </Button>
    );
}

const getDropdownIcon = (open?: boolean) => {
    return open ? <ArrowDropUp/> : <ArrowDropDown/>;
}