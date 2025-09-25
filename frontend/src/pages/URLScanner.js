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
  Link,
  Security,
  CheckCircle,
  Warning,
  Send,
} from '@mui/icons-material';
import { predictURL } from '../services/api';

const URLScanner = () => {
  const [url, setUrl] = useState('');
  const [context, setContext] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to scan');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictURL({
        url: url,
        context: context || null,
      });

      setResult(response.data);
    } catch (err) {
      setError('Failed to analyze URL. Please try again.');
      console.error('URL prediction error:', err);
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
        <Link sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          URL Phishing Scanner
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyze URLs for phishing attempts and malicious content
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Enter URL Details
              </Typography>
              
              <TextField
                fullWidth
                label="Context (Optional)"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="e.g., Received in SMS, Email, etc."
              />
              
              <TextField
                fullWidth
                label="URL to Scan"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                sx={{ mb: 3 }}
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
                {loading ? <CircularProgress size={24} /> : 'Analyze URL'}
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
                    {result.is_fraud ? 'Phishing Detected!' : 'URL Appears Safe'}
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
                  Enter a URL to get started
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our AI will analyze the URL for phishing indicators
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default URLScanner;
