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


// INDEX route
app.get("/fruits", (req, res) => {
    // Find the fruits
    Fruit.find({})
    // Render the template AFTER they're found
        .then(fruits => {
            // console.log("Fruits:", fruits)
            res.render("fruits/index.liquid", { fruits })
        })
    // Show an error if there is one
    .catch(error => {
        console.log(error)
        res.json({ error })
    })
})


// NEW route -> GET route that renders the page with the form
app.get("/fruits/new", (req, res) => {
    res.render("fruits/new")
})

// CREATE route -> POST route that actually calls the db and makes a new document
app.post("/fruits", (req, res) => {
    // Check if the readyToEat property should be true or false
    // We can check AND set this property in one line of code
    // The first part (before =) sets the property name
    // The second part (after =) is a ternary to set the value
    req.body.readyToEat = req.body.readyToEat === "on" ? true: false
    console.log("This is the fruit to create:", req.body)
    Fruit.create(req.body)
        .then(data => {
            // console.log("This was returned from create:", data)
            res.redirect("/fruits")
        })
        .catch(err => {
            console.log(err)
            res.json({ err })
        })
})


// EDIT route -> GET that takes us to the edit form view
app.get("/fruits/:id/edit", (req, res) => {
    // 1. Get the id
    const fruitId = req.params.id
    // 2. Find the fruit
    Fruit.findById(fruitId)
    // 3. Render if there is a fruit
        .then(fruit => {
            res.render("fruits/edit", { fruit })
        })
    // 4. Error if no fruit
        .catch(err => {
            console.log(err)
            res.json( {err} )
        })
})

// UPDATE route -> send a PUT request to our database
app.put("/fruits/:id", (req, res) => {
    // 1. Get the id
    const fruitId = req.params.id
    // 2. Check and assign the readyToEat property with the correct value
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false
    // 3. Tell Mongoose to update the fruit
    Fruit.findByIdAndUpdate(fruitId, req.body, { new: true })
    // 4. If successful -> redirect to the fruit page
        .then(fruit => {
            console.log("The updated fruit:", fruit)
            res.redirect("/fruits")
        })
    // 5. If an error, display that.
        .catch(error => res.json(error))
})


// SHOW route
app.get("/fruits/:id", (req, res) => {
    // 1. Get the ID
    const fruitId = req.params.id
    // 2. Find a fruit by its ID
    Fruit.findById(fruitId)
    // 3. Render a view with the data
        .then(fruit => {
            res.render("fruits/show", { fruit })
        })
    // If there's an error, show that instead.
        .catch(err => {
            console.log(err)
            res.json({ err })
        })
})


// DELETE route
app.delete("/fruits/:id", (req, res) => {
    // 1. Get the fruit id
    const fruitId = req.params.id
    // 2. Delete the fruit with Mongoose
    Fruit.findByIdAndRemove(fruitId)
        // 3. Promise chain to execute
        .then(fruit => {
            console.log("This is the response from findById:", fruit)
            res.redirect("/fruits")
        })
        .catch(err => {
            console.log(err)
            res.json({ err })
        })
})


////////////////////////////////////////
// Server Listener
///////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}`)
})

