import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Shield
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        username: formData.email, // OAuth2PasswordRequestForm expects 'username'
        password: formData.password
      });

      if (response.data.access_token) {
        // Store token and user data
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('user_email', response.data.email);

        // Update auth context
        login({
          token: response.data.access_token,
          user_id: response.data.user_id,
          email: response.data.email
        });

        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Logo and Title */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 3,
            }}
          >
            <Shield sx={{ fontSize: 40, color: 'primary.main', marginRight: 1 }} />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold' }}>
              SafeGuard AI
            </Typography>
          </Box>

          <Typography component="h2" variant="h5" sx={{ marginBottom: 3, textAlign: 'center' }}>
            Sign in to your account
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>

            <Divider sx={{ my: 2 }} />

            {/* Forgot Password Link */}
            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
              <Link
                to="/forgot-password"
                style={{
                  textDecoration: 'none',
                  color: '#4361ee',
                  fontSize: '14px'
                }}
              >
                Forgot your password?
              </Link>
            </Box>

            {/* Register Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    textDecoration: 'none',
                    color: '#4361ee',
                    fontWeight: 'bold'
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Demo Credentials */}
        <Paper
          elevation={1}
          sx={{
            padding: 2,
            marginTop: 2,
            backgroundColor: '#f5f5f5',
            width: '100%',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            <strong>Demo Credentials:</strong><br />
            Email: demo@safeguard.ai<br />
            Password: demo123
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
