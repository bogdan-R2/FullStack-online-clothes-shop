const { Router } = require("express");
const {client} = require('../../db');
const jwt = require('jsonwebtoken');
const router = Router();

JWT_KEY='81f115145aea34c747d45331ec6a2e361db3d96997fc40aeb66f7d561e2ae91a04eb3462e86b58f2124f346e1a5284b6dd329b4c46654f7cbc39fd1d79b3c7f9'

const getUser = async (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return null;
    }
    const user = await jwt.verify(token, JWT_KEY, (err, username) => {
        if (err) return err;
        return username;
    });
    if (!user.username)
        return res.status(403).json({ error: 'Invalid token!' });

    const username = user.username;

    return (await client).db('ProiectBD2').collection('users').findOne({
        username
    }).then(success => {
        return success;
    }, err => {
        console.log(err);
        res.status(400).send("eroare");
    });
}

router.get('/', async (req, res) => {
    const user = await getUser(req);
    if(user!= null) {
        (await client).db('ProiectBD2').collection('order').find({userid: user._id}).toArray().then(success => {
            return res.status(200).send({success});
        }, err => {
            console.log(err);
            res.status(400).send("eroare");
        });
       
    } else {
        return res.status(403).send({message: 'Invalid token, could not find the user'});
    }
});

router.post('/add', async (req, res) => {
    const user = await getUser(req);
    if(user!= null) {
        (await client).db('ProiectBD2').collection('cart').find({userId: user._id}).toArray().then(async success => {
            const {adresa} = req.body;
            (await client).db('ProiectBD2').collection('order').insertOne({
                produse: success,
                userid: user._id
            }).then(async success => {
                (await client).db('ProiectBD2').collection('cart').deleteMany({userId: user._id})
                console.log(success);
                res.status(201).send(success);
            }, error => {
                console.log(error);
                res.status(400).send("eroare");
            })
        }, err => {
            console.log(err);
            res.status(400).send("eroare");
        });
       
    } else {
        return res.status(403).send({message: 'Invalid token, could not find the user'});
    }
});

module.exports = { 
    orderRouter: router
};