'use client';
import React from 'react';
import {User} from "next-auth";
import {
    Box,
    Button,
    Checkbox,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {getRating} from "@/lib/vatsim";
import {toast} from "react-toastify";
import {purgeControllers} from "@/actions/controller";

export default function PurgeAssistantTable({controllers, user}: {
    controllers: { controller: User, totalHours: number, totalTrainingHours: string, }[],
    user: User,
}) {

    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [clickedOnce, setClickedOnce] = React.useState<boolean>(false);
    const [disabled, setDisabled] = React.useState<boolean>(false);

    const handlePurge = async () => {
        setDisabled(true);
        if (selectedIds.includes(user.id)) {
            toast("You cannot purge yourself.", {type: "error",});
            setDisabled(false);
            return;
        }
        if (!clickedOnce) {
            toast("THIS ACTION IS IRREVERSIBLE.  Any staff positions or training positions will be removed.  Click again to confirm purge.", {type: "warning",});
            setClickedOnce(true);
            setDisabled(false);
            return;
        }
        await purgeControllers(selectedIds);
        setClickedOnce(false);
        setDisabled(false);
        setSelectedIds([]);
        toast("Purge complete.", {type: "success",});
    }

    if (controllers.length === 0) {
        return <Typography>No controllers match criteria</Typography>
    }

    return (
        <Box>
            <TableContainer sx={{maxHeight: 600,}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Checkbox
                                    color="primary"
                                    disabled={clickedOnce || disabled}
                                    indeterminate={selectedIds.length > 0 && selectedIds.length < controllers.length}
                                    checked={selectedIds.length > 0 && selectedIds.length === controllers.length}
                                    onChange={() => {
                                        setSelectedIds(selectedIds.length > 0 ? [] : controllers.map(({controller}) => controller.id));
                                    }}
                                />
                            </TableCell>
                            <TableCell>Controller</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Total Hours</TableCell>
                            <TableCell>Total Training Hours</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {controllers.map(({controller, totalHours, totalTrainingHours}) => (
                            <TableRow key={controller.id} role="">
                                <TableCell>
                                    <Checkbox
                                        color="primary"
                                        disabled={clickedOnce || disabled}
                                        checked={selectedIds.includes(controller.id)}
                                        onChange={() => {
                                            setSelectedIds(selectedIds.includes(controller.id) ? selectedIds.filter(id => id !== controller.id) : [...selectedIds, controller.id]);
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{controller.firstName} {controller.lastName}</TableCell>
                                <TableCell>{getRating(controller.rating)}</TableCell>
                                <TableCell sx={{border: 1,}}>{totalHours.toPrecision(3)}</TableCell>
                                <TableCell sx={{border: 1,}}>{totalTrainingHours}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack direction="row" spacing={2} alignItems="center" sx={{mt: 2,}}>
                <Button variant="contained" color="error" disabled={disabled || selectedIds.length === 0} size="large"
                        sx={{mt: 2,}}
                        onClick={handlePurge}>Purge {selectedIds.length} controller{selectedIds.length === 1 ? '' : 's'}</Button>
                <Button variant="contained" color="warning" size="large" disabled={!clickedOnce} onClick={() => {
                    setDisabled(true);
                    setClickedOnce(false);
                    setDisabled(false)
                }}>Cancel</Button>
            </Stack>
        </Box>

    );
}