const express = require('express')
const sqlite3 = require('sqlite3')
const jwt = require("jsonwebtoken")

const ProductModel = require('./model/productModel')
const UserModel = require('./model/userModel')
const ShoppingCartModel = require('./model/shoppingCartModel')

const tokenSecret = "token_secret_value"

const app = express()

app.use(express.json())

app.get('/catalog', (req, res) => {
    let token

    if(req.headers['x-xsrf-token']){
        token = jwt.verify(req.headers['x-xsrf-token'], tokenSecret)
    }

    let productModel = new ProductModel(token ?? null)
    productModel.getCalatog()
    .then(catalog => {
        res.status(200).json(catalog)
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
})


app.post('/user/check', (req, res) => {
    let userModel = new UserModel()
    userModel.checkUser(req.body.email, req.body.password)
    .then(user => {
        if( user ){
            console.log("authentificated")
            res.status(200).json({token: jwt.sign({user: user}, tokenSecret, {expiresIn: '24h'})})
        }else{
            res.status(500).json({error: "Servor error"})
        }
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
})

app.post('/addToShoppingCart', (req, res) => {
    if( req.headers['x-xsrf-token'] && req.body.product, req.body.quantity ){
        let token = jwt.verify(req.headers['x-xsrf-token'], tokenSecret)
        let shoppingCartModel = new ShoppingCartModel(token)
        shoppingCartModel.addProductToCart(req.body.product, req.body.quantity)
        .then(shoppingCart => {
            res.status(200).json(shoppingCart)
        })
        .catch(err => {
            res.status(500).json({error: err})
        })

    }else{
        res.status(401).json({error: "authentication required"})
    }
})

app.post('/delToShoppingCart', (req, res) => {
    if( req.headers['x-xsrf-token'] && req.body.product){
        let token = jwt.verify(req.headers['x-xsrf-token'], tokenSecret)
        let shoppingCartModel = new ShoppingCartModel(token)
        shoppingCartModel.delToShoppingCart(req.body.product)
        .then(shoppingCart => {
            res.status(200).json(shoppingCart)
        })
        .catch(err => {
            res.status(500).json({error: err})
        })

    }else{
        res.status(401).json({error: "authentication required"})
    }
})

app.get('/shoppingCart', (req, res) => {
    if(req.headers['x-xsrf-token']){
        let token = jwt.verify(req.headers['x-xsrf-token'], tokenSecret)
        let shoppingCartModel = new ShoppingCartModel(token)
        shoppingCartModel.getShoppingCart()
        .then(shoppingCart => {
            res.status(200).json(shoppingCart)
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
    }
})

app.listen(8080, () => {
    console.log('Serveur à l\'écoute')
})