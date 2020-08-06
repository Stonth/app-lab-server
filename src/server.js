const express = require('express');
const jimp = require('jimp');
const jsonToBmp = require('./jsonToBmp');
const app = express();

app.get('/test.png', (req, res) => {
    res.type('png');
    const bmp = jsonToBmp.convert({ message: 'Hello World!' });
    jimp.read(bmp).then((image) => {
        image.getBufferAsync(jimp.MIME_PNG).then((buff) => {
            res.send(buff);
        }).catch((err) => {
            res.status(400).send(err.message);
        });
    }).catch((err) => {
        res.status(400).send(err.message);
    });
});

app.listen(8080, () => {
    console.log('Listening...');
});