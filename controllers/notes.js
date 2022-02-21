const notesRouter = require('express').Router();
const Note = require('../models/Note');
const User = require('../models/User');
const userExtractor = require('../middleware/userExtractor');


// const generateId = () => {
//     const notesIds = notes.map(n => n.id);
//     const maxId = notesIds.length ? Math.max(...notesIds) : 0;
//     const newId = maxId + 1;

//     return newId;
// };

notesRouter.get('/', async (req, res) => {
    // Note.find({}).then(notes => {
    //     res.json(notes)
    // });
    const notes = await Note.find({}).populate('user', {
        username: 1,
        name: 1
    });
    res.json(notes);
});
notesRouter.get('/:id', (req, res, next) => {
    const { id } = req.params;
    Note.findById(id).then(note => {
        if(note) {
            return res.json(note);
        } else {
            res.status(404).end();
        }
    }).catch(err => {
        next(err);
    });
});
notesRouter.put('/:id', userExtractor, (req, res, next) => {
    const { id } = req.params;
    const note = req.body;

    const newNoteInfo = {
        content: note.content,
        important: note.important
    };
    Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
        .then(result => {
            res.json(result);
        })
        .catch(err => next(err));
});
notesRouter.delete('/:id', userExtractor, async (req, res, next) => {
    const { id } = req.params;
    
    try {
        await Note.findByIdAndDelete(id);
        
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

notesRouter.post('/', userExtractor, async (req, res, next) => {
    const { 
        content, 
        important = false,  
    } = req.body;
    
    // sacar userId de request
    const { userId } = req;

    const user = await User.findById(userId);

    if(!content) {
        return res.status(400).json({
            error: 'note.content is missing'
        });
    } 

    const newNote = new Note({
        content,
        important,
        date: new Date(),
        user: user._id
    });

    // newNote.save().the(savedNote => {
    //     response.json(savedNote)
    // }).catch(err => next(err))

    try {
        const saveNote = await newNote.save();

        user.notes = user.notes.concat(saveNote._id);
        await User.updateOne({ _id: user._id }, {
            notes: user.notes
        });

        res.json(saveNote);
    } catch (err) {
        next(err);
    }
});

module.exports = notesRouter;