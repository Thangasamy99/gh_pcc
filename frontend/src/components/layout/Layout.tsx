// src/components/layout/Layout.tsx
import React, { useState, useContext } from 'react';
import { Menu, Bell, Search, RefreshCw } from 'lucide-react';
import Sidebar from './Sidebar';
import ProfileDropdown from './ProfileDropdown';
import { AuthContext } from '../auth/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
    onRefresh?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onRefresh }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const authContext = useContext(AuthContext);

    const user = authContext?.user || {
        firstName: 'System',
        lastName: 'Admin',
        email: 'super.admin@pcc.cm',
        roleCode: 'SUPER_ADMIN',
    };

    const userData = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.roleCode,
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                userData={userData}
            />

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'
                    }`}
            >
                {/* Top Header */}
                <header className="bg-white border-b sticky top-0 z-30 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-xl w-80">
                                <Search className="w-4 h-4 text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-sm w-full"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                                <Bell className="w-6 h-6 text-gray-500" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                            </button>
                            {onRefresh && (
                                <button
                                    onClick={onRefresh}
                                    className="p-2 hover:bg-purple-50 rounded-lg group transition-all"
                                    title="Refresh"
                                >
                                    <RefreshCw className="w-5 h-5 text-[#9120e8] group-hover:rotate-180 transition-transform duration-500" />
                                </button>
                            )}
                            
                            {/* Profile Dropdown */}
                            <div className="pl-2 border-l border-gray-200">
                                {authContext?.user && <ProfileDropdown user={authContext.user} />}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 pb-12">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
