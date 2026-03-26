import React, { useState, useEffect } from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSidebar from './AnimatedSidebar';
import AnimatedHeader from './AnimatedHeader';
import AnimatedFooter from './AnimatedFooter';
import PageTransition from './PageTransition';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Animated Sidebar */}
      <AnimatedSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />

      {/* Main Content */}
      <Box
        component={motion.div}
        animate={{
          marginLeft: sidebarOpen ? (isMobile ? 0 : 280) : 0,
          width: sidebarOpen ? (isMobile ? '100%' : `calc(100% - 280px)`) : '100%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
      >
        {/* Animated Header */}
        <AnimatedHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        {/* Page Content with Transition */}
        <Box
          component={motion.main}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: 'auto',
            minHeight: 'calc(100vh - 130px)',
          }}
        >
          <PageTransition>{children}</PageTransition>
        </Box>

        {/* Animated Footer */}
        <AnimatedFooter />
      </Box>
    </Box>
  );
};

export default SuperAdminLayout;
