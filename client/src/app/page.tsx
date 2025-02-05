"use client"
import React from 'react';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  // router.push('/home')
  // Function to handle button click
  const handleButtonClick = () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      router.push('/home');
    } else {
      router.push('/login');
    }
  };
  return (
    <div style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url("/image/background-.jpg")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start', 
      color: 'white',
      textAlign: 'left', 
      padding: '0 20px' 
    }}>
      <h1 style={{
        fontSize: "29px",
        fontFamily:"monospace",
        width: "540px",
        textAlign: "center",
        padding:"10px"
      }}> Go confidently in the direction of your dreams! <br/> <span style={{ color: "gray"}}>  Find Out Your Dream Job..!</span>
      </h1>
      <Button
        variant="contained"
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginLeft:"11%",
          width: "300px"
        }}
        onClick={handleButtonClick}
      >
        Login / Register
        <ArrowForwardIcon sx={{ ml: 1 }} />
      </Button>
    </div>
  );
}

export default Page;
