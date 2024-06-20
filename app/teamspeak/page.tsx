
import {Roboto} from "next/font/google";
import {Card, CardContent, Grid, Typography, Link} from "@mui/material";
const headingFont = Roboto({subsets: ['latin'], weight: '400',});

export default async function Home() {

    return (
        <Grid container columns={8} spacing={4}>
            <Grid item xs={8}>
                <Card>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h2">Virtual Washington ARTCC</Typography>
                        <Typography {...headingFont.style} variant="h5">Teamspeak Information</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={8}>
                <Card>
                    <CardContent>
                        <Typography{...headingFont.style} variant="h6">Teamspeak is used for all training and all controller communications,
                            but all members are welcome to join us in the teamspeak. You can connect to the teamspeak server, without a password, using the IP:
                            <Link href="ts3server://ts.vzdc.org?port=9987" style={{color: '#29B6F6',}}> ts.vzdc.org</Link></Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={8}>
                <Card>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h4">TeamSpeak Rules</Typography>
                        <Typography {...headingFont.style} variant="body1" mt={1}>All users must join TeamSpeak using the name associated with their VATSIM account.</Typography>
                        <Typography {...headingFont.style} variant="body1" mt={1}>Anonymous users will be kicked with a warning and banned upon reconnecting anonymously.</Typography>
                        <Typography {...headingFont.style} variant="body1" mt={1}>Teamspeak permissions are required to move within Teamspeak. Please contact a staff member to
                            receive appropriate permissions. (If you are not a member of the VATUSA region, please provide your CID for rating verification).</Typography>
                        <Typography {...headingFont.style} variant="body1" mt={1}>Streaming while controlling is allowed and encouraged although the audio from Teamspeak is
                            not allowed for the privacy of other controllers. Streaming Teamspeak audio requires the written permission of the ATM
                            (Contact the ATM at <Link href="mailto:atm@vzdc.org" style={{color: '#29B6F6',}}> atm@vzdc.org</Link> for permission).
                            Streaming audio without his/her permission may result in the loss of Teamspeak privileges.</Typography>
                        <Typography {...headingFont.style} variant="body1" mt={1}>Controlling rooms are limited to controlling only.
                            If a controller asks for you to leave, please do so.</Typography>
                        <Typography {...headingFont.style} variant="body1" mt={1}>Use of Teamspeak is a privilege and can be revoked by a staff member at any time and for any reason.
                            To appeal teamspeak bans, please contact the DATM at <Link href="mailto:datm@vzdc.org" style={{color: '#29B6F6',}}> datm@vzdc.org.</Link></Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
