import { useState, useEffect } from 'react';

export function useAuthorMode() {
  const [isAuthorMode, setIsAuthorMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('authorMode');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('authorMode', JSON.stringify(isAuthorMode));
  }, [isAuthorMode]);

  const toggleAuthorMode = () => {
    setIsAuthorMode(prev => !prev);
  };

  return {
    isAuthorMode,
    toggleAuthorMode
  };
}