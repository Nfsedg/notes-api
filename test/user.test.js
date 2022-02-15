const User = require('../models/User')
const bcrypt = require('bcrypt')
const { api, getUsers } = require('./helpers')
const mongoose = require('mongoose')
const { server } = require('../index')

describe('creating a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('pswd', 10)
        const user = new User({
            username: 'nfsedg',
            passwordHash
        })

        await user.save()
    })

    test('works as expected creating a fresh username', async () => {
        const usersAtStart = await getUsers()

        const newUser = { 
            username: 'MyUser',
            name: 'Edgar',
            password: 'contr45'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await getUsers()

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)

        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username is already taken', async () => {
        const usersAtStart = await getUsers()
        
        const newUser = {
            username: 'nfsedg',
            name: 'Yomero',
            password: 'a684wfe'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.errors.username.message).toContain('`username` to be unique')

        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('get all users', async () => {
        const usersAtStart = await getUsers()
        const response = await api.get('/api/users')

        expect(response.body).toHaveLength(usersAtStart.length)
    })

    afterAll(() => {
        mongoose.connection.close()
        server.close()
    })
})