///////////////////////////////////////
// Import dependencies
///////////////////////////////////////
// This allows us to load our env variables
require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const methodOverride = require("method-override")
const Fruit = require("./models/fruit")


////////////////////////////////////////
// Create our express aplication object
///////////////////////////////////////
const app = require("liquid-express-views")(express())


////////////////////////////////////////
// Middleware
///////////////////////////////////////
// This is for request logging
app.use(morgan("tiny"))
app.use(methodOverride("_method"))
// Parses url encoded request bodies (body parser)
app.use(express.urlencoded({ extended: false }))
// To serve files from public statically
app.use(express.static("public"))


////////////////////////////////////////
// Routes
///////////////////////////////////////
app.get("/", (req, res) => {
    console.log("The Fruit model:", Fruit)
    res.send("Your server is running, better go catch it")
})


////////////////////////////////////////
// Server Listener
///////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}`)
})

