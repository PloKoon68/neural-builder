const express = require('express');
const router = express.Router();
const { updateModelInfoByModelId, getModelInfoByModelId } = require('../models/modelInfoModel.js');
const { model } = require('mongoose');


router.get("/:modelId", async (req, res) => {
   const { modelId } = req.params;
  
   const modelInfo = await getModelInfoByModelId(modelId);

  res.json(modelInfo);
  
});
 
// for saving model dataj
router.post('/', async (req, res) => {
  const modelInfo = req.body;
  try {
    await updateModelInfoByModelId(modelInfo);    

    res.status(200).send(`Model saved successfully`);
  } catch (err) {
    console.error('Error creating case:', err);
    res.status(500).send('Error creating case');
  }
});


module.exports = router;
