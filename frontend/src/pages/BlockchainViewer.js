import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Security,
  ExpandMore,
  Timeline,
  CheckCircle,
  Warning,
  Assessment,
} from '@mui/icons-material';
import { getBlockchainStats, getFraudRegistry, getBlockchainStatus } from '../services/api';

const BlockchainViewer = () => {
  const [blockchainData, setBlockchainData] = useState(null);
  const [fraudReports, setFraudReports] = useState([]);
  const [networkStatus, setNetworkStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      setLoading(true);
      const [statsResponse, reportsResponse, statusResponse] = await Promise.all([
        getBlockchainStats(),
        getFraudRegistry(50, 0),
        getBlockchainStatus()
      ]);
      
      setBlockchainData(statsResponse.data);
      setFraudReports(reportsResponse.data);
      setNetworkStatus(statusResponse.data);
    } catch (err) {
      setError('Failed to load blockchain data');
      console.error('Blockchain viewer error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading blockchain data...
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
        <Button variant="contained" onClick={fetchBlockchainData}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Security sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Blockchain Registry Viewer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tamper-proof fraud detection registry and network status
        </Typography>
      </Box>

      {/* Network Status */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent textAlign="center">
              <Timeline sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Network Status
              </Typography>
              <Chip
                label={networkStatus?.status || 'Unknown'}
                color={networkStatus?.status === 'active' ? 'success' : 'error'}
                sx={{ mt: 1, fontWeight: 700 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent textAlign="center">
              <Assessment sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Chain Length
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                {networkStatus?.chain_length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent textAlign="center">
              <Warning sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Pending Transactions
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main' }}>
                {networkStatus?.pending_transactions || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Blockchain Statistics */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
            <Assessment sx={{ mr: 1, color: 'primary.main' }} />
            Blockchain Statistics
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {blockchainData?.total_blocks || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Blocks
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
                  {blockchainData?.total_transactions || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Transactions
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main' }}>
                  {blockchainData?.fraud_reports || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fraud Reports
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'info.main' }}>
                  {blockchainData?.predictions || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI Predictions
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box mt={3} textAlign="center">
            <Chip
              label={`Chain Integrity: ${blockchainData?.chain_integrity || 'Unknown'}`}
              color={blockchainData?.chain_integrity === 'verified' ? 'success' : 'error'}
              sx={{ fontWeight: 700 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Fraud Reports */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
            <Warning sx={{ mr: 1, color: 'error.main' }} />
            Fraud Registry ({fraudReports.length} reports)
          </Typography>
          
          {fraudReports.length > 0 ? (
            <Box>
              {fraudReports.map((report, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display="flex" alignItems="center" width="100%">
                      <Security sx={{ mr: 2, color: 'error.main' }} />
                      <Box flexGrow={1}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {report.fraud_type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Block #{report.block_index} • {new Date(report.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      <Chip
                        label="Reported"
                        color="error"
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {report.description}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="body2" color="text.secondary">
                        <strong>Block Hash:</strong> {report.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Timestamp:</strong> {new Date(report.timestamp).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Block Index:</strong> {report.block_index}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ) : (
            <Box textAlign="center" py={4}>
              <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No fraud reports in the registry
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The blockchain is clean and secure
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Security />}
          onClick={fetchBlockchainData}
          sx={{
            background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 700,
          }}
        >
          Refresh Blockchain Data
        </Button>
      </Box>
    </Container>
  );
};

export default BlockchainViewer;
