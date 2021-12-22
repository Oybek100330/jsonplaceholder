const express = require('express')
const fs = require('fs')
const app = express()
const PORT = process.env.PORT || 7000
const posts = require('./database/posts.js')
const comments = require('./database/comments.js')

app.use( express.json() )

app.get('/posts', (req, res)=> {
    res.json(posts)
})

app.get('/posts/:id', (req, res) => {
    res.json(posts.find(post => post.id == req.params.id))
})

app.get('/posts/:postId/comments', (req, res) => {
    res.json(comments.filter(comments => comments.postId == req.params.postId))
})

app.get('/comments', (req, res) => {
    res.json(
        comments.filter( comment => req.query.postId ? req.query.postId == comment.postId : true)
    )
})

app.post('/posts', (req, res) => {
    req.body.id = posts.length + 1
    posts.push(req.body)
    res
        .json({message: "The new post succesfull added", data: req.body})
        .status(201)
})

app.put('/posts', (req, res) => {
    const { userId, id, title, body } = req.body
	if(!id) return res.json({ status: 500, message: "The postId is required!" })
	let post = posts.find( post => post.id == id )
	if(!post) return res.json({ status: 500, message: "There is no such post!" })
	post.userId = userId || post.userId
	post.title = title || post.title
	post.body = body || post.body
	return res.json({ status: 201, message: "The post has been updated!", data: post })
})

app.delete('/posts', (req, res) => {
    const { id } = req.body
	if(!id) return res.json({ status: 500, message: "The userId is required!" })
	let postIndex = posts.findIndex( post => post.id == id )
	if(postIndex == -1) return res.json({ status: 500, message: "There is no such post!" })
	const deletedPost = posts.splice(postIndex, 1)
	return res.json({ status: 201, message: "The post has been deleted!", data: deletedPost })
})



app.listen(PORT, () => {console.log('Server is running on http://localhost:' + PORT)})