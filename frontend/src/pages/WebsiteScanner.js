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
} from '@mui/material';
import {
  Web,
  Security,
  CheckCircle,
  Warning,
  Send,
} from '@mui/icons-material';
import { predictWebsite } from '../services/api';

const WebsiteScanner = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Please enter a website URL to scan');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictWebsite({
        url: url,
        content: content || null,
        metadata: {
          ssl_certificate: url.startsWith('https://'),
          domain_age_days: Math.floor(Math.random() * 365), // Mock data
        }
      });

      setResult(response.data);
    } catch (err) {
      setError('Failed to analyze website. Please try again.');
      console.error('Website prediction error:', err);
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
        <Web sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Website Fraud Scanner
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detect fake e-commerce sites and malicious websites
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Website Details
              </Typography>
              
              <TextField
                fullWidth
                label="Website URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="https://example.com"
              />
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Website Content (Optional)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ mb: 3 }}
                placeholder="Paste website content or description here..."
              />
              
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Send />}
                onClick={handleScan}
                disabled={loading || !url.trim()}
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Analyze Website'}
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
                    {result.is_fraud ? 'Fraud Website Detected!' : 'Website Appears Safe'}
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
                  Enter a website URL to get started
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our AI will analyze the website for fraud indicators
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default WebsiteScanner;
