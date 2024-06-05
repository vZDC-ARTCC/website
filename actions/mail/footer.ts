import {User} from "next-auth";

const VATUSA_FACILITY = process.env.VATUSA_FACILITY;

export default function emailFooter(recipient: User) {
    return `\n\n
    ${VATUSA_FACILITY} Virtual ARTCC\n\n
    
    This inbox is not monitored. Please do not reply to this email. If you have any questions, please contact the ${VATUSA_FACILITY} staff.\n
    This email is intended for ${recipient.firstName} ${recipient.lastName} (${recipient.cid}).
    `
}