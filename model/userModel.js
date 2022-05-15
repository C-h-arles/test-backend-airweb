const sqlite3 = require('sqlite3')

class UserModel {

    constructor(){
        this.db = new sqlite3.Database('./db/DATABASE.sqlite', (err) => {
            if(err){
                console.log(err)
            }else{
                console.log("Connected to database")
            }
        })
    }

    getUser(email){
        return new Promise((resolve, reject) => {
            return this.db.get("SELECT id, name, email, password_hash FROM users WHERE email = ?", [email] , (err, user) => {
                if(err){
                    reject(err)
                }else{
                    resolve(user)
                }
            })
        })
       
         
    }

    checkUser(email, password){
        return new Promise((resolve, reject) => {
            if(email && password){
                return this.getUser(email)
                .then((user, err) => {
                    if(err || !user){
                        reject("User not found")
                    }else{
                        const md5 = require("md5")
                        if(md5(user.id + password) === user.password_hash){
                            resolve(user)
                        }else{
                            reject("Bad password")
                        }
                    }
                    
                })
            }
        }) 
       
    }

}

module.exports = UserModel