import { useState } from 'react';
import { Menu, X, Brain, Info, HelpCircle, FolderOpen, LogOut, LogIn, UserPlus } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; 
import { logout } from "../api/apiCalls/Express/auth";


function Navbar({ saved = true, setSaved = () => {} }) {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Intercept navigation and check for unsaved changes
  const handleNavigation = (targetPath) => {
    if (!saved) {
      const shouldLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!shouldLeave) return false;
    }

    setSaved(true);
    navigate(targetPath);
    setMobileMenuOpen(false); // Close mobile menu after navigation
    return true;
  };

  // Handle logout logic
  const handleLogout = async () => {
    const proceed = handleNavigation('/login');
    if (proceed) {
      await logout();
      setIsLoggedIn(false);
    }
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Nav Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center gap-2 text-white font-bold text-xl hover:text-green-400 transition-colors"
            >
              <Brain className="h-6 w-6 text-green-400" />
              <span className="hidden sm:inline">Develop Model</span>
              <span className="sm:hidden">DM</span>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => handleNavigation('/about')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm"
              >
                <Info className="h-4 w-4" />
                About
              </button>
              
              <button
                onClick={() => handleNavigation('/how-it-works')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm"
              >
                <HelpCircle className="h-4 w-4" />
                How It Works
              </button>
              
              {isLoggedIn && (
                <button
                  onClick={() => handleNavigation('/my-models')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm"
                >
                  <FolderOpen className="h-4 w-4" />
                  My Models
                </button>
              )}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-600/30 transition-colors text-sm"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors text-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-4 py-3 space-y-1">
            {/* Mobile Navigation Links */}
            <button
              onClick={() => handleNavigation('/about')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm"
            >
              <Info className="h-4 w-4" />
              About
            </button>
            
            <button
              onClick={() => handleNavigation('/how-it-works')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm"
            >
              <HelpCircle className="h-4 w-4" />
              How It Works
            </button>
            
            {isLoggedIn && (
              <button
                onClick={() => handleNavigation('/my-models')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm"
              >
                <FolderOpen className="h-4 w-4" />
                My Models
              </button>
            )}

            {/* Mobile Auth Buttons */}
            <div className="pt-3 border-t border-slate-700 space-y-2">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-600/30 transition-colors text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigation('/register')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors text-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;