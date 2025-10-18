import styled, { css } from 'styled-components';
import { COLORS, SPACING, BORDERRADIUS, SHADOWS, TYPOGRAPHY, BREAKPOINTS, TRANSITIONS } from './theme';

// Container Component
export const Container = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 ${SPACING.md};
  
  @media (min-width: ${BREAKPOINTS.md}) {
    max-width: 768px;
    padding: 0 ${SPACING.lg};
  }
  
  @media (min-width: ${BREAKPOINTS.lg}) {
    max-width: 1024px;
  }
`;

// Card Component
export const Card = styled.div`
  background: ${COLORS.surface.primary};
  border-radius: ${BORDERRADIUS.lg};
  box-shadow: ${SHADOWS.sm};
  padding: ${SPACING.lg};
  border: 1px solid ${COLORS.neutral[200]};
  transition: ${TRANSITIONS.normal};
  position: relative;
  overflow: hidden;
  
  ${props => props.elevated && css`
    box-shadow: ${SHADOWS.lg};
  `}
  
  ${props => props.interactive && css`
    cursor: pointer;
    &:hover {
      box-shadow: ${SHADOWS.md};
      transform: translateY(-2px);
    }
    &:active {
      transform: translateY(0);
    }
  `}
  
  ${props => props.premium && css`
    background: linear-gradient(135deg, 
      ${COLORS.surface.primary} 0%, 
      ${COLORS.neutral[50]} 100%);
    border: 1px solid rgba(14, 165, 233, 0.1);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        ${COLORS.primary[500]}, 
        ${COLORS.secondary[500]});
      z-index: 1;
    }
  `}
`;

// Button Component
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${SPACING.xs};
  padding: ${SPACING.sm} ${SPACING.md};
  border-radius: ${BORDERRADIUS.md};
  font-weight: ${TYPOGRAPHY.fontWeight.semibold};
  font-size: ${TYPOGRAPHY.fontSize.base};
  line-height: ${TYPOGRAPHY.lineHeight.tight};
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: ${TRANSITIONS.fast};
  min-height: 44px;
  min-width: 44px;
  user-select: none;
  
  ${props => props.fullWidth && css`
    display: flex;
    width: 100%;
  `}
  
  ${props => props.size === 'sm' && css`
    padding: ${SPACING.xs} ${SPACING.sm};
    font-size: ${TYPOGRAPHY.fontSize.sm};
    min-height: 36px;
  `}
  
  ${props => props.size === 'lg' && css`
    padding: ${SPACING.md} ${SPACING.lg};
    font-size: ${TYPOGRAPHY.fontSize.lg};
    min-height: 52px;
  `}
  
  ${props => props.variant === 'primary' && css`
    background-color: ${COLORS.primary[600]};
    color: ${COLORS.text.inverse};
    &:hover {
      background-color: ${COLORS.primary[700]};
    }
    &:active {
      background-color: ${COLORS.primary[800]};
    }
    &:disabled {
      background-color: ${COLORS.neutral[300]};
      cursor: not-allowed;
      opacity: 0.6;
    }
  `}
  
  ${props => props.variant === 'secondary' && css`
    background-color: ${COLORS.neutral[200]};
    color: ${COLORS.text.primary};
    &:hover {
      background-color: ${COLORS.neutral[300]};
    }
    &:active {
      background-color: ${COLORS.neutral[400]};
    }
    &:disabled {
      background-color: ${COLORS.neutral[100]};
      cursor: not-allowed;
      opacity: 0.6;
    }
  `}
  
  ${props => props.variant === 'success' && css`
    background-color: ${COLORS.status.success};
    color: ${COLORS.text.inverse};
    &:hover {
      background-color: #0da271;
    }
    &:active {
      background-color: ${COLORS.success[700]};
    }
    &:disabled {
      background-color: ${COLORS.success[200]};
      cursor: not-allowed;
      opacity: 0.6;
    }
  `}
  
  ${props => props.variant === 'warning' && css`
    background-color: ${COLORS.status.warning};
    color: ${COLORS.text.primary};
    &:hover {
      background-color: #e69008;
    }
    &:active {
      background-color: ${COLORS.warning[700]};
    }
    &:disabled {
      background-color: ${COLORS.warning[200]};
      cursor: not-allowed;
      opacity: 0.6;
    }
  `}
  
  ${props => props.variant === 'danger' && css`
    background-color: ${COLORS.status.danger};
    color: ${COLORS.text.inverse};
    &:hover {
      background-color: #dc2626;
    }
    &:active {
      background-color: ${COLORS.danger[700]};
    }
    &:disabled {
      background-color: ${COLORS.danger[200]};
      cursor: not-allowed;
      opacity: 0.6;
    }
  `}
  
  ${props => props.premium && css`
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, 
      ${COLORS.primary[600]}, 
      ${COLORS.secondary[600]});
    color: ${COLORS.text.inverse};
    
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
  `}
`;

// Input Component
export const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 2px solid ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.base};
  line-height: ${theme.typography.lineHeight.normal};
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.surface.primary};
  transition: ${theme.transitions.fast};
  min-height: 48px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
  }
  
  &::placeholder {
    color: ${theme.colors.text.tertiary};
  }
  
  &[type="number"] {
    -moz-appearance: textfield;
  }
  
  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

// TextArea Component
export const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 2px solid ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.base};
  line-height: ${theme.typography.lineHeight.normal};
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.surface.primary};
  transition: ${theme.transitions.fast};
  min-height: 120px;
  resize: vertical;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
  }
  
  &::placeholder {
    color: ${theme.colors.text.tertiary};
  }
`;

// Select Component
export const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 2px solid ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.base};
  line-height: ${theme.typography.lineHeight.normal};
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.surface.primary};
  transition: ${theme.transitions.fast};
  min-height: 48px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right ${theme.spacing.md} center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
  }
  
  &::-ms-expand {
    display: none;
  }
`;

// Label Component
export const Label = styled.label`
  display: block;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.sm};
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

// Form Group Component
export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

// Text Component
export const Text = styled.span`
  color: ${props => theme.colors.text[props.color] || theme.colors.text.primary};
  font-size: ${props => theme.typography.fontSize[props.size] || theme.typography.fontSize.base};
  font-weight: ${props => theme.typography.fontWeight[props.weight] || theme.typography.fontWeight.normal};
  line-height: ${props => theme.typography.lineHeight[props.lineHeight] || theme.typography.lineHeight.normal};
  text-align: ${props => props.align || 'left'};
  
  ${props => props.ellipsis && css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`;

// Heading Component
export const Heading = styled.h1`
  color: ${theme.colors.text.primary};
  font-size: ${props => theme.typography.fontSize[props.size] || theme.typography.fontSize['2xl']};
  font-weight: ${props => theme.typography.fontWeight[props.weight] || theme.typography.fontWeight.bold};
  line-height: ${props => theme.typography.lineHeight.tight};
  margin: 0;
  
  ${props => props.as === 'h2' && css`
    font-size: ${theme.typography.fontSize.xl};
  `}
  
  ${props => props.as === 'h3' && css`
    font-size: ${theme.typography.fontSize.lg};
  `}
  
  ${props => props.as === 'h4' && css`
    font-size: ${theme.typography.fontSize.base};
  `}
`;

// Grid Component
export const Grid = styled.div`
  display: grid;
  gap: ${SPACING.md};
  
  ${props => props.cols && css`
    grid-template-columns: repeat(${props.cols}, 1fr);
  `}
  
  ${props => props.cols === 1 && css`
    grid-template-columns: 1fr;
  `}
  
  ${props => props.cols === 2 && css`
    grid-template-columns: repeat(2, 1fr);
  `}
  
  ${props => props.cols === 3 && css`
    grid-template-columns: repeat(3, 1fr);
  `}
  
  ${props => props.cols === 4 && css`
    grid-template-columns: repeat(4, 1fr);
  `}
  
  @media (min-width: ${BREAKPOINTS.md}) {
    ${props => props.colsMd && css`
      grid-template-columns: repeat(${props.colsMd}, 1fr);
    `}
  }
`;

// Flex Component
export const Flex = styled.div`
  display: flex;
  ${props => props.direction && css`flex-direction: ${props.direction};`}
  ${props => props.justify && css`justify-content: ${props.justify};`}
  ${props => props.align && css`align-items: ${props.align};`}
  ${props => props.wrap && css`flex-wrap: ${props.wrap};`}
  ${props => props.gap && css`gap: ${theme.spacing[props.gap] || props.gap};`}
`;

// Layout Components
export const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: ${theme.colors.surface.tertiary};
`;

export const Header = styled.header`
  background: ${theme.colors.surface.primary};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  ${props => props.premium && css`
    background: linear-gradient(135deg, 
      ${theme.colors.primary[500]}, 
      ${theme.colors.secondary[500]});
    color: white;
    
    ${Heading} {
      color: white;
    }
  `}
`;

export const MainContent = styled.main`
  flex: 1;
  padding: ${theme.spacing.lg} ${theme.spacing.md};
  padding-bottom: calc(${theme.spacing['2xl']} + env(safe-area-inset-bottom, 20px));
  background: ${theme.colors.surface.tertiary};
`;

export const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: ${theme.colors.surface.primary};
  border-top: 1px solid ${theme.colors.neutral[200]};
  z-index: 1000;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  padding-bottom: calc(${theme.spacing.sm} + env(safe-area-inset-bottom, 0px));
`;

export const NavItem = styled.a`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xs} 0;
  text-decoration: none;
  color: ${theme.colors.text.tertiary};
  transition: ${theme.transitions.fast};
  min-height: 56px;
  position: relative;
  
  ${props => props.active && css`
    color: ${theme.colors.primary[600]};
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      width: 4px;
      height: 4px;
      background: ${theme.colors.primary[600]};
      border-radius: ${theme.borderRadius.full};
    }
  `}
`;

// Stat Card Component
export const StatCard = styled(Card)`
  text-align: center;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.surface.primary};
  border-radius: ${theme.borderRadius['2xl']};
  
  ${props => props.premium && css`
    background: linear-gradient(135deg, 
      ${theme.colors.primary[500]} 0%, 
      ${theme.colors.secondary[500]} 100%);
    color: white;
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
      color: white;
      position: relative;
      z-index: 2;
    }
  `}
`;

// List Item Component
export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.neutral[100]};
  transition: ${theme.transitions.fast};
  
  &:last-child {
    border-bottom: none;
  }
  
  ${props => props.interactive && css`
    cursor: pointer;
    &:hover {
      background: ${theme.colors.neutral[50]};
    }
  `}
`;

// Loading Component
export const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${theme.colors.neutral[200]};
  border-top: 2px solid ${theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Toast Component
export const Toast = styled.div`
  position: fixed;
  bottom: calc(80px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.colors.neutral[800]};
  color: ${theme.colors.text.inverse};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  ${props => props.variant === 'success' && css`
    background: ${theme.colors.status.success};
  `}
  
  ${props => props.variant === 'error' && css`
    background: ${theme.colors.status.danger};
  `}
  
  ${props => props.variant === 'warning' && css`
    background: ${theme.colors.status.warning};
    color: ${theme.colors.text.primary};
  `}
`;

// Modal Component
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1500;
  padding: ${theme.spacing.md};
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 100%;
  background: ${theme.colors.surface.primary};
  border-radius: ${theme.borderRadius.xl} ${theme.borderRadius.xl} 0 0;
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.xl};
  animation: slideUp 0.3s ease-out;
  
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

// Badge Component
export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${props => theme.colors.status[props.variant] || theme.colors.neutral[200]};
  color: ${props => badgeColors[props.variant] ? theme.colors.text.inverse : theme.colors.text.primary};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const badgeColors = {
  success: theme.colors.status.success,
  warning: theme.colors.status.warning,
  danger: theme.colors.status.danger,
  info: theme.colors.status.info,
  primary: theme.colors.status.primary,
};

// Trust Badge Component
export const TrustBadge = styled(Badge)`
  background: ${theme.colors.status.success};
  color: ${theme.colors.text.inverse};
`;

// Security Badge Component
export const SecurityBadge = styled(Badge)`
  background: ${theme.colors.status.info};
  color: ${theme.colors.text.inverse};
`;