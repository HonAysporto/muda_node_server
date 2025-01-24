
let userModel = require('./user.model');
let jwt = require('jsonwebtoken');


const registerUser = (req, res) => {
    console.log(req.body); 
    let form = new userModel(req.body)
    form.save().then(()=> {
        console.log('data saved');
        res.send({status:true, message: 'User Saved' });

    })
    .catch((err)=>{
        console.log('failed to save');
        console.log(err);
        res.status(500).send({ message: 'error signing up' });
    })
}

const signInUser = (req, res) => {
    console.log(req.body);
    const {email, password} = req.body;

    userModel.findOne({email})
    .then(user => {
        if (!user) {
            console.log('User not found');
            res.status(500).send({ message: 'User not found' });
        } else {
            let secret = process.env.SECRET

            user.validatePassword(password, (err, same)=>{
                if(!same){
                    res.send({status:false, message:"Wrong credentials"})
                } else {
                    let token = jwt.sign({email},secret,{expiresIn:"7h"})
                    res.send({status:true, message:"Welcome", token})
                    // console.log(token);
                    
                }
            })
            console.log('User exist');
            
      
    }
    }).catch((err) => {
        console.log(err);
    })

    
}


module.exports =  { registerUser, signInUser}