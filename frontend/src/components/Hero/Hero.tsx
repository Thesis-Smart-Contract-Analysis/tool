import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import sourceCode from '@/assets/solidity-source-code.png';
import { useTypeWriter } from '@/hooks/useTypeWriter';

import { ANIMATION_TEXT } from './constant';
import './Hero.scss';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  const { typeWriter } = useTypeWriter({
    multiText: ANIMATION_TEXT,
  });

  return (
    <Container>
      <section className='hero' id='home'>
        <Box className='hero__content'>
          <Box className='hero__description'>
            <Box className='hero__text-wrap'>
              <Typography className='title'>
                {t('hero.desc.title')}
                <span id='cursor-animation' style={{ display: 'block' }}>
                  {typeWriter}
                </span>
              </Typography>

              <Typography className='body'>{t('hero.desc.body')}</Typography>
            </Box>
            <Box className='hero__btn-wrap'>
              <a href='#scan-now' className='scan-now'>
                {t('hero.scan-now')}
              </a>
              <a href='#chatgpt' className='more'>
                ChatGPT
              </a>
            </Box>
          </Box>
          <Box className='hero__image'>
            <Box className='file-scan'>
              <Box className='file-scan__top-corner'>
                <Box className='top-left'></Box>
                <Box className='top-right'></Box>
              </Box>
              <Box className='file-scan__bottom-corner'>
                <Box className='bottom-left'></Box>
                <Box className='bottom-right'></Box>
              </Box>
            </Box>
            <img src={sourceCode} alt='hero-image' />
          </Box>
        </Box>
      </section>
    </Container>
  );
};

export default Hero;
