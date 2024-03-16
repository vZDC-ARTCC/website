'use client';
import React, {useState} from 'react';
import {Chart} from "@/types";
import {Box, Collapse, List, ListItemButton, ListItemText, Typography} from "@mui/material";
import {Description, ExpandLess, ExpandMore, OpenInNew} from "@mui/icons-material";
import Link from "next/link";

export default function ChartsList({icao, charts}: { icao: string, charts: Chart[] }) {

    const categories = getUniqueCategories(charts).sort();
    const [openTab, setOpenTab] = useState<string>();

    const toggleCategory = (category: string) => {
        setOpenTab((prev) => prev === category ? undefined : category);
    }
    return (
        <>
            <Typography variant="h6" textAlign="center">{charts.length} charts for {icao}</Typography>
            <List sx={{width: '100%',}}>
                {categories.map((category) => (
                    <Box key={category}>
                        <ListItemButton onClick={() => toggleCategory(category)}>
                            <ListItemText primary={getCategoryName(category)}/>
                            {openTab === category ? <ExpandLess/> : <ExpandMore/>}
                        </ListItemButton>
                        <Collapse in={openTab === category} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {getCategoryCharts(category, charts).map((chart) => (
                                    <Link key={chart.name} href={chart.url} target="_blank"
                                          style={{textDecoration: 'none', color: 'inherit',}}>
                                        <ListItemButton key={chart.name} sx={{pl: 4}}>
                                            <Description/>
                                            <ListItemText primary={chart.name} sx={{pl: 1,}}/>
                                            <OpenInNew/>
                                        </ListItemButton>
                                    </Link>

                                ))}
                            </List>
                        </Collapse>
                    </Box>

                ))}
            </List>
        </>

    );

}

const getCategoryCharts = (category: string, charts: Chart[]): Chart[] => {
    return charts.filter((chart) => chart.category === category);
}

const getCategoryName = (category: string): string => {
    switch (category) {
        case "MIN":
            return "Minimums";
        case "LAH":
            return "LAHSO Procedures";
        case "HOT":
            return "Hot Spots";
        case "DP":
            return "Departure Procedures";
        case "STAR":
            return "Arrival Procedures";
        case "APD":
            return "Airport Diagram";
        case "IAP":
            return "Instrument Approach Procedures";
        default:
            return category;
    }
}

const getUniqueCategories = (charts: Chart[]): string[] => {
    const uniqueCategories: string[] = [];
    charts.forEach((chart) => {
        if (!uniqueCategories.includes(chart.category)) {
            uniqueCategories.push(chart.category);
        }
    });
    return uniqueCategories;
}