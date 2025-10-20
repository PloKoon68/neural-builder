const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser'); // adjust path as needed
const { getAllModelsByUserId, createModel, deleteModelById, updateModelById } = require('../models/modelModel.js');
const { createDefaultModelInfo } = require('../models/modelInfoModel.js');

router.get("/", authenticateUser, async (req, res) => {
  const userId = req.userId;
  const cases = await getAllModelsByUserId(userId);
  res.json(cases);
});

/*
// GET the cases for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await getCasesByUserId(userId)
//      const result = await getCaseById(id);
    if (!result) {
      return res.status(404).send('Case not found');
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send('Error fetching case');
  }
});
*/  

  
// POST create a new model
router.post('/', authenticateUser, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.userId;
  try {
    const createdRow = await createModel(title, description, userId);
    await createDefaultModelInfo(createdRow._id);
    
    res.status(201).json(createdRow);
  } catch (err) {
    console.error('Error creating case:', err);
    res.status(500).send('Error creating case');
  }
});


// PUT update an existing case by ID
router.put('/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const updatedCase = await updateModelById(id, title, description);
    if (!updatedCase) {
      return res.status(404).send('Case not found');
    }
    res.status(200).json(updatedCase);
  } catch (err) {
    res.status(500).send('Error updating case');
  }
});

// DELETE a case by ID
router.delete('/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedModel = await deleteModelById(id);
    if (!deletedModel) {
      return res.status(404).send('Model not found');
    }
    res.status(200).send(`Model with id ${id} deleted`);
  } catch (err) {
    res.status(500).send('Error deleting case');
  }
});

  

  module.exports = router;
