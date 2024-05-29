import {ReactNode} from "react";
import {CertificationOption} from "@prisma/client";
import {Check, Circle, Clear} from "@mui/icons-material";
import {Tooltip} from "@mui/material";

export const getIconForCertificationOption = (certificationOption: CertificationOption): ReactNode => {
    switch (certificationOption) {
        case "NONE":
            return <Tooltip title="Not Certified"><Clear fontSize="large" color="error"/></Tooltip>;
        case "MINOR":
            return <Tooltip title="Minor Certified"><Circle fontSize="large" color="warning"/></Tooltip>;
        case "MAJOR":
            return <Tooltip title="Major Certified"><Check fontSize="large" color="success"/></Tooltip>;
        case "SOLO":
            return <Tooltip title="Solo Certified"><Circle fontSize="large" color="info"/></Tooltip>;
        default:
            return <Clear fontSize="large" color="error"/>;
    }
}