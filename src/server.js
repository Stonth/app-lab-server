const express = require('express');
const app = express();
const routeHelloWorld = require('./routes/hello-world');
const jsonToPng = require('./util/jsonToPng');

app.use('/hello-world', routeHelloWorld);

app.listen(420, () => {
    console.log('Listening...');
});