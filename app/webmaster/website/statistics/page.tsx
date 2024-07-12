import {Card, CardContent, Stack, Typography} from "@mui/material";
import {Info} from "@mui/icons-material";
import React from "react";

function Page() {
    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Info color="info"/>
                    <Typography>This page is under development!.</Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default Page;