import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';

interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: string;
    roleCode: string;
    branchId?: number;
    branchName?: string;
    lastLogin?: string;
    accessToken: string;
    refreshToken: string;
    sessionId: string;
    profilePhoto?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionCheckInterval, setSessionCheckInterval] = useState<any>(null);

    useEffect(() => {
        loadUser();
        return () => {
            if (sessionCheckInterval) {
                clearInterval(sessionCheckInterval);
            }
        };
    }, []);

    const loadUser = async () => {
        setIsLoading(true);
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                // Validate session with backend
                if (userData.sessionId) {
                    const isValid = await authService.validateSession(userData.sessionId);
                    if (isValid) {
                        setUser(userData);
                        startSessionCheck();
                    } else {
                        clearStorage();
                    }
                } else {
                    setUser(userData);
                }
            }
        } catch (error) {
            console.error('Error loading user:', error);
            clearStorage();
        } finally {
            setIsLoading(false);
        }
    };

    const startSessionCheck = () => {
        if (sessionCheckInterval) {
            clearInterval(sessionCheckInterval);
        }
        
        // Check session every 5 minutes
        const interval = setInterval(async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                if (userData.sessionId) {
                    const isValid = await authService.validateSession(userData.sessionId);
                    if (!isValid) {
                        toast.warning('Session expired. Please login again.');
                        await logout();
                    }
                }
            }
        }, 5 * 60 * 1000);
        
        setSessionCheckInterval(interval);
    };

    const clearStorage = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    const login = async (credentials: any): Promise<any> => {
        setIsLoading(true);
        try {
            const userData = await authService.login({
                username: credentials.email,
                password: credentials.password
            });
            
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', userData.accessToken);
            
            startSessionCheck();
            toast.success('Login successful!');
            return userData;
        } catch (error: any) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || error.message || 'Login failed';
            toast.error(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            if (user?.refreshToken) {
                await authService.logout({ refreshToken: user.refreshToken });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearStorage();
            if (sessionCheckInterval) {
                clearInterval(sessionCheckInterval);
            }
            setIsLoading(false);
            window.location.href = '/login';
        }
    };

    const checkSession = async (): Promise<boolean> => {
        if (!user?.sessionId) return false;
        try {
            return await authService.validateSession(user.sessionId);
        } catch (error) {
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading, 
            isAuthenticated: !!user, 
            login, 
            logout, 
            checkSession 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
