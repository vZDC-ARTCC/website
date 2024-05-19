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

    return (
        <FormControlLabel onChange={(e, b) => changeLock(b)} control={<Switch checked={positionsLocked}/>}
                          label="Lock Signups"/>
    );

}