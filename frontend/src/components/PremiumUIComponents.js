import React from 'react';
import styled from 'styled-components';
import { Card, Text, Heading, Button, Flex, StatCard } from './styledComponents';

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