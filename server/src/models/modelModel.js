const mongoose = require('mongoose');
const { ModelInfo } = require('./modelInfoModel'); // adjust path if needed


const savedWorkSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }

}, { timestamps: true });


savedWorkSchema.pre('findOneAndDelete', async function (next) {
    const doc = await this.model.findOne(this.getFilter());
    if (doc) 
      await ModelInfo.deleteOne({ modelId: doc._id });
    next();
});



const Models = mongoose.model('models', savedWorkSchema);

// Create new saved work
const createModel = async (title, description, status, userId) => {
  return await Models.create({ title, description, status, userId });
};

// Get all works by user (optionally limit fields)
const getAllModelsByUserId = async (userId) => {
  return await Models.find({ userId });
};

// Get full work detail
const getModelById = async (id) => {
  return await Models.findById(id);
};

// Update a model by its ID
const updateModelById = async (id, title, description) => {
  const updatedData = {title, description}
  return await Models.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  );
};

const updateStatusById = async (id, status) => {
  const updatedData = { status }; // Only status will be updated
  return await Models.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true, runValidators: true }
  );
};


// Delete a work
const deleteModelById = async (id) => {
  return await Models.findOneAndDelete({ _id: id }); 

};

module.exports = {
  createModel,
  getAllModelsByUserId,
  getModelById,
  deleteModelById,
  updateModelById,
  updateStatusById
};


/*
  layers: [
    {
      numOfNeurons: { type: Number, required: true },
      activation:   { type: String, required: true }
      // Add other layer-related fields if needed
    }
  ]
    */