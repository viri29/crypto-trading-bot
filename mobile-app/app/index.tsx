import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { getAuthToken } from '@/services/api';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await getAuthToken();
    setIsAuthenticated(!!token);
  };

  if (isAuthenticated === null) {
    //still checking auth status, show nothing or loading screen
    return null;
  }

  return <Redirect href={isAuthenticated ? '/(tabs)/portfolio' : '/login'} />;
}

