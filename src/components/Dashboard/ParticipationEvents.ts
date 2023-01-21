import { ParticipationEventKind } from "../../schema";

type ParticipationEvent = {
    kind: ParticipationEventKind,
    name: string,
    date: number,
}

const SPORTS_PARTICIPATION_EVENTS: ParticipationEvent[] = [
    {
        kind: ParticipationEventKind.Sporting,
        name: "Homecoming Game",
        date: 10
    }
];

const NON_SPORTS_PARTICIPATION_EVENTS: ParticipationEvent[] = [
    {
        kind: ParticipationEventKind.NonSporting,
        name: "Trunk or Treat",
        date: 10
    }
];

export const ALL_PARTICIPATION_EVENTS: ParticipationEvent[] = [...SPORTS_PARTICIPATION_EVENTS, ...NON_SPORTS_PARTICIPATION_EVENTS];