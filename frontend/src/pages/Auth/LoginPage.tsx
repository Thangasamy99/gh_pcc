import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Alert,
    Snackbar,
    CircularProgress,
    Divider,
    useTheme,
    alpha,
    Avatar,
    Fade,
    Zoom,
    Grow,
    Slide,
    Collapse,
} from '@mui/material';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    LocalHospital as HospitalIcon,
    MedicalServices as MedicalIcon,
    Healing as HealingIcon,
    Vaccines as VaccinesIcon,
    Biotech as BiotechIcon,
    Favorite as HeartIcon,
    ArrowForward as ArrowForwardIcon,
    Phone as PhoneIcon,
    WhatsApp as WhatsAppIcon,
    Badge as BadgeIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Tooltip from '../../components/common/Tooltip';

// Animations
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const heartbeat = keyframes`
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const LoginContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
}));

const AnimatedBackground = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("/images/medical-pattern.svg") repeat',
        opacity: 0.1,
        animation: `${shimmer} 20s linear infinite`,
    },
}));

const FloatingIcon = styled(motion.div)(({ theme }) => ({
    position: 'absolute',
    color: alpha(theme.palette.common.white, 0.1),
    fontSize: '4rem',
    zIndex: 1,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(5),
    width: '100%',
    maxWidth: 450,
    borderRadius: theme.spacing(3),
    background: alpha(theme.palette.background.paper, 0.95),
    backdropFilter: 'blur(10px)',
    boxShadow: `0 20px 50px ${alpha(theme.palette.common.black, 0.3)}`,
    position: 'relative',
    zIndex: 10,
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.2)})`,
        animation: `${pulse} 4s ease-in-out infinite`,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -50,
        left: -50,
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.2)})`,
        animation: `${pulse} 4s ease-in-out infinite reverse`,
    },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    position: 'relative',
}));

const AnimatedLogo = styled(Avatar)(({ theme }) => ({
    width: 100,
    height: 100,
    margin: '0 auto',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    animation: `${float} 6s ease-in-out infinite`,
    boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
    '& svg': {
        fontSize: '3rem',
    },
}));

const HeartBeatIcon = styled(HeartIcon)(({ theme }) => ({
    animation: `${heartbeat} 2s ease-in-out infinite`,
    color: theme.palette.error.main,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2.5),
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.spacing(2),
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.2)}`,
        },
        '&.Mui-focused': {
            transform: 'translateY(-2px)',
            boxShadow: `0 5px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
        },
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(2),
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    color: theme.palette.common.white,
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.2)}, transparent)`,
        transition: 'left 0.5s ease',
    },
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
        '&::before': {
            left: '100%',
        },
    },
    '&:disabled': {
        background: theme.palette.grey[400],
    },
}));

const QuickActionButton = styled(IconButton)(({ theme }) => ({
    width: 50,
    height: 50,
    background: alpha(theme.palette.background.paper, 0.1),
    backdropFilter: 'blur(5px)',
    color: theme.palette.common.white,
    margin: theme.spacing(0, 1),
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px) scale(1.1)',
        background: alpha(theme.palette.primary.main, 0.3),
    },
}));

// Floating Icons Component
const FloatingIcons = () => {
    const theme = useTheme();

    const icons = [
        { Icon: HospitalIcon, delay: 0, left: '5%', top: '10%' },
        { Icon: MedicalIcon, delay: 1, right: '8%', top: '15%' },
        { Icon: HealingIcon, delay: 2, left: '10%', bottom: '20%' },
        { Icon: VaccinesIcon, delay: 1.5, right: '12%', bottom: '25%' },
        { Icon: BiotechIcon, delay: 0.5, left: '15%', top: '50%' },
        { Icon: HeartIcon, delay: 2.5, right: '15%', top: '60%' },
    ];

    return (
        <>
            {icons.map(({ Icon, delay, ...style }, index) => (
                <FloatingIcon
                    key={index}
                    style={style}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 6,
                        delay,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                >
                    <Icon sx={{ fontSize: '4rem' }} />
                </FloatingIcon>
            ))}
        </>
    );
};

// Main Component
const LoginPage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showWelcome, setShowWelcome] = useState(true);
    const [loginStep, setLoginStep] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => setShowWelcome(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setLoginStep(2);

        try {
            const userData = await login({ email, password });
            console.log('Login Response User Data:', userData);
            toast.success('Login successful! Welcome back.');
            const hasSuperAdminRole = userData?.roleCode?.includes('SUPER_ADMIN') ||
                (userData?.roles && userData?.roles.includes('SUPER_ADMIN')) ||
                (userData?.roles && userData?.roles.includes('ROLE_SUPER_ADMIN'));

            if (hasSuperAdminRole) {
                navigate('/superadmin/dashboard');
            } else if (userData?.roleCode?.includes('SECURITY') || 
                       (userData?.roles && userData?.roles.includes('SECURITY_GUARD')) ||
                       (userData?.roles && userData?.roles.includes('ROLE_SECURITY_GUARD'))) {
                navigate('/security/dashboard');
            } else if (userData?.roleCode?.includes('RECEPTION') || 
                       (userData?.roles && userData?.roles.includes('RECEPTION')) ||
                       (userData?.roles && userData?.roles.includes('ROLE_RECEPTION'))) {
                navigate('/reception/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
            setLoginStep(1);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = (role: string) => {
        switch (role) {
            case 'admin':
                setEmail('admin@hospital.com');
                setPassword('password');
                break;
            case 'doctor':
                setEmail('doctor@hospital.com');
                setPassword('password');
                break;
            case 'nurse':
                setEmail('nurse@hospital.com');
                setPassword('password');
                break;
        }
    };

    return (
        <LoginContainer>
            <AnimatedBackground />

            {/* Floating Icons Animation */}
            <FloatingIcons />

            {/* Welcome Overlay Animation */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: alpha(theme.palette.primary.main, 0.95),
                            zIndex: 1000,
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.8, type: 'spring' }}
                        >
                            <HospitalIcon sx={{ fontSize: '6rem', color: 'white' }} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Typography variant="h3" sx={{ color: 'white', ml: 2, fontWeight: 700 }}>
                                PCC General Hospital
                            </Typography>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Login Card */}
            <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                <StyledPaper elevation={24}>
                    {/* Logo and Title */}
                    <LogoContainer>
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <AnimatedLogo>
                                <HospitalIcon />
                            </AnimatedLogo>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Typography variant="h4" sx={{ fontWeight: 700, mt: 2, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Welcome Back
                            </Typography>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Typography variant="body2" color="textSecondary">
                                Sign in to access the Hospital Management System
                            </Typography>
                        </motion.div>
                    </LogoContainer>

                    {/* Error Alert */}
                    <Collapse in={!!error}>
                        <Alert
                            severity="error"
                            sx={{ mb: 2, borderRadius: 2 }}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => setError('')}
                                >
                                    ✕
                                </IconButton>
                            }
                        >
                            {error}
                        </Alert>
                    </Collapse>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <StyledTextField
                                fullWidth
                                label="Email Address"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <StyledTextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Remember me"
                                />
                                <Button
                                    color="primary"
                                    sx={{ textTransform: 'none' }}
                                >
                                    Forgot Password?
                                </Button>
                            </Box>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <StyledButton
                                fullWidth
                                type="submit"
                                disabled={loading}
                                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </StyledButton>
                        </motion.div>
                    </form>

                    {/* Login Steps Indicator */}
                    <Collapse in={loginStep === 2}>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Authenticating...
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                {[1, 2, 3].map((step) => (
                                    <motion.div
                                        key={step}
                                        animate={{
                                            scale: loginStep === step ? [1, 1.2, 1] : 1,
                                            backgroundColor: loginStep >= step ? theme.palette.primary.main : theme.palette.grey[300],
                                        }}
                                        transition={{ duration: 0.5, repeat: loginStep === step ? Infinity : 0 }}
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Collapse>



                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="caption" color="textSecondary">
                                © 2026 Presbyterian Church in Cameroon Health Services
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                                <IconButton size="small" color="primary">
                                    <PhoneIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="primary">
                                    <EmailIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="success">
                                    <WhatsAppIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    </motion.div>

                    {/* Heartbeat Animation */}
                    <Box sx={{ position: 'absolute', bottom: 20, right: 20 }}>
                        <HeartBeatIcon />
                    </Box>
                </StyledPaper>
            </Zoom>

            {/* Background Pulse Animation */}
            <motion.div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        height: '80%',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
                    }}
                />
            </motion.div>
        </LoginContainer >
    );
};

export default LoginPage;
