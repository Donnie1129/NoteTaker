const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('Develop/public'));

app.get('/notes', (req, res) => {
    console.log('GET /notes requested');
    fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes:', err);
            return res.status(500).send('Internal Server Error');
        }
        const parsedData = JSON.parse(data);
        console.log('Sending notes:', parsedData);
        res.json(parsedData);
    });
});

app.post('/notes', (req, res) => {
    console.log('POST /notes requested with body:', req.body);
    const newNote = { ...req.body, id: uuidv4() };
    fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes:', err);
            return res.status(500).send('Internal Server Error');
        }
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile('./Develop/db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                console.error('Error writing notes:', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Note added:', newNote);
            res.json(newNote);
        });
    });
});

app.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    console.log(`DELETE /notes/${noteId} requested`);
    fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes:', err);
            return res.status(500).send('Internal Server Error');
        }
        let notes = JSON.parse(data);
        notes = notes.filter((note) => note.id !== noteId);
        fs.writeFile('./Develop/db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                console.error('Error writing notes:', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log(`Note with ID ${noteId} deleted successfully.`);
            res.send('Note deleted successfully.');
        });
    });
});

app.get('/notes', (req, res) => {
    console.log('GET /notes (fallback) requested');
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    console.log('GET * (fallback) requested');
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
