import {ReactNode} from "react";
import {CertificationOption, SoloCertification} from "@prisma/client";
import {Check, Circle, Clear} from "@mui/icons-material";
import {Tooltip} from "@mui/material";
import {formatZuluDate, getDaysLeft} from "@/lib/date";

export const getIconForCertificationOption = (certificationOption: CertificationOption, soloCertification?: SoloCertification): ReactNode => {
    switch (certificationOption) {
        case "NONE":
            return <Tooltip title="Not Certified"><Clear fontSize="large" color="error"/></Tooltip>;
        case "UNRESTRICTED":
            return <Tooltip title="Unrestricted Certification"><Circle fontSize="large" color="warning"/></Tooltip>;
        case "TIER_1":
            return <Tooltip title="Tier 1 Certified"><Check fontSize="large" color="success"/></Tooltip>;
        case "SOLO":
            return <Tooltip
                title={soloCertification ? `${soloCertification?.position} - ${getDaysLeft(soloCertification?.expires || new Date())}` : 'Solo Certified'}><Circle
                fontSize="large" color="info"/></Tooltip>;
        default:
            return <Clear fontSize="large" color="error"/>;
    }
}