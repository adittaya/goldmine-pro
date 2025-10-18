import React from 'react';
import styled from 'styled-components';
import { COLORS, SPACING, BORDERRADIUS, SHADOWS, TYPOGRAPHY, BREAKPOINTS, TRANSITIONS } from '../styles/theme';
import { Card, Text, Heading, Button, Flex, StatCard } from '../styles/styledComponents';

const PremiumCard = styled(Card)`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, 
    ${COLORS.surface.primary} 0%, 
    ${COLORS.neutral[50]} 100%);
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
      ${COLORS.primary[500]}, 
      ${COLORS.secondary[500]},
      ${COLORS.accent.purple});
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${SHADOWS.xl};
  }
`;

const PremiumButton = styled(Button)`
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, 
    ${COLORS.primary[600]}, 
    ${COLORS.secondary[600]});
  color: ${COLORS.text.inverse};
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
    ${COLORS.primary[600]}, 
    ${COLORS.secondary[600]},
    ${COLORS.accent.purple});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const TrustSection = styled.div`
  background: linear-gradient(135deg, 
    ${COLORS.primary[50]} 0%, 
    ${COLORS.secondary[50]} 100%);
  border-radius: ${BORDERRADIUS.xl};
  padding: ${SPACING.lg};
  margin: ${SPACING.lg} 0;
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
  gap: ${SPACING.sm};
  flex-wrap: wrap;
  margin: ${SPACING.md} 0;
`;

const SecurityFeature = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.sm};
  padding: ${SPACING.md};
  background: ${COLORS.surface.primary};
  border-radius: ${BORDERRADIUS.lg};
  border-left: 4px solid ${COLORS.status.success};
  margin: ${SPACING.sm} 0;
`;

const PremiumStatCard = styled(StatCard)`
  background: linear-gradient(135deg, 
    ${COLORS.primary[500]} 0%, 
    ${COLORS.secondary[500]} 100%);
  color: ${COLORS.text.inverse};
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
    color: ${COLORS.text.inverse};
    position: relative;
    z-index: 2;
  }
`;

const FeatureCard = styled(PremiumCard)`
  text-align: center;
  padding: ${SPACING.xl};
  
  ${Heading} {
    margin-bottom: ${SPACING.md};
  }
  
  ${Text} {
    color: ${COLORS.text.secondary};
    margin-bottom: ${SPACING.lg};
  }
`;

const TestimonialCard = styled(PremiumCard)`
  border-left: 4px solid ${COLORS.primary[500]};
  
  ${Text} {
    font-style: italic;
    color: ${COLORS.text.secondary};
    margin-bottom: ${SPACING.md};
  }
`;

// Premium UI Components
export const PremiumDashboardCard = ({ title, value, subtitle, icon, ...props }) => (
  <PremiumStatCard {...props}>
    <Text size="2xl" weight="bold" display="block">{value}</Text>
    <Text size="sm" weight="medium" display="block" style={{ marginTop: SPACING.xs }}>
      {title}
    </Text>
    {subtitle && (
      <Text size="xs" display="block" style={{ marginTop: SPACING.xs }}>
        {subtitle}
      </Text>
    )}
    {icon && <div style={{ marginTop: SPACING.sm }}>{icon}</div>}
  </PremiumStatCard>
);

export const PremiumFeatureCard = ({ title, description, icon, buttonLabel, onButtonClick, ...props }) => (
  <FeatureCard {...props}>
    <div style={{ marginBottom: SPACING.md }}>
      {icon}
    </div>
    <Heading as="h3" size="lg" weight="bold" style={{ marginBottom: SPACING.sm }}>
      {title}
    </Heading>
    <Text size="base" style={{ marginBottom: SPACING.lg }}>
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
    <Flex direction="column" align="center" style={{ textAlign: 'center', marginBottom: SPACING.lg }}>
      <Heading as="h3" size="xl" weight="bold" style={{ marginBottom: SPACING.sm }}>
        {name}
      </Heading>
      <Text size="2xl" weight="extrabold" color="primary">
        ₹{price}
      </Text>
      <Text size="sm" color="secondary" style={{ marginTop: SPACING.xs }}>
        {description}
      </Text>
    </Flex>
    
    <Flex direction="column" gap="md" style={{ marginBottom: SPACING.lg }}>
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
    <Heading as="h3" size="xl" weight="bold" style={{ textAlign: 'center', marginBottom: SPACING.lg }}>
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
    <Flex direction="column" align="flex-start" style={{ marginTop: SPACING.md }}>
      <Text size="sm" weight="semibold">{author}</Text>
      <Text size="xs" color="tertiary">{role}</Text>
    </Flex>
  </TestimonialCard>
);

export const PremiumHeader = ({ title, subtitle, ...props }) => (
  <header {...props} style={{ 
    background: `linear-gradient(135deg, ${COLORS.primary[500]} 0%, ${COLORS.secondary[500]} 100%)`, 
    padding: `${SPACING.lg} ${SPACING.md}`,
    borderRadius: `${BORDERRADIUS.lg} ${BORDERRADIUS.lg} 0 0`,
    color: COLORS.text.inverse,
    textAlign: 'center'
  }}>
    <Heading as="h2" size="xl" weight="bold" style={{ margin: 0, color: 'white' }}>
      {title}
    </Heading>
    {subtitle && (
      <Text size="lg" style={{ marginTop: SPACING.sm, color: 'rgba(255,255,255,0.9)' }}>
        {subtitle}
      </Text>
    )}
  </header>
);

export const PremiumTransactionItem = ({ type, amount, date, status, description, ...props }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return COLORS.status.success;
      case 'pending': return COLORS.status.warning;
      case 'failed': return COLORS.status.danger;
      default: return COLORS.text.tertiary;
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
    <PremiumCard interactive elevation="sm" style={{ marginBottom: SPACING.sm, border: 'none' }}>
      <Flex justify="space-between" align="center">
        <Flex align="center" gap="md">
          <div style={{ fontSize: TYPOGRAPHY.fontSize.xl }}>
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
          <div style={{ marginTop: SPACING.xs }}>
            <Text size="xs" style={{ color: getStatusColor(status) }}>
              {status}
            </Text>
          </div>
        </Flex>
      </Flex>
    </PremiumCard>
  );
};