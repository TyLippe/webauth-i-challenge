const router = require('express').Router();

const Users = require('./users-model.js');
const authenticate = require('../auth/authenticate-mw');

//WORKING (WORKING)
router.get('/', authenticate, (req, res) => {
    Users.find()
        .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;
