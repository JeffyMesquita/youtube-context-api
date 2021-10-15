import React, { createContext, useState, useEffect } from 'react';

import api from '../api';
import history from '../history';

const Context = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
  }, [])

  const handleLogin = async () => {
    const { data: { token } } = await api.post('/authenticate');
    
    localStorage.setItem('token', JSON.stringify(token));
    api.defaults.headers.Authorization = `Bearer ${token}`;
    history.push('/users');
    setAuthenticated(true);
  }

  const handleLogout = async () => {
    setAuthenticated(true);
    localStorage.removeItem('token');
    api.defaults.headers.Authorization = undefined;
    history.push('/login');
  }

  return(
    <Context.Provider value={{ authenticated, handleLogin, handleLogout }}>
      {children}
    </Context.Provider>
  );
};

export { Context, AuthProvider };