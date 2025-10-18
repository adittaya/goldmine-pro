import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { theme } from '../styles/theme';
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

  return (
    <AppLayout>
      <Header title="Login" showBack={true} showUser={false} />
      <LoginPageContainer>
        <LoginCard>
          <Title>Welcome Back</Title>
          
          {error && (
            <div style={{ 
              backgroundColor: `${theme.colors.status.danger}20`,
              color: theme.colors.status.danger,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.md
            }}>
              <Text size="sm">{error}</Text>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </FormGroup>
            
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              disabled={loading}
              premium={true}
              style={{ marginTop: theme.spacing.md }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <Flex direction="column" align="center" style={{ marginTop: theme.spacing.lg }}>
            <Text size="sm" color="secondary">
              Don't have an account?{' '}
              <a 
                href="/register" 
                style={{ 
                  color: theme.colors.primary[600], 
                  textDecoration: 'none',
                  fontWeight: theme.typography.fontWeight.semibold
                }}
              >
                Register here
              </a>
            </Text>
            
            <Text size="sm" color="tertiary" style={{ marginTop: theme.spacing.sm }}>
              By logging in, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </Flex>
        </LoginCard>
      </LoginPageContainer>
    </AppLayout>
  );
};

export default Login;