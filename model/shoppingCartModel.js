const fs = require('fs')
const ProductModel = require('./productModel')

class ShoppingCartModel {

    constructor(authenticated_user){
        if(authenticated_user && authenticated_user.user.id){
            this.fileName = "./db/ShoppingCart_" + authenticated_user.user.id + ".json" 
            this.authenticated_user = authenticated_user         
        }
    }

    addProductToCart(product, quantity){
        return new Promise((resolve, reject) => {
            let cartContent
            fs.readFile(this.fileName, (err, data) => {
                if(err){
                    cartContent = [{
                        product: product,
                        quantity: quantity
                    }]
                    fs.writeFile(this.fileName, JSON.stringify(cartContent), (err) => {
                        if(err){
                            reject(err)
                        }else{
                            resolve(cartContent)
                        }
                    })
                }else {
                    cartContent = data ? JSON.parse(data) : []
                    let productIndex = cartContent.findIndex(content => content.product === product)

                    if(productIndex === -1){
                        cartContent.push({product: product,quantity: quantity})
                    }else{
                        cartContent[productIndex].quantity += quantity
                    }

                    fs.writeFile(this.fileName, JSON.stringify(cartContent), (err) => {
                        if(err){
                            reject(err)
                        }else{
                            resolve(cartContent)
                        }
                    })
                }

            })
        })
    }

    delToShoppingCart(product){
        return new Promise((resolve, reject) => {
            let cartContent
            fs.readFile(this.fileName, (err, data) => {
                if(err){
                    reject("empty shopping cart")
                }else{
                    cartContent = data ? JSON.parse(data) : []
                    let productIndex = cartContent.findIndex(content => content.product === product)
                    if(productIndex === -1){
                        reject("This product is not in your shopping cart")
                    }else{
                        cartContent.splice(productIndex, 1)
                        fs.writeFile(this.fileName, JSON.stringify(cartContent), (err) => {
                            if(err){
                                reject(err)
                            }else{
                                resolve(cartContent)
                            }
                        })
                    }
                }
            })
        })
    }

    getShoppingCart(){
        return new Promise((resolve, reject) => {
            let productModel = new ProductModel(this.authenticated_user)
            fs.readFile(this.fileName, (err, data) => {
                if(err){
                    reject("empty shopping cart")
                }else{
                    let cartContent = JSON.parse(data)
                    let totalPrice = 0
                    Promise.all(
                        cartContent.map(c => c.product)
                        .map((product_id) => {
                            return productModel.getProduct(product_id)
                            .then(details_product => {
                                let productIndex = cartContent.findIndex(c =>c.product === product_id)
                                let price = details_product.price * cartContent[productIndex].quantity
                                cartContent[productIndex].product = details_product
                                cartContent[productIndex].totalPrice = price
                                totalPrice += price
                                return cartContent
                            })
                        })
                    ).then(details => {
                        resolve({cartContent : details[0], totalPrice : totalPrice})
                    })
                    .catch(err => {
                        reject(err)
                    }) 
                }
            })
        })
    }

}

module.exports = ShoppingCartModel