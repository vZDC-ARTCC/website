import React from 'react';
import {Card, CardContent, Stack, Typography} from "@mui/material";
import {Info} from "@mui/icons-material";

function NotFound() {
    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Info color="error"/>
                    <Typography>Changelog was not found.</Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default NotFound;