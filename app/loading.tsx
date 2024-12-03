import React from 'react';
import {Skeleton,} from "@mui/material";

// const headingFont = Roboto({subsets: ['latin'], weight: ['400']});

export default function Loading() {

    return <Skeleton variant="rectangular" width="100%" height={1000}/>;

    // return (
    //     <Grid2 container columns={8} spacing={4}>
    //         <BackgroundImage />
    //         <Grid2 size={8}>
    //             <Card>
    //                 <CardContent>
    //                     <HeaderText />
    //                 </CardContent>
    //             </Card>
    //         </Grid2>
    //         <Grid2
    //             size={{
    //                 xs: 8,
    //                 lg: 6
    //             }}>
    //             <Skeleton variant="rectangular" width="100%" height={600} />
    //         </Grid2>
    //         <Grid2
    //             size={{
    //                 xs: 8,
    //                 lg: 2
    //             }}>
    //             <Card sx={{ height: 600, }}>
    //                 <CardContent>
    //                     <Typography {...headingFont.style} variant="h5" sx={{mb: 1,}}>Quick Links</Typography>
    //                     <QuickLinksList />
    //                 </CardContent>
    //             </Card>
    //         </Grid2>
    //         <Grid2
    //             size={{
    //                 xs: 8,
    //                 lg: 2
    //             }}>
    //             <Skeleton variant="rectangular" width="100%" height={600} />
    //         </Grid2>
    //         <Grid2
    //             size={{
    //                 xs: 8,
    //                 lg: 4
    //             }}>
    //             <Skeleton variant="rectangular" width="100%" height={600} />
    //         </Grid2>
    //         <Grid2
    //             size={{
    //                 xs: 8,
    //                 lg: 2
    //             }}>
    //             <Skeleton variant="rectangular" width="100%" height={600} />
    //         </Grid2>
    //     </Grid2>
    // );
}