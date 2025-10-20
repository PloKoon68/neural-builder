import './style/App.css';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';  // ✅ Just use Route and Routes
import { useState } from 'react';

import Navbar from './components/Navbar';

import PrivateRoute from './components/Routes/PrivateRoute.js'; // adjust path as needed
import NonePrivateRoute from './components/Routes/NonePrivateRoute.js'; // adjust path as needed



import MyModels from './components/Pages/Authenticated Pages/MyModels.js';
import ProcessPage from './components/Pages/Authenticated Pages/Processing Page/ProcessPage';
import LoginPage from "./components/Pages/None Authenticated Pages/LoginPage.js"
import RegisterPage from "./components/Pages/None Authenticated Pages/RegisterPage.js"
import AboutPage from './components/Pages/Public Pages/AboutPage.js';
import HowItWorksPage from './components/Pages/Public Pages/HowItWorksPage.js';
import ServerDownPage from "./components/Pages/ServerDownPage.js"

import { useAuth } from './components/AuthContext';
import { useEffect } from 'react';

import { checkExpressHealth, checkCrowHealth } from './api/axious.js';


import GlobalSpinner from "./components/GlobalSpinner.js"

function App() {
  const { waitAuthorization } = useAuth();

  const [saved, setSaved] = useState(true);



  useEffect(() => {
    checkExpressHealth();
    checkCrowHealth();
  }, []);


  return (
    <>
    {waitAuthorization? 
    (<GlobalSpinner/>)
    :
    <div className='App'>
      <Navbar saved={saved} setSaved={setSaved} />

      <Routes>
        <Route path="/" element={<Navigate to="/about" />} />
        <Route
          path="/my-models"
          element={
            <PrivateRoute >
              <MyModels />
            </PrivateRoute>
          }
        />

        <Route
          path="/process/:modelId"
          element={
            <PrivateRoute >
              <ProcessPage saved={saved} setSaved={setSaved} />
            </PrivateRoute>
          }
        />

        <Route
          path="/login"
          element={
            <NonePrivateRoute >
              <LoginPage />
            </NonePrivateRoute>
          }
        />
        <Route
          path="/register"
          element={
            <NonePrivateRoute >
              <RegisterPage />
            </NonePrivateRoute>
          }
        />

        <Route path="/about" element={<AboutPage />}/>
        <Route path="/how-it-works" element={<HowItWorksPage />}/>

        <Route path="/server-error" element={<ServerDownPage/>} />

      </Routes>
    </div>
}
    </>

  );
}

export default App;
