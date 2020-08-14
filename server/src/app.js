const express = require('express')
const {v4} = require('uuid')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

let STORAGE = []

app.get('/api/items', (req, res) => {
  res.status(200).json(STORAGE)
})

app.post('/api/items', (req, res) => {
  const item = {...req.body, id: v4()}
  STORAGE.unshift(item)
  res.status(201).json(item)
})

app.delete('/api/items/:id', (req, res) => {
  STORAGE = STORAGE.filter(c => c.id !== req.params.id)
  res.status(200).json({message: 'Прогноз был удален'})
})

app.put('/api/items/:id', (req, res) => {
  const idx = STORAGE.findIndex(c => c.id === req.params.id)
  STORAGE[idx] = req.body
  res.json(STORAGE[idx])
})

app.listen(8081, () => console.log('Server has been started on port 8081...'))
