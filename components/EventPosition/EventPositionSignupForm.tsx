'use client';
import React from 'react';
import {User} from "next-auth";
import {Event, EventPosition} from "@prisma/client";
import {assignEventPosition, unassignEventPosition} from "@/actions/eventPosition";
import EventPositionSignupButton from "@/components/EventPosition/EventPositionSignupButton";
import ControllerSignupDeleteButton from "@/components/EventPosition/ControllerSignupDeleteButton";
import {toast} from "react-toastify";
import {Block} from "@mui/icons-material";

function EventPositionSignupForm({ user, event, position, controllers }: { user: User, event: Event, position: EventPosition, controllers: User[] }) {

    if (user.noEventSignup) {
        return <Block/>;
    }

    const isSignedUp = (controllers: User[]) => controllers.map((controller) => controller.id).includes(user.id || '');

    const formSubmit = async (position: EventPosition, controllers: User[]) => {
        if (isSignedUp(controllers)) {
            await unassignEventPosition(event, position, user);
            toast("Signup deleted", { type: "success" });
        } else if (isAbleToSignup(position, controllers, user)) {
            await assignEventPosition(event, position, controllers, user);
            toast("Signup added", { type: "success" });
        }
    }



    return (
        <form action={async () => {
            await formSubmit(position, controllers)
        }}>
            {isSignedUp(controllers) &&
                <ControllerSignupDeleteButton />
            }
            {!isSignedUp(controllers) && isAbleToSignup(position, controllers as User[], user) &&
                <EventPositionSignupButton/>
            }
        </form>
    );
}

const isAbleToSignup = (eventPosition: EventPosition, controllersSignedUp: User[], controller: User) => {
    if (controller.controllerStatus === "NONE") {
        return false;
    }
    if (eventPosition.signupCap && controllersSignedUp.length >= eventPosition.signupCap) {
        return false;
    }
    return !(eventPosition.minRating && eventPosition.minRating > controller.rating);

}

export default EventPositionSignupForm;