import { Button } from "carbon-components-react";
import { StatisticsBar } from "./StatisticsBar";
import { StudentStatisticsTable } from "./StudentStatisticsTable";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";

export const Dashboard = () => {
    const [databaseFilename, setDatabaseFilename] = useState("");

    useEffect(() => {
        invoke("get_database_filename").then(filename => setDatabaseFilename(filename as string));
    }, []);


    return (
        <div className="w-full h-full overflow-y-scroll p-4">
            <div className="flex flex-row justify-between flex-wrap">
                <div className="flex flex-row items-center space-x-4">
                    <h1 className="font-semibold">{databaseFilename}</h1>
                    {/* <p className="text-blue-500 hover:text-blue-800 text-xl transition duration-150 underline cursor-pointer" tabIndex={0}>Change</p> */}
                </div>
                <div className="flex flex-row items-center space-x-5">
                    {/* <Button>Award Menu</Button> */}
                    {/* <Button>Generate Quarter Report</Button> */}
                </div>
            </div>

            {/* <StatisticsBar className="mt-5" /> */}
            <StudentStatisticsTable className="mt-16" />
        </div>
    );
};
