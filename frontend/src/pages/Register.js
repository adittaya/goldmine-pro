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

const RegisterPageContainer = styled(MainContent)`
  padding-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
`;

const RegisterCard = styled.div`
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

const Register = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    try {
      const result = await register(name, mobile, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Header title="Register" showBack={true} showUser={false} />
      <RegisterPageContainer>
        <RegisterCard>
          <Title>Create Account</Title>
          
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </FormGroup>
            
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
                placeholder="Enter your password (min 6 characters)"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <Flex direction="column" align="center" style={{ marginTop: theme.spacing.lg }}>
            <Text size="sm" color="secondary">
              Already have an account?{' '}
              <a 
                href="/login" 
                style={{ 
                  color: theme.colors.primary[600], 
                  textDecoration: 'none',
                  fontWeight: theme.typography.fontWeight.semibold
                }}
              >
                Login here
              </a>
            </Text>
            
            <Text size="sm" color="tertiary" style={{ marginTop: theme.spacing.sm }}>
              By registering, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </Flex>
        </RegisterCard>
      </RegisterPageContainer>
    </AppLayout>
  );
};

export default Register;