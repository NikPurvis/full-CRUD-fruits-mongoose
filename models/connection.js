///////////////////////////////////////
// Import dependencies
///////////////////////////////////////
require("dotenv").config()
const mongoose = require("mongoose")

///////////////////////////////////////
// Database connection
///////////////////////////////////////
// We're setting up inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// Establishes connection
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when our connection opens/closes/errors
mongoose.connection
    .on("open", () => console.log("Connected to Mongoose"))
    .on("close", () => console.log("Disconnected from Mongoose"))
    .on("error", (error) => console.log(error))


///////////////////////////////////////
// Export connection
///////////////////////////////////////
module.exports = mongoose
