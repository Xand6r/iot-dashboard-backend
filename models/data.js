const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');

const SENSOR_TYPES = ["pressure", "flow"];

const dataSchema = new mongoose.Schema({
    value: Number,
    type: { type: String, enum:Object.values(SENSOR_TYPES) },
    sensor: Number,
    lab: Number
}, {
    timestamps: { createdAt: "date" }
});

dataSchema.plugin(mongoosePaginate);

// define the model
const dataModel = mongoose.model('data', dataSchema);

// export
module.exports = dataModel;