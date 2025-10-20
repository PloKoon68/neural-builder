import {crowAPI} from "../../axious"; // Import the axios instance

const sendHyperparametersCrow = async (modelId, hyperparameters, setModelInProcess) => {
  try {
      const response = await crowAPI.post(`/compile/${modelId}`, hyperparameters); 
      setModelInProcess(false)
      return response.data;
  } catch (error) {
      console.error('Error posting data:', error);
  }
};

const sendTestRequest = async (modelId, testData, setIsTesting, setModelInProcess) => {
  try { 
    const response = await crowAPI.post(`/test/${modelId}`, testData);
    setIsTesting(false)
    setModelInProcess(false);

    return response.data;
  } catch (error) {
    console.error("Test error:", error);
    return "Test failed.";
  }
};


const fetchParameters = async (modelId) => {
  try{
    console.log("mmmdd: ", modelId)
    return (await crowAPI.get(`/parameters/${modelId}`)).data
  } catch(err) {
    console.log("fetch error is:", err)
  }
}

const sendPredictionRequest = async (modelId, inputData, setModelInProcess) => {
  try {
      const predictionResults = await crowAPI.post(`/predict/${modelId}`, {"inputData": inputData}); 
      setModelInProcess(false)
      return predictionResults.data;
  } catch (error) {
      console.error('Error posting data:', error);
  }
};

const createCompiledModel = async (modelId, hyperParametersWithParameters) => {
  try {
    await crowAPI.post(`/createCompiledModel/${modelId}`, hyperParametersWithParameters ); 
  } catch (error) {
      console.error('Error posting data:', error);
  }
};

const removeModel = async (modelId) => {
  try {
    await crowAPI.post(`/removeModel/${modelId}`); 
  } catch (error) {
      console.error('Error posting data:', error);
  }
};


export { sendHyperparametersCrow, sendTestRequest, fetchParameters, sendPredictionRequest, createCompiledModel, removeModel };

/*
const sendTrainRequest = async (data) => {
  try {
    console.log("sent train")
    const response = await crowAPI.post('/train', data);
    return response.data;
  } catch (error) {
    console.error("Train error:", error);
    return "Train failed.";
  }
};*/