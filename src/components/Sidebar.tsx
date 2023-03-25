import { BrightnessContrast, Csv, Help, Rule } from "@carbon/icons-react";
import { invoke } from "@tauri-apps/api";
import { emit } from "@tauri-apps/api/event";
import { PropsWithChildren } from "react";
import { CarbonIconSize } from "../types/common";

interface SidebarItemProps {
    onClick?: () => void;
    toolbarText: string;
}

const SidebarItem = ({ children, onClick, toolbarText }: PropsWithChildren<SidebarItemProps>) => (
    <div
        className="border-solid border-2 border-transparent hover:border-[var(--cds-button-primary)] bg-[var(--cds-layer-hover)] hover:bg-[var(--cds-overlay)] transition duration-150 p-3 cursor-pointer"
        title={toolbarText}
        onClick={onClick}
    >
        {children}
    </div>
);

export const Sidebar = () => {
    // Appropriate naming
    const SIDEBAR_ITEM_ICON_SIZE: CarbonIconSize = 32;

    return (
        <div className="bg-[var(--cds-layer)] p-3 space-y-3">
            <SidebarItem toolbarText="Backup Current Database" onClick={async () => {
                const currentPath = await invoke("get_database_path") as string;
                invoke("backup_database", { destination: currentPath.replace(".db", "-backup.db") });
            }}>
                <Rule size={SIDEBAR_ITEM_ICON_SIZE} />
            </SidebarItem>
            <SidebarItem toolbarText="Export Current Database Roster as CSV" onClick={async () => {
                const currentPath = await invoke("get_database_path") as string;
                invoke("export_student_roster_as_csv", { destination: currentPath.replace(".db", "-roster-export.csv") });
            }}>
                <Csv size={SIDEBAR_ITEM_ICON_SIZE} />
            </SidebarItem>
            <SidebarItem toolbarText="Toggle Application Theme" onClick={() => {
                emit("toggle-app-theme");
            }}>
                <BrightnessContrast size={SIDEBAR_ITEM_ICON_SIZE} />
            </SidebarItem>
            <SidebarItem toolbarText="Help" onClick={() => {
                emit("toggle-help-menu");
            }}>
                <Help size={SIDEBAR_ITEM_ICON_SIZE} />
            </SidebarItem>
        </div>
    );
};