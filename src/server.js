const express = require('express');
const app = express();
const routeHelloWorld = require('./routes/hello-world');
const routeProxy = require('./routes/proxy');

app.use('/hello-world', routeHelloWorld);
app.use('/proxy', routeProxy);

app.listen(420, () => {
    console.log('Listening...');
});