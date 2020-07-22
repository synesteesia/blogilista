const _ = require('lodash')


const dummy = (blogs) => {
  return 1
}

const totalLikes = array => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return array.reduce(reducer, 0)
}

const favouriteBlog = array => {
  const reducer = (favourite, item) => {
    return item.likes < favourite.likes ? favourite : item
  }
  return array.reduce(reducer, { likes: -1 })
}

const mostBlogs = array => {
  const reducer = (most, item) => {
    return most[1] > item[1] ? most : item
  }
  const mostProlific = _.toPairs(_.countBy(array, item => item.author)).reduce(reducer, [0, 0])
  return { author: mostProlific[0], blogs: mostProlific[1] }
}

const mostLikes = array => {
  const reducer = (most, item) => {
    return most[1] > item[1] ? most : item
  }
  const sumReducer = (likes, item) => {
    return likes + item.likes
  }
  const mostProlific = _.toPairs(_.mapValues(_.groupBy(array, item => item.author), item => item.reduce(sumReducer, 0))).reduce(reducer, [0, 0])
  return { author: mostProlific[0], likes: mostProlific[1] }
}


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}