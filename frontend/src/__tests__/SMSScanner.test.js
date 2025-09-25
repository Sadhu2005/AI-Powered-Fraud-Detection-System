import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import SMSScanner from '../pages/SMSScanner';
import * as api from '../services/api';

const theme = createTheme();

// Mock the API
jest.mock('../services/api');
const mockPredictSMS = api.predictSMS as jest.MockedFunction<typeof api.predictSMS>;

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('SMS Scanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders SMS scanner form', () => {
    renderWithProviders(<SMSScanner />);
    
    expect(screen.getByText(/SMS Fraud Scanner/i)).toBeInTheDocument();
    expect(screen.getByText(/Analyze SMS messages for spam/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/SMS Message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sender/i)).toBeInTheDocument();
  });

  test('handles form submission with legitimate message', async () => {
    const mockResponse = {
      data: {
        is_fraud: false,
        confidence: 0.8,
        risk_score: 0.2,
        explanation: 'Message appears legitimate',
        blockchain_hash: 'test-hash-123'
      }
    };
    
    mockPredictSMS.mockResolvedValue(mockResponse);
    
    renderWithProviders(<SMSScanner />);
    
    const messageInput = screen.getByLabelText(/SMS Message/i);
    const submitButton = screen.getByText(/Analyze Message/i);
    
    fireEvent.change(messageInput, { target: { value: 'Hello, this is a normal message' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockPredictSMS).toHaveBeenCalledWith({
        message: 'Hello, this is a normal message',
        sender: null
      });
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Message Appears Safe/i)).toBeInTheDocument();
    });
  });

  test('handles form submission with suspicious message', async () => {
    const mockResponse = {
      data: {
        is_fraud: true,
        confidence: 0.9,
        risk_score: 0.8,
        explanation: 'Contains urgent language and suspicious patterns',
        blockchain_hash: 'test-hash-456'
      }
    };
    
    mockPredictSMS.mockResolvedValue(mockResponse);
    
    renderWithProviders(<SMSScanner />);
    
    const messageInput = screen.getByLabelText(/SMS Message/i);
    const submitButton = screen.getByText(/Analyze Message/i);
    
    fireEvent.change(messageInput, { target: { value: 'URGENT! Click here immediately!' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Fraud Detected!/i)).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    mockPredictSMS.mockRejectedValue(new Error('API Error'));
    
    renderWithProviders(<SMSScanner />);
    
    const messageInput = screen.getByLabelText(/SMS Message/i);
    const submitButton = screen.getByText(/Analyze Message/i);
    
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to analyze message/i)).toBeInTheDocument();
    });
  });

  test('validates required fields', async () => {
    renderWithProviders(<SMSScanner />);
    
    const submitButton = screen.getByText(/Analyze Message/i);
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/Please enter a message to scan/i)).toBeInTheDocument();
  });

  test('displays loading state during analysis', async () => {
    mockPredictSMS.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    renderWithProviders(<SMSScanner />);
    
    const messageInput = screen.getByLabelText(/SMS Message/i);
    const submitButton = screen.getByText(/Analyze Message/i);
    
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
