
import './styles/App.scss';
import { Dashboard } from './components/Dashboard/Dashboard'
import { Sidebar } from './components/Sidebar'
import { GlobalTheme } from '@carbon/react';
import { useCallback, useEffect, useState } from 'react';
import { fs, invoke, path } from '@tauri-apps/api';
import { Button, Modal, TextInput } from 'carbon-components-react';

const App = () => {
    const [theme, setTheme] = useState("g100");
    const [databasePathSelected, setDatabasePathSelected] = useState(false);
    const [createFileModalOpen, setCreateFileModalOpen] = useState(false);
    const [databaseFilename, setDatabaseFilename] = useState('');
    const [databaseFilenameValid, setDatabaseFilenameValid] = useState(false);
    const [folderLocation, setFolderLocation] = useState<null | string>(null);

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

    const verifyFilename = useCallback((filename: string) => {
        return (/^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/).test(filename);
    }, []);

    useEffect(() => {
        setDatabaseFilenameValid(verifyFilename(databaseFilename));
    }, [databaseFilename])

    if (!databasePathSelected) {
        return (
            <div className='w-full h-screen flex flex-col items-center justify-center space-y-8'>
                <Modal
                    open={createFileModalOpen}
                    modalHeading="Create New Database"
                    primaryButtonText="Create"
                    secondaryButtonText="Cancel"
                    onRequestClose={() => setCreateFileModalOpen(false)}
                    primaryButtonDisabled={!databaseFilenameValid || folderLocation === null}
                    onRequestSubmit={async () => {
                        const filePath = path.join(folderLocation as string, databaseFilename)
                        await invoke("create_database_file", { path: filePath });
                        await invoke("set_database_path", { path: filePath });
                        await invoke("initialize_tables");

                        refreshDatabasePathSelection();
                        setCreateFileModalOpen(false);
                    }}
                >
                    <TextInput
                        data-model-primary-focus
                        id=""
                        labelText="Database Filename"
                        value={databaseFilename}
                        invalid={!databaseFilenameValid}
                        invalidText="Invalid Filename. Remove illegal characters if any, and ensure the field is not empty."
                        onInput={(e) => { setDatabaseFilename(e.currentTarget.value) }}
                    />

                    <div className='mt-5 space-x-4 flex flex-row items-center'>
                        <Button className='mt-5' onClick={async () => {
                            const folderPath: string | null = await invoke('get_selected_folder_path');
                            if (folderPath !== null) {
                                setFolderLocation(folderPath);
                            }
                        }}>
                            Select Folder Location
                        </Button>
                        {(folderLocation === null) ? (
                            <p className='text-[var(--cds-text-error)]'>Make sure to select a folder location before proceeding.</p>
                        ) : (
                            <p>{folderLocation}</p>
                        )}
                    </div>
                </Modal>
                <div className='flex flex-col items-center space-y-2'>
                    <h1 className='font-bold text-7xl'>Hello There!</h1>
                    <p>Let's get you set up with a database file</p>
                </div>
                <div className='flex flex-row items-center space-x-4'>
                    <Button onClick={() => {
                        setCreateFileModalOpen(true);
                    }}>
                        Make a new one
                    </Button>
                    <Button onClick={async () => {
                        const filePath = await invoke("get_selected_file_path");
                        await invoke("set_database_path", { path: filePath });
                        await invoke("initialize_tables");

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
