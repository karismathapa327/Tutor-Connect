import { createContext, useContext, useEffect, useState } from "react";
import { storage } from "../utils/storage";
import * as authApi from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storage.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = storage.getUser();

    if (savedUser) {
      setUser(savedUser);
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authApi.loginUser(credentials);

    storage.setToken(data.token);
    storage.setUser(data.user);

    setUser(data.user);

    return data;
  };

  const register = async (userData) => {
    return await authApi.registerUser(userData);
  };

  const logout = () => {
    storage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}