const sqlite3 = require('sqlite3')

class ProductModel {

    constructor(authenticated_user){
        this.db = new sqlite3.Database('./db/DATABASE.sqlite', (err) => {
            if( err ){
                console.log(err)
            }else{
                console.log("Connected to database")
            }
        })

        this.authenticated_user = authenticated_user ? authenticated_user : null
    }

    getCalatog(){
        if( this.authenticated_user ){
            return this.getPrivateProduct()
        }else{
            return this.getPublicProduct()
        }
    }

    getPublicProduct(){
        return new Promise((resolve, reject) => {
            return this.db.all("SELECT p.id, p.label, p.description, p.price, p.thumbnail_url, c.label as category_label, c.description as category_description FROM products p, categories c WHERE p.category_id = c.id AND p.visible_public = ?", [1] , (err, products) => {
                if( err ){
                    reject(err)
                }else{
                    resolve(products)
                }
            }) 
        })
    }

    getPrivateProduct(){
        return new Promise((resolve, reject) => {
            return this.db.all("SELECT p.id, p.label, p.description, p.price, p.thumbnail_url, c.label as category_label, c.description as category_description FROM products p, categories c WHERE p.category_id = c.id AND p.visible_authenticated = ?", [1] , (err, products) => {
                if( err ){
                    reject(err)
                }else{
                    resolve(products)
                }
            }) 
        })
    }

    getProduct(id){
        return new Promise((resolve, reject) => {
            return this.db.get("SELECT p.id, p.label, p.description, p.price, p.thumbnail_url, c.label as category_label, c.description as category_description FROM products p, categories c WHERE p.category_id = c.id AND p.id = ?", [id] , (err, product) => {
                if( err ){
                    reject(err)
                }else{
                    resolve(product)
                }
            }) 
        })
    }
    

}

module.exports = ProductModel