import React from 'react';
import {Card, CardContent} from "@mui/material";

export default async function Layout({children}: { children: React.ReactNode }) {
    return (
        <Card>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}