import { expressAPI } from "../../axious.js"; // Import the axios instance

const register = async (username, password, email) => {
  try {
    await expressAPI.post('/auth/register', { username, password, email }, { withCredentials: true });
    return { success: true };
  } catch (err) {
    if (err.response && err.response.status === 400) {
      return { success: false, reason: 'user_exists' }; // assuming backend sends 400 for existing user
    } 

    return { success: false, reason: 'server_error' };
  }
};

const login = async (username, password) => {
  try{
    await expressAPI.post('/auth/login', { username, password }, { withCredentials: true });
    
    return { success: true };
  } catch(err) {
    if (err.response && err.response.status === 401) {
      return { success: false, reason: 'invalid_credentials' };
    }
    return { success: false, reason: 'server_error' };   //code: ERR_NETWORK
  }
};

const logout = async () => {
  await expressAPI.get('/auth/logout', { withCredentials: true })
};

const checkLoggedIn = async () => {
  try {
    await expressAPI.get('/auth/protected', { withCredentials: true });
    return true;    
  } catch (err) {
    console.error("Access denied");
    return false;    
  }
};

export {
  login,
  logout,
  checkLoggedIn,
  register
};