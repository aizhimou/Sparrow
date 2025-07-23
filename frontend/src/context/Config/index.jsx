import React from 'react';
import { initialState, reducer } from './reducer';

export const ConfigContext = React.createContext({
  state: initialState,
  dispatch: () => null,
});

export const ConfigProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <ConfigContext.Provider value={[state, dispatch]}>
      {children}
    </ConfigContext.Provider>
  );
};