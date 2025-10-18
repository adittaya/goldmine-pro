import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Button, Flex, Text } from '../styles/styledComponents';
import { useAuth } from '../contexts/AuthContext';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, 
    ${theme.colors.primary[500]} 0%, 
    ${theme.colors.secondary[500]} 100%);
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${theme.shadows.md};
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Title = styled.h1`
  color: ${theme.colors.text.inverse};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  margin: 0;
`;

const BackButton = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  color: ${theme.colors.text.inverse};
  min-width: 40px;
  min-height: 40px;
  padding: ${theme.spacing.xs};
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const UserBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  color: ${theme.colors.text.inverse};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const Header = ({ title, showBack = false, showUser = true, onBack }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <HeaderContainer>
      <Flex align="center" justify="space-between" style={{ width: '100%' }}>
        <Flex align="center" gap="md">
          {showBack && (
            <BackButton onClick={handleBack}>
              ←
            </BackButton>
          )}
          <Title>{title}</Title>
        </Flex>
        
        {showUser && user && (
          <UserActions>
            <UserBadge>
              <span>👤</span>
              <Text size="sm" weight="medium" style={{ color: 'white' }}>
                {user.name}
              </Text>
            </UserBadge>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleLogout}
              style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            >
              Logout
            </Button>
          </UserActions>
        )}
      </Flex>
    </HeaderContainer>
  );
};

export default Header;