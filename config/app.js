const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({ msg: 'Hello World! 👋' });
});

module.exports = app;