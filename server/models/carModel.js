const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carSchema = new Schema({
    "Brand:": String,
    "Model:": String,
    "Trim / Edition:": String,
    "Fuel type:": String,
    "Transmission:": String,
    "Body type:": String,
    "Year of Manufacture:": String,
    "Engine capacity:": String,
    "Mileage:": String
})

module.exports = mongoose.model('vehicles', carSchema);