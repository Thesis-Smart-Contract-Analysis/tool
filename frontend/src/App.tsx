import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import Footer from "./components/Footer/Footer";
import Box from "@mui/material/Box";
import "./App.scss";

function App() {
  return (
    <Box className="container">
      <Header />
      <Content />
      <Footer />
    </Box>
  );
}

export default App;
