import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { COLORS, SPACING, BORDERRADIUS, SHADOWS, TYPOGRAPHY, BREAKPOINTS, TRANSITIONS } from '../styles/theme';
import { Button, Flex, Text } from '../styles/styledComponents';
import { useAuth } from '../contexts/AuthContext';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, 
    ${COLORS.primary[500]} 0%, 
    ${COLORS.secondary[500]} 100%);
  padding: ${SPACING.md} ${SPACING.lg};
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${SHADOWS.md};
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.sm};
`;

const Title = styled.h1`
  color: ${COLORS.text.inverse};
  font-size: ${TYPOGRAPHY.fontSize.xl};
  font-weight: ${TYPOGRAPHY.fontWeight.bold};
  margin: 0;
`;

const BackButton = styled(Button)`
  background: rgba(255, 255, 255, 0.2);
  color: ${COLORS.text.inverse};
  min-width: 40px;
  min-height: 40px;
  padding: ${SPACING.xs};
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.sm};
`;

const UserBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  color: ${COLORS.text.inverse};
  padding: ${SPACING.xs} ${SPACING.sm};
  border-radius: ${BORDERRADIUS.full};
  font-size: ${TYPOGRAPHY.fontSize.sm};
  font-weight: ${TYPOGRAPHY.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: ${SPACING.xs};
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