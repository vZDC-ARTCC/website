import { Button, CardContent, Grid, Typography, Card } from '@mui/material';
import {Roboto} from "next/font/google";


const headingFont = Roboto({subsets: ['latin'], weight: '400',});

export default function Home() {
    return (
        <Grid container columns={8} spacing={4}>
            <Grid item xs={8}>
                <Card>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h2">Virtual Washington ARTCC</Typography>
                        <Typography {...headingFont.style} variant="h5">Discord Information</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={8}>
                <Card>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h6">Our Discord Server is open to all VATSIM members</Typography>
                        <Typography {...headingFont.style} variant="body1">Join our Discord server to get the latest information on events, training, and more!</Typography>
                        <Typography {...headingFont.style} variant="body1">Click the button below to join our Discord server.</Typography>
                        <br />
                        <Button variant="contained" color="primary" href='https://discord.com/invite/me9zury'>Join Discord</Button>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}