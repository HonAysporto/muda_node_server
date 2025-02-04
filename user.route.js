//List of imports
const express = require('express');
const router = express.Router()
const {registerUser, signInUser, dashboard, sendMessage} = require("./user.controller")



router.post('/register', registerUser)
router.post('/signin', signInUser)
router.get('/dashboard', dashboard)
router.post('/sendmsg/:username', sendMessage)




module.exports = router
