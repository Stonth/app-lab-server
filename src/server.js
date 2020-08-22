const express = require('express');

const routeHelloWorld = require('./routes/hello-world');
const routeProxy = require('./routes/proxy');
const routeMessageBoard = require('./routes/message-board');

const app = express();

// Use routes.
app.use('/hello-world', routeHelloWorld);
app.use('/proxy', routeProxy);
app.use('/message-board', routeMessageBoard);

// Listen on port 420.
app.listen(420, () => {
    console.log('Listening...');
});