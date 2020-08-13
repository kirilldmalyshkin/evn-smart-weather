const express = require('express')
const path = require('path')
const {v4} = require('uuid')
const app = express()

// let STORAGE = []

app.use(express.json())

// // GET
// app.get('/api/items', (req, res) => {
//   res.status(200).json(STORAGE)
// })
//
// // POST
// app.post('/api/items', (req, res) => {
//   const contact = {...req.body, id: v4(), marked: false}
//   STORAGE.unshift(contact)
//   res.status(201).json(contact)
// })
//
//
// // DELETE
// app.delete('/api/items/:id', (req, res) => {
//   STORAGE = STORAGE.filter(c => c.id !== req.params.id)
//   res.status(200).json({message: 'Контакт был удален'})
// })
//
// // PUT
// app.put('/api/items/:id', (req, res) => {
//   const idx = STORAGE.findIndex(c => c.id === req.params.id)
//   STORAGE[idx] = req.body
//   res.json(STORAGE[idx])
// })


// app.use(express.static(path.resolve(__dirname, 'client')))
//
//
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
// })

app.listen(8081, () => console.log('Server has been started on port 3000...'))
