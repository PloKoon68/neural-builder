const express = require('express');
const router = express.Router();
const { getCases, getCasesByUserId, createCase, updateCase, deleteCase } = require('../db/dbFunctions');
const authenticateUser = require('../middleware/authenticateUser'); // adjust path as needed


router.get("/", authenticateUser, async (req, res) => {
  const userId = req.userId;
  const cases = await getCasesByUserId(userId);

  res.json(cases);
});

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
  
  
  // POST create a new case
  router.post('/', authenticateUser, async (req, res) => {
    const { title, description } = req.body;
    const userId = req.userId; // ✅ Safe and verified

    try {
      const createdRow = await createCase(userId, title, description);
      res.status(201).json(createdRow);
    } catch (err) {
      console.error('Error creating case:', err);
      res.status(500).send('Error creating case');
    }
  });

  
  // PUT update an existing case by ID
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
      const updatedCase = await updateCase(id, title, description);
      if (!updatedCase) {
        return res.status(404).send('Case not found');
      }
      res.status(200).json(updatedCase);
    } catch (err) {
      res.status(500).send('Error updating case');
    }
  });
  
  // DELETE a case by ID
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedCase = await deleteCase(id);
      if (!deletedCase) {
        return res.status(404).send('Case not found');
      }
      res.status(200).send(`Case with id ${id} deleted`);
    } catch (err) {
      res.status(500).send('Error deleting case');
    }
  });

  

  module.exports = router;
