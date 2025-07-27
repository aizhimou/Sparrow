import { Navigate } from 'react-router-dom';
import { history } from '../helpers';
import {useContext} from "react";
import {UserContext} from "../context/User/index.jsx";

function PrivateRoute({ children }) {

  const [userState, userDispatch] = useContext(UserContext);

  if (!userState.user) {
    return <Navigate to='/login' state={{ from: history.location }} />;
  }

  /*if (!localStorage.getItem('user')) {

  }*/

  return children;
}

export default PrivateRoute;