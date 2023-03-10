import { CarbonIconType, FlashFilled, Meter, Renew, TrophyFilled } from "@carbon/icons-react";
import { CarbonIconSize, PropsWithClassName } from "../../types/common";
import { useCallback, useState } from "react";
import { ParticipationEventKind } from "../../schema";

enum StatisticsBarItemColor {
    Blue,
    Green,
    Red
}

interface StatisticsBarItemProps {
    headerText: string;
    dataText: string | undefined;
    icon: CarbonIconType;
    color: StatisticsBarItemColor;
}

const StatisticCard = ({ headerText, dataText, icon: Icon, color }: StatisticsBarItemProps) => {
    const colorDependentStyles = ({
        [StatisticsBarItemColor.Blue]: { cardOutlineColor: 'text-blue-500', badgeOutlineColor: 'border-[var(--cds-layer-selected-hover)]', badgeBackgroundColor: 'bg-[var(--cds-layer-hover)]' },
        [StatisticsBarItemColor.Green]: { cardOutlineColor: 'text-green-500', badgeOutlineColor: 'border-green-500', badgeBackgroundColor: 'bg-green-200' },
        [StatisticsBarItemColor.Red]: { cardOutlineColor: 'text-red-500', badgeOutlineColor: 'border-red-500', badgeBackgroundColor: 'bg-red-200' }
    } satisfies {
            [key in StatisticsBarItemColor]: { cardOutlineColor: string, badgeOutlineColor: string, badgeBackgroundColor: string }
        })[color];

    const STATISTICS_BAR_ITEM_ICON_SIZE: CarbonIconSize = 32;

    return (
        <div className={`border-solid border h-32 bg-[var(--cds-layer)] border-[var(--cds-layer-hover)] ${colorDependentStyles.cardOutlineColor} hover:border-current flex flex-row space-x-5 p-5 shadow-none hover:shadow-xl transition duration-150 text-blue-500`}>
            <div className={`rounded-md border-solid border ${colorDependentStyles.badgeOutlineColor} ${colorDependentStyles.badgeBackgroundColor} flex items-center justify-center w-14`}>
                <Icon size={STATISTICS_BAR_ITEM_ICON_SIZE} />
            </div>
            <div className="self-center">
                <h3 className="text-base whitespace-nowrap text-[var(--cds-text-secondary)]">{headerText}</h3>
                <h1 className="font-bold whitespace-nowrap text-[var(--cds-text-primary)]">{dataText ?? "Loading"}</h1>
            </div>
        </div>
    )
}

type StatisticsBarData = {
    mostParticipationGrade: number,
    averageParticipationPoints: number,
    mostPopularEventType: ParticipationEventKind
}

export const StatisticsBar = ({ className }: PropsWithClassName) => {
    const [data, setData] = useState<Partial<StatisticsBarData>>({
        mostParticipationGrade: undefined,
        averageParticipationPoints: undefined,
        mostPopularEventType: undefined
    });

    const refreshData = useCallback(() => {

    }, []);

    return (
        <div className={className}>
            <div
                className="flex flex-row items-center w-fit space-x-2 mb-2 group cursor-pointer text-[var(--cds-text-secondary)] hover:text-[var(--cds-button-primary)]"
                onClick={refreshData}
            >
                <p>Refresh</p>
                <Renew className="group-hover:rotate-180 transition duration-200" />
            </div>
            <div className={`relative w-full h-40 overflow-x-hidden`}>
                <div className="absolute inset-x-0 overflow-x-scroll flex flex-row items-center space-x-6" >
                    <StatisticCard
                        headerText="Most Participation Achieved by"
                        dataText={data.mostParticipationGrade !== undefined ? `Grade ${data.mostParticipationGrade}` : undefined}
                        icon={TrophyFilled}
                        color={StatisticsBarItemColor.Blue}
                    />
                    <StatisticCard
                        headerText="Average Participant Achieved"
                        dataText={data.averageParticipationPoints !== undefined ? `${data.averageParticipationPoints} Points` : undefined}
                        icon={TrophyFilled}
                        color={StatisticsBarItemColor.Blue}
                    />
                    <StatisticCard
                        headerText="Students Participated Most in"
                        dataText={data.mostPopularEventType !== undefined ? `Sporting` : undefined}
                        icon={FlashFilled}
                        color={StatisticsBarItemColor.Blue}
                    />
                </div>
            </div>
        </div>
    );
}