// For ES6 modules / TypeScript
import axios from 'axios';

//const EXPRESS_URL = "http://localhost:5000/api"; // Change this to your backend URL
//const EXPRESS_URL = "https://deep-learning-framework-express.onrender.com/api"; // Change this to your backend URLs
const EXPRESS_URL = process.env.REACT_APP_EXPRESS_URL;

const CROW_URL_HTTP = process.env.REACT_APP_CROW_URL_HTTP;
const CROW_URL_WS = process.env.REACT_APP_CROW_URL_WS;

/*
const CROW_URL_HTTP = "https://deep-learning-framework-crow.onrender.com"; 
const CROW_URL_WS = "wss://deep-learning-framework-crow.onrender.com/ws"; 
*/

// Create axios instance pointing to your C++ backend
const crowAPI = axios.create({
    // Replace with your C++ backend server address and port
    baseURL: CROW_URL_HTTP,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

// Create axios instance pointing to your Express backend
const expressAPI = axios.create({
    baseURL: EXPRESS_URL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

console.log("sending to: ", EXPRESS_URL)
console.log("crowcr to: ", CROW_URL_HTTP)
console.log("crowws to: ", CROW_URL_WS)


  // Health check functions
  const checkExpressHealth = async () => {
      try {
          const response = await expressAPI.get(`/healthz`); 
          console.log("Express health check response:", response.data);
          return response.data;
      } catch (error) {
          console.error('Error posting data:', error);
      }
  };
  

  const checkCrowHealth = async () => {
    try {
        const response = await crowAPI.get(`/healthz`); 
          console.log("Crow health check response:", response.data);
        return response.data;
    } catch (error) { 
        console.error('Error posting data:', error);
    }
};




  export {expressAPI, crowAPI, CROW_URL_WS, checkExpressHealth, checkCrowHealth};
