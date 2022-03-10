///////////////////////////////////////
// Import dependencies
///////////////////////////////////////
// This allows us to load our env variables
require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const methodOverride = require("method-override")
// We no longer need this reference because it lives in the fruit controller now
// const Fruit = require("./models/fruit")
// Now that we're using controllers as they should be used, we need to require our routers
const FruitRouter = require("./controllers/fruit")
const UserRouter = require('./controllers/user')
// Session Middleware requirements 
const session = require("express-session")
const MongoStore = require("connect-mongo")


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
// This is the middleware to set up a session
app.use(
    session ({
        secret: process.env.SECRET,
        store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
        saveUninitialized: true,
        resave: false
    })
)


////////////////////////////////////////
// Routes
///////////////////////////////////////
// Send all "/fruits" routes to the Fruit Router
// (Technically this is middleware)
app.use("/fruits", FruitRouter)
app.use('/user', UserRouter)

app.get("/", (req, res) => {
    res.send("Ground Control to Major Tom")
})


////////////////////////////////////////
// Server Listener
///////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App is listening on port: ${PORT}`)
})
