'use client';
import React from 'react';
import {Event} from '@prisma/client';
import {FormControlLabel, Switch} from "@mui/material";
import {setPositionsLock} from "@/actions/event";
import {toast} from "react-toastify";

export default function EventPositionsLockButton({event}: { event: Event, }) {

    const [positionsLocked, setPositionsLocked] = React.useState<boolean>(event.positionsLocked);

    const changeLock = async (newLock: boolean) => {
        setPositionsLocked(newLock);
        await setPositionsLock(event, newLock);
        toast(`Signups ${newLock ? 'locked!' : 'unlocked!'}`, {type: 'success',});
    }

    const eventIsWithin48Hours = new Date(event.start).getTime() - Date.now() < 48 * 60 * 60 * 1000;

    return (
        <FormControlLabel disabled={eventIsWithin48Hours} onChange={(e, b) => changeLock(b)}
                          control={<Switch checked={positionsLocked}/>}
                          label="Lock Signups"/>
    );

}