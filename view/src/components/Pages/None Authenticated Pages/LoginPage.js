import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from "../../../api/apiCalls/Express/auth"; 
import '../../../style/Pages/Login.css';

import { useAuth } from '../../AuthContext';

function LoginPage() {
  const navigate = useNavigate(); 
  const { setIsLoggedIn } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [waitingResponse, setWaitingResponse] = useState(false);

  const [errors, setErrors] = useState({
    usernameBlank: false,
    passwordBlank: false,
    
    invalidCredentials: false
  });
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setWaitingResponse(true)

    const _errors = {
      usernameBlank: !username.trim(),
      passwordBlank: !password.trim(),
      invalidCredentials: false
    }
    
    if(!_errors.usernameBlank && !_errors.passwordBlank) {
      const result = await login(username, password);
      console.log("login result is:", result)
      if(result.success) {   //check if credentials are valid
        navigate('/my-models');  //if so, direct to logged in page 
        setIsLoggedIn(true);
      } else if (result.reason === 'invalid_credentials') {
        _errors.invalidCredentials = true;
        setErrors(_errors);
      } else if (result.reason === 'server_error') {
        navigate('/server-error');
        return;
      }
    }
    setErrors(_errors);
    setWaitingResponse(false)
  };

  return (
    <div>
      <div className="background">
          <div className="shape"></div>
          <div className="shape"></div>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className='login-title' style={{color:"black"}}><strong>Login</strong></h2>

        {errors.invalidCredentials && (
        <div className="invalid-credentials">
          Invalid username or password.
          <button 
            className="close-btn" 
            onClick={() => setErrors(prev => ({ ...prev, invalidCredentials: false }))}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        )}
        
          <input className='login-input' type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} id="Username"/>
          {errors.usernameBlank && <div className="error-text">Username can't be empty!</div>}
        
          <input className='login-input' type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} id="Password"/>
          {errors.passwordBlank && <div className="error-text">Password can't be empty!</div>}

        <button className="login-button" disabled={waitingResponse} style={{marginTop: "30px"}}>
          {waitingResponse ? "Logging in..." : "LOGIN"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
