const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model');

//WORKING
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

//WORKING
router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.get('/logout', (res, req) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.status(500).json({ message: 'Unable to Logout' })
            } else {
                res.status(200).json({ message: 'Successful Logout' })
            }
        })
    } else {
        res.status(200).json({ message: 'Successful Logout' })
    }
})

module.exports = router;