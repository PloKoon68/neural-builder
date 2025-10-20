const mongoose = require('mongoose');

const layerSchema = new mongoose.Schema({
  activation:   { type: String, required: true },
  numOfNeurons: { type: Number, required: true },
  lr:           { type: Number, required: true },
  wim:          { type: String, required: true },
  layerType:    { type: String, required: true },  // for your "DL" field (sometimes you wrote LT too)
 }, { _id: false });

const trainingHyperparametersSchema = new mongoose.Schema({
  lossFunction:   { type: String, required: true },
  optimizer:      { type: String, required: true },
  epochNum:       { type: Number, required: true },
  minibatchSize:  { type: Number, required: true },
}, { _id: false });


const parametersSchema = new mongoose.Schema({
  weights: [[Number]],  // 2D array of numbers
  biases: [Number]     // 1D array of numbers
}, { _id: false });

const normalizerParametersSchema = new mongoose.Schema({
  means: [Number],  // 1D array of numbers
  stdevs: [Number]    // 1D array of numbers
}, { _id: false });

const modelInfoSchema = new mongoose.Schema({
  modelId:     { type: mongoose.Schema.Types.ObjectId, ref: 'models', required: true }, // reference to models collection
  layers:      [layerSchema],
  parameters:  [parametersSchema],
  normalizerParameters: normalizerParametersSchema,

  inputSize:   { type: Number, required: true },

  trainingHyperparameters: trainingHyperparametersSchema,

  isCompiled:  { type: Boolean, default: true }
}, { timestamps: true });

const ModelInfo = mongoose.model('modelInfo', modelInfoSchema);


// Get by modelId (foreign key)
const getModelInfoByModelId = async (modelId) => {
  return await ModelInfo.findOne({ modelId });
};


// Create
const createDefaultModelInfo = async (modelId) => {
    const defData = {
        modelId,
        layers: [{ "activation": "relu", "numOfNeurons": 1, "lr": 0.01, "wim": "XAVİER", "layerType": "DL" },],
        
        trainingHyperparameters: {
          lossFunction: "sigmoid cross entropy",
          optimizer: "SGD",
          epochNum: 400,
          minibatchSize: 64,
        },
        parameters: [{weights: [[0]], biases: [0]}],
        inputSize: 0,
        isCompiled: false
    }
    
  return await ModelInfo.create({ ...defData });
};

// Update

const updateModelInfoByModelId = async (updatedData) => {
  return await ModelInfo.findOneAndUpdate(
    { modelId: updatedData.modelId },  // use modelId as filter
    { $set: updatedData },
    { new: true, runValidators: true }
  );
};


/*
// Delete
const deleteModelInfoByModelId = async (modelId) => {
  return await ModelInfo.deleteOne({ modelId: modelId });
};*/

module.exports = {
  createDefaultModelInfo,
  getModelInfoByModelId,
  updateModelInfoByModelId,
  ModelInfo
};
