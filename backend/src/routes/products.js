const { Router } = require("express");
const {client} = require('../../db');

const router = Router();

router.get('/', async (req, res) => {
    (await client).db('ProiectBD2').collection('products').find().toArray().then(success => {
        return res.status(200).send({success});
    }, err => {
        console.log(err);
        res.status(400).send("eroare");
    })
});

router.post('/filteredProducts', async (req, res) => {
    const category = req.body.category;
    const size = req.body.size;

    if(category && size) {
        (await client).db('ProiectBD2').collection('products').find({
            category,
            size
        }).toArray().then(success => {
            return res.status(200).send({success});
        }, err => {
            console.log(err);
            res.status(400).send("eroare");
        })
    } else if(category) {
        (await client).db('ProiectBD2').collection('products').find({
            category
        }).toArray().then(success => {
            return res.status(200).send({success});
        }, err => {
            console.log(err);
            res.status(400).send("eroare");
        })
    } else if(size) {
        (await client).db('ProiectBD2').collection('products').find({
            size
        }).toArray().then(success => {
            return res.status(200).send({success});
        }, err => {
            console.log(err);
            res.status(400).send("eroare");
        })
    } else {
        (await client).db('ProiectBD2').collection('products').find().toArray().then(success => {
            return res.status(200).send({success});
        }, err => {
            console.log(err);
            res.status(400).send("eroare");
        })
    }
    

})

module.exports = { 
    productsRouter: router
};