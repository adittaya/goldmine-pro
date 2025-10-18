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
  Button, 
  FormGroup, 
  Label, 
  Text, 
  Flex
} from '../styles/styledComponents';
import Header from '../components/PremiumHeader';

const WithdrawalPageContainer = styled(MainContent)`
  padding-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WithdrawalCard = styled.div`
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

const Withdrawal = () => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
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
    
    // Validate required fields based on method
    if (method === 'upi' && !upiId) {
      setError('UPI ID is required for UPI withdrawal');
      setLoading(false);
      return;
    }
    
    if (method === 'bank' && (!bankName || !accountHolderName || !ifscCode || !accountNumber)) {
      setError('All bank details are required for bank transfer');
      setLoading(false);
      return;
    }
    
    try {
      const withdrawalData = {
        amount: parseFloat(amount),
        method,
        ...(method === 'upi' && { upi_id: upiId }),
        ...(method === 'bank' && {
          bank_name: bankName,
          account_holder_name: accountHolderName,
          ifsc_code: ifscCode,
          account_number: accountNumber
        })
      };
      
      const response = await transactionAPI.createWithdrawal(withdrawalData);
      
      // Calculate GST details for display
      const gstAmount = parseFloat(amount) * 0.18;
      const netAmount = parseFloat(amount) - gstAmount;
      
      setSuccess(
        `Withdrawal request submitted successfully!\n` +
        `Amount: ₹${parseFloat(amount).toFixed(2)}\n` +
        `GST (18%): ₹${gstAmount.toFixed(2)}\n` +
        `Net Amount: ₹${netAmount.toFixed(2)}\n` +
        `Status: Pending Approval`
      );
      
      // Reset form
      setAmount('');
      setUpiId('');
      setBankName('');
      setAccountHolderName('');
      setIfscCode('');
      setAccountNumber('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  const calculateGST = (amount) => {
    if (!amount || isNaN(amount) || amount <= 0) return { gst: 0, net: 0 };
    const gst = parseFloat(amount) * 0.18;
    const net = parseFloat(amount) - gst;
    return { gst: gst.toFixed(2), net: net.toFixed(2) };
  };

  const gstInfo = calculateGST(amount);

  return (
    <AppLayout>
      <Header title="Withdraw Funds" showBack={true} />
      <WithdrawalPageContainer>
        <WithdrawalCard>
          <Title>Withdraw Your Funds</Title>
          
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
          
          <div style={{ 
            backgroundColor: `${theme.colors.primary[100]}`,
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.lg,
            marginBottom: theme.spacing.lg
          }}>
            <Text size="sm" weight="semibold" color="primary" style={{ marginBottom: theme.spacing.xs }}>
              Account Balance: ₹{user.balance?.toFixed(2) || '0.00'}
            </Text>
            <Text size="sm" color="secondary">
              Available for withdrawal after 18% GST deduction
            </Text>
          </div>
          
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="amount">Withdrawal Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
                min="100"
                step="10"
                required
              />
              <Text size="xs" color="tertiary" style={{ marginTop: theme.spacing.xs }}>
                Minimum withdrawal amount: ₹100
              </Text>
            </FormGroup>
            
            {amount > 0 && (
              <div style={{ 
                backgroundColor: `${theme.colors.secondary[100]}`,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.lg,
                marginBottom: theme.spacing.md
              }}>
                <Text size="sm" weight="semibold" color="secondary">
                  GST Calculation:
                </Text>
                <Flex justify="space-between">
                  <Text size="sm">Withdrawal Amount:</Text>
                  <Text size="sm">₹{parseFloat(amount).toFixed(2)}</Text>
                </Flex>
                <Flex justify="space-between">
                  <Text size="sm">GST (18%):</Text>
                  <Text size="sm" color="danger">-₹{gstInfo.gst}</Text>
                </Flex>
                <Flex justify="space-between" style={{ marginTop: theme.spacing.xs }}>
                  <Text size="sm" weight="semibold">Net Amount:</Text>
                  <Text size="sm" weight="semibold" color="success">₹{gstInfo.net}</Text>
                </Flex>
              </div>
            )}
            
            <FormGroup>
              <Label>Withdrawal Method</Label>
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
            
            {method === 'upi' && (
              <FormGroup>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter your UPI ID (e.g., yourname@bank)"
                  required={method === 'upi'}
                />
              </FormGroup>
            )}
            
            {method === 'bank' && (
              <>
                <FormGroup>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter your bank name"
                    required={method === 'bank'}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    placeholder="Enter account holder name as per bank records"
                    required={method === 'bank'}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter your account number"
                    required={method === 'bank'}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    placeholder="Enter IFSC code"
                    required={method === 'bank'}
                  />
                </FormGroup>
              </>
            )}
            
            <Flex direction="column" gap="sm" style={{ marginTop: theme.spacing.lg }}>
              <Text size="sm" weight="semibold" color="primary">Important Information:</Text>
              <Text size="sm">
                • 18% GST is automatically deducted from withdrawal amounts
              </Text>
              <Text size="sm">
                • Withdrawal requests are processed within 24-48 hours
              </Text>
              <Text size="sm">
                • One withdrawal request per 24 hours is allowed
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
              {loading ? 'Processing...' : 'Submit Withdrawal Request'}
            </Button>
          </form>
        </WithdrawalCard>
      </WithdrawalPageContainer>
    </AppLayout>
  );
};

export default Withdrawal;