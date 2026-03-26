import React, { useState } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Typography,
    Divider,
    useTheme,
    alpha,
    Collapse,
    Tooltip,
    Badge,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    LocalHospital as HospitalIcon,
    People as PeopleIcon,
    PersonAdd as PersonAddIcon,
    Assignment as AssignmentIcon,
    Settings as SettingsIcon,
    Security as SecurityIcon,
    Assessment as AssessmentIcon,
    Backup as BackupIcon,
    History as HistoryIcon,
    Logout as LogoutIcon,
    ExpandLess,
    ExpandMore,
    ChevronLeft,
    ChevronRight,
    BusinessCenter as BusinessIcon,
    AdminPanelSettings as AdminIcon,
    Notifications as NotificationsIcon,
    Lock as LockIcon,
    Add as AddIcon,
    ViewList as ViewListIcon,
    BarChart as ChartIcon,
    Storage as StorageIcon,
    Build as BuildIcon,
    Person as PersonIcon,
} from '@mui/icons-material';

// Animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 0 0 ${alpha('#9120e8', 0.7)}; }
  70% { box-shadow: 0 0 0 10px ${alpha('#9120e8', 0)}; }
  100% { box-shadow: 0 0 0 0 ${alpha('#9120e8', 0)}; }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// Styled Components
const SidebarContainer = styled(Box)(({ theme }) => ({
    height: '100%',
    background: `linear-gradient(180deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
    color: '#fff',
    overflow: 'hidden',
}));

const LogoContainer = styled(motion.div)(({ theme }) => ({
    padding: theme.spacing(3, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
    marginBottom: theme.spacing(2),
}));

const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
    width: 60,
    height: 60,
    background: theme.palette.common.white,
    color: theme.palette.primary.main,
    animation: `${pulse} 2s infinite ease-in-out`,
    boxShadow: `0 4px 20px ${alpha(theme.palette.common.white, 0.3)}`,
}));

const StyledListItemButton = styled(ListItemButton)<{ active?: boolean }>(
    ({ theme, active }) => ({
        margin: theme.spacing(0.5, 1),
        borderRadius: theme.spacing(1.5),
        transition: 'all 0.3s ease',
        background: active
            ? `linear-gradient(90deg, ${alpha(theme.palette.common.white, 0.15)} 0%, ${alpha(
                theme.palette.common.white,
                0.05
            )} 100%)`
            : 'transparent',
        borderLeft: active ? `4px solid ${theme.palette.common.white}` : '4px solid transparent',
        '&:hover': {
            background: alpha(theme.palette.common.white, 0.1),
            transform: 'translateX(5px)',
            '& .MuiListItemIcon-root': {
                animation: `${pulse} 1s infinite`,
            },
        },
    })
);

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
    color: '#fff',
    minWidth: 40,
    transition: 'all 0.3s ease',
}));

const BadgeIcon = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        animation: `${glow} 2s infinite`,
    },
}));

interface SidebarProps {
    open: boolean;
    onClose: () => void;
    isMobile: boolean;
}

const AnimatedSidebar: React.FC<SidebarProps> = ({ open, onClose, isMobile }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        branches: false,
        users: false,
        reports: false,
        settings: false,
    });

    const handleMenuClick = (menu: string) => {
        setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) {
            onClose();
        }
    };

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/superadmin/dashboard',
            badge: null,
        },
        {
            id: 'branches',
            label: 'Branch Management',
            icon: <HospitalIcon />,
            children: [
                {
                    label: 'All Branches',
                    icon: <ViewListIcon />,
                    path: '/superadmin/branches',
                    description: 'View all 16 hospital branches',
                },
                {
                    label: 'Create Branch',
                    icon: <AddIcon />,
                    path: '/superadmin/branches/create',
                    description: 'Add new hospital branch',
                },
                {
                    label: 'Branch Details',
                    icon: <BusinessIcon />,
                    path: '/superadmin/branches/details',
                    description: 'View branch information',
                },
            ],
        },
        {
            id: 'users',
            label: 'User Management',
            icon: <PeopleIcon />,
            badge: 3,
            children: [
                {
                    label: 'All Users',
                    icon: <ViewListIcon />,
                    path: '/superadmin/users',
                    description: 'View all system users',
                },
                {
                    label: 'Create Branch Admin',
                    icon: <AdminIcon />,
                    path: '/superadmin/users/create-branch-admin',
                    description: 'Create new branch administrator',
                },
                {
                    label: 'Create Central Pharmacy Admin',
                    icon: <PersonAddIcon />,
                    path: '/superadmin/users/create-pharmacy-admin',
                    description: 'Create central pharmacy admin',
                },
                {
                    label: 'Role Management',
                    icon: <SecurityIcon />,
                    path: '/superadmin/roles',
                    description: 'Manage user roles',
                },
            ],
        },
        {
            id: 'reports',
            label: 'Global Reports',
            icon: <AssessmentIcon />,
            children: [
                {
                    label: 'Branch Comparison',
                    icon: <ChartIcon />,
                    path: '/superadmin/reports/branch-comparison',
                    description: 'Compare all 16 branches',
                },
                {
                    label: 'User Activity',
                    icon: <HistoryIcon />,
                    path: '/superadmin/reports/user-activity',
                    description: 'View user activity logs',
                },
                {
                    label: 'System Analytics',
                    icon: <StorageIcon />,
                    path: '/superadmin/reports/analytics',
                    description: 'System performance metrics',
                },
                {
                    label: 'Export Reports',
                    icon: <AssignmentIcon />,
                    path: '/superadmin/reports/export',
                    description: 'Export data to Excel/PDF',
                },
            ],
        },
        {
            id: 'settings',
            label: 'System Settings',
            icon: <SettingsIcon />,
            children: [
                {
                    label: 'System Configuration',
                    icon: <BuildIcon />,
                    path: '/superadmin/settings/system',
                    description: 'Configure system settings',
                },
                {
                    label: 'License Manager',
                    icon: <LockIcon />,
                    path: '/superadmin/settings/license',
                    description: 'Manage licenses',
                },
                {
                    label: 'Backup & Restore',
                    icon: <BackupIcon />,
                    path: '/superadmin/settings/backup',
                    description: 'Database backup and restore',
                },
                {
                    label: 'Audit Logs',
                    icon: <HistoryIcon />,
                    path: '/superadmin/settings/audit',
                    description: 'View system audit trails',
                },
            ],
        },
    ];

    const drawerContent = (
        <SidebarContainer>
            {/* Logo Section */}
            <LogoContainer
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <AnimatedAvatar>
                    <HospitalIcon sx={{ fontSize: 40 }} />
                </AnimatedAvatar>
                <Box sx={{ ml: 2 }}>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                        PCC
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
                        Super Admin
                    </Typography>
                </Box>
            </LogoContainer>

            {/* User Info */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <Box sx={{ px: 3, py: 2 }}>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                        Logged in as
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                        Super Administrator
                    </Typography>
                </Box>
            </motion.div>

            <Divider sx={{ borderColor: alpha('#fff', 0.1) }} />

            {/* Navigation Menu */}
            <List sx={{ px: 1, py: 2 }}>
                {menuItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        {item.children ? (
                            // Menu with children
                            <>
                                <ListItem disablePadding>
                                    <StyledListItemButton onClick={() => handleMenuClick(item.id)}>
                                        <StyledListItemIcon>
                                            {item.badge ? (
                                                <BadgeIcon badgeContent={item.badge} color="error">
                                                    {item.icon}
                                                </BadgeIcon>
                                            ) : (
                                                item.icon
                                            )}
                                        </StyledListItemIcon>
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{ fontWeight: 500 }}
                                        />
                                        {openMenus[item.id] ? <ExpandLess /> : <ExpandMore />}
                                    </StyledListItemButton>
                                </ListItem>

                                <Collapse in={openMenus[item.id]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.children.map((child, childIndex) => (
                                            <motion.div
                                                key={child.path}
                                                initial={{ x: -10, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: childIndex * 0.03 }}
                                            >
                                                <Tooltip title={child.description} placement="right" arrow>
                                                    <ListItem disablePadding sx={{ pl: 2 }}>
                                                        <StyledListItemButton
                                                            active={location.pathname === child.path}
                                                            onClick={() => handleNavigation(child.path)}
                                                        >
                                                            <StyledListItemIcon sx={{ minWidth: 32 }}>
                                                                {child.icon}
                                                            </StyledListItemIcon>
                                                            <ListItemText
                                                                primary={child.label}
                                                                primaryTypographyProps={{ variant: 'body2' }}
                                                            />
                                                        </StyledListItemButton>
                                                    </ListItem>
                                                </Tooltip>
                                            </motion.div>
                                        ))}
                                    </List>
                                </Collapse>
                            </>
                        ) : (
                            // Single menu item
                            <ListItem disablePadding>
                                <Tooltip title={item.label} placement="right" arrow>
                                    <StyledListItemButton
                                        active={location.pathname === item.path}
                                        onClick={() => handleNavigation(item.path!)}
                                    >
                                        <StyledListItemIcon>
                                            {item.badge ? (
                                                <BadgeIcon badgeContent={item.badge} color="error">
                                                    {item.icon}
                                                </BadgeIcon>
                                            ) : (
                                                item.icon
                                            )}
                                        </StyledListItemIcon>
                                        <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 500 }} />
                                    </StyledListItemButton>
                                </Tooltip>
                            </ListItem>
                        )}
                    </motion.div>
                ))}
            </List>

            {/* Logout Button */}
            <Box sx={{ position: 'absolute', bottom: 16, left: 0, right: 0, px: 2 }}>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <ListItem disablePadding>
                        <StyledListItemButton
                            onClick={() => {
                                // Handle logout
                                navigate('/login');
                            }}
                            sx={{
                                background: alpha('#f44336', 0.1),
                                '&:hover': {
                                    background: alpha('#f44336', 0.2),
                                },
                            }}
                        >
                            <StyledListItemIcon>
                                <LogoutIcon />
                            </StyledListItemIcon>
                            <ListItemText primary="Logout" />
                        </StyledListItemButton>
                    </ListItem>
                </motion.div>
            </Box>
        </SidebarContainer>
    );

    return (
        <AnimatePresence mode="wait">
            {isMobile ? (
                <Drawer
                    anchor="left"
                    open={open}
                    onClose={onClose}
                    PaperProps={{
                        sx: {
                            width: 280,
                            background: 'transparent',
                            boxShadow: 'none',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                <Box
                    component={motion.div}
                    initial={{ width: 280 }}
                    animate={{ width: open ? 280 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    sx={{
                        width: 280,
                        flexShrink: 0,
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
                    }}
                >
                    {drawerContent}
                </Box>
            )}
        </AnimatePresence>
    );
};

export default AnimatedSidebar;
