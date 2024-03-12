const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const dbFilePath = path.join(__dirname, 'Develop', 'db', 'db.json');
const publicDir = path.join(__dirname, 'Develop', 'public');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(publicDir));

app.get('/api/notes', getNotes);
app.post('/api/notes', createNote);
app.delete('/api/notes/:id', deleteNote);

app.get('/notes', (req, res) => res.sendFile(path.join(publicDir, 'notes.html')));
app.get('*', (req, res) => res.sendFile(path.join(publicDir, 'index.html')));

app.listen(PORT, () => console.log(`Server is listening on ${PORT}.`));

async function getNotes(req, res) {
  try {
    const data = await fs.readFile(dbFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    handleError(res, err);
  }
}

async function createNote(req, res) {
  try {
    const newNote = { ...req.body, id: uuidv4() };
    const data = await fs.readFile(dbFilePath, 'utf8');
    const notes = JSON.parse(data);
    notes.push(newNote);
    await fs.writeFile(dbFilePath, JSON.stringify(notes));
    res.json(newNote);
  } catch (err) {
    handleError(res, err);
  }
}

async function deleteNote(req, res) {
  try {
    const noteId = req.params.id;
    let data = await fs.readFile(dbFilePath, 'utf8');
    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);
    await fs.writeFile(dbFilePath, JSON.stringify(notes));
    res.send('Note deleted successfully.');
  } catch (err) {
    handleError(res, err);
  }
}

function handleError(res, err) {
  console.error(err);
  res.status(500).send('Internal Server Error');
}
