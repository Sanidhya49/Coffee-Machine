import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token in localStorage
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (token && username && role) {
            setUser({ token, username, role });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await api.post('/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token, role, username: resUsername } = response.data;

            // Save to localStorage
            localStorage.setItem('token', access_token);
            localStorage.setItem('username', resUsername);
            localStorage.setItem('role', role);

            setUser({ token: access_token, username: resUsername, role });
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error.response?.data?.detail || error.message);
            return { success: false, message: error.response?.data?.detail || "Login failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
