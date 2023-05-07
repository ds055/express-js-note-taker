const express = require('express');
const path = require('path');
const fs = require('fs');
const { readFilePromise, writeToFile, appendData } = require('./utils/utilities');
const uuid = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Sends notes.html file based on /notes path
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET /api/notes should return db.json all notes as json
app.get('/api/notes', async (req, res) => {
    try {
        // Read db from file; must do this every call since page dynamically updates
        const dbString = await readFilePromise('./db/db.json');

        // Parse into JSON to send in response
        const parsedDB = JSON.parse(dbString);

        // Send JSON db back
        res.json(parsedDB);
    } catch(err){
        // Send back error message if get fails
        res.json(err);
    }
})

// Add new post
app.post('/api/notes', async (req, res) => {
    try {
         // Destructure note from req.body
        const { title, text } = req.body;

        // If post missing either title or text, return an error; prevent rest of code from running
        if (!title || !text) {
            return console.log("Missing note component.")
        }

        // New note variable
        const newNote = {
            title, 
            text, 
            id: uuid.v4()
        };

        const newNoteList = await appendData(newNote, './db/db.json');

        res.json(newNoteList)


        // // Get notes db
        // const dbString = await fs.promises.readFile('./db/db.json')

        // // Parse db
        // const parsedDB = JSON.parse(dbString)

        // // Add note to parsed data
        // parsedDB.push(newNote);

        // // Stringify parsedDB
        // const restrungDB = JSON.stringify(parsedDB, null, 4);

        // // Write parse data to file
        // fs.writeFile(
        // './db/db.json',
        // restrungDB,
        // (err) => err ? console.log(err): console.log("Success!"));

        // res.json(parsedDB);
        
    } catch(err) {
        res.json(err);
    }
})

// `DELETE /api/notes/:id` should receive a query parameter that contains the id of a note to delete. To delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const noteId = req.params.id



        
    } catch(err){
        res.json(err);
    }
})

// Any other route re-directs to index page
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`App listening on Port ${PORT}`);
});