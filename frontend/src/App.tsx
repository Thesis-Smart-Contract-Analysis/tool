import Box from "@mui/material/Box";

import path from "@/assets/path.svg";

import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import "./App.scss";

function App() {
  return (
    <Box className="container">
      <img src={path} alt="path" className="container__path" />
      <Header />
      <Hero />
      <Content />
      <Footer />
    </Box>
  );
}

export default App;
