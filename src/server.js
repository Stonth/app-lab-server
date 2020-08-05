const express = require('express');
const jsonToBmp = require('./jsonToBmp');
const app = express();

app.get('/test.bmp', (req, res) => {
    res.type('bmp');
    res.send(jsonToBmp.convert({ message: 'Hello World!' }));
});

app.listen(8080, () => {
    console.log('Listening...');
});