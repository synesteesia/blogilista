const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post('/', async (request, response) => {

  if (request.body.title === undefined || request.body.title === null) {
    response.status(400).json({ error: "Title missing" })
    return
  }

  if (request.body.url === undefined || request.body.url === null) {
    response.status(400).json({ error: "Url missing" })
    return
  }

  const decodedToken = request.token ? jwt.verify(request.token, process.env.SECRET) : null
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  const result = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })

  user.blogs = user.blogs.concat(result)
  await user.save()

  response.status(201).json(result)

})

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = request.token ? jwt.verify(request.token, process.env.SECRET) : null
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === decodedToken.id.toString()) {
    await blog.delete()
    return response.status(204).end()
  }

  return response.status(401).json({ error: 'token missing or invalid' })
})

blogRouter.put('/:id', async (request, response) => {
  const decodedToken = request.token ? jwt.verify(request.token, process.env.SECRET) : null
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  }

  const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { username: 1, name: 1 })

  response.json(result)
})

module.exports = blogRouter
