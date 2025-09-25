import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import {
  Security,
  QrCodeScanner,
  Link,
  AccountBalance,
  Web,
  Dashboard,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'SMS Scanner',
      description: 'Detect spam and phishing messages in real-time',
      icon: <QrCodeScanner sx={{ fontSize: 40 }} />,
      path: '/sms',
      color: '#f72585',
    },
    {
      title: 'URL Scanner',
      description: 'Analyze URLs for phishing and malicious content',
      icon: <Link sx={{ fontSize: 40 }} />,
      path: '/url',
      color: '#4cc9f0',
    },
    {
      title: 'Transaction Monitor',
      description: 'Monitor transactions for anomalies and fraud',
      icon: <AccountBalance sx={{ fontSize: 40 }} />,
      path: '/transaction',
      color: '#fca311',
    },
    {
      title: 'Website Scanner',
      description: 'Detect fake e-commerce and malicious websites',
      icon: <Web sx={{ fontSize: 40 }} />,
      path: '/website',
      color: '#7209b7',
    },
  ];

  const stats = [
    { label: '₹1000+ Crores', value: 'Annual Fraud Loss' },
    { label: '99.5%', value: 'Detection Accuracy' },
    { label: '360°', value: 'Fraud Coverage' },
    { label: '10M+', value: 'Target Users' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
          }}
        >
          <Security sx={{ mr: 2, verticalAlign: 'middle' }} />
          SafeGuard AI
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          India's First 360° AI-Powered Fraud Detection System
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Protect yourself from digital fraud with our comprehensive AI-powered detection system.
          Scan SMS, URLs, transactions, and websites for potential threats.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<Dashboard />}
          onClick={() => navigate('/dashboard')}
          sx={{
            background: 'linear-gradient(135deg, #fca311 0%, #fb5607 100%)',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 700,
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card
              sx={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
                color: 'white',
                height: '100%',
              }}
            >
              <CardContent>
                <Typography variant="h4" component="div" sx={{ fontWeight: 800 }}>
                  {stat.label}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features Section */}
      <Typography variant="h4" component="h2" textAlign="center" sx={{ mb: 4, fontWeight: 700 }}>
        Detection Features
      </Typography>
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box
                  sx={{
                    color: feature.color,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {feature.description}
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate(feature.path)}
                  sx={{
                    borderColor: feature.color,
                    color: feature.color,
                    '&:hover': {
                      backgroundColor: feature.color,
                      color: 'white',
                    },
                  }}
                >
                  Try Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box
        textAlign="center"
        sx={{
          mt: 6,
          p: 4,
          background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
          borderRadius: 2,
          color: 'white',
        }}
      >
        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Ready to Protect Your Digital Life?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
          Join thousands of users who trust SafeGuard AI to protect them from digital fraud.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<TrendingUp />}
          onClick={() => navigate('/dashboard')}
          sx={{
            backgroundColor: '#fca311',
            color: '#000',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 700,
            '&:hover': {
              backgroundColor: '#ffb700',
            },
          }}
        >
          Start Protection Now
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
