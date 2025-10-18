import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../utils/api';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { 
  AppLayout, 
  MainContent, 
  LoadingSpinner, 
  Flex, 
  Text 
} from '../styles/styledComponents';
import Header from '../components/PremiumHeader';
import {
  PremiumDashboardCard,
  PremiumTrustSection,
  PremiumTransactionItem
} from '../components/PremiumUIComponents';

const DashboardContainer = styled(MainContent)`
  padding-top: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  
  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionTitle = styled(Text)`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text.primary};
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await userAPI.getDashboard();
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    try {
      const response = await userAPI.getReferral();
      navigator.clipboard.writeText(response.data.referralLink);
      alert('Referral link copied to clipboard!');
    } catch (err) {
      alert('Failed to get referral link');
    }
  };

  if (loading) return (
    <AppLayout>
      <Header title="Dashboard" showBack={false} />
      <DashboardContainer>
        <Flex justify="center" align="center" style={{ padding: theme.spacing['2xl'] }}>
          <LoadingSpinner />
        </Flex>
      </DashboardContainer>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <Header title="Dashboard" showBack={false} />
      <DashboardContainer>
        <Flex justify="center" align="center" style={{ padding: theme.spacing['2xl'] }}>
          <Text color="danger">{error}</Text>
        </Flex>
      </DashboardContainer>
    </AppLayout>
  );

  return (
    <AppLayout>
      <Header title="Dashboard" showBack={false} />
      <DashboardContainer>
        {/* Premium Trust Section */}
        <PremiumTrustSection />
        
        {/* Stats Grid */}
        <StatsGrid>
          <PremiumDashboardCard 
            title="Wallet Balance" 
            value={`₹${dashboardData?.user?.balance?.toFixed(2) || '0.00'}`}
            subtitle="Available for withdrawal"
            premium
          />
          <PremiumDashboardCard 
            title="Total Invested" 
            value={`₹${dashboardData?.user?.total_invested?.toFixed(2) || '0.00'}`}
            subtitle="Lifetime investments"
          />
          <PremiumDashboardCard 
            title="Total Withdrawn" 
            value={`₹${dashboardData?.user?.total_withdrawn?.toFixed(2) || '0.00'}`}
            subtitle="Lifetime withdrawals"
          />
        </StatsGrid>

        {/* Quick Actions */}
        <Section>
          <SectionTitle>Quick Actions</SectionTitle>
          <Flex gap="md" wrap="wrap">
            <button 
              className="btn btn-primary"
              onClick={copyReferralLink}
              style={{ 
                background: `linear-gradient(135deg, ${theme.colors.primary[600]}, ${theme.colors.secondary[600]})`,
                color: 'white',
                border: 'none',
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.md,
                fontWeight: theme.typography.fontWeight.semibold,
                cursor: 'pointer',
                flex: 1,
                minWidth: '120px'
              }}
            >
              🎁 Share Referral
            </button>
            
            {/* Add more quick action buttons */}
            <a 
              href="/plans" 
              style={{ 
                background: theme.colors.neutral[200],
                color: theme.colors.text.primary,
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.md,
                fontWeight: theme.typography.fontWeight.semibold,
                textDecoration: 'none',
                flex: 1,
                minWidth: '120px',
                textAlign: 'center'
              }}
            >
              💰 Invest Now
            </a>
            
            <a 
              href="/withdrawal" 
              style={{ 
                background: theme.colors.neutral[200],
                color: theme.colors.text.primary,
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.md,
                fontWeight: theme.typography.fontWeight.semibold,
                textDecoration: 'none',
                flex: 1,
                minWidth: '120px',
                textAlign: 'center'
              }}
            >
              💳 Withdraw
            </a>
          </Flex>
        </Section>

        {/* Active Plans */}
        {dashboardData?.activePlans && dashboardData.activePlans.length > 0 && (
          <Section>
            <SectionTitle>Active Investment Plans</SectionTitle>
            <div>
              {dashboardData.activePlans.map((plan) => (
                <div key={plan.id} style={{ marginBottom: theme.spacing.md }}>
                  <div style={{ 
                    background: theme.colors.surface.primary, 
                    borderRadius: theme.borderRadius.lg,
                    padding: theme.spacing.md,
                    border: `1px solid ${theme.colors.neutral[200]}`
                  }}>
                    <Flex justify="space-between" align="center">
                      <div>
                        <Text size="lg" weight="semibold">{plan.plan_name}</Text>
                        <Flex gap="lg" style={{ marginTop: theme.spacing.xs }}>
                          <Text size="sm" color="success">
                            Daily: ₹{plan.daily_income}
                          </Text>
                          <Text size="sm" color="secondary">
                            Ends: {new Date(plan.end_date).toLocaleDateString()}
                          </Text>
                        </Flex>
                      </div>
                      <Text size="sm" weight="semibold" color="success">
                        Active
                      </Text>
                    </Flex>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Recent Transactions */}
        <Section>
          <SectionTitle>Recent Transactions</SectionTitle>
          {dashboardData?.transactions && dashboardData.transactions.length > 0 ? (
            <div>
              {dashboardData.transactions.slice(0, 5).map((transaction) => (
                <PremiumTransactionItem
                  key={transaction.id}
                  type={transaction.type}
                  amount={transaction.amount}
                  date={new Date(transaction.created_at).toLocaleDateString()}
                  status={transaction.type === 'daily_income' ? 'completed' : transaction.type}
                  description={transaction.description}
                />
              ))}
            </div>
          ) : (
            <Flex justify="center" align="center" style={{ padding: theme.spacing.xl }}>
              <Text color="tertiary">No recent transactions</Text>
            </Flex>
          )}
        </Section>

        {/* Recent Withdrawals */}
        {dashboardData?.withdrawals && dashboardData.withdrawals.length > 0 && (
          <Section>
            <SectionTitle>Recent Withdrawals</SectionTitle>
            <div>
              {dashboardData.withdrawals.slice(0, 3).map((withdrawal) => (
                <div key={withdrawal.id} style={{ marginBottom: theme.spacing.md }}>
                  <div style={{ 
                    background: theme.colors.surface.primary, 
                    borderRadius: theme.borderRadius.lg,
                    padding: theme.spacing.md,
                    border: `1px solid ${theme.colors.neutral[200]}`
                  }}>
                    <Flex justify="space-between" align="center">
                      <div>
                        <Text size="lg" weight="semibold">
                          ₹{withdrawal.amount}
                        </Text>
                        <Text size="sm" color="secondary" display="block">
                          {new Date(withdrawal.created_at).toLocaleDateString()}
                        </Text>
                      </div>
                      <Text 
                        size="sm" 
                        weight="semibold"
                        style={{
                          background: 
                            withdrawal.status === 'approved' ? `${theme.colors.status.success}20` :
                            withdrawal.status === 'pending' ? `${theme.colors.status.warning}20` :
                            `${theme.colors.status.danger}20`,
                          color:
                            withdrawal.status === 'approved' ? theme.colors.status.success :
                            withdrawal.status === 'pending' ? theme.colors.status.warning :
                            theme.colors.status.danger,
                          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                          borderRadius: theme.borderRadius.full
                        }}
                      >
                        {withdrawal.status}
                      </Text>
                    </Flex>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </DashboardContainer>
    </AppLayout>
  );
};

export default Dashboard;