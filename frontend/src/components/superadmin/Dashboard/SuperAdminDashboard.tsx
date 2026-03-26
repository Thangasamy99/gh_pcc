import React, { useState, useEffect } from 'react';
import {
    Grid,
    Box,
    Typography,
    Paper,
    useTheme,
    alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import StatsCards from './StatsCards';
import BranchDistributionMap from './BranchDistributionMap';
import RecentActivities from './RecentActivities';
import SystemHealth from './SystemHealth';
import { superAdminAPI } from '../../../services/api/superAdminAPI';

const SuperAdminDashboard: React.FC = () => {
    const theme = useTheme();
    const [stats, setStats] = useState({
        totalBranches: 16,
        totalUsers: 245,
        activeUsers: 198,
        pendingApprovals: 3,
        systemUptime: '99.9%',
        storageUsed: '45%',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await superAdminAPI.getDashboardStats();
            if (response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h4" gutterBottom fontWeight={600}>
                    Welcome back, Super Admin
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Here's what's happening across all 16 hospital branches today.
                </Typography>
            </motion.div>

            {/* Stats Cards */}
            <StatsCards stats={stats} loading={loading} />

            {/* Main Content Grid */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Branch Distribution */}
                <Grid item xs={12} md={7}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.1)}`,
                            }}
                        >
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                                Branch Distribution Map
                            </Typography>
                            <BranchDistributionMap />
                        </Paper>
                    </motion.div>
                </Grid>

                {/* System Health */}
                <Grid item xs={12} md={5}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                boxShadow: `0 8px 30px ${alpha(theme.palette.secondary.main, 0.1)}`,
                            }}
                        >
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                                System Health
                            </Typography>
                            <SystemHealth />
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Recent Activities */}
                <Grid item xs={12}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                boxShadow: `0 8px 30px ${alpha(theme.palette.common.black, 0.05)}`,
                            }}
                        >
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                                Recent Activities
                            </Typography>
                            <RecentActivities />
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SuperAdminDashboard;
