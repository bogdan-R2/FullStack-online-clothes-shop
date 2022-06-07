const { Router } = require("express");
const {client} = require('../../db');
const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongodb');
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
        (await client).db('ProiectBD2').collection('addresses').find({userid: user._id}).toArray().then(success => {
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
    const {adresa, nume} = req.body;
    (await client).db('ProiectBD2').collection('addresses').insertOne({
        adresa,
        nume,
        userid: user._id
    }).then(success => {
        console.log(success);
        res.status(201).send(success);
    }, error => {
        console.log(error);
        res.status(400).send("eroare");
    })
});

router.delete('/remove/:id', async (req, res) => {
    const user = await getUser(req);
    const addressid = req.params.id;
    (await client).db('ProiectBD2').collection('addresses').deleteOne({
        _id: new ObjectId(addressid),
        userid: user._id
    }).then(success => {
        console.log(success);
        res.status(201).send(success);
    }, error => {
        console.log(error);
        res.status(400).send("eroare");
    })
});


module.exports = { 
    addressesRouter: router
};