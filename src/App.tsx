import React from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {theme} from "./theme";
import ApartmentMarketplace from "./components/ApartmentMarketplace";

function App() {
  return (
      <div>
          <ThemeProvider theme={theme}>

            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
              <ApartmentMarketplace/>
          </ThemeProvider>
      </div>
  );
}

export default App;
