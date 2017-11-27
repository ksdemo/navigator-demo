const path = require('path')
const express = require('express')
const app = express()

app.use('/static', express.static(path.resolve(__dirname, 'dist', 'static')))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})
app.listen(3000)
