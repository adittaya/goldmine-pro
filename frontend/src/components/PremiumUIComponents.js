import React from 'react';
import styled from 'styled-components';
import { theme } from './theme';
import { Card, Text, Heading, Button, Flex, StatCard } from './styledComponents';

const PremiumCard = styled(Card)`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, 
    ${theme.colors.surface.primary} 0%, 
    ${theme.colors.neutral[50]} 100%);
  border: 1px solid rgba(14, 165, 233, 0.1);
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      ${theme.colors.primary[500]}, 
      ${theme.colors.secondary[500]},
      ${theme.colors.accent.purple});
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.xl};
  }
`;

const PremiumButton = styled(Button)`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, 
    ${theme.colors.primary[600]}, 
    ${theme.colors.secondary[600]});
  color: ${theme.colors.text.inverse};
  border: none;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: rotate(30deg);
    transition: all 0.6s ease;
  }
  
  &:hover::before {
    transform: rotate(30deg) translate(20%, 20%);
  }
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, 
    ${theme.colors.primary[600]}, 
    ${theme.colors.secondary[600]},
    ${theme.colors.accent.purple});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const TrustSection = styled.div`
  background: linear-gradient(135deg, 
    ${theme.colors.primary[50]} 0%, 
    ${theme.colors.secondary[50]} 100%);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.lg};
  margin: ${theme.spacing.lg} 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,0.2), transparent 70%);
    z-index: 0;
  }
`;

const TrustBadgeContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
  margin: ${theme.spacing.md} 0;
`;

const SecurityFeature = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  background: ${theme.colors.surface.primary};
  border-radius: ${theme.borderRadius.lg};
  border-left: 4px solid ${theme.colors.status.success};
  margin: ${theme.spacing.sm} 0;
`;

const PremiumStatCard = styled(StatCard)`
  background: linear-gradient(135deg, 
    ${theme.colors.primary[500]} 0%, 
    ${theme.colors.secondary[500]} 100%);
  color: ${theme.colors.text.inverse};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,0.1), transparent 70%);
    z-index: 1;
  }
  
  ${Text} {
    color: ${theme.colors.text.inverse};
    position: relative;
    z-index: 2;
  }
`;

const FeatureCard = styled(PremiumCard)`
  text-align: center;
  padding: ${theme.spacing.xl};
  
  ${Heading} {
    margin-bottom: ${theme.spacing.md};
  }
  
  ${Text} {
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.lg};
  }
`;

const TestimonialCard = styled(PremiumCard)`
  border-left: 4px solid ${theme.colors.primary[500]};
  
  ${Text} {
    font-style: italic;
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.md};
  }
`;

// Premium UI Components
export const PremiumDashboardCard = ({ title, value, subtitle, icon, ...props }) => (
  <PremiumStatCard {...props}>
    <Text size="2xl" weight="bold" display="block">{value}</Text>
    <Text size="sm" weight="medium" display="block" style={{ marginTop: theme.spacing.xs }}>
      {title}
    </Text>
    {subtitle && (
      <Text size="xs" display="block" style={{ marginTop: theme.spacing.xs }}>
        {subtitle}
      </Text>
    )}
    {icon && <div style={{ marginTop: theme.spacing.sm }}>{icon}</div>}
  </PremiumStatCard>
);

export const PremiumFeatureCard = ({ title, description, icon, buttonLabel, onButtonClick, ...props }) => (
  <FeatureCard {...props}>
    <div style={{ marginBottom: theme.spacing.md }}>
      {icon}
    </div>
    <Heading as="h3" size="lg" weight="bold" style={{ marginBottom: theme.spacing.sm }}>
      {title}
    </Heading>
    <Text size="base" style={{ marginBottom: theme.spacing.lg }}>
      {description}
    </Text>
    {buttonLabel && (
      <PremiumButton onClick={onButtonClick}>
        {buttonLabel}
      </PremiumButton>
    )}
  </FeatureCard>
);

export const PremiumPlanCard = ({ name, price, dailyIncome, duration, returnAmount, description, onSubscribe, ...props }) => (
  <PremiumCard {...props}>
    <Flex direction="column" align="center" style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
      <Heading as="h3" size="xl" weight="bold" style={{ marginBottom: theme.spacing.sm }}>
        {name}
      </Heading>
      <Text size="2xl" weight="extrabold" color="primary">
        ₹{price}
      </Text>
      <Text size="sm" color="secondary" style={{ marginTop: theme.spacing.xs }}>
        {description}
      </Text>
    </Flex>
    
    <Flex direction="column" gap="md" style={{ marginBottom: theme.spacing.lg }}>
      <Flex justify="space-between">
        <Text size="sm" color="secondary">Daily Income:</Text>
        <Text size="sm" weight="semibold" color="success">₹{dailyIncome}</Text>
      </Flex>
      <Flex justify="space-between">
        <Text size="sm" color="secondary">Duration:</Text>
        <Text size="sm" weight="semibold">{duration} days</Text>
      </Flex>
      <Flex justify="space-between">
        <Text size="sm" color="secondary">Total Return:</Text>
        <Text size="sm" weight="semibold" color="primary">₹{returnAmount}</Text>
      </Flex>
    </Flex>
    
    <PremiumButton fullWidth onClick={onSubscribe}>
      Subscribe Now
    </PremiumButton>
  </PremiumCard>
);

export const PremiumTrustSection = () => (
  <TrustSection>
    <Heading as="h3" size="xl" weight="bold" style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
      <GradientText>Trusted by Thousands</GradientText>
    </Heading>
    
    <TrustBadgeContainer>
      <div className="trust-badge">
        <Text size="sm" weight="semibold">🔒 Secure</Text>
      </div>
      <div className="trust-badge">
        <Text size="sm" weight="semibold">✅ Verified</Text>
      </div>
      <div className="trust-badge">
        <Text size="sm" weight="semibold">⚡ Instant</Text>
      </div>
      <div className="trust-badge">
        <Text size="sm" weight="semibold">💰 Profitable</Text>
      </div>
    </TrustBadgeContainer>
    
    <Flex direction="column" gap="sm">
      <SecurityFeature>
        <Text size="sm">256-bit SSL encryption for all transactions</Text>
      </SecurityFeature>
      <SecurityFeature>
        <Text size="sm">Regulated and compliant with financial standards</Text>
      </SecurityFeature>
      <SecurityFeature>
        <Text size="sm">Daily backup of all financial data</Text>
      </SecurityFeature>
    </Flex>
  </TrustSection>
);

export const PremiumTestimonialCard = ({ quote, author, role }) => (
  <TestimonialCard>
    <Text size="lg">"{quote}"</Text>
    <Flex direction="column" align="flex-start" style={{ marginTop: theme.spacing.md }}>
      <Text size="sm" weight="semibold">{author}</Text>
      <Text size="xs" color="tertiary">{role}</Text>
    </Flex>
  </TestimonialCard>
);

export const PremiumHeader = ({ title, subtitle, ...props }) => (
  <header {...props} style={{ 
    background: `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.secondary[500]} 100%)`, 
    padding: `${theme.spacing.lg} ${theme.spacing.md}`,
    borderRadius: `${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0`,
    color: theme.colors.text.inverse,
    textAlign: 'center'
  }}>
    <Heading as="h2" size="xl" weight="bold" style={{ margin: 0, color: 'white' }}>
      {title}
    </Heading>
    {subtitle && (
      <Text size="lg" style={{ marginTop: theme.spacing.sm, color: 'rgba(255,255,255,0.9)' }}>
        {subtitle}
      </Text>
    )}
  </header>
);

export const PremiumTransactionItem = ({ type, amount, date, status, description, ...props }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return theme.colors.status.success;
      case 'pending': return theme.colors.status.warning;
      case 'failed': return theme.colors.status.danger;
      default: return theme.colors.text.tertiary;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'daily_income': return '💰';
      case 'plan_purchase': return '📊';
      case 'recharge': return '⬆️';
      case 'withdrawal': return '⬇️';
      default: return '📝';
    }
  };

  return (
    <PremiumCard interactive elevation="sm" style={{ marginBottom: theme.spacing.sm, border: 'none' }}>
      <Flex justify="space-between" align="center">
        <Flex align="center" gap="md">
          <div style={{ fontSize: theme.typography.fontSize.xl }}>
            {getTypeIcon(type)}
          </div>
          <div>
            <Text size="base" weight="semibold">{description}</Text>
            <Text size="sm" color="tertiary">{date}</Text>
          </div>
        </Flex>
        <Flex direction="column" align="flex-end">
          <Text size="base" weight="bold" color={type === 'daily_income' || type === 'recharge' ? 'success' : 'danger'}>
            {type === 'daily_income' || type === 'recharge' ? '+' : '-'}₹{amount}
          </Text>
          <div style={{ marginTop: theme.spacing.xs }}>
            <Text size="xs" style={{ color: getStatusColor(status) }}>
              {status}
            </Text>
          </div>
        </Flex>
      </Flex>
    </PremiumCard>
  );
};