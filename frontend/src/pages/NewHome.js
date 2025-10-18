import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { 
  AppLayout, 
  MainContent, 
  Button, 
  Flex, 
  Text 
} from '../styles/styledComponents';
import Header from '../components/PremiumHeader';
import {
  PremiumFeatureCard,
  PremiumTrustSection,
  PremiumTestimonialCard
} from '../components/PremiumUIComponents';

const HomePageContainer = styled(MainContent)`
  padding-top: 0;
  background: linear-gradient(135deg, 
    ${theme.colors.primary[50]} 0%, 
    ${theme.colors.secondary[50]} 100%);
`;

const HeroSection = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const HeroTitle = styled(Text)`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.extrabold};
  margin-bottom: ${theme.spacing.md};
  background: linear-gradient(135deg, 
    ${theme.colors.primary[600]}, 
    ${theme.colors.secondary[600]});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (min-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['4xl']};
  }
`;

const HeroSubtitle = styled(Text)`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xl};
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const FeaturesSection = styled.div`
  margin: ${theme.spacing.xl} 0;
`;

const TestimonialsSection = styled.div`
  margin: ${theme.spacing.xl} 0;
`;

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <Header 
        title="Goldmine Pro" 
        showBack={false} 
        showUser={!!user}
      />
      
      <HomePageContainer>
        {/* Hero Section */}
        <HeroSection>
          <HeroTitle>Grow Your Wealth with Goldmine Pro</HeroTitle>
          <HeroSubtitle>
            Join thousands of investors earning daily returns on our secure, 
            high-yield investment platform.
          </HeroSubtitle>
          
          <Flex justify="center" gap="md" wrap="wrap">
            {!user ? (
              <>
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => navigate('/login')}
                  premium
                >
                  Login to Account
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  premium
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={() => navigate('/plans')}
                >
                  View Plans
                </Button>
              </>
            )}
          </Flex>
        </HeroSection>

        {/* Trust Section */}
        <PremiumTrustSection />

        {/* Features Section */}
        <FeaturesSection>
          <Text 
            size="2xl" 
            weight="bold" 
            style={{ 
              textAlign: 'center', 
              marginBottom: theme.spacing.xl,
              display: 'block'
            }}
          >
            Why Choose Goldmine Pro?
          </Text>
          
          <Flex direction="column" gap="lg">
            <PremiumFeatureCard
              title="Daily Income"
              description="Earn returns every day with our automated income distribution system."
              icon={<span style={{ fontSize: '2rem' }}>💰</span>}
              buttonLabel={user ? "View Earnings" : "Learn More"}
              onButtonClick={() => user ? navigate('/dashboard') : navigate('/plans')}
            />
            
            <PremiumFeatureCard
              title="Secure Platform"
              description="Bank-level security with 256-bit encryption and secure transactions."
              icon={<span style={{ fontSize: '2rem' }}>🔒</span>}
              buttonLabel="Security Info"
            />
            
            <PremiumFeatureCard
              title="Instant Withdrawals"
              description="Withdraw your earnings quickly with our streamlined approval process."
              icon={<span style={{ fontSize: '2rem' }}>⚡</span>}
              buttonLabel="Withdraw Now"
              onButtonClick={() => user && navigate('/withdrawal')}
            />
            
            <PremiumFeatureCard
              title="High Returns"
              description="Investment plans with returns up to 200% of your initial investment."
              icon={<span style={{ fontSize: '2rem' }}>📈</span>}
              buttonLabel="View Plans"
              onButtonClick={() => navigate('/plans')}
            />
          </Flex>
        </FeaturesSection>

        {/* Testimonials Section */}
        {!user && (
          <TestimonialsSection>
            <Text 
              size="2xl" 
              weight="bold" 
              style={{ 
                textAlign: 'center', 
                marginBottom: theme.spacing.xl,
                display: 'block'
              }}
            >
              What Our Investors Say
            </Text>
            
            <Flex direction="column" gap="md">
              <PremiumTestimonialCard
                quote="I've been using Goldmine Pro for 6 months and have seen consistent daily returns. The platform is reliable and secure."
                author="Rajesh Kumar"
                role="Investor • 2 years"
              />
              
              <PremiumTestimonialCard
                quote="The referral system has helped me earn extra income while my friends also benefit from the investment opportunities."
                author="Priya Sharma"
                role="Investor • 1 year"
              />
            </Flex>
          </TestimonialsSection>
        )}

        {/* CTA Section */}
        <Flex 
          direction="column" 
          align="center" 
          style={{ 
            textAlign: 'center', 
            padding: `${theme.spacing.xl} 0`,
            background: theme.colors.surface.primary,
            borderRadius: theme.borderRadius.xl,
            margin: `${theme.spacing.xl} 0`
          }}
        >
          <Text size="2xl" weight="bold" style={{ marginBottom: theme.spacing.md }}>
            Ready to Start Investing?
          </Text>
          <Text 
            size="lg" 
            color="secondary" 
            style={{ marginBottom: theme.spacing.lg, maxWidth: '600px' }}
          >
            Join thousands of investors already growing their wealth with Goldmine Pro. 
            Sign up today and start earning daily returns.
          </Text>
          
          <Flex gap="md">
            {!user ? (
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/register')}
                premium
              >
                Start Investing Now
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                premium
              >
                View My Account
              </Button>
            )}
          </Flex>
        </Flex>
      </HomePageContainer>
    </AppLayout>
  );
};

export default Home;