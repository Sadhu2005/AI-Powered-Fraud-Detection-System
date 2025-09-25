import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Chip,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  AccountBalance,
  Security,
  CheckCircle,
  Warning,
  Send,
} from '@mui/icons-material';
import { predictTransaction } from '../services/api';

const TransactionMonitor = () => {
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [location, setLocation] = useState('');
  const [userId, setUserId] = useState('');
  const [transactionType, setTransactionType] = useState('online');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    if (!amount || !merchant) {
      setError('Please enter amount and merchant details');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictTransaction({
        amount: parseFloat(amount),
        merchant: merchant,
        location: location || null,
        user_id: userId || null,
        transaction_type: transactionType,
      });

      setResult(response.data);
    } catch (err) {
      setError('Failed to analyze transaction. Please try again.');
      console.error('Transaction prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskScore) => {
    if (riskScore < 0.3) return 'success';
    if (riskScore < 0.7) return 'warning';
    return 'error';
  };

  const getRiskLabel = (riskScore) => {
    if (riskScore < 0.3) return 'Low Risk';
    if (riskScore < 0.7) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <AccountBalance sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Transaction Fraud Monitor
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor transactions for anomalies and fraud patterns
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Transaction Details
              </Typography>
              
              <TextField
                fullWidth
                label="Amount (₹)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="1000"
              />
              
              <TextField
                fullWidth
                label="Merchant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="Amazon, Flipkart, etc."
              />
              
              <TextField
                fullWidth
                label="Location (Optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="Mumbai, Delhi, etc."
              />
              
              <TextField
                fullWidth
                label="User ID (Optional)"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="user123"
              />
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                >
                  <MenuItem value="online">Online Payment</MenuItem>
                  <MenuItem value="upi">UPI Transfer</MenuItem>
                  <MenuItem value="card">Card Payment</MenuItem>
                  <MenuItem value="cash">Cash Transaction</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Send />}
                onClick={handleScan}
                disabled={loading || !amount || !merchant}
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Analyze Transaction'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {result.is_fraud ? (
                    <Warning color="error" sx={{ mr: 1 }} />
                  ) : (
                    <CheckCircle color="success" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {result.is_fraud ? 'Fraud Detected!' : 'Transaction Appears Safe'}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Risk Assessment
                  </Typography>
                  <Chip
                    label={getRiskLabel(result.risk_score)}
                    color={getRiskColor(result.risk_score)}
                    sx={{ fontWeight: 700 }}
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Confidence Level
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {(result.confidence * 100).toFixed(1)}%
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Risk Score
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {(result.risk_score * 100).toFixed(1)}/100
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Analysis Details
                  </Typography>
                  <Typography variant="body2">
                    {result.explanation}
                  </Typography>
                </Box>

                {result.blockchain_hash && (
                  <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
                    <Typography variant="caption" color="text.secondary">
                      Blockchain Hash: {result.blockchain_hash}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {!result && !loading && (
            <Card>
              <CardContent textAlign="center">
                <Security sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Enter transaction details to get started
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our AI will analyze the transaction for fraud patterns
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default TransactionMonitor;
