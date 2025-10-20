import { createContext, useContext, useState, useEffect } from 'react';
import { checkLoggedIn } from '../api/apiCalls/Express/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [waitAuthorization, setWaitAuthorization] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(true); // ← NEW for general loading

  useEffect(() => {
    setGlobalLoading(true)

    const _check = async () => {
      const result = await checkLoggedIn();
      console.log("checking if logged in: ", result)
      setIsLoggedIn(result);
      setWaitAuthorization(false);
    };
    _check();
  }, []);


  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, globalLoading, setGlobalLoading, waitAuthorization }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

