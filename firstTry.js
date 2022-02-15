const express = require('express');
const app = express();

app.use(express.json())

let notes = [
    {
        id: 1,
        content: "Nota numero 1",
        date: "10-10-10",
        important: false
    },
    {
        id: 2,
        content: "Nota numero 2",
        date: "10-10-11",
        important: true
    }

]
app.get('/', (req, res) => {
    res.send('<h1>hello world</h1>')
})
app.get('/api/notes', (req, res) => {
    res.json(notes)
})
app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    if(note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

app.post('/api/notes', (req, res) => {
    const note = req.body

    if(!note || note.content) {
        return res.status(400).json({
            error: 'note.content is missing'
        })
    }

    const notesIds = notes.map(n => n.id);
    const maxId = notesIds.length ? Math.max(...notesIds) : 0;
    const newId = maxId + 1;

    const newNote = {
        id: newId,
        content: note.content,
        important: typeof note.important !== 'undefined' ? note.important : false,
        date: new Date().toISOString()
    }

    notes = [...notes, newNote]

    console.log(newNote)
    res.status(201).json(note)
})

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})