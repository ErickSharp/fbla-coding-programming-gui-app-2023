import { DocumentImport, Help, Rule } from "@carbon/icons-react";
import { PropsWithChildren } from "react";
import { CarbonIconSize } from "../types/common";

interface SidebarItemProps {
    onClick?: () => void;
    toolbarText: string;
}

const SidebarItem = ({ children, onClick, toolbarText }: PropsWithChildren<SidebarItemProps>) => (
    <div
        className="border-solid border-2 border-transparent hover:border-[var(--cds-button-primary)] bg-[var(--cds-layer-hover)] hover:bg-[var(--cds-overlay)] transition duration-150 p-3 cursor-pointer"
        onClick={onClick}
    >
        {children}
    </div>
);

export const Sidebar = () => {
    const SIDEBAR_ITEM_ICON_SIZE: CarbonIconSize = 32;

    return (
        <div className="bg-[var(--cds-layer)] p-3 space-y-3">
            <SidebarItem toolbarText="Load">
                <DocumentImport size={SIDEBAR_ITEM_ICON_SIZE} />
            </SidebarItem>
            <SidebarItem toolbarText="Backup">
                <Rule size={SIDEBAR_ITEM_ICON_SIZE} />
            </SidebarItem>
            <SidebarItem toolbarText="Help">
                <Help size={SIDEBAR_ITEM_ICON_SIZE} />
            </SidebarItem>
        </div>
    );
};