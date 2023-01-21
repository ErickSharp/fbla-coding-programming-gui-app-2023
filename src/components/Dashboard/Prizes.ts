enum PrizeKind {
    School,
    Food,
    SchoolSpirit
}

type Prize = {
    kind: PrizeKind,
    name: string,
    description: string
}

export const PRIZES: Prize[] = [
    {
        kind: PrizeKind.School,
        name: "",
        description: ""
    },
    {
        kind: PrizeKind.Food,
        name: "",
        description: ""
    },
    {
        kind: PrizeKind.SchoolSpirit,
        name: "",
        description: ""
    }
]