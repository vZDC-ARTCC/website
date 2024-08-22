import React from 'react';
import {Button, Card, CardContent, Stack, Typography} from "@mui/material";
import TrainingAssignmentTable from "@/components/TrainingAssignment/TrainingAssignmentTable";
import {Add} from "@mui/icons-material";
import Link from "next/link";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";

export default async function Page() {

    const session = await getServerSession(authOptions);

    const isInstructorOrStaff = session?.user?.roles.includes('INSTRUCTOR') || session?.user?.roles.includes('STAFF');

    return (
        <Card>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                    <Typography variant="h5">Trainer Assignments</Typography>
                    {isInstructorOrStaff && <Link href="/training/assignments/new" passHref>
                        <Button variant="contained" startIcon={<Add/>}>Manual Training Assignment</Button>
                    </Link>}
                </Stack>
                <TrainingAssignmentTable isInstructorOrStaff={!!isInstructorOrStaff}/>
            </CardContent>
        </Card>
    );
}