import { Navigate } from 'react-router-dom';
import { history } from '../helpers';

function PrivateRoute({ children, requireAdmin = false}) {
  let userItem = localStorage.getItem('user');
  if (!userItem) {
    return <Navigate to="/login" state={{ from: history.location }} />;
  }

  const user = JSON.parse(userItem);
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/403" replace />;
  }

  return children;
}

export default PrivateRoute;
