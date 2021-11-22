var express = require("express");
const dataModel = require("../models/data");
const { celebrate, Joi } = require("celebrate");

var router = express.Router();

const DEFAULT_OPTIONS = {
  page: 1,
  limit: 10,
  collation: {
    locale: "en",
  },
  sort: '-data'
};

/* ADD data to the data base of the sensors */
router.post(
  "/add",
  celebrate({
    body: Joi.object({
      pressure: Joi.array(),
      flow: Joi.array(),
      lab: Joi.number(),
    }),
  }),
  async function (req, res) {
    const { io } = global.__socketInstance;
    const dataResults = await dataModel.create({ ...req.body });
    // emit an event for real time sake
    io.emit('NEW_DATA', dataResults);
    res.send(dataResults);
  }
);

/* FILTER data gotten from the backend */
router.post("/filter", async function (req, res) {
  const { page = 1, limit = 10, sorter="", filter={} } = req.body;

  const options = {
    ...DEFAULT_OPTIONS,
    page,
    limit,
  };
  if(sorter){
    options['sort'] = sorter;
  }
  const data = await dataModel.paginate(filter, options);

  res.send(data);
});
/* FILTER data gotten from the backend */

/* get basic statistics from the backend */
router.get("/stats/:labid", async function(req, res){
  const labId = req.params.labid;
  // get all the data with this labid
  const allData = await dataModel.find({
    lab: labId
  }).select('type value');

  const allPressure = allData.filter(({type}) => type === "pressure").map(p=>p.value);
  const allFlow = allData.filter(({type}) => type === "flow").map(f=>f.value);

  return res.send({
    pMax: Math.max(...allPressure),
    fMax: Math.max(...allFlow),
    pMeam: (allPressure.reduce((a,b)=>a+b, 0)/allPressure.length).toFixed(2),
    fMeam: (allFlow.reduce((a,b)=>a+b, 0)/allFlow.length).toFixed(2)
  });
})
/* get basic statistics from the backend */



module.exports = router;
