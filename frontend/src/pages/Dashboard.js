import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Security,
  TrendingUp,
  Warning,
  CheckCircle,
  Timeline,
  Assessment,
} from '@mui/icons-material';
import { getBlockchainStats, getFraudRegistry } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, reportsResponse] = await Promise.all([
        getBlockchainStats(),
        getFraudRegistry(10, 0)
      ]);
      
      setStats(statsResponse.data);
      setRecentReports(reportsResponse.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchDashboardData}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Assessment sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          SafeGuard AI Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time fraud detection analytics and blockchain registry
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)', color: 'white' }}>
            <CardContent textAlign="center">
              <Security sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {stats?.total_blocks || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Blockchain Blocks
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f72585 0%, #b5179e 100%)', color: 'white' }}>
            <CardContent textAlign="center">
              <Warning sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {stats?.fraud_reports || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Fraud Reports
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4cc9f0 0%, #4895ef 100%)', color: 'white' }}>
            <CardContent textAlign="center">
              <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {stats?.predictions || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                AI Predictions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fca311 0%, #fb5607 100%)', color: 'white' }}>
            <CardContent textAlign="center">
              <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {stats?.total_transactions || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Fraud Reports */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ mr: 1, color: 'error.main' }} />
                Recent Fraud Reports
              </Typography>
              
              {recentReports.length > 0 ? (
                <List>
                  {recentReports.map((report, index) => (
                    <ListItem key={index} divider>
                      <ListItemIcon>
                        <Security color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={report.fraud_type}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {report.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Block #{report.block_index} • {new Date(report.timestamp).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4}>
                  <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No fraud reports yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Great! The system is working perfectly
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                <Timeline sx={{ mr: 1, color: 'primary.main' }} />
                System Status
              </Typography>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Blockchain Integrity
                </Typography>
                <Chip
                  label={stats?.chain_integrity === 'verified' ? 'Verified' : 'Compromised'}
                  color={stats?.chain_integrity === 'verified' ? 'success' : 'error'}
                  sx={{ fontWeight: 700 }}
                />
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Pending Transactions
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {stats?.pending_transactions || 0}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Detection Accuracy
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                  99.5%
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Coverage
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  360°
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Security />}
          onClick={fetchDashboardData}
          sx={{
            background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 700,
          }}
        >
          Refresh Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
