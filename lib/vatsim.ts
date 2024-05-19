import {Role, StaffPosition} from "@prisma/client";
import {User} from "next-auth";

const RATINGS = [
    "SUS",
    "OBS",
    "S1",
    "S2",
    "S3",
    "C1",
    "C2",
    "C3",
    "I1",
    "I2",
    "I3",
    "SUP",
    "ADM",
];

export const getRating = (rating: number) => {
    return RATINGS[rating];
}

export const getLongStaffPosition = (position: StaffPosition) => {
    switch (position) {
        case "ATM":
            return "Air Traffic Manager (ATM)";
        case "DATM":
            return "Deputy Air Traffic Manager (DATM)";
        case "TA":
            return "Training Administrator (TA)";
        case "EC":
            return "Events Coordinator (EC)";
        case "WM":
            return "Webmaster (WM)";
        case "FE":
            return "Facility Engineer (FE)";
        case "ATA":
            return "Assistant Training Administrator (ATA)";
        case "AWM":
            return "Assistant Webmaster (AWM)";
        case "AFE":
            return "Assistant Facility Engineer (AFE)";
        default:
            return "Unknown";
    }
}

export const getLongRole = (role: Role) => {
    switch (role) {
        case "CONTROLLER":
            return "Controller";
        case "INSTRUCTOR":
            return "Instructor";
        case "MENTOR":
            return "Mentor";
        case "STAFF":
            return "Staff";
    }
}

export const getSubtitle = (user: User, shortStaffRoles?: boolean): string => {

    if (user.controllerStatus === "NONE") {
        return '';
    }

    if (user.controllerStatus === "VISITOR") {
        return `Visiting Controller - ${user.artcc}`;
    }

    let result: string[] = [];

    if (user.roles.includes("INSTRUCTOR")) {
        result.push(getLongRole("INSTRUCTOR"));
    } else if (user.roles.includes("MENTOR")) {
        result.push(getLongRole("MENTOR"));
    }

    if (user.roles.includes("STAFF")) {
        const staffPositions = user.staffPositions.filter((sp) => sp !== "MTR" && sp !== "INS");
        if (shortStaffRoles) {
            result.push(...staffPositions);
        } else {
            result.push(...staffPositions.map(getLongStaffPosition));
        }
    }

    if (result.length === 0) {
        return "Home Controller";
    }
    return result.join(" • ");
}