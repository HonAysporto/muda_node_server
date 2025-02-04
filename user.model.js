const mongoose = require('mongoose')
const bcrypt = require("bcrypt")



let userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
    messages: [{
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    }]
}, { timestamps: true });




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