// components/GlobalSpinner.js
import { useAuth } from './AuthContext';
import '../style/GlobalSpinner.css';


const GlobalSpinner = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-400"></div>
  </div>
);

export default GlobalSpinner;
