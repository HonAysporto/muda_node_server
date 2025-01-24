const mongoose = require('mongoose')
const bcrypt = require("bcrypt")



let userSchema = mongoose.Schema({
    firstname : {type:String, required:true},
    lastname :  {type:String, required:true},
    email : {type:String, required:true, unique:true},
    password: {type:String, required:true},
    registrationDate : {type:Date, default:Date.now()}
})



let saltRound = 10

    userSchema.pre('save', function(next) {
        bcrypt.hash(this.password, saltRound, (err, hashedpasword)=>{
            console.log(hashedpasword);
             
            if (err) {
                console.log(err);
                
            } else {
                this.password = hashedpasword
                next()
            }
        })
   
})

userSchema.methods.validatePassword = function(password, callback){
    bcrypt.compare(password, this.password, (err,same)=> {
        if (!err) {
            callback(err, same)
        }else {
            next()
        }
        
    })
}

let userModel = mongoose.model("student", userSchema)

module.exports = userModel