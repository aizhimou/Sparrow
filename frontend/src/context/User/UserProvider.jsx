import React from 'react';
import { userReducer, initialState } from './UserReducer.js';
import { UserContext } from './UserContext';

export const UserProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(userReducer, initialState);

  return <UserContext.Provider value={[state, dispatch]}>{children}</UserContext.Provider>;
};
