import {
    Box,
    Drawer,
    Grid,
    IconButton,
    Stack,
    styled,
    Typography,
  } from "@mui/material";
  import React, { useState } from "react";
  import { grayColor } from "../../constants/color";
  import {
    Close as CloseIcon,
    Dashboard as DashboardIcon,
    ExitToApp as ExitToAppIcon,
    Groups as GroupsIcon,
    ManageAccounts as ManageAccountsIcon,
    Menu as MenuIcon,
    Message as MessageIcon,
  } from "@mui/icons-material";
  import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
  
  const Link = styled(LinkComponent)`
    text-decoration: none;
    border-radius: 2rem;
    padding: 2rem;
    color: black;
    &:hover {
      color: rgba(0, 0, 0, 0.54);
    }
  `;
  
  const adminTabs = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <DashboardIcon />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <ManageAccountsIcon />,
    },
    {
      name: "Chats",
      path: "/admin/chats",
      icon: <GroupsIcon />,
    },
    {
      name: "Messages",
      path: "/admin/messages",
      icon: <MessageIcon />,
    },
  ];
  
  const Sidebar = ({ w = "100%" }) => {
    const location = useLocation();
  
    const logoutHandler = () => {
      console.log("logout");
    };
  
    return (
      <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
        <Typography variant="h5" fontWeight="bold">QuickPigeon</Typography>
  
        <Stack>
          {adminTabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              sx={
                location.pathname === tab.path && {
                  bgcolor: "black",
                  color: "white",
                  ":hover": { color: "white" },
                }
              }
            >
              <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                {tab.icon}
                <Typography>{tab.name}</Typography>
              </Stack>
            </Link>
          ))}
          <Link onClick={logoutHandler}>
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              <ExitToAppIcon />
              <Typography>Logout</Typography>
            </Stack>
          </Link>
        </Stack>
      </Stack>
    );
  };
  
  const isAdmin = true;
  
  const AdminLayout = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);
  
    const handleMobile = () => {
      setIsMobile(!isMobile);
    };
  
    const handleClose = () => {
      setIsMobile(false);
    };
  
    if (!isAdmin) return <Navigate to="/admin" />;
  
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box
          sx={{
            width: { md: '33.33%', lg: '25%' },
            flexShrink: 0,
            position: 'fixed',
            height: '100vh',
            overflowY: 'auto',
            display: { xs: 'none', md: 'block' },
            borderRight: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Sidebar />
        </Box>
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: '66.67%', lg: '75%' },
            ml: { md: '33.33%', lg: '25%' },
            bgcolor: grayColor,
            minHeight: '100vh',
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              position: "fixed",
              right: "1rem",
              top: "1rem",
              zIndex: 1100,
            }}
          >
            <IconButton onClick={handleMobile}>
              {isMobile ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
          {children}
        </Box>
  
        <Drawer
          variant="temporary"
          open={isMobile}
          onClose={handleClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '340px' },
          }}
        >
          <Sidebar w="100%" />
        </Drawer>
      </Box>
    );
  };
  
  export default AdminLayout;