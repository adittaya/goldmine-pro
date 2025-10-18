import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { transactionAPI } from '../utils/api';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { 
  AppLayout, 
  MainContent, 
  LoadingSpinner, 
  Text, 
  Flex
} from '../styles/styledComponents';
import Header from '../components/PremiumHeader';
import {
  PremiumTransactionItem
} from '../components/PremiumUIComponents';

const TransactionsPageContainer = styled(MainContent)`
  padding-top: 0;
`;

const SectionTitle = styled(Text)`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text.primary};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  overflow-x: auto;
  padding-bottom: ${theme.spacing.xs};
`;

const FilterButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${props => props.active ? theme.colors.primary[500] : theme.colors.neutral[200]};
  background: ${props => props.active ? theme.colors.primary[500] : theme.colors.surface.primary};
  color: ${props => props.active ? theme.colors.text.inverse : theme.colors.text.secondary};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  white-space: nowrap;
  cursor: pointer;
  transition: ${theme.transitions.fast};
  
  &:hover {
    border-color: ${theme.colors.primary[500]};
    background: ${props => props.active ? theme.colors.primary[600] : theme.colors.neutral[50]};
  }
`;

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, daily_income, plan_purchase, recharge, withdrawal
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getUserTransactions();
      setTransactions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load transactions');
      setLoading(false);
    }
  };

  // Filter transactions based on selected filter
  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(transaction => transaction.type === filter);

  if (loading) return (
    <AppLayout>
      <Header title="Transactions" showBack={true} />
      <TransactionsPageContainer>
        <Flex justify="center" align="center" style={{ padding: theme.spacing['2xl'] }}>
          <LoadingSpinner />
        </Flex>
      </TransactionsPageContainer>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <Header title="Transactions" showBack={true} />
      <TransactionsPageContainer>
        <Flex justify="center" align="center" style={{ padding: theme.spacing['2xl'] }}>
          <Text color="danger">{error}</Text>
        </Flex>
      </TransactionsPageContainer>
    </AppLayout>
  );

  return (
    <AppLayout>
      <Header title="Transaction History" showBack={true} />
      <TransactionsPageContainer>
        <SectionTitle>My Transactions</SectionTitle>
        
        <Flex justify="space-between" align="center" style={{ marginBottom: theme.spacing.lg }}>
          <Text size="lg" weight="semibold">
            Total Transactions: {transactions.length}
          </Text>
          <Text size="lg" weight="semibold" color="primary">
            Balance: ₹{user.balance?.toFixed(2) || '0.00'}
          </Text>
        </Flex>
        
        <FilterContainer>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </FilterButton>
          <FilterButton active={filter === 'daily_income'} onClick={() => setFilter('daily_income')}>
            Daily Income
          </FilterButton>
          <FilterButton active={filter === 'plan_purchase'} onClick={() => setFilter('plan_purchase')}>
            Plan Purchase
          </FilterButton>
          <FilterButton active={filter === 'recharge'} onClick={() => setFilter('recharge')}>
            Recharge
          </FilterButton>
          <FilterButton active={filter === 'withdrawal'} onClick={() => setFilter('withdrawal')}>
            Withdrawal
          </FilterButton>
        </FilterContainer>
        
        {filteredTransactions.length > 0 ? (
          <div>
            {filteredTransactions.map((transaction) => (
              <PremiumTransactionItem
                key={transaction.id}
                type={transaction.type}
                amount={transaction.amount}
                date={new Date(transaction.created_at).toLocaleDateString()}
                status="completed"
                description={transaction.description}
              />
            ))}
          </div>
        ) : (
          <Flex justify="center" align="center" style={{ padding: theme.spacing.xl }}>
            <Text color="tertiary">No transactions found</Text>
          </Flex>
        )}
        
        <Flex 
          direction="column" 
          style={{ 
            marginTop: theme.spacing.xl,
            paddingTop: theme.spacing.lg,
            borderTop: `1px solid ${theme.colors.neutral[200]}`,
            textAlign: 'center'
          }}
        >
          <Text size="lg" weight="bold" style={{ marginBottom: theme.spacing.md }}>
            Need Help?
          </Text>
          <Text size="sm" color="secondary" style={{ marginBottom: theme.spacing.md }}>
            Contact our support team for any questions about your transactions
          </Text>
          <Text size="sm" color="tertiary">
            support@goldmine-pro.com
          </Text>
        </Flex>
      </TransactionsPageContainer>
    </AppLayout>
  );
};

export default Transactions;