const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model');

//WORKING (still working)
router.post('/register', (req, res) => {
    let newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 8);
    newUser.password = hash;

    Users.findBy({ username: newUser.username })
        .then(user => {
            if (user) {
                res.status(409).json({ message: 'Username is already taken.' })
            } else {
                Users.add(newUser)
                    .then(saved => {
                        res.status(201).json(saved);
                    })
                    .catch(error => {
                        res.status(500).json(error);
                    });
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
});

//WORKING (still working)
router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.username = username;
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

//res.status not a function
router.get('/logout', (req, res) => {
    if(req.session.username) {
        req.session.destroy(err => {
            if(err) {
                res.status(500).json({ message: 'Unable to Logout' })
            } else {
                res.status(200).json({ message: 'Successful Logout' })
            }
        })
    } else {
        res.status(400).json({ message: 'You are not logged in!' })
    }
})

module.exports = router;