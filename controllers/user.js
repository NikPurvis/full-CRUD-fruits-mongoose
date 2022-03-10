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
    res.render("users/login")
})

// 2. POST to send the login info (and create a session)
router.post("/login", async (req, res) => {
    // 1. Get the data from the request body
    const { username, password } = req.body
    // 2. Search for the user
    User.findOne({ username })
        .then(async (user) => {
            // 3. Check if the user exists
            if (user) {
                // 4. Compare the password
                // bcrypt.compare evalues to a truthy or falsy value
                const result = await bcrypt.compare(password, user.password)
                
                if (result) {
                    // 5. Use the session object
                    // 6. Store some properties in the session
                    req.session.username = username
                    req.session.loggedIn = true
                    // 7. Redirect to /fruits if login is successful
                    res.redirect("/fruits")
                } else {
                    // 8. Send a error if the password doesn't match
                    res.json({ error: "Username or Password incorrect" })
                }
            } else {
                // 9. Send a different error if the user doesn't exist
                res.json({ error: "User does not exist" })
            }
        })
        // 10. Catch any other errors that occur        
        .catch(error => {
            console.log(error)
            res.json(error)
        })
})

// Signout route -> destroy the session
router.get("/logout", (req, res) => {
   // Destroy the session and redirect to the main page
    req.session.destroy(error => {
        console.log(error)
        res.send("your session has been destroyed")
    })
})


///////////////////////////////////////
// Export user model
///////////////////////////////////////
module.exports = router