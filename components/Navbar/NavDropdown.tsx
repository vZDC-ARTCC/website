import React from 'react';
import {Menu} from "@mui/material";

export default function NavDropdown({open, anchorElement, onClose, children}: {
    open: boolean,
    anchorElement: null | HTMLElement,
    onClose: () => void,
    children: React.ReactNode
}) {
    return (
        <Menu
            open={open}
            onClose={onClose}
            anchorEl={anchorElement}
            disableScrollLock={true}
        >
            {children}
        </Menu>
    );
}