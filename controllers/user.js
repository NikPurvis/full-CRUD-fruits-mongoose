///////////////////////////////////////
// Import dependencies
///////////////////////////////////////
// This allows us to load our env variables
const express = require("express")
const User = require("../models/user")
const bcrypt = require("bcryptjs")

///////////////////////////////////////
// Create router
///////////////////////////////////////
const router = express.Router()

///////////////////////////////////////
// Routes
///////////////////////////////////////

// Two sign-up routes:
// 1. GET to render the sign-up form
router.get("/signup", (req, res) => {
    res.render("users/signup")
})
// 2. POST to send the signup info
router.post("/signup", async (req, res) => {
    // console.log("Initial req.body in signup:", req.body)
    // 1. Encrypt our password
    req.body.password = await bcrypt.hash(
        req.body.password, 
        await bcrypt.genSalt(10)
    )
    // console.log("req.body after hash:", req.body)
    // 2. Create a new user
    User.create(req.body)
        // 3. If created successfully redirect to login
        .then(user => {
            res.redirect("/user/login")
        })
        // 4. If an error occurs, send error
        .catch(error => {
            console.log(error)
            res.json(error)
        })
})

// Two login routes:
// 1. GET to render the login form
router.get("/login", (req, res) => {
    res.send("login page")
})

// 2. POST to send the login info (and create a session)
router.post("/login", (req, res) => {
    res.send("login -> post")
})

// Signout route -> destroy the session
router.get("/logout", (req, res) => {
    res.send("logout page")
})


///////////////////////////////////////
// Export user model
///////////////////////////////////////
module.exports = router