import {
    Box,
    Card,
    CardContent,
    Grid,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    SvgIcon,
    Tooltip,
    Typography
} from "@mui/material";
import Image from "next/image";
import bg from "@/public/img/home-bg.png";
import {Roboto_Mono} from "next/font/google";
import prisma from "@/lib/db";
import UpcomingEventsCarousel from "@/components/HomePage/UpcomingEventsCarousel";
import {UTApi} from "uploadthing/server";
import {getDuration} from "@/lib/date";
import {getRating} from "@/lib/vatsim";
import Link from "next/link";
import {
    AirplanemodeActive,
    BarChart,
    BugReport,
    ListAlt,
    OpenInNew,
    PersonAdd,
    Route,
    StackedLineChart,
} from "@mui/icons-material";
import {getTop3Controllers} from "@/lib/hours";

const headingFont = Roboto_Mono({subsets: ['latin'], weight: 'variable',});

const ut = new UTApi();

export default async function Home() {

    const upcomingEvents = await prisma.event.findMany({
        where: {
            start: {
                gt: new Date(),
            },
        },
        orderBy: {
            start: 'asc',
        },
        take: 5,
    });

    const upcomingEventsImages = await ut.getFileUrls(upcomingEvents.map(event => event.bannerKey));

    const imageUrls = Object.fromEntries(upcomingEvents.map((event, i) => {
        const foundObject = upcomingEventsImages.data.find(o => o.key === event.bannerKey);
        return [event.id, foundObject ? foundObject.url : ''];
    }));

    const onlineAtc = await prisma.controllerPosition.findMany({
        where: {
            active: true,
        },
        include: {
            log: {
                include: {
                    user: true,
                },
            },
        },
    });

    const soloCertifications = await prisma.soloCertification.findMany({
        where: {
            expires: {
                gt: new Date(),
            },
        },
        include: {
            controller: true,
        },
    });

    const top3Logs = await prisma.controllerLogMonth.findMany({
        where: {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
        },
        include: {
            log: {
                include: {
                    user: true
                }
            }
        }
    });

    const top3Controllers = getTop3Controllers(top3Logs);

    return (
        <Grid container columns={8} spacing={4}>
            <Box sx={{zIndex: -10, overflow: 'hidden',}}>
                <Image src={bg} alt="vZDC" fill style={{objectFit: 'contain', opacity: 0.3,}}/>
            </Box>
            <Grid item xs={8}>
                <Card>
                    <CardContent>
                        <Box sx={{display: 'flex',}}>
                            <SvgIcon style={{
                                transform: 'rotate(45deg)',
                                fontSize: '1.5rem',
                                marginTop: '1rem',
                                marginRight: '0.25rem',
                            }}>
                                <path
                                    d="M12 6c-3.31 0-6.42 1.28-8.77 3.58l1.06 1.06C5.45 8.1 8.35 7 12 7s6.55 1.1 8.71 3.64l1.06-1.06C18.42 7.28 15.31 6 12 6zm0 3c-2.76 0-5.26 1.12-7.07 2.92l1.06 1.06C7.47 11.1 9.64 10 12 10s4.53 1.1 6.01 2.98l1.06-1.06C17.26 10.12 14.76 9 12 9zm0 3c-1.66 0-3.14.69-4.24 1.77l1.06 1.06C9.64 13.1 10.74 12 12 12s2.36 1.1 3.18 2.83l1.06-1.06C15.14 12.69 13.66 12 12 12zm0 3c-.79 0-1.58.3-2.12.88l1.06 1.06.71.71.71-.71 1.06-1.06c-.54-.58-1.33-.88-2.12-.88z"
                                    fill="green"/>
                            </SvgIcon>
                            <Typography {...headingFont.style} variant="h3"
                                        sx={{p: 0.5, borderTop: 2, borderLeft: 2, borderColor: 'orange',}}>
                                Virtual <div style={{display: 'inline-flex', flexWrap: 'nowrap',}}>
                                <span style={{
                                    borderRadius: '50%',
                                    backgroundColor: '#009dff',
                                    color: '#FFFFFF',
                                    padding: '5px 20px', // Add horizontal padding
                                    display: 'inline-block',
                                    fontWeight: 'bold',
                                }}>W</span>
                                <span>ashington</span>
                            </div> ARTCC
                            </Typography>
                        </Box>

                        <Typography {...headingFont.style} variant="h6" sx={{mt: 1,}}>A group of passionate virtual air
                            traffic
                            controllers dedicated to managing some of the busiest airspace in the United
                            States.</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={8} lg={6}>
                <Card sx={{height: '100%',}}>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h5" sx={{mb: 1,}}>Upcoming Events</Typography>
                        <UpcomingEventsCarousel events={upcomingEvents} imageUrls={imageUrls}/>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={8} lg={2}>
                <Card sx={{height: '100%',}}>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h5" sx={{mb: 1,}}>Online ATC</Typography>
                        <Stack direction="column" spacing={1} sx={{maxHeight: 600,}}>
                            {onlineAtc.length > 0 ? onlineAtc.map(position => (
                                <Card elevation={0} key={position.position + position.log.userId}>
                                    <CardContent>
                                        <Stack direction="row" spacing={1} justifyContent="space-between">
                                            <Typography>{position.position}</Typography>
                                            <Typography>{getDuration(position.start, new Date())}</Typography>
                                        </Stack>
                                        <Link href={`/controllers/${position.log.user.cid}`}
                                              style={{textDecoration: 'none', color: 'inherit',}}>
                                            <Typography
                                                variant="subtitle2">{position.log.user.firstName} {position.log.user.lastName} - {getRating(position.log.user.rating)}</Typography>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )) : <Typography>No controllers online</Typography>}
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={8} lg={2}>
                <Card sx={{height: '100%',}}>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h5" sx={{mb: 1,}}>Quick Links</Typography>
                        <List>
                            <Link href="/airports" style={{textDecoration: 'none', color: 'inherit',}}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <AirplanemodeActive/>
                                    </ListItemIcon>
                                    <ListItemText primary="Airport Database"/>
                                </ListItemButton>
                            </Link>
                            <Link href="/controllers/roster/home" style={{textDecoration: 'none', color: 'inherit',}}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ListAlt/>
                                    </ListItemIcon>
                                    <ListItemText primary="Roster"/>
                                </ListItemButton>
                            </Link>
                            <Link href="/visitor/new" style={{textDecoration: 'none', color: 'inherit',}}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <PersonAdd/>
                                    </ListItemIcon>
                                    <ListItemText primary="Visitor Application"/>
                                </ListItemButton>
                            </Link>
                            <Link href="/prd" style={{textDecoration: 'none', color: 'inherit',}}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Route/>
                                    </ListItemIcon>
                                    <ListItemText primary="Preferred Route Database"/>
                                </ListItemButton>
                            </Link>
                            <Link href="/controllers/statistics" style={{textDecoration: 'none', color: 'inherit',}}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <BarChart/>
                                    </ListItemIcon>
                                    <ListItemText primary="Statistics"/>
                                </ListItemButton>
                            </Link>
                            <Link href="https://github.com/vZDC-ARTCC/website/issues" target="_blank"
                                  style={{textDecoration: 'none', color: 'inherit',}}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <BugReport/>
                                    </ListItemIcon>
                                    <ListItemText primary="Report a Bug"/>
                                </ListItemButton>
                            </Link>
                            <Link href="https://www.vatusa.net" target="_blank"
                                  style={{textDecoration: 'none', color: 'inherit',}}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <OpenInNew/>
                                    </ListItemIcon>
                                    <ListItemText primary="VATUSA"/>
                                </ListItemButton>
                            </Link>
                            <Link href="https://www.vatsim.net" target="_blank"
                                  style={{textDecoration: 'none', color: 'inherit',}}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <OpenInNew/>
                                    </ListItemIcon>
                                    <ListItemText primary="VATSIM"/>
                                </ListItemButton>
                            </Link>
                        </List>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={8} lg={4}>
                <Card sx={{height: '100%',}}>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h5" sx={{mb: 1,}}>Top 3 Controllers</Typography>
                        <Stack direction="column" spacing={1}>
                            {top3Controllers.map((controller, idx) => (
                                <Card elevation={0} key={controller.user.cid}>
                                    <CardContent>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography
                                                variant="h5">{idx + 1} - {controller.user.preferredName || `${controller.user.firstName} ${controller.user.lastName}`}</Typography>
                                            <Tooltip title="View Statistics for this controller">
                                                <Link
                                                    href={`/controllers/statistics/${new Date().getFullYear()}/-/${controller.user.cid}`}
                                                    style={{color: 'inherit', textDecoration: 'none',}}>
                                                    <IconButton size="large">
                                                        <StackedLineChart fontSize="large"/>
                                                    </IconButton>
                                                </Link>
                                            </Tooltip>
                                        </Stack>
                                        <Typography
                                            variant="subtitle2">{controller.hours.toPrecision(3)} hours</Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={8} lg={2}>
                <Card sx={{height: '100%',}}>
                    <CardContent>
                        <Typography {...headingFont.style} variant="h5" sx={{mb: 1,}}>Solo Certifications</Typography>
                        <Stack direction="column" spacing={1}>
                            {soloCertifications.length > 0 ? soloCertifications.map(solo => (
                                <Card elevation={0} key={solo.id}>
                                    <CardContent>
                                        <Typography variant="h6">{solo.position}</Typography>
                                        <Typography variant="body2">Expires {solo.expires.toDateString()}</Typography>
                                        <Link href={`/controllers/${solo.controller.cid}`}
                                              style={{textDecoration: 'none', color: 'inherit',}}>
                                            <Typography
                                                variant="subtitle2">{solo.controller.firstName} {solo.controller.lastName} - {getRating(solo.controller.rating)}</Typography>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )) : <Typography>No active solo certifications</Typography>}
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

    );
}
