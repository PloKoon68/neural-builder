import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { register } from "../../../api/apiCalls/Express/auth"; 

import '../../../style/Pages/Register.css';

import { useAuth } from '../../AuthContext';

function RegisterPage() {
  const navigate = useNavigate(); 
  const { setIsLoggedIn } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');


  const [waitingResponse, setWaitingResponse] = useState(false);


  const [errors, setErrors] = useState({
  });

  
  const checkPreErrors = () => {  
    const _errors = {
      usernameBlank: !username,
      usernameHasSpaces: username.includes(" "),

      passwordBlank: !password,
      confirmPasswordNotMatch: password !== confirmPassword,

      emailBlank: !email,
      invalidEmail: false,
      emailNotFound: false,
  
      userExists: false
    };
    return _errors;
  }
  
  const checkIfValid = (_errors) => {  
    let isValid = true;
    for (const value of Object.values(_errors)) {
      if (value) {
        isValid = false;
        break;
      }
    }
    return isValid;
  }
  const handleRegister = async (e) => {
    e.preventDefault();
    setWaitingResponse(true);

    const _errors = checkPreErrors();
    const isValid = checkIfValid(_errors);

    if (isValid) {
      const result = await register(username, password, email);

      if (result.success) {
        navigate('/my-cases');
        setIsLoggedIn(true);
        return;
      } else if (result.reason === 'user_exists') {
        _errors.userExists = true;
      } else if (result.reason === 'server_error') {
        navigate('/server-error');
        return;
      }
    }

    setErrors(_errors);
    setWaitingResponse(false);
  };

  return (
    <div>
      <div className="background">
          <div className="shape"></div>
          <div className="shape"></div>
      </div>
      <form className="register-form" onSubmit={handleRegister}>
        <h2 className='register-title' style={{color:"black"}}><strong>Register</strong></h2>

        {errors.userExists && (
        <div className="invalid-credentials">
          Username already exists.
          <button 
            className="close-btn" 
            onClick={() => setErrors(prev => ({ ...prev, invalidCredentials: false }))}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        )}
        
          <input className='register-input' type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          {errors.usernameBlank && (<div className="error-text">Username can't be empty!</div>) ||
          errors.usernameHasSpaces && <small className="error-text">Blank character not allowed in username ℹ️</small>}
        
          <input className='register-input' type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          {errors.passwordBlank && <div className="error-text">Password can't be empty!</div>}
          <input className='register-input' type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          {errors.confirmPasswordNotMatch && <div className="error-text">The passwords you entered do not match!</div>}

          <input className='register-input' type="email" placeholder="E-mail address" value={email} onChange={e => setEmail(e.target.value)} />
          {errors.emailBlank && <div className="error-text">Email required!</div>}

        <button className="register-button" disabled={waitingResponse} style={{marginTop: "30px"}}>
          {waitingResponse ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
