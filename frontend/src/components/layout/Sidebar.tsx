
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Users,
    Shield,
    BarChart3,
    FileText,
    Settings,
    LogOut,
    ChevronDown,
    ChevronRight,
    UserCircle,
    CirclePlus,
    Activity,
    DollarSign,
    Lock,
    Database,
    Key,
    ShieldCheck,
} from 'lucide-react';

import { roleService } from '../../services/roleService';
import { userService } from '../../services/userService';

// ============================================================
// SIDEBAR NAVIGATION ITEMS CONFIGURATION
// ============================================================

interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    href: string;
    badge?: number;
    children?: NavItem[];
}

const superAdminItems: NavItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/superadmin/dashboard',
    },
    {
        id: 'branches',
        label: 'Branches',
        icon: Building2,
        href: '/superadmin/branches',
        children: [
            {
                id: 'branches-list',
                label: 'All Branches',
                icon: Building2,
                href: '/superadmin/branches',
            },
            {
                id: 'branches-create',
                label: 'Create Branch',
                icon: CirclePlus,
                href: '/superadmin/branches/create',
            },
        ],
    },
    {
        id: 'doctors',
        label: 'Doctor Management',
        icon: UserCircle,
        href: '/superadmin/doctors',
        children: [
            {
                id: 'doctors-create',
                label: 'Create Doctor',
                icon: CirclePlus,
                href: '/superadmin/doctors/create',
            },
            {
                id: 'doctors-list',
                label: 'Doctor List',
                icon: Users,
                href: '/superadmin/doctors/list',
            },
        ],
    },
    {
        id: 'users',
        label: 'Users',
        icon: Users,
        href: '/superadmin/users',
    },
    {
        id: 'roles',
        label: 'Roles & Permissions',
        icon: Shield,
        href: '/superadmin/roles',
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        href: '/superadmin/settings',
    },
];

const doctorItems: NavItem[] = [
    {
        id: 'doctor-dashboard',
        label: 'Clinical Dashboard',
        icon: Activity,
        href: '/doctor/dashboard',
    },
    {
        id: 'doctor-patients',
        label: 'My Patients',
        icon: Users,
        href: '/doctor/patients',
    },
    {
        id: 'doctor-consultations',
        label: 'Consultation History',
        icon: FileText,
        href: '/doctor/consultations',
    },
    {
        id: 'doctor-settings',
        label: 'My Profile',
        icon: Settings,
        href: '/doctor/profile',
    },
];

const getNavItemsByRole = (role: string): NavItem[] => {
    switch (role) {
        case 'SUPER_ADMIN':
            return superAdminItems;
        case 'DOCTOR':
            return doctorItems;
        default:
            return superAdminItems; // Default to admin for safety or common items
    }
};

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    userData: {
        name: string;
        email: string;
        role: string;
        avatar?: string;
    };
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, userData }) => {
    const location = useLocation();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [counts, setCounts] = useState({ users: 0, roles: 0 });

    useEffect(() => {
        const fetchCounts = async () => {
            // Only fetch counts for SUPER_ADMIN role
            if (userData.role !== 'SUPER_ADMIN') {
                return;
            }
            try {
                const [roles, users] = await Promise.all([
                    roleService.getAllRoles(),
                    userService.getAllUsers({ size: 1 })
                ]);
                setCounts({
                    roles: roles.length,
                    users: (users as any).totalElements || 0
                });
            } catch (error) {
                console.error('Error fetching sidebar counts:', error);
            }
        };
        fetchCounts();
    }, [userData.role]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const roleNavItems = getNavItemsByRole(userData.role);

    useEffect(() => {
        const currentPath = location.pathname;
        roleNavItems.forEach(item => {
            if (item.children?.some(child => child.href === currentPath)) {
                if (!expandedItems.includes(item.id)) {
                    setExpandedItems(prev => [...prev, item.id]);
                }
            }
        });
    }, [location.pathname, roleNavItems]);

    const toggleExpand = (itemId: string) => {
        setExpandedItems(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    const sidebarVariants = {
        open: { x: 0, opacity: 1, display: 'block' },
        closed: { x: -280, opacity: 0, transitionEnd: { display: 'none' } },
    };

    return (
        <>
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial="open"
                animate={isOpen ? 'open' : 'closed'}
                variants={sidebarVariants}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#9120e8] to-[#6a15b5] text-white shadow-2xl z-50 overflow-y-auto flex flex-col"
            >
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <Building2 className="w-6 h-6 text-[#9120e8]" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">PCC HMS</h2>
                            <p className="text-xs text-white/70">Super Admin</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            {userData.avatar ? (
                                <img src={userData.avatar} alt={userData.name} className="w-12 h-12 rounded-full" />
                            ) : (
                                <UserCircle className="w-8 h-8 text-white" />
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-semibold text-sm truncate">{userData.name}</h3>
                            <p className="text-xs text-white/70 truncate">{userData.email}</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 flex-1">
                    <ul className="space-y-1">
                        {roleNavItems.map((item) => {
                            const badgeCount = (item.id === 'users' ? counts.users : item.id === 'roles' ? counts.roles : item.badge) || 0;
                            return (
                                <li key={item.id}>
                                {item.children ? (
                                    <div>
                                        <button
                                            onClick={() => toggleExpand(item.id)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${location.pathname.startsWith(item.href)
                                                ? 'bg-white text-[#9120e8] shadow-lg'
                                                : 'hover:bg-white/10 text-white'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <item.icon className="w-5 h-5" />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {badgeCount > 0 && (
                                                    <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                                                        {badgeCount}
                                                    </span>
                                                )}
                                                {expandedItems.includes(item.id) ? (
                                                    <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4" />
                                                )}
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {expandedItems.includes(item.id) && (
                                                <motion.ul
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden pl-11 mt-1 space-y-1"
                                                >
                                                    {item.children.map((child) => (
                                                        <li key={child.id}>
                                                            <NavLink
                                                                to={child.href}
                                                                className={({ isActive }) =>
                                                                    `flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-300 ${isActive
                                                                        ? 'bg-white/20 text-white font-medium'
                                                                        : 'hover:bg-white/5 text-white/70'
                                                                    }`
                                                                }
                                                            >
                                                                <span className="text-sm">{child.label}</span>
                                                            </NavLink>
                                                        </li>
                                                    ))}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <NavLink
                                        to={item.href}
                                        className={({ isActive }) =>
                                            `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                                ? 'bg-white text-[#9120e8] shadow-lg font-medium'
                                                : 'hover:bg-white/10 text-white'
                                            }`
                                        }
                                    >
                                        <div className="flex items-center space-x-3">
                                            <item.icon className="w-5 h-5" />
                                            <span className="text-sm">{item.label}</span>
                                        </div>
                                        {item.badge && (
                                            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </NavLink>
                                )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 mt-auto border-t border-white/10">
                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
