'use client';
import React from 'react';
import {Event, EventPosition} from "@prisma/client";
import {User} from "next-auth";
import ControllerSignupDeleteButton from "@/components/EventPosition/ControllerSignupDeleteButton";
import {unassignEventPosition} from "@/actions/eventPosition";
import {log} from "@/actions/log";
import {toast} from "react-toastify";

function EventControllerRemoveForm({ event, position, controller }: { event: Event, position: EventPosition, controller: User }) {

    const handleSubmit = async () => {
        await unassignEventPosition(event, position, controller, true);
        await log("UPDATE", "EVENT_POSITION", `Removed controller ${controller.cid} from position ${position.position} in event ${event.name}`);
        toast(`Controller removed from ${position.position}`, { type: "success" });
    }

    return (
        <form action={handleSubmit}>
            <ControllerSignupDeleteButton iconOnly />
        </form>
    );
}

export default EventControllerRemoveForm;