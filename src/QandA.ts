export interface QandAEntry {
    question: string,
    answer: string
}

const concatLines = (...lines: string[]) => {
    return lines.join(" ");
}

export const qaEntries: QandAEntry[] = [
    {
        question: "I have a lot of new members that I need to add, is there any way I can do that quickly?",
        answer: concatLines(
            "Of course!",
            "On the main dashboard, to the right of your database's name, you will find a button that reads 'Dump Import from CSV Roster.'",
            "After clicking the button, select a CSV file that contains a roster of your students in (Student Name, Grade Level) order.",
            "After doing so, your students will be quickly loaded into your database!"
        )
    },
    {
        question: "I need to get a list of the students in my chapter. How can I do this?",
        answer: concatLines(
            "Aside from viewing all students on the main dashboard screen, you can also export a list of all students and their respective grade levels into a CSV file.",
            "You can do so by clicking the button on the sidebar with a 'CSV' icon that is tooltipped with 'Export Current Database Roster as CSV'"
        ),
    },
    {
        question: "What type of participation events can I input for a given student? Are there only presets?",
        answer: concatLines(
            "You have a wide range of participation events that can be input for students.",
            "There are preset events consisting of five sporting and five non-sporting events that you can quickly select from.",
            "In addition, you can also create custom events that give you the liberty to edit a wide array of attributes.",
            "Whichever event you choose to insert, you can do so at the bottom of the student edit modal where there are buttons that read 'Add New Custom Event' or 'Add New Pre-Set Event'"
        )
    },
    {
        question: "I am scared that my chapter's data isn't safe in just one place. What can I do?",
        answer: concatLines(
            "Don't worry!",
            "SNHS Legacy features a dynamic backup feature that allows you to backup your students' data with peace of mind.",
            "Simply click on the sidebar button with a shield on it tooltipped with 'Backup Current Database' and your database will be backed up.",
            "The file name will be the same as your current database but with '-backup' appended to the end of it, and can be found in the same location as your current database.",
            "Keep this backup file in a safe place in case anything happens to your original file.",
            "If ever needed, you can load up the backup file just like the original."
        )
    },
    {
        question: "I want to award a member of my SNHS chapter, how can I do this?",
        answer: concatLines(
            "You can award members in a variety of ways through SNHS Legacy's built in functionalities.",
            "After having at least one member in your chapter's data set, you can choose to award a member either randomly or through manual selection.",
            "For a random selection, you can click the button that reads 'Appoint Random Winner' at the top of the 'Student Statistics' table.",
            "For a manual selection, find your desired student in the 'Student Statistics' table and on their horizontal data strip, click on the button that reads 'Appoint as Winner.'",
            "After selecting a winner by either of these options, you can reveal the winner by clicking on the button that reads 'Show Winner!'"
        ),
    }
];