import React, { lazy, Suspense, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Typography, Box, Paper, Grid, Avatar, Button, Backdrop } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import { grayColor } from '../constants/color';
const SearchDialog = lazy(() => import("../components/specific/Search"));

const Home = () => {
  const [ isSearch, setIsSearch ] = useState(false);

  const openSearch = () => {
    setIsSearch(prev => !prev);
  };

  return (
    <>
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: "100%",
      padding: '2rem',
      backgroundColor: grayColor,
      // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
    }}>
      <Paper elevation={3} sx={{ 
        padding: '3rem', 
        borderRadius: '15px', 
        maxWidth: '600px', 
        width: '100%',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.9)'
      }}>
        <Avatar sx={{ 
          width: 80, 
          height: 80, 
          margin: '0 auto 1rem', 
          backgroundColor: 'rgba(0, 0, 0, 0.85)' 
        }}>
          <ChatIcon fontSize="large" />
        </Avatar>
        
        <Typography variant="h4" gutterBottom fontWeight="bold" color="rgba(0, 0, 0, 0.85)">
          Welcome to QuickPigeon
        </Typography>
        
        <Typography variant="body1" paragraph>
          Connect with friends and start chatting! Select a friend from your list to begin a conversation.
        </Typography>
        
        <Grid container spacing={2} justifyContent="center" mt={4}>
          <Grid item>
            <Button variant="contained" startIcon={<PeopleIcon />} onClick={openSearch} sx={{
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 1)",
              }
            }} >
              Find Friends
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>

    {isSearch && (
      <Suspense fallback={<Backdrop open />} >
          <SearchDialog />
      </Suspense>
    )}
    </>
  );
};

export default AppLayout()(Home);