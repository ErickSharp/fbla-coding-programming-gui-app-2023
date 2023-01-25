import { ParticipationEventKind } from "../../schema";

type ParticipationEvent = {
    kind: ParticipationEventKind,
    name: string,
    date: number,
}

const epochSeconds = (time: number): number => {
    return Math.floor(time / 1000);
}

const SPORTS_PARTICIPATION_EVENTS: ParticipationEvent[] = [
    {
        kind: ParticipationEventKind.Sporting,
        name: "Homecoming Game",
        date: epochSeconds(new Date("September 24, 2022").getTime())
    },
    {
        kind: ParticipationEventKind.Sporting,
        name: "Varsity Men's Basketball at Taylor",
        date: epochSeconds(new Date("October 10, 2022").getTime())
    },
    {
        kind: ParticipationEventKind.Sporting,
        name: "Girl's Volleyball Home Game",
        date: epochSeconds(new Date("November 19, 2022").getTime())
    },
    {
        kind: ParticipationEventKind.Sporting,
        name: "FBLA Dodgeball Tournament",
        date: epochSeconds(new Date("November 21, 2022").getTime())
    },
    {
        kind: ParticipationEventKind.Sporting,
        name: "Football Game at Morton Ranch",
        date: epochSeconds(new Date("December 13, 2022").getTime())
    }
];

const NON_SPORTS_PARTICIPATION_EVENTS: ParticipationEvent[] = [
    {
        kind: ParticipationEventKind.NonSporting,
        name: "Trunk or Treat",
        date: epochSeconds(new Date("October 26, 2022").getTime())
    },
    {
        kind: ParticipationEventKind.NonSporting,
        name: "Prom Decorations",
        date: epochSeconds(new Date("May 9, 2023").getTime())
    },
    {
        kind: ParticipationEventKind.NonSporting,
        name: "The Environmental Alliance's Spring Cleanup",
        date: epochSeconds(new Date("March 15, 2022").getTime())
    },
    {
        kind: ParticipationEventKind.NonSporting,
        name: "Science National Honor Society Teacher Goodie Bags",
        date: epochSeconds(new Date("May 10, 2023").getTime())
    },
    {
        kind: ParticipationEventKind.NonSporting,
        name: "African American Culture Club Poster Painting",
        date: epochSeconds(new Date("November 15, 2022").getTime())
    }
];

export const ALL_PARTICIPATION_EVENTS: ParticipationEvent[] = [...SPORTS_PARTICIPATION_EVENTS, ...NON_SPORTS_PARTICIPATION_EVENTS];