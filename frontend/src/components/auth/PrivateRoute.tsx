import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode;
    requiredRole?: string | string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
    const authContext = useContext(AuthContext);
    const location = useLocation();

    if (!authContext) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const { user, isLoading, isAuthenticated } = authContext;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Verifying session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const userRole = user.roleCode || user.role || '';
        const hasRequiredRole = roles.some(role => 
            userRole.includes(role) || 
            userRole === role || 
            userRole === `ROLE_${role}`
        );
        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};

export default PrivateRoute;
