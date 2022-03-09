///////////////////////////////////////
// Import dependencies
///////////////////////////////////////
const mongoose = require("./connection")


///////////////////////////////////////
// Define fruits model
///////////////////////////////////////
// Pull the schema and model constructors from Mongoose.
// We'll use something called "destructuring" to accomplish this
const { Schema, model } = mongoose

// Make the fruits Schema
const fruitSchema = new Schema ({
    name: { type: String }, 
    color: { type: String },
    readyToEat: { type: Boolean }
}, { timestamps: true }
)

// Make the fruit model
const Fruit = model("Fruit", fruitSchema)


///////////////////////////////////////
// Export model
///////////////////////////////////////
module.exports = Fruit
