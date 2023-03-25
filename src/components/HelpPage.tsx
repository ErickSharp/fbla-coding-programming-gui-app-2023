import { CaretDown } from "@carbon/icons-react";
import { emit } from "@tauri-apps/api/event";
import { Search } from "carbon-components-react";
import { useState } from "react";
import { qaEntries, QandAEntry } from "../QandA";

type QAItemProps = QandAEntry & { id: string };

const QAItem = ({question, answer, id}: QAItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div id={id}>
            <div className="flex items-center">
                <div className="flex items-center justify-between w-full py-4 cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
                    <div className="flex flex-row items-center justify-between w-full">
                        <p className="text-xl font-bold group-hover:text-gray-light duration-300">{question}</p>
                        <CaretDown size={16} />
                    </div>
                    <div>
                        <div className={`${isOpen && 'bg-blue-darker'} w-6 h-1 rounded-full bg-blue-light duration-300`} />
                        <div className={`${isOpen ? 'w-0 bg-blue-darker' : 'w-6'} h-1 mx-auto -translate-y-1 duration-300 rotate-90 rounded-full bg-blue-light`} />
                    </div>
                </div>
            </div>
            <div className={`${isOpen ? 'py-3' : 'h-0'} duration-200 overflow-hidden leading-loose`}>
                {answer}
            </div>
        </div>
    );
}

export const HelpPage = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="w-full h-full overflow-y-scroll p-4">
            <div className="flex flex-row items-center justify-between">
                <h1>Frequently Asked Questions</h1>
                <p
                    className="text-blue-500 hover:text-blue-800 text-xl transition duration-150 underline cursor-pointer"
                    tabIndex={0}
                    onClick={() => emit("toggle-help-menu")}
                >
                    Close Help Menu
                </p>
            </div>

            <Search 
                className="mt-4"
                placeholder="Search through frequently asked questions"
                labelText="Q & A Search Bar"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.currentTarget.value)}
            />
            
            <div className="mt-4 flex flex-col divide-y-2 divide-white">
                {qaEntries.filter(entry => entry.answer.toUpperCase().includes(searchTerm.toUpperCase()) || entry.question.toUpperCase().includes(searchTerm.toUpperCase()))
                    .map(({question, answer}, i) => (
                        <QAItem id={i.toString()} question={question} answer={answer} />
                    )
                )}
            </div>
        </div>
    );
}