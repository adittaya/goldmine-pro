import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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

const HomePageContainer = MainContent; // Use the component directly instead of styled

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return React.createElement(AppLayout, null,
    React.createElement(Header, { 
      title: "Goldmine Pro", 
      showBack: false, 
      showUser: !!user 
    }),
    
    React.createElement(HomePageContainer, { 
      style: { 
        padding: "0", 
        background: "linear-gradient(135deg, #f0f9ff 0%, #f0fdfa 100%)" 
      } 
    },
      // Hero Section
      React.createElement('div', {
        style: {
          textAlign: 'center',
          padding: '48px 16px',
          marginBottom: '48px'
        }
      },
        React.createElement(Text, {
          size: "3xl",
          weight: "extrabold",
          style: {
            fontSize: '28px',
            background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '16px',
            display: 'block'
          }
        }, "Grow Your Wealth with Goldmine Pro"),
        
        React.createElement(Text, {
          size: "lg",
          color: "secondary",
          style: {
            marginBottom: '48px',
            lineHeight: '1.625'
          }
        }, "Join thousands of investors earning daily returns on our secure, high-yield investment platform."),
        
        React.createElement(Flex, {
          justify: "center",
          gap: "md",
          wrap: "wrap"
        },
          !user 
            ? [
                React.createElement(Button, {
                  key: "login",
                  variant: "primary", 
                  size: "lg", 
                  onClick: () => navigate('/login'),
                  premium: true
                }, "Login to Account"),
                React.createElement(Button, {
                  key: "register",
                  variant: "secondary", 
                  size: "lg", 
                  onClick: () => navigate('/register')
                }, "Create Account")
              ]
            : [
                React.createElement(Button, {
                  key: "dashboard",
                  variant: "primary", 
                  size: "lg", 
                  onClick: () => navigate('/dashboard'),
                  premium: true
                }, "Go to Dashboard"),
                React.createElement(Button, {
                  key: "plans",
                  variant: "secondary", 
                  size: "lg", 
                  onClick: () => navigate('/plans')
                }, "View Plans")
              ]
        )
      ),

      // Trust Section
      React.createElement(PremiumTrustSection),

      // Features Section
      React.createElement('div', {
        style: { margin: '48px 0' }
      },
        React.createElement(Text, {
          size: "2xl",
          weight: "bold",
          style: {
            textAlign: 'center',
            marginBottom: '48px',
            display: 'block'
          }
        }, "Why Choose Goldmine Pro?"),
        
        React.createElement(Flex, {
          direction: "column",
          gap: "lg"
        },
          React.createElement(PremiumFeatureCard, {
            key: "feature1",
            title: "Daily Income",
            description: "Earn returns every day with our automated income distribution system.",
            icon: React.createElement('span', { style: { fontSize: '2rem' }}, "💰"),
            buttonLabel: user ? "View Earnings" : "Learn More",
            onButtonClick: () => user ? navigate('/dashboard') : navigate('/plans')
          }),
          
          React.createElement(PremiumFeatureCard, {
            key: "feature2",
            title: "Secure Platform",
            description: "Bank-level security with 256-bit encryption and secure transactions.",
            icon: React.createElement('span', { style: { fontSize: '2rem' }}, "🔒"),
            buttonLabel: "Security Info"
          }),
          
          React.createElement(PremiumFeatureCard, {
            key: "feature3",
            title: "Instant Withdrawals",
            description: "Withdraw your earnings quickly with our streamlined approval process.",
            icon: React.createElement('span', { style: { fontSize: '2rem' }}, "⚡"),
            buttonLabel: "Withdraw Now",
            onButtonClick: () => user && navigate('/withdrawal')
          }),
          
          React.createElement(PremiumFeatureCard, {
            key: "feature4",
            title: "High Returns",
            description: "Investment plans with returns up to 200% of your initial investment.",
            icon: React.createElement('span', { style: { fontSize: '2rem' }}, "📈"),
            buttonLabel: "View Plans",
            onButtonClick: () => navigate('/plans')
          })
        )
      ),

      // Testimonials Section (only for non-logged in users)
      !user && React.createElement('div', {
        style: { margin: '48px 0' }
      },
        React.createElement(Text, {
          size: "2xl",
          weight: "bold",
          style: {
            textAlign: 'center',
            marginBottom: '48px',
            display: 'block'
          }
        }, "What Our Investors Say"),
        
        React.createElement(Flex, {
          direction: "column",
          gap: "md"
        },
          React.createElement(PremiumTestimonialCard, {
            key: "testimonial1",
            quote: "I've been using Goldmine Pro for 6 months and have seen consistent daily returns. The platform is reliable and secure.",
            author: "Rajesh Kumar",
            role: "Investor • 2 years"
          }),
          
          React.createElement(PremiumTestimonialCard, {
            key: "testimonial2",
            quote: "The referral system has helped me earn extra income while my friends also benefit from the investment opportunities.",
            author: "Priya Sharma",
            role: "Investor • 1 year"
          })
        )
      ),

      // CTA Section
      React.createElement(Flex, {
        direction: "column",
        align: "center",
        style: {
          textAlign: 'center',
          padding: '48px 0',
          background: '#ffffff',
          borderRadius: '24px',
          margin: '48px 0'
        }
      },
        React.createElement(Text, {
          size: "2xl",
          weight: "bold",
          style: { marginBottom: '16px' }
        }, "Ready to Start Investing?"),
        
        React.createElement(Text, {
          size: "lg",
          color: "secondary",
          style: {
            marginBottom: '24px',
            maxWidth: '600px'
          }
        }, "Join thousands of investors already growing their wealth with Goldmine Pro. Sign up today and start earning daily returns."),
        
        React.createElement(Flex, { gap: "md" },
          user 
            ? React.createElement(Button, {
                variant: "primary",
                size: "lg",
                onClick: () => navigate('/dashboard'),
                premium: true
              }, "View My Account")
            : React.createElement(Button, {
                variant: "primary",
                size: "lg",
                onClick: () => navigate('/register'),
                premium: true
              }, "Start Investing Now")
        )
      )
    )
  );
};

export default Home;