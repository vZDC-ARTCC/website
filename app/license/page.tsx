
import {Roboto} from "next/font/google";
import {Card, CardContent, Grid, Typography, Link, Button} from "@mui/material";
import {Check, Close, Info} from '@mui/icons-material'
const headingFont = Roboto({subsets: ['latin'], weight: '400',});

export default async function Home() {

    return (
        <Grid container columns={9} spacing={4}>
            <Grid item xs={9}>
                <Card>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h3">Virtual Washington ARTCC</Typography>
                        <Typography {...headingFont.style} variant="h5">License Information</Typography>
                        <Typography {...headingFont.style} variant="body2">This is not legal advice.
                            <Link href="https://docs.github.com/articles/licensing-a-repository/#disclaimer" style={{color: '#29B6F6',textDecoration: 'none'}}> Learn more
                                about repository licenses</Link></Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h4">Permissions</Typography>
                        <Typography {...headingFont.style} variant="body1" color="green"><Check/> Commercial use</Typography>
                        <Typography {...headingFont.style} variant="body1" color="green"><Check/> Modification</Typography>
                        <Typography {...headingFont.style} variant="body1" color="green"><Check/> Distribution</Typography>
                        <Typography {...headingFont.style} variant="body1" color="green"><Check/> Patent use</Typography>
                        <Typography {...headingFont.style} variant="body1" color="green"><Check/> Private use</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h4">Limitations</Typography>
                        <Typography {...headingFont.style} variant="body1" color="red"><Close/> Private use</Typography>
                        <Typography {...headingFont.style} variant="body1" color="red"><Close/> Private use</Typography>
                        <Typography {...headingFont.style} variant="body1" color="red"><Close/> Private use</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h4">Conditions</Typography>
                        <Typography {...headingFont.style} variant="body1" color="lightblue"><Info/> License and copyright notice</Typography>
                        <Typography {...headingFont.style} variant="body1" color="lightblue"><Info/> State changes</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={9}>
                <Card>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h4">Apache License 3.0</Typography>
                        <br/>
                        <Button variant="contained" color="primary" href='license.txt'>Full License</Button>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
