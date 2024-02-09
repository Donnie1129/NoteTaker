const fs = require('fs');
const path = require('path');

// Function to generate a simple timestamp-based ID
const generateUniqueId = () => {
  return new Date().getTime().toString();
};

module.exports = (fs) => {
  const router = require('express').Router();

  // Read notes from db.json
  router.get('/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8'));
    res.json(notes);
  });

  // Save new note to db.json
  router.post('/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8'));

    // Assign a simple timestamp-based ID
    newNote.id = generateUniqueId();

    notes.push(newNote);
    fs.writeFileSync(path.join(__dirname, '../db.json'), JSON.stringify(notes));
    res.json(newNote);
  });

  // Bonus: Delete note by id
  router.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    let notes = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8'));
    notes = notes.filter((note) => note.id !== noteId);
    fs.writeFileSync(path.join(__dirname, '../db.json'), JSON.stringify(notes));
    res.json({ msg: 'Note deleted' });
  });

  return router;
};
