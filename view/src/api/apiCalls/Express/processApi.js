import { expressAPI } from "../../axious"; // Import the axios instance


const saveModelInfo = async (modelInfo) => {
    try {
        const response = await expressAPI.post(`/process`, modelInfo); 
        return response.data;
    } catch (error) {
        console.error('Error posting data:', error);
    }
};

const fetchModelData = async (modelId) => {
    try {
        const response = await expressAPI.get(`/process/${modelId}`); 
        return response.data;
    } catch (error) {
        console.error('Error posting data:', error);
    }
};



export { saveModelInfo, fetchModelData };

/*
{
    "layers": [{ "activation": "relu", "numOfNeurons": 4, "lr": 0.01, "wim": "XAVİER", "layerType": "DL" },
    { "activation": "relu", "numOfNeurons": 1, "lr": 0.01, "wim": "XAVİER"}],
    "lossFunction": "",
    "epochNumber": 1000,
    "minibatch": 64,
    "parameters": {
        "w": [[], []],
        "b": []
    }
    isCompiled: true

  }*/