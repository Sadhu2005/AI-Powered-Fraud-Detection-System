import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import App from '../App';

const theme = createTheme();

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe('SafeGuard AI App', () => {
  test('renders without crashing', () => {
    renderWithProviders(<App />);
  });

  test('renders SafeGuard AI title', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/SafeGuard AI/i)).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/SMS Scanner/i)).toBeInTheDocument();
    expect(screen.getByText(/URL Scanner/i)).toBeInTheDocument();
    expect(screen.getByText(/Transaction Monitor/i)).toBeInTheDocument();
    expect(screen.getByText(/Website Scanner/i)).toBeInTheDocument();
  });
});
