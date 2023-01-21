import { invoke } from "@tauri-apps/api";
import { Button, DatePicker, DatePickerInput, Modal, NumberInput, Select, SelectItem, TextArea, TextInput } from "carbon-components-react";
import { useCallback, useEffect, useState } from "react";
import { ParticipationEvent, ParticipationEventKind } from "../../schema";
import { AddFilled } from "@carbon/icons-react";

interface AddStudentModalProps {
    visibilityState: [boolean, (visibility: boolean) => void];
    onSubmit: () => void;
}

export const AddStudentModal = ({ visibilityState: [open, setOpen], onSubmit }: AddStudentModalProps) => {
    const [studentName, setStudentName] = useState("");
    const [gradeLevel, setGradeLevel] = useState(10);
    const [participationEvents, setParticipationEvents] = useState<(Partial<ParticipationEvent> & { id: number })[]>([]);

    const editParticipationEvent = useCallback(<T extends keyof ParticipationEvent,>(id: number, key: T, value: ParticipationEvent[T]) => {
        setParticipationEvents(old => {
            const selectedEventIndex = old.findIndex((element) => element.id === id);

            const selectedEvent = old[selectedEventIndex];

            // Associate the provided key with the new data given
            old[selectedEventIndex] = {
                ...selectedEvent,
                [key]: value
            };

            return [...old]
        })
    }, [participationEvents]);

    useEffect(() => {
        /* something useful here */
        console.log(open)
        if (!open) {
            setStudentName("");
            setGradeLevel(10);
            setParticipationEvents([]);
        }
    }, [open])

    return (
        <Modal
            open={open}
            modalHeading="Add a Student"
            primaryButtonText="Add"
            secondaryButtonText="Cancel"
            onRequestClose={() => setOpen(false)}
            primaryButtonDisabled={!studentName || typeof gradeLevel === "string" || (() => {
                for (const participationEvent of participationEvents) {
                    const { name, date, kind, points } = participationEvent;
                    if (!(name && date && kind && typeof points === "number")) return true;
                }
                return false;
            })()}
            onRequestSubmit={() => {
                invoke("add_student",
                    {
                        name: studentName, gradeLevel, participationEvents: participationEvents.map(participationEvent => {
                            return {
                                ...participationEvent,
                                notes: participationEvent.notes || null
                            };
                        }) as ParticipationEvent[]
                    });
                onSubmit();
                setOpen(false);
            }}
        >
            <div className="space-y-4">
                <TextInput
                    data-model-primary-focus
                    id=""
                    labelText="Student Name"
                    value={studentName}
                    onInput={(e) => { setStudentName(e.currentTarget.value) }}
                />
                <NumberInput
                    id=""
                    min={0}
                    value={gradeLevel}
                    label="Student Grade Level"
                    invalidText="Entry is invalid; check that entry is a number and fits within range."
                    hideSteppers={typeof gradeLevel === "string"}
                    onChange={(_, { value }) => {
                        const parsed = parseInt(value);
                        if (Number.isNaN(parsed)) {
                            setGradeLevel(value);
                        } else {
                            setGradeLevel(parsed);
                        }
                    }}
                />
                <p>Participation Events</p>

                <div className="flex flex-col space-y-8 divide-y-2  divide-blue-500">
                    {participationEvents.map(participationEvent => {
                        return (
                            <div className="space-y-4">
                                <TextInput
                                    id=""
                                    labelText="Event Name"
                                    onInput={(e) => editParticipationEvent(participationEvent.id, "name", e.currentTarget.value)}
                                />
                                <Select
                                    id=""
                                    defaultValue="placeholder"
                                    labelText="Event Type"
                                    onChange={(e) => editParticipationEvent(participationEvent.id, "kind", e.target.value as ParticipationEventKind)}
                                >
                                    <SelectItem disabled hidden value="placeholder" text="Choose an Event Type" />
                                    <SelectItem value={ParticipationEventKind.NonSporting} text="Non-Sporting" />
                                    <SelectItem value={ParticipationEventKind.Sporting} text="Sporting" />
                                </Select>
                                <DatePicker
                                    datePickerType="single"
                                    onChange={([date]) => editParticipationEvent(participationEvent.id, "date", Math.floor(date.getTime() / 1000))}
                                >
                                    <DatePickerInput placeholder="MM/DD/YYYY" labelText="Event Date" id="" />
                                </DatePicker>
                                <NumberInput
                                    id=""
                                    min={0}
                                    value={participationEvent.points}
                                    label="Event Point Value"
                                    invalidText="Entry is invalid; check that entry is a number and fits within range."
                                    hideSteppers={typeof participationEvent.points === "string"}
                                    onChange={(_, { value }: { value: number | string }) => {
                                        const usedValue = (() => {
                                            const parsed = parseInt(value);
                                            if (Number.isNaN(parsed)) {
                                                return value;
                                            } else {
                                                return parsed;
                                            }
                                        })();

                                        editParticipationEvent(participationEvent.id, "points", usedValue);
                                    }}
                                />
                                <TextArea
                                    labelText="Event Notes (Optional)"
                                    value={participationEvent.notes ?? ""}
                                    onChange={(e) => editParticipationEvent(participationEvent.id, "notes", e.target.value)}
                                />
                                <Button
                                    kind="danger"
                                    onClick={() => setParticipationEvents(old => old.filter(element => element.id !== participationEvent.id))}
                                >
                                    Delete Event
                                </Button>
                            </div>
                        )
                    })}
                </div>
                <button
                    type="button"
                    className="flex flex-row items-center justify-center p-4 space-x-4 w-full bg-transparent hover:bg-[var(--cds-background)] transition duration-150"
                    onClick={() => {
                        setParticipationEvents(old => [...old, { id: participationEvents.length + 1 }]);
                    }}
                >
                    <AddFilled size={32} />
                    <p className="!pr-0">Add New Event</p>
                </button>
            </div>
        </Modal>
    )
}