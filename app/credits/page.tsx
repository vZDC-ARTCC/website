import {Card, CardContent, Grid, Typography} from "@mui/material";
import {BugReportSharp, Info, SettingsSuggest} from '@mui/icons-material'
import Link from "next/link";

export default async function Home() {

    return (
        <Grid container columns={9} spacing={4}>
            <Grid item xs={9}>
                <Card>
                    <CardContent>
                        <Typography variant="h4">Credit Information</Typography>
                        <Typography variant="body2">Full Commit History can be found on <Link
                            href="https://github.com/vZDC-ARTCC/website" target="_blank"
                            style={{color: '#29B6F6', textDecoration: 'none',}}>our public GitHub.</Link></Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" sx={{mb: 1,}}>Main Contributors</Typography>
                        <Typography variant="h6" color="#29B6F6" fontWeight="bold">Aneesh Reddy</Typography>
                        <Typography variant="h6" color="#29B6F6" fontWeight="bold">Carson Berget</Typography>
                        <Typography variant="h6" color="#29B6F6" fontWeight="bold">Leo Roberts</Typography>
                        <Typography variant="h6" color="#29B6F6" fontWeight="bold">Harry Xu</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" sx={{mb: 1,}}>Bug/Suggestion Report</Typography>
                        <Typography variant="body1" color="#F44336"
                                    sx={{display: 'flex', gap: 1, alignItems: 'center',}}><SettingsSuggest/> Cameron D.</Typography>
                        <Typography variant="body1" color="#F44336"
                                    sx={{display: 'flex', gap: 1, alignItems: 'center',}}><BugReportSharp/> James Martin</Typography>
                        <Typography variant="body1" color="#F44336"
                                    sx={{display: 'flex', gap: 1, alignItems: 'center',}}><SettingsSuggest/> Junzhe Yan</Typography>
                        <Typography variant="body1" color="#F44336"
                                    sx={{display: 'flex', gap: 1, alignItems: 'center',}}><SettingsSuggest/> Geoff Burns</Typography>
                        <Typography variant="body1" color="#F44336"
                                    sx={{display: 'flex', gap: 1, alignItems: 'center',}}><BugReportSharp/> John
                            Man</Typography>

                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" sx={{mb: 1,}}>Easter Egg</Typography>
                        <Typography variant="body1" color="#CE93D8"
                                    sx={{display: 'flex', gap: 1, alignItems: 'center',}}><Info/>Coming
                            Soon</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
