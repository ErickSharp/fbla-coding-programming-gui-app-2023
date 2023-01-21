import { CarbonIconType, FlashFilled, Meter, Renew, TrophyFilled } from "@carbon/icons-react";
import { CarbonIconSize, PropsWithClassName } from "../../types/common";

enum StatisticsBarItemColor {
    Blue,
    Green,
    Red
}

interface StatisticsBarItemProps {
    headerText: string;
    dataText: string;
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
                <h1 className="font-bold whitespace-nowrap text-[var(--cds-text-primary)]">{dataText}</h1>
            </div>
        </div>
    )
}

export const StatisticsBar = ({ className }: PropsWithClassName) => {
    return (
        <div className={className}>
            <div className="flex flex-row items-center w-fit space-x-2 mb-2 group cursor-pointer text-[var(--cds-text-secondary)] hover:text-[var(--cds-button-primary)]">
                <p>Refresh</p>
                <Renew className="group-hover:rotate-180 transition duration-200" />
            </div>
            <div className={`relative w-full h-40 overflow-x-hidden`}>
                <div className="absolute inset-x-0 overflow-x-scroll flex flex-row items-center space-x-6" >
                    <StatisticCard
                        headerText="Participation Greater than Last Quarter by"
                        dataText="22%"
                        icon={Meter}
                        color={StatisticsBarItemColor.Green}
                    />
                    <StatisticCard
                        headerText="Most Participation Achieved by"
                        dataText="Grade 12"
                        icon={TrophyFilled}
                        color={StatisticsBarItemColor.Blue}
                    />
                    <StatisticCard
                        headerText="Average Participant Achieved"
                        dataText="13 Points"
                        icon={TrophyFilled}
                        color={StatisticsBarItemColor.Blue}
                    />
                    <StatisticCard
                        headerText="Students Participated Most in"
                        dataText="Sporting"
                        icon={FlashFilled}
                        color={StatisticsBarItemColor.Blue}
                    />
                    <StatisticCard
                        headerText="District Performance"
                        dataText="Absolutely Horrible"
                        icon={Meter}
                        color={StatisticsBarItemColor.Red}
                    />
                </div>
            </div>
        </div>
    );
}