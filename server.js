// Pull in required modules/functions
const express = require('express');
const path = require('path');
const fs = require('fs');
// Holds read/write functions to help clean up this file
const { readFilePromise, writeToFile, appendData } = require('./utils/utilities');
// module that generates unique id
const uuid = require('uuid');

// Establish port variable
const PORT = process.env.PORT || 3001;

// Establish express variable
const app = express();

// Set up data types
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up public folder
app.use(express.static('public'));

// Sends notes.html file based on /notes path
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET /api/notes should return db.json all notes as json
app.get('/api/notes', async (req, res) => {
    try {
        // Read db from file; must do this every call since page dynamically updates; uses method from utilities.js
        const dbString = await readFilePromise('./db/db.json');

        // Parse db into JSON to send in response
        const parsedDB = JSON.parse(dbString);

        // Send json db back
        res.json(parsedDB);
    } catch(err){
        // Send back error message if GET fails
        res.json(err);
    }
})

// POST /api/notes addes new note to json db
app.post('/api/notes', async (req, res) => {
    try {
         // Destructure note from req.body
        const { title, text } = req.body;

        // If post missing either title or text, return an error; prevent rest of code from running
        if (!title || !text) {
            return console.log("Missing note component.")
        }

        // New note variable object
        const newNote = {
            title, 
            text, 
            id: uuid.v4()
        };

        // Call appendData function from utilities.js; pushes new note into array, writes to file, returns db as json for res below
        const newNoteList = await appendData(newNote, './db/db.json');

        // Send updated object array to user as json
        res.json(newNoteList)

    } catch(err) {
        res.json(err);
    }
})

// Remove note with the given `id` property, and then rewrite remaining notes to the `db.json` file.
app.delete('/api/notes/:id', async (req, res) => {
    try {
        // Id of note to delete based on api request
        const noteId = req.params.id;

        // Get db in string form via function from utilities.js
        const dbString = await readFilePromise('./db/db.json');

        // Parse db into json
        const dbParse = JSON.parse(dbString);

        // Adds notes to new array (dbElRemoved) that do not match id to be removed; return array with remaining notes
        const dbElRemoved = dbParse.filter((el) => {
            return el.id !== noteId;
        })

        // Write new note list to file using method from utilities.js
        await writeToFile('./db/db.json', dbElRemoved);

        // New json array returned in res
        res.json(dbElRemoved);

        
    } catch(err){
        res.json(err);
    }
})

// Any other / route re-directs to index page
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Open ports
app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`App listening on Port ${PORT}`);
});