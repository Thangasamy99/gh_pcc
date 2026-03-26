import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    Tooltip,
    Chip,
    useTheme,
    alpha,
    InputBase,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu as MenuIcon,
    MenuOpen as MenuOpenIcon,
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    Search as SearchIcon,
    Wifi as WifiIcon,
    WifiOff as WifiOffIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    Help as HelpIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Animations
const slideDown = keyframes`
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    backgroundSize: '200% 200%',
    animation: `${gradientShift} 10s ease infinite`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.drawer + 1,
}));

const SearchBox = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.spacing(3),
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
    transition: 'all 0.3s ease',
    '&:focus-within': {
        transform: 'scale(1.02)',
        backgroundColor: alpha(theme.palette.common.white, 0.3),
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
            '&:focus': {
                width: '30ch',
            },
        },
    },
}));

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.1) rotate(5deg)',
        backgroundColor: alpha(theme.palette.common.white, 0.1),
    },
}));

const DateTimeDisplay = styled(motion.div)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: theme.spacing(2),
    padding: theme.spacing(0.5, 2),
    borderRadius: theme.spacing(2),
    backgroundColor: alpha(theme.palette.common.white, 0.1),
}));

interface HeaderProps {
    toggleSidebar: () => void;
    sidebarOpen: boolean;
}

const AnimatedHeader: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            clearInterval(timer);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setNotificationAnchor(null);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    const notifications = [
        { id: 1, title: 'New Branch Created', time: '5 min ago', color: '#4caf50' },
        { id: 2, title: 'User Login Alert', time: '10 min ago', color: '#ff9800' },
        { id: 3, title: 'System Update Available', time: '1 hour ago', color: '#2196f3' },
        { id: 4, title: 'Backup Completed', time: '2 hours ago', color: '#9c27b0' },
    ];

    return (
        <StyledAppBar position="sticky">
            <Toolbar>
                {/* Sidebar Toggle */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="toggle sidebar"
                        onClick={toggleSidebar}
                        sx={{ mr: 2 }}
                    >
                        {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                </motion.div>

                {/* Logo/Brand */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        PCC Super Admin
                    </Typography>
                </motion.div>

                {/* Search Box */}
                <SearchBox>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search branches, users..."
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </SearchBox>

                <Box sx={{ flexGrow: 1 }} />

                {/* DateTime Display */}
                <DateTimeDisplay
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Typography variant="caption" sx={{ lineHeight: 1 }}>
                        {format(currentTime, 'EEEE, MMMM do')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {format(currentTime, 'HH:mm:ss')}
                    </Typography>
                </DateTimeDisplay>

                {/* Online Status */}
                <Tooltip title={isOnline ? 'Online' : 'Offline'}>
                    <AnimatedIconButton color="inherit">
                        {isOnline ? <WifiIcon /> : <WifiOffIcon />}
                    </AnimatedIconButton>
                </Tooltip>

                {/* Fullscreen Toggle */}
                <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                    <AnimatedIconButton color="inherit" onClick={toggleFullscreen}>
                        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </AnimatedIconButton>
                </Tooltip>

                {/* Notifications */}
                <Tooltip title="Notifications">
                    <AnimatedIconButton color="inherit" onClick={handleNotificationOpen}>
                        <Badge badgeContent={notifications.length} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </AnimatedIconButton>
                </Tooltip>

                {/* Profile */}
                <Tooltip title="Profile">
                    <AnimatedIconButton
                        edge="end"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
                            <PersonIcon />
                        </Avatar>
                    </AnimatedIconButton>
                </Tooltip>
            </Toolbar>

            {/* Notifications Menu */}
            <Menu
                anchorEl={notificationAnchor}
                open={Boolean(notificationAnchor)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        width: 320,
                        borderRadius: 2,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6">Notifications</Typography>
                </Box>
                <Divider />
                {notifications.map((notification) => (
                    <MenuItem key={notification.id} sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: notification.color,
                                    mr: 1.5,
                                    animation: `${pulse} 2s infinite`,
                                }}
                            />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2">{notification.title}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {notification.time}
                                </Typography>
                            </Box>
                        </Box>
                    </MenuItem>
                ))}
                <Divider />
                <MenuItem sx={{ justifyContent: 'center' }}>
                    <Typography variant="body2" color="primary">
                        View All Notifications
                    </Typography>
                </MenuItem>
            </Menu>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle1">Super Admin</Typography>
                    <Typography variant="body2" color="text.secondary">
                        super.admin@pcc.cm
                    </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">Settings</Typography>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <HelpIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">Help</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => navigate('/login')}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography variant="body2" color="error">
                        Logout
                    </Typography>
                </MenuItem>
            </Menu>
        </StyledAppBar>
    );
};

export default AnimatedHeader;
