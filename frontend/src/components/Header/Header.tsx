import React from 'react';

import { useTranslation } from 'react-i18next';
import type { ParseKeys } from 'i18next';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import logo from '@/assets/logo.png';

import './Header.scss';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { NAVBAR_MENU } from './constant';

const Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <header className='header'>
        <Box className='header__content'>
          <Box className='header-logo__wrapper'>
            <img
              src={logo}
              alt=''
              className='header-logo__image'
            />
            <Typography className='header-logo__text'>So1Scan</Typography>
          </Box>

          <Box className='header-nav__wrapper'>
            <List className='header-nav__menu'>
              {NAVBAR_MENU.map((item) => {
                const tItem = `header.${item}` as ParseKeys;
                return (
                  <ListItem
                    key={item}
                    className='header-nav__item'
                  >
                    {t(tItem)}
                  </ListItem>
                );
              })}
              <ListItem className='header-nav__document'>
                {t('header.docs')}
              </ListItem>
            </List>
          </Box>
        </Box>
      </header>
    </Container>
  );
};

export default Header;
