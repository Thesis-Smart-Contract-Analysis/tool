import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import logo from '@/assets/logo.png';

import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <Container className='footer'>
      <Box className='footer__container'>
        <Box className='footer-logo__wrapper'>
          <img src={logo} alt='' className='image' />
          <Box className='split'></Box>
          <Typography className='text'>So1Scan</Typography>
        </Box>

        <Typography className='footer__all-right-reserved'>
          2024 © All Right Reserved{' '}
        </Typography>
      </Box>
    </Container>
  );
};

export default Footer;
