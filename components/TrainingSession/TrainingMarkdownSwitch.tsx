'use client';
import React from 'react';
import {Card, CardContent, Typography,} from "@mui/material";
import Markdown from "react-markdown";
import {TrainingSession} from "@prisma/client"

export default function TrainingMarkdownSwitch({trainingSession, trainerView}: { trainingSession:TrainingSession ,trainerView?: boolean }){

    // const [enableMarkdown, setEnableMarkdown] = React.useState<boolean>(false);

    return(
        <Card>
            {/* <CardContent>
                <FormControlLabel control={<Switch onChange={()=>setEnableMarkdown(!enableMarkdown)}/>} label="Enable Markdown" />
            </CardContent> */}
            <Card variant="outlined">

                <CardContent>
                    <Typography variant="h6">Comments</Typography>
                    {/* {enableMarkdown ? <Markdown>{trainingSession.additionalComments || 'N/A'}</Markdown> : <Typography variant="body1" sx={{marginTop:"16px",marginBottom:"16px", whiteSpace:"pre-wrap"}}>{trainingSession.additionalComments || 'N/A'}</Typography>} */}
                    {trainingSession.enableMarkdown ? <Markdown>{trainingSession.additionalComments || 'N/A'}</Markdown> : <Typography variant="body1" sx={{marginTop:"16px",marginBottom:"16px", whiteSpace:"pre-wrap"}}>{trainingSession.additionalComments || 'N/A'}</Typography>}
                </CardContent>
            </Card>
            {trainerView &&
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6">Trainer Comments</Typography>
                        {/* {enableMarkdown ? <Markdown>{trainingSession.trainerComments || 'N/A'}</Markdown> : <Typography variant="body1" sx={{marginTop:"16px",marginBottom:"16px", whiteSpace:"pre-wrap"}}>{trainingSession.trainerComments || 'N/A'}</Typography>} */}
                        {trainingSession.enableMarkdown ? <Markdown>{trainingSession.trainerComments || 'N/A'}</Markdown> : <Typography variant="body1" sx={{marginTop:"16px",marginBottom:"16px", whiteSpace:"pre-wrap"}}>{trainingSession.trainerComments || 'N/A'}</Typography>}
                    </CardContent>
                </Card>
            }
        </Card>
    )
}