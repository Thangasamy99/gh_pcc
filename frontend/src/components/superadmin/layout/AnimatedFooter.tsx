import React from 'react';
import { Box, Container, Typography, Link, useTheme, alpha, IconButton } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
    Favorite as HeartIcon,
    Facebook as FacebookIcon,
    Twitter as TwitterIcon,
    Instagram as InstagramIcon,
    LinkedIn as LinkedInIcon,
    GitHub as GitHubIcon,
    Copyright as CopyrightIcon,
} from '@mui/icons-material';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const StyledFooter = styled(motion.footer)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    padding: theme.spacing(2, 0),
    marginTop: 'auto',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.03)',
}));

const HeartIconAnimated = styled(HeartIcon)(({ theme }) => ({
    color: theme.palette.error.main,
    animation: `${pulse} 2s infinite`,
    fontSize: 18,
    margin: '0 4px',
}));

const AnimatedFooter: React.FC = () => {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <StyledFooter
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {/* Copyright */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CopyrightIcon sx={{ fontSize: 16, mr: 0.5, opacity: 0.7 }} />
                        <Typography variant="body2" color="text.secondary">
                            {currentYear} Presbyterian Church in Cameroon. All rights reserved.
                        </Typography>
                    </Box>

                    {/* Made with love */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Made with
                        </Typography>
                        <HeartIconAnimated />
                        <Typography variant="body2" color="text.secondary">
                            for better healthcare
                        </Typography>
                    </Box>

                    {/* Social Links */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon, GitHubIcon].map(
                            (Icon, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <IconButton
                                        size="small"
                                        sx={{
                                            color: alpha(theme.palette.text.primary, 0.5),
                                            '&:hover': {
                                                color: theme.palette.primary.main,
                                            },
                                        }}
                                    >
                                        <Icon fontSize="small" />
                                    </IconButton>
                                </motion.div>
                            )
                        )}
                    </Box>
                </Box>

                {/* Version Info */}
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        Version 2.0.0 | Build 2024.03 | 16 Branches Active
                    </Typography>
                </Box>
            </Container>
        </StyledFooter>
    );
};

export default AnimatedFooter;
