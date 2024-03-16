import React from 'react';
import IcaoForm from "@/components/Form/IcaoForm";
import {Stack} from "@mui/material";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <Stack direction="column" spacing={2}>
            <IcaoForm basePath="/charts"/>
            {children}
        </Stack>
    );
}