import React from 'react';
import { Tooltip as MuiTooltip, TooltipProps, Zoom } from '@mui/material';

interface CustomTooltipProps extends TooltipProps {
    children: React.ReactElement;
}

const Tooltip: React.FC<CustomTooltipProps> = ({ children, ...props }) => {
    return (
        <MuiTooltip
            TransitionComponent={Zoom}
            arrow
            enterDelay={500}
            leaveDelay={200}
            {...props}
        >
            {children}
        </MuiTooltip>
    );
};

export default Tooltip;
