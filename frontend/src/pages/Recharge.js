import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { transactionAPI } from '../utils/api';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { 
  AppLayout, 
  MainContent, 
  Input, 
  TextArea, 
  Button, 
  FormGroup, 
  Label, 
  Text, 
  Flex
} from '../styles/styledComponents';
import Header from '../components/PremiumHeader';

const RechargePageContainer = styled(MainContent)`
  padding-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RechargeCard = styled.div`
  background: ${theme.colors.surface.primary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  width: 100%;
  max-width: 500px;
  box-shadow: ${theme.shadows.lg};
  border: 1px solid ${theme.colors.neutral[200]};
`;

const Title = styled(Text)`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text.primary};
  display: block;
`;

const Recharge = () => {
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await transactionAPI.createRecharge(parseFloat(amount), utr, method);
      setSuccess('Recharge request submitted successfully! It will be processed within 24 hours.');
      setAmount('');
      setUtr('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit recharge request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Header title="Recharge Account" showBack={true} />
      <RechargePageContainer>
        <RechargeCard>
          <Title>Add Funds to Your Account</Title>
          
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
          
          {success && (
            <div style={{ 
              backgroundColor: `${theme.colors.status.success}20`,
              color: theme.colors.status.success,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.md
            }}>
              <Text size="sm">{success}</Text>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to recharge"
                min="100"
                step="10"
                required
              />
              <Text size="xs" color="tertiary" style={{ marginTop: theme.spacing.xs }}>
                Minimum recharge amount: ₹100
              </Text>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="utr">UTR (Unique Transaction Reference)</Label>
              <Input
                id="utr"
                type="text"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="Enter UTR from your bank transaction"
                required
              />
              <Text size="xs" color="tertiary" style={{ marginTop: theme.spacing.xs }}>
                This can be found in your bank transaction details
              </Text>
            </FormGroup>
            
            <FormGroup>
              <Label>Payment Method</Label>
              <Flex gap="md">
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  padding: theme.spacing.sm,
                  border: `2px solid ${method === 'upi' ? theme.colors.primary[500] : theme.colors.neutral[200]}`,
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer',
                  flex: 1,
                  justifyContent: 'center'
                }}>
                  <input
                    type="radio"
                    name="method"
                    value="upi"
                    checked={method === 'upi'}
                    onChange={(e) => setMethod(e.target.value)}
                    style={{ marginRight: theme.spacing.sm }}
                  />
                  <Text>UPI</Text>
                </label>
                
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  padding: theme.spacing.sm,
                  border: `2px solid ${method === 'bank' ? theme.colors.primary[500] : theme.colors.neutral[200]}`,
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer',
                  flex: 1,
                  justifyContent: 'center'
                }}>
                  <input
                    type="radio"
                    name="method"
                    value="bank"
                    checked={method === 'bank'}
                    onChange={(e) => setMethod(e.target.value)}
                    style={{ marginRight: theme.spacing.sm }}
                  />
                  <Text>Bank Transfer</Text>
                </label>
              </Flex>
            </FormGroup>
            
            <Flex direction="column" gap="sm" style={{ marginTop: theme.spacing.lg }}>
              <Text size="sm" weight="semibold" color="primary">Payment Instructions:</Text>
              <Text size="sm">
                1. Send the exact amount to our UPI ID: <Text weight="semibold">7047571829@yespop</Text>
              </Text>
              <Text size="sm">
                2. Note down the UTR (Unique Transaction Reference) from your bank app
              </Text>
              <Text size="sm">
                3. Enter the details above and submit for verification
              </Text>
              <Text size="sm" color="secondary">
                4. Your account will be credited within 24 hours of successful verification
              </Text>
            </Flex>
            
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              disabled={loading}
              premium={true}
              style={{ marginTop: theme.spacing.lg }}
            >
              {loading ? 'Processing...' : 'Submit Recharge Request'}
            </Button>
          </form>
          
          <Flex direction="column" style={{ marginTop: theme.spacing.xl, paddingTop: theme.spacing.lg, borderTop: `1px solid ${theme.colors.neutral[200]}` }}>
            <Text size="sm" weight="semibold" style={{ marginBottom: theme.spacing.md, textAlign: 'center' }}>
              Recent Recharge History
            </Text>
            <Text size="sm" color="tertiary" style={{ textAlign: 'center' }}>
              Your recharge history will appear here after submitting requests
            </Text>
          </Flex>
        </RechargeCard>
      </RechargePageContainer>
    </AppLayout>
  );
};

export default Recharge;