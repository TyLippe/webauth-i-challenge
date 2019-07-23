const express = require('express');

const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js');
const setupGlobalMiddleware = require('./setup-middleware');

const server = express();

setupGlobalMiddleware(server);

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
    res.json({ api: 'up' });
});

module.exports = server;