// "use client"
// import React, { useEffect, useState } from 'react';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import { Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Avatar } from '@mui/material';
// import { AccountCircle } from '@mui/icons-material';
// import { useRouter } from 'next/navigation';
// import ProfileView from '../admin/ProfileView';
// import UploadCv from './UploadCv';

// function ResponsiveAppBar() {

//   const router = useRouter();
//   const [profileAnchorEl, setProfileAnchorEl] = useState(null);
//   const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
//   const [profileDialogOpen, setProfileDialogOpen] = useState(false); 
//   const [addOpen, setAddOpen] = useState(false);
//   const [userImage, setUserImage] = useState('');
//   const [userRole, setUserRole] = useState('');

//   const handleProfileClick = (event:any) => {
//     setProfileAnchorEl(event.currentTarget);
//   };

//   const handleCloseProfileMenu = () => {
//     setProfileAnchorEl(null);
//   };

//   useEffect(() => {

//     const image = localStorage.getItem('image');
//     const role = localStorage.getItem('role')

//     if (image) {
//       setUserImage(image);
//     }

//     if(role) {
//       setUserRole(role)
//     }
//   }, []);


//     const userId = localStorage.getItem('userId') || '';
//     console.log(userId);

//     const handleLogout = () => {
     
    
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('userId');
//       localStorage.removeItem('role');
//       localStorage.removeItem('first_name');
//       localStorage.removeItem('image');
    
//       // Redirect to login page
//       router.replace('/login');
    

//     };
    
    
//   const handleAddOpen = () => {
//     setAddOpen(true);
//   };
//   const handleAddClose = () => {
//     setAddOpen(false);
//   };

//   const handleOpenLogoutDialog = () => {
//     setLogoutDialogOpen(true);
//     handleCloseProfileMenu();
//   };

//   const handleCloseLogoutDialog = () => {
//     setLogoutDialogOpen(false);
//   };

//   const handleOpenProfileDialog = () => { 
//     setProfileDialogOpen(true);
//     handleCloseProfileMenu();
//   };

//   const handleCloseProfileDialog = () => { 
//     setProfileDialogOpen(false);
//   };

//   return (
//     <AppBar position="static">
//       <Container maxWidth="xl" sx={{ background: "#1c2a38" }}>
//         <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Typography
//             variant="h6"
//             noWrap
//             component="a"
//             href="#app-bar-with-responsive-menu"
//             sx={{
//               mr: 2,
//               display: { xs: 'none', md: 'flex' },
//               fontFamily: 'monospace',
//               fontWeight: 700,
//               letterSpacing: '.3rem',
//               color: 'inherit',
//               textDecoration: 'none',
//             }}
//           >
//             LOGO
//           </Typography>
          
//           <Typography
//             variant="h5"
//             noWrap
//             component="a"
//             href="#app-bar-with-responsive-menu"
//             sx={{
//               mr: 2,
//               display: { xs: 'flex', md: 'none' },
//               flexGrow: 1,
//               fontFamily: 'monospace',
//               fontWeight: 700,
//               letterSpacing: '.3rem',
//               color: 'inherit',
//               textDecoration: 'none',
//             }}
//           >
//             LOGO
//           </Typography>
            
//           {userRole === 'client' && (
//               <Button onClick={handleAddOpen}>Upload Cv</Button>
//             )}
//           <Button onClick={handleProfileClick} sx={{ color: 'inherit' }}>
//             {userImage ? (
//               <Avatar alt="User Avatar" src={userImage} />
//             ) : (
//               <AccountCircle />
//             )}
//           </Button>
//           <Menu
//             anchorEl={profileAnchorEl}
//             open={Boolean(profileAnchorEl)}
//             onClose={handleCloseProfileMenu}
//             anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//             transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//           >
//             <MenuItem onClick={handleOpenProfileDialog}>Profile</MenuItem>
//             <MenuItem onClick={handleOpenLogoutDialog}>Logout</MenuItem>
                
//           {userRole === 'admin'  && (
//             <MenuItem onClick={() => router.push('/dashboard')}>Dashboard</MenuItem>           
//           )}
//           </Menu>

//         </Toolbar>
//       </Container>
//       <Dialog open={logoutDialogOpen} onClose={handleCloseLogoutDialog}>
//         <DialogTitle>Confirm Logout</DialogTitle>

//         <DialogContent>
//           Are you sure you want to logout?
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleCloseLogoutDialog}>Cancel</Button>
//           <Button onClick={handleLogout}>Logout</Button>
//         </DialogActions>

//       </Dialog>
//       <Dialog open={profileDialogOpen} onClose={handleCloseProfileDialog}>

//         <DialogContent>
//             <ProfileView params={{ id: userId }}/>         
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={handleCloseProfileDialog}>Close</Button>
//         </DialogActions>
//       </Dialog>
//       <UploadCv open={addOpen} handleClose={handleAddClose} userId={userId}/>
//     </AppBar>
//   );

// }

// export default ResponsiveAppBar;

"use client";
import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Avatar } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import ProfileView from "../admin/ProfileView";
import UploadCv from "./UploadCv";

function ResponsiveAppBar() {
  const router = useRouter();
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  const handleProfileClick = (event: any) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setProfileAnchorEl(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const image = localStorage.getItem("image");
      const role = localStorage.getItem("role");
      const id = localStorage.getItem("userId");

      if (image) setUserImage(image);
      if (role) setUserRole(role);
      if (id) setUserId(id);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("first_name");
      localStorage.removeItem("image");

      router.replace("/login");
    }
  };

  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);

  const handleOpenLogoutDialog = () => {
    setLogoutDialogOpen(true);
    handleCloseProfileMenu();
  };

  const handleCloseLogoutDialog = () => setLogoutDialogOpen(false);

  const handleOpenProfileDialog = () => {
    setProfileDialogOpen(true);
    handleCloseProfileMenu();
  };

  const handleCloseProfileDialog = () => setProfileDialogOpen(false);

  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{ background: "#1c2a38" }}>
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          {userRole === "client" && <Button onClick={handleAddOpen}>Upload Cv</Button>}
          <Button onClick={handleProfileClick} sx={{ color: "inherit" }}>
            {userImage ? <Avatar alt="User Avatar" src={userImage} /> : <AccountCircle />}
          </Button>
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleCloseProfileMenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleOpenProfileDialog}>Profile</MenuItem>
            <MenuItem onClick={handleOpenLogoutDialog}>Logout</MenuItem>
            {userRole === "admin" && <MenuItem onClick={() => router.push("/dashboard")}>Dashboard</MenuItem>}
          </Menu>
        </Toolbar>
      </Container>
      <Dialog open={logoutDialogOpen} onClose={handleCloseLogoutDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to logout?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog}>Cancel</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={profileDialogOpen} onClose={handleCloseProfileDialog}>
        <DialogContent>
          <ProfileView params={{ id: userId }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfileDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <UploadCv open={addOpen} handleClose={handleAddClose} userId={userId} />
    </AppBar>
  );
}

export default ResponsiveAppBar;
