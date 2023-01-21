
import './styles/App.scss';
import { Dashboard } from './components/Dashboard/Dashboard'
import { Sidebar } from './components/Sidebar'
import { GlobalTheme } from '@carbon/react';
import { useCallback, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { Button } from 'carbon-components-react';

const App = () => {
    const [theme, setTheme] = useState("g100");
    const [databasePathSelected, setDatabasePathSelected] = useState(false);

    const refreshDatabasePathSelection = useCallback(async () => {
        const path = await invoke("get_database_path");
        setDatabasePathSelected(path !== null);
    }, []);

    useEffect(() => {
        refreshDatabasePathSelection();
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-carbon-theme", theme);
    }, [theme]);

    if (!databasePathSelected) {


        return (
            <div className='w-full h-screen flex flex-col items-center justify-center space-y-8'>
                <div className='flex flex-col items-center space-y-2'>
                    <h1 className='font-bold text-7xl'>Hello There!</h1>
                    <p>Let's get you set up with a database file</p>
                </div>
                <div className='flex flex-row items-center space-x-4'>
                    <Button>
                        Make a new one
                    </Button>
                    <Button onClick={async () => {
                        const filePath = await invoke("get_selected_file_path");
                        await invoke("set_database_path", { path: filePath });

                        refreshDatabasePathSelection();
                    }}>
                        I have my own
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex flex-row overflow-x-hidden">
            <GlobalTheme theme={theme}>
                <Sidebar />
                <Dashboard />
            </GlobalTheme>
        </div>
    )
}

export default App;
