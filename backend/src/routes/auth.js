const { Router } = require("express");
const {client} = require('../../db');
const {v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = Router();
JWT_KEY='81f115145aea34c747d45331ec6a2e361db3d96997fc40aeb66f7d561e2ae91a04eb3462e86b58f2124f346e1a5284b6dd329b4c46654f7cbc39fd1d79b3c7f9'

function generateAccessToken(username) {
    return jwt.sign({ username }, JWT_KEY);
}

router.post('/register', async (req, res) => {
    const {username, password, mail} = req.body;
    const saltRounds = 10;
    const hash_password = await bcrypt.hash(password, saltRounds);
    (await client).db('ProiectBD2').collection('users').insertOne({
        username,
        hash_password,
        mail
    }).then(success => {
        console.log(success);
        var token = generateAccessToken(username);
        res.status(201).send({ token });
    }, error => {
        console.log(error);
        res.status(400).send("eroare");
    })
});

router.post('/login', async (req, res) => {
    const {password, mail} = req.body;
    (await client).db('ProiectBD2').collection('users').findOne({
            mail
    }).then(success => {
        if(!success) {
            return res.status(404).send({message: "could not find the account"});
        }
        console.log(success);
        const {hash_password, username} = success;
        if (!bcrypt.compareSync(password, hash_password)) {
            return res.status(401).json({ message: 'Wrong username or password!' })
        }

        var token = generateAccessToken(username);
        res.status(200).send({ token });

        }, error =>  {
            console.log(error);
            res.status(400).send("eroare");
        })
});

router.get('/getcurrentuser',
    async (req, res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(403).json({ error: 'No token provided, please log in' });
        }
        const user = await jwt.verify(token, JWT_KEY, (err, username) => {
            if (err) return err;
            return username;
        });
        if (!user.username)
            return res.status(403).json({ error: 'Invalid token!' });

        const username = user.username;

        (await client).db('ProiectBD2').collection('users').findOne({
            username
        }).then(success => {
            return res.status(200).send({success});
        }, err => {
            console.log(err);
            res.status(400).send("eroare");
        })
    })

module.exports = { 
    authRouter: router
};