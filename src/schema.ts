export enum ParticipationEventKind {
    NonSporting = "NonSporting",
    Sporting = "Sporting",
}

export interface ParticipationEvent {
    name: string;
    date: number;
    notes: string | null;
    points: number;
    kind: ParticipationEventKind;
}

export interface Student {
    id: number;
    name: string;
    gradeLevel: number;
    participationEvents: ParticipationEvent[];
}

interface Data {
    students: Student[];
}

export { };