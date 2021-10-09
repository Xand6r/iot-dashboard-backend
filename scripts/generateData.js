/**
 * A script to generate random data points
*/
const mongoose = require('mongoose');
const dataModel = require('../models/data');
const mongoDBconnectionString = `mongodb+srv://nodeuser:Pa$$w0rd@cluster0.oocwe.mongodb.net/iot`

const TYPES = ["flow", "pressure"];
const MAX_VALUE = 1000;
const MAX_SENSOR_COUNT = 10;
const MAX_LAB = 6; //actually 5, but we're using math.floor

const generateFakeDataPoint = () => {
    const randLab = Math.ceil(Math.random() * MAX_LAB);

    const fake = {
        "pressure": [
          Math.round((Math.random() * MAX_VALUE), 2),
          Math.round((Math.random() * MAX_VALUE), 2),
          Math.round((Math.random() * MAX_VALUE), 2)
        ],
        "flow": [
          Math.round((Math.random() * MAX_VALUE), 2),
          Math.round((Math.random() * MAX_VALUE), 2),
          Math.round((Math.random() * MAX_VALUE), 2)
        ],
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