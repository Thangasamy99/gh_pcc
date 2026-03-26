import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import {
    LocalHospital as HospitalIcon,
    People as PeopleIcon,
    PersonAdd as PersonAddIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Storage as StorageIcon,
} from '@mui/icons-material';
import CountUp from 'react-countup';

interface StatsCardsProps {
    stats: {
        totalBranches: number;
        totalUsers: number;
        activeUsers: number;
        pendingApprovals: number;
        systemUptime: string;
        storageUsed: string;
    };
    loading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
    const theme = useTheme();

    const cards = [
        {
            title: 'Total Branches',
            value: stats.totalBranches,
            icon: <HospitalIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.primary.main,
            bgColor: alpha(theme.palette.primary.main, 0.1),
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.secondary.main,
            bgColor: alpha(theme.palette.secondary.main, 0.1),
        },
        {
            title: 'Active Users',
            value: stats.activeUsers,
            icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.success.main,
            bgColor: alpha(theme.palette.success.main, 0.1),
        },
        {
            title: 'Pending Approvals',
            value: stats.pendingApprovals,
            icon: <PersonAddIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.warning.main,
            bgColor: alpha(theme.palette.warning.main, 0.1),
        },
        {
            title: 'System Uptime',
            value: stats.systemUptime,
            icon: <WarningIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.info.main,
            bgColor: alpha(theme.palette.info.main, 0.1),
        },
        {
            title: 'Storage Used',
            value: stats.storageUsed,
            icon: <StorageIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.error.main,
            bgColor: alpha(theme.palette.error.main, 0.1),
        },
    ];

    return (
        <Grid container spacing={3}>
            {cards.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={card.title}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                    >
                        <Paper
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                bgcolor: card.bgColor,
                                border: `1px solid ${alpha(card.color, 0.2)}`,
                                boxShadow: `0 4px 20px ${alpha(card.color, 0.15)}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: `0 8px 30px ${alpha(card.color, 0.3)}`,
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {card.title}
                                    </Typography>
                                    {loading ? (
                                        <CircularProgress size={24} sx={{ color: card.color }} />
                                    ) : (
                                        <Typography variant="h4" sx={{ color: card.color, fontWeight: 700 }}>
                                            {typeof card.value === 'number' ? (
                                                <CountUp end={card.value} duration={2} />
                                            ) : (
                                                card.value
                                            )}
                                        </Typography>
                                    )}
                                </Box>
                                <Box
                                    sx={{
                                        p: 1,
                                        borderRadius: 2,
                                        bgcolor: alpha(card.color, 0.2),
                                        color: card.color,
                                    }}
                                >
                                    {card.icon}
                                </Box>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>
            ))}
        </Grid>
    );
};

export default StatsCards;
