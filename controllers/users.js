const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    if (request.body.username === undefined || request.body.username === null || request.body.username.length < 3) {
        response.status(400).json({ error: "Username missing or too short" })
        return
      }
    
      if (request.body.password === undefined || request.body.password === null || request.body.password.length < 3) {
        response.status(400).json({ error: "password missing or too short" })
        return
      }
  const body = request.body

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
    const users = await User.find({})
    response.json(users.map(u => u.toJSON()))
  })

module.exports = usersRouter