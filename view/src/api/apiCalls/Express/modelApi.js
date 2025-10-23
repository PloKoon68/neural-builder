import { expressAPI } from "../../axious"; // Import the axios instance


const fetchModels = async () => {
  try{
    return (await expressAPI.get(`/models`, { withCredentials: true })).data
  } catch(err) {
    console.log("fetch error is:", err)
  }
}

const createModel = async (newModelData) => {
  try{
    let createdModel = (await expressAPI.post('/models/', newModelData, { withCredentials: true })).data;
    return createdModel;
  } catch(err) {
    return err
  }
};

const updateStatue = async (modelId, isCompiled, isTrained) => {
  let status;
  console.log("now sending to: ", modelId)
  if(isTrained) status = "trained"
  else if(isCompiled) status = "compiled"
  else status = "draft" 
  await expressAPI.post(`/models/update-status/${modelId}`, {status: status}, { withCredentials: true });
};


const updateModel = async (modelId, updatedData) => {
  //console.log("mid:", modelId, "updaedDate:", updatedData)
  return (await expressAPI.put(`/models/${modelId}`, updatedData, { withCredentials: true })).data;
};

const deleteModel = async (modelId) => {
  return (await expressAPI.delete(`/models/${modelId}`, { withCredentials: true })).data;
};


export {
  fetchModels,
  createModel,
  updateModel,
  deleteModel,
  updateStatue
};