
let userModel = require('./user.model');
let jwt = require('jsonwebtoken');


const registerUser = (req, res) => {
    console.log(req.body);

    // Check if the username already exists
    userModel.findOne({ username: req.body.username })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(200).json({ status: false, message: 'Username already exists' });
            }

            // If username does not exist, create and save the user
            let form = new userModel(req.body);
            return form.save().then(() => {
                console.log('Data saved');
                res.status(201).json({ status: true, message: 'Registration Successful' });
            });
        })
        .catch((err) => {
            console.log('Failed to save:', err);
            res.status(500).json({ message: 'Error signing up', error: err });
        });
};





const signInUser = (req, res) => {
    console.log(req.body);
    const {username, password} = req.body;

    userModel.findOne({username})
    .then(user => {
        if (!user) {
            // console.log('User not found');
            res.status(200).send({ status: false,  message: 'User not found' });
        } else {
            let secret = process.env.SECRET

            user.validatePassword(password, (err, same)=>{
                if(!same){
                    res.send({status:false, message:"Wrong credentials"})
                } else {
                    let token = jwt.sign({username},secret,{expiresIn:"7h"})
                    res.send({status:true, message:"Login successful", token, user})
                    // console.log(token);
                    
                }
            })
            console.log('User exist');
            
      
    }
    }).catch((err) => {
        console.log(err);
    })
}




const dashboard = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the request header

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    // Verify the token
    let secret = process.env.SECRET
    jwt.verify(token, secret , (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        // Find user from the database using decoded userId
        userModel.findOne({ username: decoded.username })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                // Send user information (e.g., username, messages, etc.)
                res.json({
                    username: user.username,
                    messages: user.messages // Optional: If you have messages in the schema
                });
            })
            .catch(err => {
                res.status(500).json({ message: 'Server error', error: err });
            });
    });
};






// POST: Save Anonymous Message
const sendMessage = (req, res) => {
    const username  = req.params.username; // Get recipient username from URL
    const  content  = req.body.message; // Get message content from request body

    // console.log(req.body.message)
    console.log(username);
    

    if (!content) {
        return res.status(400).json({ message: "Message content is required" });
    }

    
    

    // Find the recipient by username
//     userModel.findOne({ username })
//         .then(user => {
//             if (!user) {
//                 return res.status(404).json({ message: "Recipient not found" });
//             }

//             // Add message to the user's messages array
//             user.messages.push({ content });

//             // Save the updated user document
//             return user.save();
//         })
//         .then(() => {
//             res.status(201).json({ message: "Message sent successfully" });
//         })
//         .catch(error => {
//             console.error("Error saving message:", error);
//             res.status(500).json({ message: "Internal server error" });
//         });



userModel.updateOne(
    { username },
    { $push: { messages: { content } } } // Only update messages array
)
.then(result => {
    if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Recipient not found" });
    }
    res.status(201).json({ "status": true,  message: "Message sent successfully" });
})
.catch(error => {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Internal server error" });
});

}






module.exports =  { registerUser, signInUser, dashboard, sendMessage}