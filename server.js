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

app.get("/fruits/seed", (req, res) => {
// array of starter fruits
    const startFruits = [
        { name: "Orange", color: "orange", readyToEat: false },
        { name: "Grape", color: "purple", readyToEat: false },
        { name: "Banana", color: "orange", readyToEat: false },
        { name: "Strawberry", color: "red", readyToEat: false },
        { name: "Coconut", color: "brown", readyToEat: false }
    ]
    // When we seed data, there are a few steps involved.
    // 1. Delete all the data that already exists (will only happen if data exists)
    Fruit.remove({})
        .then (data => {
            console.log("This is what remove returns", data)
            // 2. Create with our seed data
            Fruit.create(startFruits)
                .then(data => {
                    res.send(data)
                })
        })
    // 3. Send, if we want to seed that data.
})


////////////////////////////////////////
// Server Listener
///////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}`)
})

