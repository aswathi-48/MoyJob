"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Typography } from '@mui/material';
import Link from 'next/link';

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ width: "100%" }}>
     <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{ background: "#1c2a38" }}
      >
         <Link href={'/home'}>  
        <BottomNavigationAction 
          label="Jobs" 
          icon={<WorkIcon />} 
          sx={{ color: value === 0 ? 'white' : 'gray' }}
        />
         </Link>
        <BottomNavigationAction 
          label="Companies" 
          icon={<BusinessIcon />} 
          sx={{ color: value === 1 ? 'white' : 'gray' }}
        />
        <BottomNavigationAction 
          label="Profile" 
          icon={<AccountCircleIcon />} 
          sx={{ color: value === 2 ? 'white' : 'gray' }}
        />
      </BottomNavigation>
      
    </Box>

  );
}
