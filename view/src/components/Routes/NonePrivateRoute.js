import { Navigate } from 'react-router-dom';

import { useAuth } from '../AuthContext';

export default function NonePrivateRoute({children}) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/my-models" replace />;
  }
  return children;
}
