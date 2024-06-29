import React from 'react';

import GitHubIcon from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import logo from '@/assets/logo.png';

import './Header.scss';

const Header: React.FC = () => {
  return (
    <Container>
      <header className='header'>
        <Box className='header__content'>
          <Box className='header-logo__wrapper'>
            <img src={logo} alt='' className='header-logo__image' />
            <Typography className='header-logo__text'>So1Scan</Typography>
          </Box>

          <Box className='header-nav__wrapper'>
            <List className='header-nav__menu'>
              <a className='header-nav__github'>
                <Typography>GITHUB</Typography>
                <GitHubIcon />
              </a>
              {/* <ListItem className='header-nav__document'>
                {t('header.docs')}
              </ListItem> */}
            </List>
          </Box>
        </Box>
      </header>
    </Container>
  );
};

export default Header;
