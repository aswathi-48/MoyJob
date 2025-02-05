"use client"
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import styles from './navbar.module.css'

function ResponsiveAppBar() {

  const pathname = usePathname()

  return (
    <div className={styles.container}>
        <div className={styles.title}>{pathname.split('/').pop()}</div>
        <div className={styles.menu}>
            <div className={styles.icon}>
            </div>
        </div>
    </div>
  );
}
export default ResponsiveAppBar;
