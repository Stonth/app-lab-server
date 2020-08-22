/*
    This is an example of a proxy.

    App Lab Project: https://studio.code.org/projects/applab/5gPBz4yS0pvbLxQaSz3rmKcH1D81DjtO6gj3MWewq9Q
*/

const express = require('express');
const bent = require('bent');

const jsonToPng = require('../util/json-to-png');
const dupeChecker = new (require('../util/dupe-checker'))();

const router = express.Router();

const METHODS = [
    {type: 'GET', body: false},
    {type: 'HEAD', body: false},
    {type: 'POST', body: true},
    {type: 'PUT', body: true},
    {type: 'DELETE', body: true},
    {type: 'CONNECT', body: false},
    {type: 'OPTIONS', body: false},
    {type: 'TRACE', body: false},
    {type: 'PATCH', body: true}
];

function badQuery(res) {
    res.send({error: true, message: 'Bad query'});
}

router.get('/:method/:url/*.png', (req, res) => {
    if (dupeChecker.check(req)) {
        let found = false;
        for (method of METHODS) {
            if (req.params.method == method.type) {
                found = true;
                if (method.body && !req.query.body) {
                    return badQuery(res);
                }
                const url = decodeURIComponent(req.params.url);
                const request = bent(method.type, 'json');
                request(url, method.body ? JSON.parse(decodeURIComponent(queryParts[2])) : undefined).then((data) => {
                    jsonToPng.convert(data).then((png) => {
                        res.type('png');
                        res.send(png);
                    }).catch(err => res.status(400).send(err.message));
                }).catch((err) => {
                    return res.status(400).send(err.message);
                });
            }
        }

        if (!found) {
            return badQuery(res);
        }
    }
});

module.exports = router;