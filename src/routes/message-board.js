/*
    The message board that I set out to make in the first place.

    App Lab Project: https://studio.code.org/projects/applab/akr_ClyzQaU8oAF1T_fpVTWsgOGuTgTpnv_Ak2NHDtw
*/

const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const jsonToPng = require('../util/json-to-png');
const dupeChecker = new (require('../util/dupe-checker'))();

const MAX_USERNAME_LENGTH = 16;
const MAX_MESSAGE_LENGTH = 140;
const RESULTS_PER_PAGE = 5;
const router = express.Router();

/*
    Make sre you have a file called /auth/mysql.json
    {
        "host": ...,
        "user": ...,
        "password": ...,
        "database": ...
    }
*/
let auth;
let connection;
fs.readFile(path.join(__dirname, '..', '..', 'auth', 'mysql.json'), (err, data) => {
    if (err) {
        throw err;
    }
    auth = JSON.parse(data);

    // Connect to the database. Keep alive with a query every 5 seconds.
    connection = mysql.createConnection(auth);
    setInterval(function () {
        connection.query('SELECT 1');
    }, 5000);
});

// Get messages.
router.get('/get/*.png', (req, res) => {
    if (dupeChecker.check(req)) {
        const page = req.query.page || 0;
        connection.query('SELECT * FROM messages ORDER BY id DESC LIMIT ? OFFSET ?', [RESULTS_PER_PAGE, page * RESULTS_PER_PAGE], (err, results) => {
            if (err) {
                return res.send({error: true, message: err.message});
            }
            connection.query('SELECT MIN(id) as first FROM messages', (err, fResults) => {
                if (err) {
                    return res.send({error: true, message: err.message});
                }
                jsonToPng.convert({
                    messages: results,
                    lastPage: !results.length || fResults[0].first == results[results.length - 1].id
                }).then((png) => {
                    res.type('png');
                    res.send(png);
                });
            });
        });
    }
});

// Post a message.
router.get('/post/*.png', (req, res) => {
    if (dupeChecker.check(req)) {
        if (!req.query.message) {
            return res.send({error: true, message: 'Message field is not optional'});
        }
        if (!req.query.username) {
            return res.send({error: true, message: 'Username field is not optional'});
        }
        if (req.query.username.length > MAX_USERNAME_LENGTH) {
            return res.send({error: true, message: 'Username has a max length of ' + MAX_USERNAME_LENGTH});
        }
        if (req.query.message.length > MAX_MESSAGE_LENGTH) {
            return res.send({error: true, message: 'Message has a max length of ' + MAX_MESSAGE_LENGTH});
        }

        connection.query('INSERT INTO messages (message, username) VALUES (?, ?)', [req.query.message, req.query.username.toLowerCase()], (err) => {
            if (err) {
                return res.send({error: true, message: err.message});
            }
            jsonToPng.convert({}).then((png) => {
                res.type('png');
                res.send(png);
            });
        });
    }
});

module.exports = router;