#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{fs, path::Path, time::Duration, io::Write};

use rfd::FileDialog;
use rusqlite::{backup, params, Connection};
use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct Student {
    id: u32,
    name: String,
    grade_level: u32,
    participation_events: Vec<ParticipationEvent>,
}

#[derive(Deserialize, Debug, Serialize)]
enum ParticipationEventKind {
    NonSporting = 0,
    Sporting = 1,
}

impl From<u32> for ParticipationEventKind {
    fn from(f: u32) -> Self {
        match f {
            0 => Self::NonSporting,
            1 => Self::Sporting,
            _ => panic!(
                "Integer value {} cannot be parsed into a variant of ParticipationEventKind",
                f
            ),
        }
    }
}

#[derive(Deserialize, Debug, Serialize)]
struct ParticipationEvent {
    name: String,
    date: u64,
    notes: Option<String>,
    points: u32,
    kind: ParticipationEventKind,
}

#[tauri::command]
fn add_participation_event(
    student_id: u32,
    name: String,
    date: u64,
    notes: Option<String>,
    points: u32,
    kind: ParticipationEventKind,
) {
    let connection = Connection::open(get_database_path().unwrap()).unwrap();
    connection.execute("INSERT INTO ParticipationEvents(StudentId, Name, Date, Notes, Points, Kind) VALUES(?1, ?2, ?3, ?4, ?5, ?6)", params![student_id, name, date, notes, points, kind as u32]);
}

#[derive(Serialize)]
struct StudentResponse {
    students: Vec<Student>,
}

#[tauri::command]
fn get_students() -> StudentResponse {
    let connection = Connection::open(get_database_path().unwrap()).unwrap();

    let mut student_statement = connection.prepare("SELECT * FROM Students").unwrap();
    let students = student_statement
        .query_map([], |row| {
            let student_id: u32 = row.get(0)?;

            let mut participation_events_statement = connection
                .prepare("SELECT * FROM ParticipationEvents WHERE StudentId = (?1)")
                .unwrap();

            // Query for participation events, unwrap data, and bundle it into 'ParticipationEvent' structs
            let participation_events: Vec<ParticipationEvent> = participation_events_statement
                .query_map(params![student_id], |row| {
                    let participation_event_kind_number: u32 = row.get(5)?;

                    Ok(ParticipationEvent {
                        name: row.get(1)?,
                        date: row.get(2)?,
                        notes: row.get(3)?,
                        points: row.get(4)?,
                        kind: ParticipationEventKind::from(participation_event_kind_number),
                    })
                })
                .unwrap()
                .filter_map(|res| {
                    if let Ok(participation_event) = res {
                        Some(participation_event)
                    } else {
                        None
                    }
                })
                .collect();

            Ok(Student {
                id: student_id,
                name: row.get(1)?,
                grade_level: row.get(2)?,
                participation_events,
            })
        })
        .unwrap()
        .filter_map(|res| {
            if let Ok(student) = res {
                Some(student)
            } else {
                None
            }
        })
        .collect::<Vec<_>>();
    StudentResponse { students }
}

#[tauri::command]
fn get_student_participation_points(student_id: u32) -> u32 {
    let connection = Connection::open(get_database_path().unwrap()).unwrap();

    // Query to retrieve the points of a student with the given studentID
    let mut point_retrieval_statement = connection
        .prepare("SELECT Points from ParticipationEvents WHERE StudentID = (?1)")
        .unwrap();

    // Carry out the query and perform necessary unwrapping to get participation points
    point_retrieval_statement
        .query_map(params![student_id], |row| {
            let value: u32 = row.get(0)?;
            Ok(value)
        })
        .unwrap()
        .filter_map(|res| {
            if let Ok(points) = res {
                Some(points)
            } else {
                None
            }
        })
        .sum::<u32>()
}

#[tauri::command]
fn delete_student(student_id: u32) {
    let connection = Connection::open(get_database_path().unwrap()).unwrap();

    connection.execute(
        "DELETE FROM Students WHERE Id=(?1);
        DELETE FROM ParticipationEvents WHERE StudentId=(?1)",
        params![student_id],
    );
}

#[tauri::command]
fn add_student(name: String, grade_level: u32, participation_events: Vec<ParticipationEvent>) {
    let connection = Connection::open(get_database_path().unwrap()).unwrap();

    connection.execute(
        "INSERT INTO Students(Name, Grade) VALUES(?1, ?2)",
        params![name, grade_level],
    );

    let mut student_id_statement = connection.prepare("SELECT last_insert_rowid()").unwrap();
    let student_id: u32 = student_id_statement
        .query_row(params![], |row| row.get(0))
        .unwrap();

    participation_events.into_iter().for_each(
        |ParticipationEvent {
             name,
             date,
             notes,
             points,
             kind,
         }| {
            add_participation_event(student_id, name, date, notes, points, kind);
        },
    );
}

#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }

    window.get_window("main").unwrap().show().unwrap();
}

#[tauri::command]
fn initialize_tables() {
    if get_database_path().is_none() {
        return;
    }

    let connection = Connection::open(get_database_path().unwrap()).unwrap();

    // Set up table that holds student data
    connection.execute(
        "CREATE TABLE IF NOT EXISTS Students (
        Id INTEGER PRIMARY KEY,
        Name TEXT NOT NULL,
        Grade INTEGER NOT NULL
    )",
        params![],
    );

    // Set up table that holds participation events
    connection.execute(
        "CREATE TABLE IF NOT EXISTS ParticipationEvents (
            StudentId INTEGER NOT NULL,
            Name TEXT NOT NULL,
            Date INTEGER NOT NULL,
            Notes TEXT,
            Points INTEGER NOT NULL,
            Kind INTEGER NOT NULL
        )",
        params![],
    );
}

#[tauri::command]
fn backup_database(destination: String) {
    let src = Connection::open(get_database_path().unwrap()).unwrap();

    let mut backup_connection = Connection::open(Path::new(&destination)).unwrap();
    let mut backup = backup::Backup::new(&src, &mut backup_connection).unwrap();
    backup
        .run_to_completion(5, Duration::from_millis(250), None)
        .unwrap();
}

#[tauri::command]
fn create_database_file(path: String) {
    fs::write(path, "");
}

#[tauri::command]
fn get_selected_folder_path() -> Result<String, ()> {
    let folder = FileDialog::new()
        .set_directory("/")
        .pick_folder()
        .map_or(Err(()), |v| Ok(v))?;

    folder
        .into_os_string()
        .into_string()
        .map_or(Err(()), |v| Ok(v))
}

#[tauri::command]
fn get_selected_file_path() -> Result<String, ()> {
    let file = FileDialog::new()
        .set_directory("/")
        .pick_file()
        .map_or(Err(()), |v| Ok(v))?;

    file.into_os_string()
        .into_string()
        .map_or(Err(()), |v| Ok(v))
}

#[derive(Deserialize, Serialize, Default)]
#[serde(rename_all = "camelCase")]
struct AppConfig {
    database_path: Option<String>,
}

const CONFIG_PATH: &'static str = "./config.json";

fn initialize_config() {
    if Path::new(CONFIG_PATH).exists() {
        return;
    }

    fs::write(
        CONFIG_PATH,
        serde_json::to_string(&AppConfig::default()).unwrap(),
    );
}

#[tauri::command]
fn get_database_path() -> Option<String> {
    let config: AppConfig =
        serde_json::from_str(&fs::read_to_string(CONFIG_PATH).unwrap()).unwrap();
    config.database_path
}

#[tauri::command]
fn get_database_filename() -> Option<String> {
    Some(
        Path::new(&get_database_path().unwrap())
            .file_name()
            .unwrap()
            .to_os_string()
            .into_string()
            .unwrap(),
    )
}

#[tauri::command]
fn set_database_path(path: String) {
    let mut config: AppConfig =
        serde_json::from_str(&fs::read_to_string(CONFIG_PATH).unwrap()).unwrap();
    config.database_path = Some(path);

    fs::write(CONFIG_PATH, serde_json::to_string(&config).unwrap());
}

#[tauri::command]
fn dump_import_from_csv(path: String) {
    let csv_file = fs::read_to_string(path).unwrap();

    let mut reader = csv::Reader::from_reader(csv_file.as_bytes());

    for record in reader.records() {
        let record = record.unwrap();

        // FORMAT MUST BE name, grade_level
        let name = &record[0];
        let grade_level = &record[1];

        add_student(name.into(), grade_level.parse::<u32>().unwrap(), vec![]);
    }
}

#[tauri::command]
fn export_student_roster_as_csv(destination: String) {
    let mut roster_output_file = fs::File::create(destination).unwrap();

    let StudentResponse { students } = get_students();

    // Write header...
    roster_output_file.write_all(b"Student Name,Grade Level");

    // ...then write each line of CSV data for each student
    students.iter().for_each(|student| {
        roster_output_file.write_all(format!("{}, {}\n", student.name, student.grade_level).as_bytes());
    });
}

fn main() -> std::io::Result<()> {
    let context = tauri::generate_context!();

    initialize_config();
    tauri::Builder::default()
        .menu(if cfg!(target_os = "macos") {
            tauri::Menu::os_default(&context.package_info().name)
        } else {
            tauri::Menu::default()
        })
        .setup(|app| {
            initialize_tables();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // These functions bridge between the backend and frontend to encapsulate functionality
            add_participation_event,
            get_students,
            add_student,
            delete_student,
            close_splashscreen,
            get_student_participation_points,
            backup_database,
            get_selected_folder_path,
            get_selected_file_path,
            get_database_path,
            set_database_path,
            get_database_filename,
            initialize_tables,
            create_database_file,
            dump_import_from_csv,
            export_student_roster_as_csv
        ])
        .run(context)
        .expect("error while running tauri application");

    Ok(())
}
