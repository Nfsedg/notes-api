require('dotenv').config()
const express = require('express');
const app = express();
require('./mongo')

const cors = require('cors');
const Note = require('./models/Note');
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const usersRouter = require('./controllers/users');
const User = require('./models/User');

app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'))

// const generateId = () => {
//     const notesIds = notes.map(n => n.id);
//     const maxId = notesIds.length ? Math.max(...notesIds) : 0;
//     const newId = maxId + 1;

//     return newId;
// };

app.get('/', (req, res) => {
    res.send('<h1>hello world</h1>')
})
app.get('/api/notes', async (req, res) => {
    // Note.find({}).then(notes => {
    //     res.json(notes)
    // });
    const notes = await Note.find({}).populate('user', {
        username: 1,
        name: 1
    })
    res.json(notes)
})
app.get('/api/notes/:id', (req, res, next) => {
    const { id } = req.params
    Note.findById(id).then(note => {
        if(note) {
            return res.json(note)
        } else {
            res.status(404).end()
        }
    }).catch(err => {
        next(err)
    })
})
app.put('/api/notes/:id', (req, res, next) => {
    const { id } = req.params
    const note = req.body

    const newNoteInfo = {
        content: note.content,
        important: note.important
    }
    Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
        .then(result => {
            res.json(result)
        })
        .catch(err => next(err))
})
app.delete('/api/notes/:id', async (req, res, next) => {
    const { id } = req.params
    
    try {
        await Note.findByIdAndDelete(id)
        
        res.status(204).end()
    } catch (err) {
        next(err)
    }
})

app.post('/api/notes', async (req, res, next) => {
    const { 
        content, 
        important = false,  
        userId
    } = req.body

    const user = await User.findById(userId)

    if(!content) {
        return res.status(400).json({
            error: 'note.content is missing'
        })
    } 

    const newNote = new Note({
        content,
        important,
        date: new Date(),
        user: user._id
    })

    // newNote.save().the(savedNote => {
    //     response.json(savedNote)
    // }).catch(err => next(err))

    try {
        const saveNote = await newNote.save()

        user.notes = user.notes.concat(saveNote._id)
        await User.updateOne({ _id: user._id }, {
            notes: user.notes
        })

        res.json(saveNote)
    } catch (err) {
        next(err)
    }
})
app.use('/api/users', usersRouter)
app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})

module.exports = { app, server }