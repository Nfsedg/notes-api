require('dotenv').config();
const express = require('express');
const app = express();
require('./mongo');

const cors = require('cors');
const notFound = require('./middleware/notFound');
const handleErrors = require('./middleware/handleErrors');
const usersRouter = require('./controllers/users');
const notesRouter = require('./controllers/notes');
const loginRouter = require('./controllers/login');

app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));


app.use('/api/login', loginRouter);
app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);
app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

module.exports = { app, server };