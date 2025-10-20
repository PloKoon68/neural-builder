import { useNavigate } from 'react-router-dom';
import '../style/Navbar.css';
import { useAuth } from './AuthContext'; 
import { logout } from "../api/apiCalls/Express/auth"; 

function Navbar({ saved, setSaved }) {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  // Intercept navigation and check for unsaved changes
  const handleNavigation = (targetPath) => {
    if (!saved) {
      const shouldLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!shouldLeave) return false;
    }

    setSaved(true); // Reset saved state or cleanup if needed
    navigate(targetPath);
    return true;
  };

  // Handle logout logic
  const handleLogout = async () => {
    const proceed = handleNavigation('/login'); // Confirm before logout
    if (proceed) {
      await logout(); // Clear backend session
      setIsLoggedIn(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo" style={{marginRight: "100px"}}>Develop Model</div>
        <button className="nav-link" onClick={() => handleNavigation('/about')}>About</button>
        <button className="nav-link" onClick={() => handleNavigation('/how-it-works')}>How It Works</button>
        {isLoggedIn && (
          <button className="nav-link" onClick={() => handleNavigation('/my-models')}>My Models</button>
        )}
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <button className="auth-btn logout" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <button className="auth-btn login" onClick={() => handleNavigation('/login')}>Login</button>
            <button className="auth-btn register" onClick={() => handleNavigation('/register')}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
