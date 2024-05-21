import React from 'react';
import {DossierEntry} from "@prisma/client";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

function DossierTable({dossier}: { dossier: DossierEntry[] }) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Writer</TableCell>
                    <TableCell>Message</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {dossier.map((entry) => (
                    <TableRow key={entry.id}>
                        <TableCell>{entry.timestamp.toDateString()}</TableCell>
                        <TableCell>{(entry as any).writer.firstName} {(entry as any).writer.lastName} ({(entry as any).writer.cid})</TableCell>
                        <TableCell>{entry.message}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default DossierTable;