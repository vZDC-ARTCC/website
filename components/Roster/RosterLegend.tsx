import React from 'react';
import {Grid2, Stack, Typography} from "@mui/material";
import {CertificationOption} from "@prisma/client";
import {getIconForCertificationOption} from "@/lib/certification";

function RosterLegend() {
    return (
        <Grid2 container spacing={2} justifyContent="center" sx={{mb: 2,}}>
            {Object.values(CertificationOption).map((co: CertificationOption) => (
                <Grid2 size={1}>
                    <Stack key={co} direction="column" alignItems="center">
                        {getIconForCertificationOption(co)}
                        <Typography variant="subtitle2">{co}</Typography>
                    </Stack>
                </Grid2>
            ))}
        </Grid2>
    );
}

export default RosterLegend;