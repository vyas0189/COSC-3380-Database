const express = require('express');
const app = express();
const cors = require('cors')
app.use(cors())

app.get('/api', (req, res) => {
    res.send({ msg: 'Hello World! 👋' });
});

module.exports = app;