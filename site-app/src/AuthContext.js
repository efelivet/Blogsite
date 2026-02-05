 // AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {API} from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/api/auth/getme"); 
        console.log("User fetched:", res.data);
        setUser(res.data);
      } catch (err) {
        console.error("Auth Check Failed:", err.response?.data?.message || err.message);
        setUser(null);
      }
    };
    fetchUser();
  }, []);
     console.log(user)
  return (
    <AuthContext.Provider value={{ user, setUser }}>     
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);