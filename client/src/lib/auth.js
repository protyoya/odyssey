// lib/auth.js - All auth utilities in one file
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Auth API functions
export const getAuthorityData = async (token) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/authorities/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch authority data');
    }
    
    const data = await response.json();
    return data.data.authority;
  } catch (error) {
    throw new Error('Failed to get authority information');
  }
};

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [authority, setAuthority] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      const authorityData = await getAuthorityData(token);
      setAuthority(authorityData);
    } catch (error) {
      localStorage.removeItem('token');
      setAuthority(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    try {
      localStorage.setItem('token', token);
      const authorityData = await getAuthorityData(token);
      setAuthority(authorityData);
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthority(null);
    router.push('/login');
  };

  const value = {
    authority,
    loading,
    login,
    logout,
    isAuthenticated: () => !!authority,
    hasDepartment: (dept) => authority?.department === dept,
    hasAnyDepartment: (depts) => depts.includes(authority?.department),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};