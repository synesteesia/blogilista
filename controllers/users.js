const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1 })

  response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  if (body.username === undefined || body.username === null || body.username.length < 3) {
    response.status(400).json({ error: "Username missing or too short" })
    return
  }

  if (body.password === undefined || body.password === null || body.password.length < 3) {
    response.status(400).json({ error: "password missing or too short" })
    return
  }

  const existingUser = await User.findOne({ username: body.username })
  if (existingUser) {
    return response.status(400).json({ error: 'ValidationError: expected `username` to be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1 })
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter