/**
 * A script to generate random data points
*/
const mongoose = require('mongoose');
const dataModel = require('../models/data');
const mongoDBconnectionString = `mongodb+srv://nodeuser:Pa$$w0rd@cluster0.oocwe.mongodb.net/iot`

const TYPES = ["flow", "pressure"];
const MAX_VALUE = 1000;
const MAX_SENSOR_COUNT = 10;
const MAX_LAB = 5;

const generateFakeDataPoint = () => {
    const randValue = Math.round((Math.random() * MAX_VALUE), 2);
    const randType = TYPES[Math.floor(Math.random() * TYPES.length)];
    const randSensor = Math.floor(Math.random() * MAX_SENSOR_COUNT);
    const randLab = Math.ceil(Math.random() * MAX_LAB);

    const fake = {
        "value": randValue,
        "type": randType,
        "sensor": randSensor,
        "lab": randLab
    };

    return fake;
};

const generateData = async (dataCount) => {
    console.log('generating points')
    for (let i=0;i<dataCount;i++){
        const newPoint = generateFakeDataPoint();
        await dataModel.create(newPoint);
        console.log('created for datapoint', i)
    }
};

// connect to mongoose using the string
mongoose.connect(mongoDBconnectionString,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((db) => {
    // generate 1000 random data points
    console.log('connected to db');
    generateData(1000);
  }).catch((err) => {
    console.log(err);
    console.log('there was an error connecting to mongodb database')
  })