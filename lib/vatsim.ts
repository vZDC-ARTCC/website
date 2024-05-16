import {Role, StaffPosition} from "@prisma/client";
import {User} from "next-auth";

export const getRating = (rating: number) => {
    switch (rating) {
        case 0:
            return "SUS";
        case 1:
            return "OBS";
        case 2:
            return "S1";
        case 3:
            return "S2";
        case 4:
            return "S3";
        case 5:
            return "C1";
        case 6:
            return "C2";
        case 7:
            return "C3";
        case 8:
            return "I1";
        case 9:
            return "I2";
        case 10:
            return "I3";
        case 11:
            return "SUP";
        case 12:
            return "ADM";
        default:
            return "UNK";
    }
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