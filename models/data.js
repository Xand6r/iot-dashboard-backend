const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    // pressure will be an array of p1, p2 and p3
    // which would be the output of the 3 pressure sensors at any given point in time
    pressure: { type: Array, default: [] },
    // flow will be an array of f1, f2 and f3 which would be an array of flow rates at any given point in time
    flow: { type: Array, default: [] },
    // the lab which we are fetching data from
    lab: Number
}, {
    timestamps: { createdAt: "date" }
});

dataSchema.plugin(mongoosePaginate);

// define the model
const dataModel = mongoose.model('sensor', dataSchema);

// export
module.exports = dataModel;