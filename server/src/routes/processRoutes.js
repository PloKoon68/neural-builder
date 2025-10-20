const express = require('express');
const router = express.Router();
const { updateModelInfoByModelId, getModelInfoByModelId } = require('../models/modelInfoModel.js');

/*
"api/process/save/5/betül".split('/')
reviecedRoutes = ["api", "process", "save", '5', 'betül']
recievedRoutes[3] -> 5
recievedRoutes[4] -> 'betül'
req = {
    asfasf
    SVGDefsElementsafsda
    asdf
    params: {
        5, betül
    }
}

"api/process/save/:id/:name".split('/')
routes = ["api", "process", "save", ':id', ':name']

parameters = [3, 4]
for routePart, ind in routes:
   routePart[0] == ':':
       parameters.push(ind)
*/

router.get("/:modelId", async (req, res) => {
   const { modelId } = req.params;
  
   const modelInfo = await getModelInfoByModelId(modelId);

  res.json(modelInfo);
  
});
 
// for saving model data
router.post('/', async (req, res) => {
  const modelInfo = req.body;
  try {
    const result = await updateModelInfoByModelId(modelInfo);
        
    res.status(200).send(`Model saved successfully`);
  } catch (err) {
    console.error('Error creating case:', err);
    res.status(500).send('Error creating case');
  }
});


module.exports = router;
