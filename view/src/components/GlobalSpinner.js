// components/GlobalSpinner.js
import { useAuth } from './AuthContext';
import '../style/GlobalSpinner.css';


const GlobalSpinner = () => {
  /*
  const { globalLoading, waitAuthorization } = useAuth();
  if (!globalLoading && !waitAuthorization) return null;
*/  

  return (
    <div className="spinner-container">
      <div className="custom-spinner"></div>
    </div>
  );
};

export default GlobalSpinner;
