import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    setToken: (token: string)=> void;
    logout: ()=> void;
    userToken: string | null;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userToken, setUserToken] = useState<string | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem("jwt");
            setIsAuthenticated(!!token);
            setLoading(false);
        };

        checkToken();
    }, []);

    const setToken = async (token: string) => {
        await AsyncStorage.setItem("jwt", token);
        setUserToken(token);
        console.log(token)
        setIsAuthenticated(true);
    };

    const logout = async () => {
        alert("logout")
        await AsyncStorage.removeItem("jwt");
        setUserToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, setToken, logout, userToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};