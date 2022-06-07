const { Router } = require("express");
const {client} = require('../../db');
const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongodb');

JWT_KEY='81f115145aea34c747d45331ec6a2e361db3d96997fc40aeb66f7d561e2ae91a04eb3462e86b58f2124f346e1a5284b6dd329b4c46654f7cbc39fd1d79b3c7f9'

const router = Router();

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
        (await client).db('ProiectBD2').collection('cart').find({userId: user._id}).toArray().then(success => {
            return res.status(200).send({success});
        }, err => {
            console.log(err);
            res.status(400).send("eroare");
        });
       
    } else {
        return res.status(403).send({message: 'Invalid token, could not find the user'});
    }
});

router.get('/value', async (req, res) => {
    const user = await getUser(req);
    const mapFunction = function(){ 
        emit(this._id, this.price * this.quantity);
    }
    const reduceFunction = function(keyCustId, valuesPrices) {
        return Array.sum(valuesPrices);
     };

    if(user!= null) {
        (await client).db('ProiectBD2').collection('cart').mapReduce(mapFunction, reduceFunction, {out: "out"}).then(success => {
            return res.status(200).send({success});
        }, err => {
            console.log(err);
            res.status(400).send("eroare");
        });
       
    } else {
        return res.status(403).send({message: 'Invalid token, could not find the user'});
    }
});

router.post('/addToCart', async (req, res) => {
    const user = await getUser(req);
    const {productId} = req.body;

    if(user!= null) {
        (await client).db('ProiectBD2').collection('products').findOne({_id: new ObjectId(productId)}).then(async(product) =>  {
            if(product) {
                (await client).db('ProiectBD2').collection('cart').findOne({userId: user._id, productId: new ObjectId(productId)}).then(async success => {
                    if(success) {
                        //update
                        (await client).db('ProiectBD2').collection('cart').findOneAndUpdate({userId: user._id, productId: new ObjectId(productId)}, 
                        { $set: {
                            ...success,
                            quantity: success.quantity + 1
                            }
                        }, {upsert: true}).then(_ => {
                            res.status(200).send("updatat cu success");
                        });
                    } else {
                        //insert
                        (await client).db('ProiectBD2').collection('cart').insertOne({userId: user._id, productId: new ObjectId(productId), quantity: 1, price: product.price})
                        .then(_ => {
                            res.status(201).send("creat cu success");
                        })
                    }            
            }, err => {
                console.log(err);
                res.status(400).send("eroare");
            });
        } else {
            return res.status(404).send("nu am gasit produsul");
        }
        }, err => {
            console.log(err);
            return res.status(404).send({message: "could not find the product"});
        })
    } else {
        console.log(err);
        return res.status(403).send({message: 'Invalid token, could not find the user'});
    }
});


router.post('/removeFromCart', async (req, res) => {
    const user = await getUser(req);
    const {productId} = req.body;

    if(user!= null) {
                (await client).db('ProiectBD2').collection('cart').findOne({userId: user._id, productId: new ObjectId(productId)}).then(async success => {
                    if(!success) {
                        return res.status(404).send("produsul nu exista in cartul dvs")
                    }
                    if(success.quantity <= 1) {
                        //update
                        (await client).db('ProiectBD2').collection('cart').remove({userId: user._id, productId: new ObjectId(productId)}).then(_ => {
                            res.status(200).send("operatia a avut success");
                        });
                    } else {
                        //insert
                        (await client).db('ProiectBD2').collection('cart').findOneAndUpdate({userId: user._id, productId: new ObjectId(productId)}, 
                        { $set: {
                            ...success,
                            quantity: success.quantity - 1
                            }
                        }, {upsert: true}).then(_ => {
                            res.status(200).send("updatat cu success");
                        });
                    }
        }, err => {
            console.log(err);
            return res.status(404).send({message: "could not find the product"});
        })
    } else {
        console.log(err);
        return res.status(403).send({message: 'Invalid token, could not find the user'});
    }
});

module.exports = { 
    cartRouter: router
};