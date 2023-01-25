import { Edit, TrashCan, TrophyFilled } from "@carbon/icons-react";
import {
    Modal,
    Button,
    DataTable,
    Table,
    TableBatchAction,
    TableBatchActions,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    TableSelectAll,
    TableSelectRow,
    TableToolbar,
    TableToolbarContent,
    TableToolbarSearch
} from "carbon-components-react";

import { PropsWithClassName } from "../../types/common";
import { invoke } from "@tauri-apps/api";
import { Student } from "../../schema";
import { useCallback, useEffect, useState } from "react";
import { AddStudentModal } from "./AddStudentModal";

interface TableStudent {
    id: number;
    name: string;
    gradeLevel: number;
    participationPoints: number;
    dateOfLastParticipation: number;
}

export const StudentStatisticsTable = ({ className }: PropsWithClassName) => {
    const [studentData, setStudentData] = useState<TableStudent[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
    const [winnerOpen, setWinnerOpen] = useState(false);

    const [winner, setWinner] = useState<string | undefined>(undefined);
    const getStudentData = async (): Promise<TableStudent[]> => {
        const { students } = await (invoke("get_students") as Promise<{ students: Student[] }>);
        const studentPointMap: Record<Student["id"], TableStudent["participationPoints"]> = {};

        for (const student of students) {
            const participationPoints = await (invoke("get_student_participation_points", { studentId: student.id }) as Promise<number>);
            studentPointMap[student.id] = participationPoints;
        }

        return students.map(student => ({
            ...student,
            participationPoints: studentPointMap[student.id],
            dateOfLastParticipation: (() => {
                if (student.participationEvents.length === 0) return -1;

                const earliestToLatest = student.participationEvents.map(participationEvent => participationEvent.date).sort();
                const latest = earliestToLatest[student.participationEvents.length - 1];

                return latest;
            })()
        }));
    }

    const updateStudents = useCallback(() => {
        getStudentData().then(student => {
            setStudentData(student);
        });
    }, [setStudentData]);

    useEffect(() => {
        getStudentData().then(students => {
            setStudentData(students);
        });
    }, []);

    const DATA_TABLE_HEADERS = [
        { key: "name", header: "Name" },
        { key: "gradeLevel", header: "Grade Level" },
        { key: "participationPoints", header: "Participation Points" },
        { key: "dateOfLastParticipation", header: "Date of Last Participation" }
    ];

    return (
        <div className={className}>
            <DataTable
                rows={studentData}
                headers={DATA_TABLE_HEADERS}
                // size="xs"
                isSortable
            >
                {({
                    rows,
                    headers,
                    getHeaderProps,
                    getRowProps,
                    getSelectionProps,
                    getToolbarProps,
                    getBatchActionProps,
                    onInputChange,
                    selectedRows,
                    getTableProps,
                    getTableContainerProps,
                }) => {
                    const batchActionProps = getBatchActionProps();

                    return (
                        <>
                            <Modal
                                open={modalOpen}
                                modalHeading={`Are you sure you want to delete ${(selectedRows as unknown[]).length == 1 ? 'this student' : 'these students'}?`}
                                primaryButtonText="Delete"
                                secondaryButtonText="Cancel"
                                danger
                                onRequestClose={() => setModalOpen(false)}
                                onRequestSubmit={() => {
                                    (selectedRows as { id: number }[]).forEach(({ id }) => {
                                        invoke("delete_student", { studentId: id });
                                    });
                                    updateStudents();
                                    setModalOpen(false);
                                }}
                            />
                            <AddStudentModal visibilityState={[addStudentModalOpen, setAddStudentModalOpen]} onSubmit={updateStudents} />
                            <TableContainer
                                title="Student Statistics"
                                description=""
                                {...getTableContainerProps()}>
                                <TableToolbar {...getToolbarProps()}>
                                    <TableBatchActions {...batchActionProps}>
                                        <TableBatchAction
                                            tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                                            renderIcon={TrashCan}
                                            onClick={() => {
                                                setModalOpen(true);
                                            }}
                                        >
                                            Delete
                                        </TableBatchAction>
                                    </TableBatchActions>
                                    <TableToolbarContent
                                        aria-hidden={batchActionProps.shouldShowBatchActions}>
                                        <TableToolbarSearch
                                            tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                                            onChange={onInputChange}
                                        />
                                        <Button
                                            tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                                            onClick={() => setAddStudentModalOpen(true)}
                                            size="small"
                                            kind="primary">
                                            Add new
                                        </Button>
                                        <Button renderIcon={TrophyFilled} onClick={() => setWinner(studentData[parseInt(Math.random() * studentData.length - 1)].name)}>
                                            Appoint Random Winner
                                        </Button>
                                        <Button renderIcon={TrophyFilled} onClick={() => setWinnerOpen(true)}>
                                            Show Winner!
                                        </Button>
                                    </TableToolbarContent>
                                </TableToolbar>
                                <Modal open={winnerOpen} onRequestClose={() => setWinnerOpen(false)} onRequestSubmit={() => setWinnerOpen(false)} primaryButtonText="Okay" secondaryButtonText="Close" modalHeading={winner === undefined ? "No winner yet!" : `${winner} is our winner!`}></Modal>
                                <Table {...getTableProps()}>
                                    <TableHead>
                                        <TableRow>
                                            <TableSelectAll {...getSelectionProps()} />
                                            <>
                                                {headers.map((header, i) => (
                                                    <TableHeader key={i} {...getHeaderProps({ header })}>
                                                        {header.header}
                                                    </TableHeader>
                                                ))}
                                                <TableHeader>Actions</TableHeader>
                                            </>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row, i) => (
                                            <TableRow key={i} {...getRowProps({ row })}>
                                                <TableSelectRow {...getSelectionProps({ row })} />
                                                <>
                                                    {row.cells.map((cell) => {
                                                        const { info: { header } } = cell;

                                                        let value = cell.value;
                                                        if (header === "dateOfLastParticipation") {
                                                            if (cell.value === -1) {
                                                                value = "N/A";
                                                            } else {
                                                                value = new Date(value * 1000).toDateString()
                                                            }
                                                        }

                                                        return (
                                                            <TableCell key={cell.id}>{value}</TableCell>
                                                        )
                                                    })}
                                                    <TableCell style={{ padding: '0', width: '0' }}>
                                                        <div className="flex flex-row items-center justify-end">
                                                            <Button renderIcon={TrophyFilled} onClick={() => setWinner(row.cells[0].value)}>
                                                                Appoint Winner
                                                            </Button>

                                                        </div>
                                                    </TableCell>
                                                </>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    );
                }}
            </DataTable>
        </div>
    );
};