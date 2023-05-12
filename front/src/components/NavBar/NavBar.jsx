import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useMediaQuery, useTheme } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import DrawerComponent from './DrawerComponent';

const NavBar = () => {
  const theme = useTheme();
  const screenSizeSmall = useMediaQuery(theme.breakpoints.down('tablet'));
  const { values } = theme.breakpoints;

  const navLinksArray = [
    {
<<<<<<< HEAD
      title: "Home",
      path: "/home",
=======
      title: 'Home',
      path: '/',
>>>>>>> 2b47fa2e5857f4e18d13c3e1a6f70b5ad8e402c3
    },
    {
      title: 'Login',
      path: '/login',
    },
    {
      title: 'Eres un medico?',
      path: '/login',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      <AppBar
        color="secondary"
        position="static"
        sx={{ height: '100px', justifyContent: 'center', alignItems: 'center' }}
      >
        <Toolbar
          color="white"
          sx={{
            width: {
              mobile: '100vw',
              tablet: '100vw',
              laptop: '100vw',
              desktop: values.desktop,
            },
          }}
        >
          <Box display="flex" alignItems="center" gap="4px" color="white" sx={{ flexGrow: 1 }}>
            <LocalHospitalIcon color="inherit" />
            <Typography variant="h5" component="div" color="white">
              CONSUMEDIC
            </Typography>
          </Box>
          {screenSizeSmall ? (
            <DrawerComponent navLinksArray={navLinksArray} />
          ) : (
            <nav style={{ color: 'white' }}>
              {navLinksArray.map((link, index) => (
                <Button key={index} color="inherit" href={link.path}>
                  {link.title}
                </Button>
              ))}
            </nav>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
