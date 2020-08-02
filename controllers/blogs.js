const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

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

  const user = await User.findById(request.body.userId)

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id

  })

  const result = await blog.save()

  user.blogs = user.blogs.concat(result)
  await user.save()


  response.status(201).json(result)

})











blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove({ _id: request.params.id })

  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  response.json(result)
})

module.exports = blogRouter
