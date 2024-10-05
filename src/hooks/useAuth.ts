import { useState, useEffect } from "react";

const AUTH_KEY = "isAuthenticated";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const authStatus = localStorage.getItem(AUTH_KEY);
    if (authStatus === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthModalOpen(true);
    }
  }, []);

  const authenticate = (password: string): boolean => {
    if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setIsAuthModalOpen(true);
  };

  return {
    isAuthenticated,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authenticate,
    logout,
  };
};
