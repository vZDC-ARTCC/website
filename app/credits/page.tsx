import {Card, CardContent, Grid, Typography} from "@mui/material";
import Link from "next/link";

export default async function Home() {

    return (
        <Grid container columns={6} spacing={4}>
            <Grid item xs={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h4">Credit Information</Typography>
                        <Typography variant="body2">Full Commit History can be found on <Link
                            href="https://github.com/vZDC-ARTCC/website" target="_blank"
                            style={{color: '#29B6F6', textDecoration: 'none',}}>our public GitHub.</Link></Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={6}>
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
        </Grid>
    );
}
