/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  user: null,
  login: (token) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On initial load, check for token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you might fetch user details with the token.
      setUser({ token });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
