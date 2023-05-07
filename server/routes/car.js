const express = require('express');
const router = express.Router();

const {getBrands,getModels,getTrims,getFuelTypes, getTransmission,getBodyTypes, getYears,getCapacities} = require("../controllers/carController");

//get brands
router.get("/brands", getBrands);

//get models
router.get("/models/:brand", getModels);

//get trims
router.get("/trims/:model", getTrims);

//get fuel types
router.get("/fuel-types/:model", getFuelTypes);

//get transmission
router.get("/transmission/:model", getTransmission);

//get body types
router.get("/body-types/:model", getBodyTypes);

//get years
router.get("/years/:model", getYears);

//get engine capacity
router.get("/capacities/:model", getCapacities);

module.exports = router;