const express = require('express');
const app = express();
const PORT = 3000;
require('dotenv').config()
const mongoose = require("mongoose")
const cors = require('cors')
let userRouter = require('./user.route')

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/user', userRouter)




// let URI = 'mongodb+srv://Honourable:Password@cluster0.guyvfqs.mongodb.net/school_portal_db?retryWrites=true&w=majority&appName=Cluster0';




let URI = "mongodb+srv://Honourable:Password@cluster0.guyvfqs.mongodb.net/mudashiru_db?retryWrites=true&w=majority&appName=Cluster0"


mongoose.connect(URI).then(()=> {
    console.log('mongodb connected successfully');
}).catch((err)=> {
    console.log('mongodb no gree connect')
    console.log(err);
})








app.listen((PORT), ()=> {
    console.log(`Server is running on port${PORT}`);
    
})