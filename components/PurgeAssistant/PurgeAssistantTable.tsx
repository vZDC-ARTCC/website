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
    Typography,
    Tab,
    Tabs
} from "@mui/material";
import {getRating} from "@/lib/vatsim";
import {toast} from "react-toastify";
import {purgeControllers} from "@/actions/controller";
// import {useSession} from "next-auth/react";

export default function PurgeAssistantTable({controllers, user}: {
    controllers: { controller: User, totalHours: number, totalTrainingHours: string, homeController: boolean }[],
    user: User,
}) {

    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [clickedOnce, setClickedOnce] = React.useState<boolean>(false);
    const [disabled, setDisabled] = React.useState<boolean>(false);
    const [selectedRoster, setSelectedRoster] = React.useState<string>("home");
    // const session = useSession();

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

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedRoster(newValue);
    }

    interface TabPanelProps {
        index: string;
        value: string;
    }

    function RosterPurgePanel(props: TabPanelProps) {
        const { value, index } = props;
        const numOfHomeControllers = controllers.filter((x)=>x.homeController).length;
        const numOfVisitingControllers = controllers.length - numOfHomeControllers;

        return(
            <div hidden={value !== index}>
                <TableContainer sx={{maxHeight: 600,}}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Checkbox
                                        color="primary"
                                        disabled={clickedOnce || disabled || value==="home" && numOfHomeControllers <= 0 || value==="visit" && numOfVisitingControllers <= 0}
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
                            {controllers.filter((controllers)=>{
                                if (value==="home"){
                                    if (controllers.homeController) return true;
                                }
                                else{
                                    if (!controllers.homeController) return true;
                                }
                                return false;
                            }).map(({controller, totalHours, totalTrainingHours}) => (
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
            </div>
        )
    }

    return (
        <Box>
            <Tabs variant="fullWidth" value={selectedRoster} onChange={handleChange}>
                <Tab label="Home" value="home"/>
                <Tab label="Visiting" value="visit"/>
            </Tabs>
            <RosterPurgePanel value={selectedRoster} index={"home"}/>
            <RosterPurgePanel value={selectedRoster} index={"visit"}/>
            <Stack direction="row" spacing={2} alignItems="center" sx={{mt: 2,}}>
                    <Button variant="contained" color="error"
                            disabled={disabled || selectedIds.length === 0 || !user.staffPositions.some((sp) => ["ATM", "DATM"].includes(sp))}
                            size="large"
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