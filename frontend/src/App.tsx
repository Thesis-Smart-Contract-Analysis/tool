import Header from './components/Header/Header';
import Content from './components/Content/Content';
import Footer from './components/Footer/Footer';
import Box from '@mui/material/Box';
import path from '@/assets/path.svg';
import './App.scss';
import Hero from './components/Hero/Hero';

function App() {
  return (
    <Box className='container'>
      <img
        src={path}
        alt='path'
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: -1,
        }}
      />
      <Header />
      <Hero />
      <Content />
      <Footer />
    </Box>
  );
}

export default App;
