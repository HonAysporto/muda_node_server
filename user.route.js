//List of imports
const express = require('express');
const router = express.Router()
const {registerUser, signInUser} = require("./user.controller")



router.post('/register', registerUser )
router.post('/signin', signInUser)


module.exports = router
