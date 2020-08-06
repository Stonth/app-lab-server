const express = require('express');
const jsonToPng = require('../util/jsonToPng');

const router = express.Router();

router.get('/*.png', (req, res) => {
    jsonToPng.convert({ message: 'Hello World!' }).then((png) => {
        res.type('png');
        res.send(png);
    }).catch(err => res.status(400).send(err.message));
});

module.exports = router;