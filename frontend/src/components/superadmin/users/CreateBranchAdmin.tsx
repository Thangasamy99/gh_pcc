import React, { useState } from 'react';
import {
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Box,
    Stepper,
    Step,
    StepLabel,
    Alert,
    IconButton,
    InputAdornment,
    Chip,
    Avatar,
    useTheme,
    alpha,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PersonAdd as PersonAddIcon,
    ArrowForward as ArrowForwardIcon,
    ArrowBack as ArrowBackIcon,
    Check as CheckIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Badge as BadgeIcon,
    Visibility,
    VisibilityOff,
    Save as SaveIcon,
    Send as SendIcon,
    LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { superAdminAPI } from '../../../services/api/superAdminAPI';
import { toast } from 'react-toastify';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.spacing(3),
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(
        theme.palette.background.paper,
        0.98
    )} 100%)`,
    backdropFilter: 'blur(10px)',
    boxShadow: `0 20px 50px ${alpha(theme.palette.common.black, 0.1)}`,
}));

const AnimatedStep = styled(motion.div)({
    width: '100%',
});

const steps = ['Personal Information', 'Account Details', 'Branch Assignment', 'Review & Confirm'];

interface Branch {
    id: number;
    branch_name: string;
    branch_code: string;
    city: string;
    region: string;
}

const CreateBranchAdmin: React.FC = () => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await superAdminAPI.getBranches();
            if (response.data) {
                setBranches(response.data);
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
            toast.error('Failed to load branches');
        }
    };

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            staffId: '',
            username: '',
            password: '',
            confirmPassword: '',
            branchId: '',
            sendEmailNotification: true,
            sendSMSNotification: false,
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
            staffId: Yup.string(), // Optional, auto-generated if empty
            username: Yup.string().required('Username is required').min(4, 'Username must be at least 4 characters'),
            password: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters')
                .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
                .matches(/[0-9]/, 'Must contain at least one number'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Confirm password is required'),
            branchId: Yup.string().required('Please select a branch'),
        }),
        onSubmit: async (values) => {
            try {
                setLoading(true);
                await superAdminAPI.createBranchAdmin(values);
                toast.success('Branch Admin created successfully!');
                formik.resetForm();
                setActiveStep(0);
            } catch (error) {
                console.error('Error creating branch admin:', error);
                toast.error('Failed to create branch admin');
            } finally {
                setLoading(false);
            }
        },
    });

    const handleNext = () => {
        // Validate current step fields
        if (activeStep === 0) {
            if (
                formik.values.firstName &&
                formik.values.lastName &&
                formik.values.email &&
                formik.values.phone &&
                !formik.errors.firstName &&
                !formik.errors.lastName &&
                !formik.errors.email &&
                !formik.errors.phone
            ) {
                setActiveStep((prev) => prev + 1);
            } else {
                formik.setTouched({
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                });
                toast.warning('Please fill all required fields');
            }
        } else if (activeStep === 1) {
            if (
                formik.values.username &&
                formik.values.password &&
                formik.values.confirmPassword &&
                !formik.errors.username &&
                !formik.errors.password &&
                !formik.errors.confirmPassword
            ) {
                setActiveStep((prev) => prev + 1);
            } else {
                formik.setTouched({
                    username: true,
                    password: true,
                    confirmPassword: true,
                });
                toast.warning('Please fill all required fields');
            }
        } else if (activeStep === 2) {
            if (formik.values.branchId) {
                setActiveStep((prev) => prev + 1);
            } else {
                formik.setTouched({ branchId: true });
                toast.warning('Please select a branch');
            }
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <AnimatedStep
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName as string}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BadgeIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName as string}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email as string}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone as string}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Staff ID (Optional - Auto-generated if empty)"
                                    name="staffId"
                                    value={formik.values.staffId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.staffId && Boolean(formik.errors.staffId)}
                                    helperText={formik.touched.staffId && formik.errors.staffId as string}
                                    placeholder="e.g. BGH-ADM-001"
                                />
                            </Grid>
                        </Grid>
                    </AnimatedStep>
                );

            case 1:
                return (
                    <AnimatedStep
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username as string}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password as string}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword as string}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip
                                        label="8+ characters"
                                        color={formik.values.password.length >= 8 ? 'success' : 'default'}
                                        icon={<CheckIcon />}
                                    />
                                    <Chip
                                        label="Uppercase letter"
                                        color={/[A-Z]/.test(formik.values.password) ? 'success' : 'default'}
                                        icon={<CheckIcon />}
                                    />
                                    <Chip
                                        label="Number"
                                        color={/[0-9]/.test(formik.values.password) ? 'success' : 'default'}
                                        icon={<CheckIcon />}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </AnimatedStep>
                );

            case 2:
                return (
                    <AnimatedStep
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <FormControl fullWidth error={formik.touched.branchId && Boolean(formik.errors.branchId)}>
                            <InputLabel>Select Branch</InputLabel>
                            <Select
                                name="branchId"
                                value={formik.values.branchId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label="Select Branch"
                            >
                                {branches.map((branch) => (
                                    <MenuItem key={branch.id} value={branch.id}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.primary.main }}>
                                                <HospitalIcon sx={{ fontSize: 14 }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2">{branch.branch_name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {branch.city}, {branch.region} - {branch.branch_code}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.branchId && formik.errors.branchId && (
                                <FormHelperText>{formik.errors.branchId as string}</FormHelperText>
                            )}
                        </FormControl>
                    </AnimatedStep>
                );

            case 3:
                return (
                    <AnimatedStep
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <Paper sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Review Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        First Name
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {formik.values.firstName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Last Name
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {formik.values.lastName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body1">{formik.values.email}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Phone
                                    </Typography>
                                    <Typography variant="body1">{formik.values.phone}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" color="text.secondary">
                                        Staff ID
                                    </Typography>
                                    <Typography variant="body1">
                                        {formik.values.staffId || 'Auto-generated'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Username
                                    </Typography>
                                    <Typography variant="body1">{formik.values.username}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">
                                        Assigned Branch
                                    </Typography>
                                    <Typography variant="body1">
                                        {branches.find((b) => b.id === Number(formik.values.branchId))?.branch_name}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Notification Preferences
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Chip
                                        label="Email Notification"
                                        color={formik.values.sendEmailNotification ? 'success' : 'default'}
                                        icon={<EmailIcon />}
                                    />
                                    <Chip
                                        label="SMS Notification"
                                        color={formik.values.sendSMSNotification ? 'success' : 'default'}
                                        icon={<PhoneIcon />}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </AnimatedStep>
                );

            default:
                return 'Unknown step';
        }
    };

    return (
        <StyledPaper>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Create Branch Administrator
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Create a new administrator for one of the 16 hospital branches
                </Typography>
            </Box>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ minHeight: 400 }}>
                    <AnimatePresence mode="wait">{getStepContent(activeStep)}</AnimatePresence>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        variant="outlined"
                    >
                        Back
                    </Button>
                    <Box>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                type="submit"
                                variant="contained"
                                endIcon={<SaveIcon />}
                                disabled={loading}
                                sx={{
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    '&:hover': {
                                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                                    },
                                }}
                            >
                                {loading ? 'Creating...' : 'Create Admin'}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                endIcon={<ArrowForwardIcon />}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </Box>
            </form>
        </StyledPaper>
    );
};

export default CreateBranchAdmin;
