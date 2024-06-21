
import {Roboto} from "next/font/google";
import {Card, CardContent, Grid, Typography, Link, Button} from "@mui/material";
import {SettingsSuggest, BugReportSharp, Info} from '@mui/icons-material'
const headingFont = Roboto({subsets: ['latin'], weight: '400',});

export default async function Home() {

    return (
        <Grid container columns={9} spacing={4}>
            <Grid item xs={9}>
                <Card>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h3">Virtual Washington ARTCC</Typography>
                        <Typography {...headingFont.style} variant="h5">Credit Information</Typography>
                        <Typography {...headingFont.style} variant="body2">
                            <Link href="https://github.com/vZDC-ARTCC/website" style={{color: '#29B6F6',textDecoration: 'none'}}>
                                Full Commit History can be found on our public GitHub</Link></Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h4">Main Contributors</Typography>
                        <Typography {...headingFont.style} variant="body1" color="#29B6F6">Aneesh Reddy</Typography>
                        <Typography {...headingFont.style} variant="body1" color="#29B6F6">Carson Berget</Typography>
                        <Typography {...headingFont.style} variant="body1" color="#29B6F6">Leo Roberts</Typography>
                        <Typography {...headingFont.style} variant="body1" color="#29B6F6">Harry Xu</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h4">Bug/Suggestion Report</Typography>
                        <Typography {...headingFont.style} variant="body1" color="#F44336"><BugReportSharp/><SettingsSuggest/> Leo Roberts</Typography>
                        <Typography {...headingFont.style} variant="body1" color="#F44336"><SettingsSuggest/> Cameron D.</Typography>
                        <Typography {...headingFont.style} variant="body1" color="#F44336"><BugReportSharp/> James Martin</Typography>
                        <Typography {...headingFont.style} variant="body1" color="#F44336"><SettingsSuggest/> Junzhe Yan</Typography>
                        <Typography {...headingFont.style} variant="body1" color="#F44336"><SettingsSuggest/> Geoff Burns</Typography>
                        <Typography {...headingFont.style} variant="body1" color="#F44336"><BugReportSharp/> John Man</Typography>

                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h4">Easter Egg</Typography>
                        <Typography {...headingFont.style} variant="body1" color="#CE93D8"><Info/>Coming Soon</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
