import { useState } from 'react';
import { Brain, Mail, Lock, AlertCircle, X, Zap, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { register } from "../../../api/apiCalls/Express/auth";

export default function RegisterPage() {

  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    usernameBlank: false,
    usernameHasSpaces: false,
    passwordBlank: false,
    confirmPasswordNotMatch: false,
    emailBlank: false,
    userExists: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const _errors = {
      usernameBlank: !username.trim(),
      usernameHasSpaces: username.includes(" "),
      passwordBlank: !password.trim(),
      confirmPasswordNotMatch: password !== confirmPassword,
      emailBlank: !email.trim(),
      userExists: false
    };

    if (
      !_errors.usernameBlank &&
      !_errors.usernameHasSpaces &&
      !_errors.passwordBlank &&
      !_errors.confirmPasswordNotMatch &&
      !_errors.emailBlank
    ) {
      const result = await register(username, password, email);

      if (result.success) {
        console.log('Registration successful');
        navigate('/my-models');
        setIsLoggedIn(true);
      } else if (result.reason === 'user_exists') {
        _errors.userExists = true;
        setErrors(_errors);
      } else if (result.reason === 'server_error') {
        navigate('/server-error');
        return;
      }
    }

    setErrors(_errors);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(148, 163, 184) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Animated Background Shapes */}
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute -right-8 -bottom-20 w-64 h-64 bg-gradient-to-br from-orange-600 to-orange-400 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Registration Form Container */}
      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/20 rounded-full px-4 py-2 mb-4">
            <Zap className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Visual Deep Learning Platform</span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Brain className="h-8 w-8 text-green-400" />
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
          </div>
          <p className="text-slate-400 text-sm">Join to start building your models</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Exists Error */}
            {errors.userExists && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm flex-1">An account with this username already exists.</p>
                <button
                  type="button"
                  onClick={() => setErrors(prev => ({ ...prev, userExists: false }))}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a unique username"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </div>
              {errors.usernameBlank && (
                <p className="text-red-400 text-sm mt-1">Username can't be empty!</p>
              )}
              {errors.usernameHasSpaces && (
                <p className="text-red-400 text-sm mt-1">Username cannot contain spaces.</p>
              )}
            </div>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </div>
              {errors.emailBlank && (
                <p className="text-red-400 text-sm mt-1">Email can't be empty!</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </div>
              {errors.passwordBlank && (
                <p className="text-red-400 text-sm mt-1">Password can't be empty!</p>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </div>
              {errors.confirmPasswordNotMatch && (
                <p className="text-red-400 text-sm mt-1">Passwords do not match!</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition-all hover:shadow-lg hover:shadow-green-600/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-xs">
            By signing up, you agree to our{' '}
            <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}