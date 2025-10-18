import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../utils/api';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { 
  AppLayout, 
  MainContent, 
  Input, 
  Button, 
  FormGroup, 
  Label, 
  Text, 
  Flex
} from '../styles/styledComponents';
import Header from '../components/PremiumHeader';

const ProfilePageContainer = styled(MainContent)`
  padding-top: 0;
`;

const ProfileCard = styled.div`
  background: ${theme.colors.surface.primary};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.lg};
  border: 1px solid ${theme.colors.neutral[200]};
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
`;

const ProfileAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.secondary[500]});
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.md};
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.text.inverse};
`;

const Profile = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await userAPI.updateProfile(name);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
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

  return (
    <AppLayout>
      <Header title="My Profile" showBack={true} />
      <ProfilePageContainer>
        <ProfileHeader>
          <ProfileAvatar>
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </ProfileAvatar>
          <Text size="xl" weight="bold">{user.name}</Text>
          <Text size="sm" color="secondary">{user.mobile}</Text>
        </ProfileHeader>

        <ProfileCard>
          <Text size="lg" weight="bold" style={{ marginBottom: theme.spacing.lg }}>
            Personal Information
          </Text>
          
          {error && (
            <div style={{ 
              backgroundColor: `${theme.colors.status.danger}20`,
              color: theme.colors.status.danger,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.md
            }}>
              <Text size="sm">{error}</Text>
            </div>
          )}
          
          {success && (
            <div style={{ 
              backgroundColor: `${theme.colors.status.success}20`,
              color: theme.colors.status.success,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.md
            }}>
              <Text size="sm">{success}</Text>
            </div>
          )}
          
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editing}
              placeholder="Enter your full name"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="text"
              value={user.mobile}
              disabled={true}
              placeholder="Mobile number"
            />
          </FormGroup>
          
          <Flex gap="md" style={{ marginTop: theme.spacing.lg }}>
            {editing ? (
              <>
                <Button 
                  variant="primary" 
                  onClick={handleSave} 
                  disabled={loading}
                  premium={true}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setEditing(false);
                    setName(user.name);
                    setError('');
                    setSuccess('');
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                variant="primary" 
                onClick={() => setEditing(true)}
                premium={true}
              >
                Edit Profile
              </Button>
            )}
          </Flex>
        </ProfileCard>

        <ProfileCard>
          <Text size="lg" weight="bold" style={{ marginBottom: theme.spacing.lg }}>
            Account Information
          </Text>
          
          <Flex direction="column" gap="md">
            <Flex justify="space-between">
              <Text color="secondary">Account Balance</Text>
              <Text weight="bold" color="primary">
                ₹{user.balance?.toFixed(2) || '0.00'}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="secondary">Total Invested</Text>
              <Text weight="bold">
                ₹{user.total_invested?.toFixed(2) || '0.00'}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="secondary">Total Withdrawn</Text>
              <Text weight="bold">
                ₹{user.total_withdrawn?.toFixed(2) || '0.00'}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="secondary">Joined On</Text>
              <Text>
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </Text>
            </Flex>
          </Flex>
        </ProfileCard>

        <ProfileCard>
          <Text size="lg" weight="bold" style={{ marginBottom: theme.spacing.lg }}>
            Referral Program
          </Text>
          
          <Flex direction="column" gap="md">
            <Text size="sm" color="secondary">
              Share your referral link and earn when your friends join Goldmine Pro.
            </Text>
            
            <Flex gap="md" style={{ marginTop: theme.spacing.md }}>
              <Button 
                variant="primary" 
                onClick={copyReferralLink}
                premium={true}
                fullWidth
              >
                Copy Referral Link
              </Button>
            </Flex>
          </Flex>
        </ProfileCard>

        <ProfileCard>
          <Text size="lg" weight="bold" style={{ marginBottom: theme.spacing.lg }}>
            Security
          </Text>
          
          <Flex direction="column" gap="md">
            <Flex justify="space-between" align="center">
              <div>
                <Text size="sm" weight="semibold">Login Security</Text>
                <Text size="xs" color="secondary">2-step verification not enabled</Text>
              </div>
              <Button variant="secondary" size="sm">
                Enable
              </Button>
            </Flex>
            
            <Flex justify="space-between" align="center">
              <div>
                <Text size="sm" weight="semibold">Password</Text>
                <Text size="xs" color="secondary">Last changed recently</Text>
              </div>
              <Button variant="secondary" size="sm">
                Change
              </Button>
            </Flex>
          </Flex>
        </ProfileCard>

        <Flex justify="center" style={{ marginTop: theme.spacing.xl }}>
          <Button 
            variant="danger" 
            onClick={logout}
            size="lg"
          >
            Logout
          </Button>
        </Flex>
      </ProfilePageContainer>
    </AppLayout>
  );
};

export default Profile;