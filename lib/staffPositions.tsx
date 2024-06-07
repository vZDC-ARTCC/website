import {User} from "next-auth";
import React, {ReactNode} from "react";
import {Chip} from "@mui/material";

const colorPriority = {
    'error': 1, // red
    'info': 2, // blue
    'secondary': 3,
    'success': 4, // instructor
    'warning': 5, // mentor
    'default': 6
};

export const getChips = (user: User) => {
    const chips: ReactNode[] = [];
    const sortedPositions = [...user.staffPositions].sort((a, b) => {
        const colorA = getColor(a);
        const colorB = getColor(b);
        return colorPriority[colorA] - colorPriority[colorB];
    });

    for (const sp of sortedPositions) {
        const color = getColor(sp);
        chips.push(
            <Chip
                key={sp}
                label={sp}
                size="small"
                color={color as any}
                style={{margin: '2px'}}
            />
        );
    }
    return chips;
}

const getColor = (position: string) => {
    switch (position) {
        case 'ATM':
        case 'DATM':
        case 'TA':
            return 'error';
        case 'WM':
        case 'EC':
        case 'FE':
            return 'info';
        case 'ATA':
        case 'AFE':
        case 'AEC':
        case 'AWM':
            return 'secondary';
        case 'MTR':
            return 'warning';
        case 'INS':
            return 'success';
        default:
            return 'default';
    }
}