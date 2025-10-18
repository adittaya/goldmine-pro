import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { 
  AppLayout, 
  MainContent, 
  Input, 
  Button, 
  FormGroup, 
  Label, 
  Text, 
  Flex
} from '../styles/styledComponents';
import Header from '../components/PremiumHeader';

// Get theme from styledComponents since it has the embedded theme
const theme = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  borderRadius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
  typography: {
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
    },
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    secondary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    accent: {
      purple: '#8b5cf6',
      pink: '#ec4899',
      orange: '#f97316',
      amber: '#f59e0b',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6',
      primary: '#0ea5e9',
    },
    surface: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      tertiary: '#94a3b8',
      inverse: '#ffffff',
    },
  },
};

const LoginPageContainer = styled(MainContent)`
  padding-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
`;

const LoginCard = styled.div`
  background: ${theme.colors.surface.primary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  width: 100%;
  max-width: 400px;
  box-shadow: ${theme.shadows.lg};
  border: 1px solid ${theme.colors.neutral[200]};
  
  @media (min-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing['2xl']};
  }
`;

const Title = styled(Text)`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text.primary};
  display: block;
`;

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(mobile, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(AppLayout, null,
    React.createElement(Header, { title: "Login", showBack: true, showUser: false }),
    React.createElement(LoginPageContainer, null,
      React.createElement(LoginCard, null,
        React.createElement(Title, null, "Welcome Back"),
        
        error && React.createElement('div', {
          style: { 
            backgroundColor: `${theme.colors.status.danger}20`,
            color: theme.colors.status.danger,
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing.md
          }
        }, 
          React.createElement(Text, { size: "sm" }, error)
        ),
        
        React.createElement('form', { onSubmit: handleSubmit },
          React.createElement(FormGroup, null,
            React.createElement(Label, { htmlFor: "mobile" }, "Mobile Number"),
            React.createElement(Input, {
              id: "mobile",
              type: "tel",
              value: mobile,
              onChange: (e) => setMobile(e.target.value),
              placeholder: "Enter your mobile number",
              required: true
            })
          ),
          
          React.createElement(FormGroup, null,
            React.createElement(Label, { htmlFor: "password" }, "Password"),
            React.createElement(Input, {
              id: "password",
              type: "password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              placeholder: "Enter your password",
              required: true
            })
          ),
          
          React.createElement(Button, { 
            type: "submit", 
            variant: "primary", 
            fullWidth: true, 
            disabled: loading,
            premium: true,
            style: { marginTop: theme.spacing.md }
          }, 
            loading ? 'Signing in...' : 'Sign In'
          )
        ),
        
        React.createElement(Flex, { 
          direction: "column", 
          align: "center", 
          style: { marginTop: theme.spacing.lg } 
        },
          React.createElement(Text, { size: "sm", color: "secondary" },
            "Don't have an account? ",
            React.createElement('a', { 
              href: "/register", 
              style: { 
                color: theme.colors.primary[600], 
                textDecoration: 'none',
                fontWeight: theme.typography.fontWeight.semibold
              }
            }, "Register here")
          ),
          
          React.createElement(Text, { 
            size: "sm", 
            color: "tertiary", 
            style: { marginTop: theme.spacing.sm } 
          },
            "By logging in, you agree to our Terms of Service and Privacy Policy."
          )
        )
      )
    )
  );
};

export default Login;