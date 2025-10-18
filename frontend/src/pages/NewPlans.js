import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { plansAPI } from '../utils/api';
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
  PremiumPlanCard
} from '../components/PremiumUIComponents';

const PlansPageContainer = styled(MainContent)`
  padding-top: 0;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SectionTitle = styled(Text)`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.text.primary};
`;

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await plansAPI.getPlans();
      setPlans(response.data.plans);
      setLoading(false);
    } catch (err) {
      setError('Failed to load investment plans');
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // In a real implementation, we would call the purchase API
      // For now, we'll just navigate to the purchase confirmation
      navigate(`/plans/${planId}/purchase`);
    } catch (err) {
      alert('Failed to subscribe to plan');
    }
  };

  if (loading) return (
    <AppLayout>
      <Header title="Investment Plans" showBack={true} />
      <PlansPageContainer>
        <Flex justify="center" align="center" style={{ padding: theme.spacing['2xl'] }}>
          <LoadingSpinner />
        </Flex>
      </PlansPageContainer>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <Header title="Investment Plans" showBack={true} />
      <PlansPageContainer>
        <Flex justify="center" align="center" style={{ padding: theme.spacing['2xl'] }}>
          <Text color="danger">{error}</Text>
        </Flex>
      </PlansPageContainer>
    </AppLayout>
  );

  return (
    <AppLayout>
      <Header title="Investment Plans" showBack={true} />
      <PlansPageContainer>
        <SectionTitle>Choose Your Investment Plan</SectionTitle>
        
        <Text 
          size="lg" 
          color="secondary" 
          style={{ 
            textAlign: 'center', 
            marginBottom: theme.spacing.xl,
            maxWidth: '600px',
            margin: `0 auto ${theme.spacing.xl}px`
          }}
        >
          Select from our range of investment plans designed to help you grow your wealth. 
          All plans offer daily returns and are completely secure.
        </Text>
        
        <PlansGrid>
          {plans.map((plan) => (
            <PremiumPlanCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              dailyIncome={plan.daily_income}
              duration={plan.duration_days}
              returnAmount={plan.total_return}
              description={`Earn ₹${plan.daily_income} daily for ${plan.duration_days} days`}
              onSubscribe={() => handleSubscribe(plan.id)}
            />
          ))}
        </PlansGrid>
        
        <Flex 
          direction="column" 
          align="center" 
          style={{ 
            textAlign: 'center', 
            padding: `${theme.spacing.xl} 0`,
            margin: `${theme.spacing.xl} 0`,
            background: theme.colors.surface.tertiary,
            borderRadius: theme.borderRadius.xl
          }}
        >
          <Text size="xl" weight="bold" style={{ marginBottom: theme.spacing.md }}>
            Have Questions?
          </Text>
          <Text 
            size="lg" 
            color="secondary" 
            style={{ marginBottom: theme.spacing.lg }}
          >
            Our support team is available 24/7 to help you with your investment journey.
          </Text>
          <Text size="sm" color="tertiary">
            Contact us: support@goldmine-pro.com
          </Text>
        </Flex>
      </PlansPageContainer>
    </AppLayout>
  );
};

export default Plans;