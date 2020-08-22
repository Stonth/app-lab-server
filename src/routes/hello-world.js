/*
    A simple Hello World example. Contains the basic elements like converting JSON to PNG,
    and duplicate checking.

    App Lab Project: https://studio.code.org/projects/applab/9qYTMHCwXtOzNFMQm_7BroiPkUEob_oLrb_d7zjiiGw
*/

const express = require('express');

const jsonToPng = require('../util/json-to-png');
const dupeChecker = new (require('../util/dupe-checker'))();

const router = express.Router();

router.get('/*.png', (req, res) => {
    if (dupeChecker.check(req)) {
        jsonToPng.convert({ message: 'Hello World!' }).then((png) => {
            res.type('png');
            res.send(png);
        }).catch(err => res.status(400).send(err.message));
    }
});

module.exports = router;