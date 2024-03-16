'use server';

export type Airport = {
    icao: string,
    iata: string,
    name: string,
    city: string,
    runways: {
        id: string,
        procedures: {
            route: string,
            text: string,
        }[],
    }[],
}
export type AirportGroup = {
    name: string;
    airports: Airport[],
}

// TODO: get airportGroups from prisma
const airportGroups: AirportGroup[] = [
    {
        name: 'PCT (Potomac Consolidated TRACON)',
        airports: [
            {
                icao: 'KIAD',
                iata: 'IAD',
                name: 'Washington Dulles International Airport',
                city: 'Washington, D.C.',
                runways: [
                    {
                        id: '30',
                        procedures: [
                            {
                                route: 'JCOBY4',
                                text: 'Expect a heading of 300-320 on departure',
                            },
                            {
                                route: 'JDUBB4',
                                text: 'Expect a heading of 300-250 on departure',
                            }
                        ],
                    },
                    {
                        id: '01C',
                        procedures: [
                            {
                                route: 'Anything',
                                text: 'Expect runway heading on departure',
                            },
                        ],
                    },
                ],
            },
            {
                icao: 'KDCA',
                iata: 'DCA',
                name: 'Ronald Reagan Washington National Airport',
                city: 'Washington, D.C.',
                runways: [
                    {
                        id: '01',
                        procedures: [
                            {
                                route: 'Anything',
                                text: 'Expect to flt the RNAV departure.',
                            },
                        ],
                    },
                ],
            }
        ],
    },
    {
        name: 'RDU TRACON',
        airports: [
            {
                icao: 'KRDU',
                iata: 'RDU',
                name: 'Raleigh-Durham International Airport',
                city: 'Raleigh, North Carolina',
                runways: [
                    {
                        id: '05L',
                        procedures: [
                            {
                                route: 'Anything',
                                text: 'Expect a heading of 050-020 on departure',
                            },
                        ],
                    },
                ],
            }
        ],
    }
];

export const getAirports = async (searchIcao?: string) => {
    return searchIcao ? airportGroups.map(group => ({
        ...group,
        airports: group.airports.filter(airport => airport.icao === searchIcao)
    })).filter((group) => group.airports.length > 0) : airportGroups;
}

export const getAirport = async (icao: string) => {
    return airportGroups.flatMap(group => group.airports).find(airport => airport.icao === icao);
}