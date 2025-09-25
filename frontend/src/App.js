import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SMSScanner from './pages/SMSScanner';
import URLScanner from './pages/URLScanner';
import TransactionMonitor from './pages/TransactionMonitor';
import WebsiteScanner from './pages/WebsiteScanner';
import Dashboard from './pages/Dashboard';
import BlockchainViewer from './pages/BlockchainViewer';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4361ee',
    },
    secondary: {
      main: '#3a0ca3',
    },
    error: {
      main: '#f72585',
    },
    warning: {
      main: '#fca311',
    },
    success: {
      main: '#4cc9f0',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sms" element={<SMSScanner />} />
              <Route path="/url" element={<URLScanner />} />
              <Route path="/transaction" element={<TransactionMonitor />} />
              <Route path="/website" element={<WebsiteScanner />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/blockchain" element={<BlockchainViewer />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
