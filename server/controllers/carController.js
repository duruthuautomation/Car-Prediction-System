const Car = require("../models/carModel");

const getBrands = async (req,res) => {

    try {
        const brands = await Car.distinct("Brand:");
        res.status(200).json(brands);
    } catch (error) {
        res.status(400).json(error);
    }
}

const getModels = async (req,res) => {

    const brand = req.params.brand;

    try {
        const models = await Car.find({ "Brand:": brand }).distinct("Model:");
        res.status(200).json(models);
    } catch (error) {
        res.status(400).json(error);
    } 
}

const getTrims = async (req,res) => {

    const model = req.params.model;

    try {
        const trims = await Car.find({ "Model:": model }).distinct("Trim / Edition:");
        res.status(200).json(trims);
    } catch (error) {
        res.status(400).json(error);
    }
}

const getFuelTypes = async (req,res) => {

    const model = req.params.model;

    try {
        const fuelTypes = await Car.find({ "Model:": model }).distinct("Fuel type:");
        res.status(200).json(fuelTypes);
    } catch (error) {
        res.status(400).json(error);
    }
}

const getTransmission = async (req,res) => {

    const model = req.params.model;

    try {
        const transmission = await Car.find({ "Model:": model }).distinct("Transmission:");
        res.status(200).json(transmission);
    } catch (error) {
        res.status(400).json(error);
    }
}

const getBodyTypes = async (req,res) => {

    const model = req.params.model;

    try {
        const bodyTypes = await Car.find({ "Model:": model }).distinct("Body type:");
        res.status(200).json(bodyTypes);
    } catch (error) {
        res.status(400).json(error);
    }
}

const getYears = async (req,res) => {

    const model = req.params.model;

    try {
        const bodyTypes = await Car.find({ "Model:": model }).distinct("Year of Manufacture:");
        res.status(200).json(bodyTypes);
    } catch (error) {
        res.status(400).json(error);
    }
}

const getCapacities = async (req,res) => {

    const model = req.params.model;

    try {
        const bodyTypes = await Car.find({ "Model:": model }).distinct("Engine capacity:");
        res.status(200).json(bodyTypes);
    } catch (error) {
        res.status(400).json(error);
    }
}

module.exports = {getBrands, getModels, getTrims, getFuelTypes, getTransmission, getBodyTypes, getYears, getCapacities};