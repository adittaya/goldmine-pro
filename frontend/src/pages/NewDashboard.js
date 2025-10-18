import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../utils/api';
import { 
  AppLayout, 
  MainContent, 
  LoadingSpinner, 
  Flex, 
  Text 
} from '../styles/styledComponents';
import Header from '../components/PremiumHeader';
import {
  PremiumDashboardCard,
  PremiumTrustSection,
  PremiumTransactionItem
} from '../components/PremiumUIComponents';

const DashboardContainer = MainContent; // Use the component directly

const StatsGrid = (props) => {
  return React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)',
      gap: '16px',
      marginBottom: '24px'
    },
    className: 'stats-grid'
  }, props.children);
};

const Section = (props) => {
  return React.createElement('div', {
    style: {
      marginBottom: '48px'
    },
    className: 'section'
  }, props.children);
};

const SectionTitle = (props) => {
  return React.createElement(Text, {
    size: "xl",
    weight: "bold",
    style: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#0f172a',
      display: 'block'
    }
  }, props.children);
};

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await userAPI.getDashboard();
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
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

  if (loading) return React.createElement(AppLayout, null,
    React.createElement(Header, { title: "Dashboard", showBack: false }),
    React.createElement(DashboardContainer, null,
      React.createElement(Flex, {
        justify: "center",
        align: "center",
        style: { padding: '48px' }
      },
        React.createElement(LoadingSpinner)
      )
    )
  );

  if (error) return React.createElement(AppLayout, null,
    React.createElement(Header, { title: "Dashboard", showBack: false }),
    React.createElement(DashboardContainer, null,
      React.createElement(Flex, {
        justify: "center",
        align: "center",
        style: { padding: '48px' }
      },
        React.createElement(Text, { color: "danger" }, error)
      )
    )
  );

  return React.createElement(AppLayout, null,
    React.createElement(Header, { title: "Dashboard", showBack: false }),
    React.createElement(DashboardContainer, null,
      // Premium Trust Section
      React.createElement(PremiumTrustSection),

      // Stats Grid
      React.createElement(StatsGrid, null,
        React.createElement(PremiumDashboardCard, {
          title: "Wallet Balance",
          value: `₹${dashboardData?.user?.balance?.toFixed(2) || '0.00'}`,
          subtitle: "Available for withdrawal",
          premium: true
        }),
        React.createElement(PremiumDashboardCard, {
          title: "Total Invested",
          value: `₹${dashboardData?.user?.total_invested?.toFixed(2) || '0.00'}`,
          subtitle: "Lifetime investments"
        }),
        React.createElement(PremiumDashboardCard, {
          title: "Total Withdrawn",
          value: `₹${dashboardData?.user?.total_withdrawn?.toFixed(2) || '0.00'}`,
          subtitle: "Lifetime withdrawals"
        })
      ),

      // Quick Actions
      React.createElement(Section, null,
        React.createElement(SectionTitle, null, "Quick Actions"),
        React.createElement(Flex, {
          gap: "md",
          wrap: "wrap"
        },
          React.createElement('button', {
            className: "btn btn-primary",
            onClick: copyReferralLink,
            style: {
              background: 'linear-gradient(135deg, #0284c7, #0d9488)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              flex: 1,
              minWidth: '120px'
            }
          }, "🎁 Share Referral"),

          // Add more quick action buttons
          React.createElement('a', {
            href: "/plans",
            style: {
              background: '#e2e8f0',
              color: '#0f172a',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              textDecoration: 'none',
              flex: 1,
              minWidth: '120px',
              textAlign: 'center'
            }
          }, "💰 Invest Now"),

          React.createElement('a', {
            href: "/withdrawal",
            style: {
              background: '#e2e8f0',
              color: '#0f172a',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              textDecoration: 'none',
              flex: 1,
              minWidth: '120px',
              textAlign: 'center'
            }
          }, "💳 Withdraw")
        )
      ),

      // Active Plans
      dashboardData?.activePlans && dashboardData.activePlans.length > 0 && React.createElement(Section, null,
        React.createElement(SectionTitle, null, "Active Investment Plans"),
        React.createElement('div', null,
          dashboardData.activePlans.map((plan) => 
            React.createElement('div', { key: plan.id, style: { marginBottom: '16px' } },
              React.createElement('div', {
                style: {
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #e2e8f0'
                }
              },
                React.createElement(Flex, {
                  justify: "space-between",
                  align: "center"
                },
                  React.createElement('div', null,
                    React.createElement(Text, {
                      size: "lg",
                      weight: "semibold"
                    }, plan.plan_name),
                    React.createElement(Flex, {
                      gap: "lg",
                      style: { marginTop: '4px' }
                    },
                      React.createElement(Text, {
                        size: "sm",
                        color: "success"
                      }, "Daily: ₹" + plan.daily_income),
                      React.createElement(Text, {
                        size: "sm",
                        color: "secondary"
                      }, "Ends: " + new Date(plan.end_date).toLocaleDateString())
                    )
                  ),
                  React.createElement(Text, {
                    size: "sm",
                    weight: "semibold",
                    color: "success"
                  }, "Active")
                )
              )
            )
          )
        )
      ),

      // Recent Transactions
      React.createElement(Section, null,
        React.createElement(SectionTitle, null, "Recent Transactions"),
        dashboardData?.transactions && dashboardData.transactions.length > 0
          ? React.createElement('div', null,
              dashboardData.transactions.slice(0, 5).map((transaction) =>
                React.createElement(PremiumTransactionItem, {
                  key: transaction.id,
                  type: transaction.type,
                  amount: transaction.amount,
                  date: new Date(transaction.created_at).toLocaleDateString(),
                  status: transaction.type === 'daily_income' ? 'completed' : transaction.type,
                  description: transaction.description
                })
              )
            )
          : React.createElement(Flex, {
              justify: "center",
              align: "center",
              style: { padding: '48px' }
            },
              React.createElement(Text, { color: "tertiary" }, "No recent transactions")
            )
      ),

      // Recent Withdrawals
      dashboardData?.withdrawals && dashboardData.withdrawals.length > 0 && React.createElement(Section, null,
        React.createElement(SectionTitle, null, "Recent Withdrawals"),
        React.createElement('div', null,
          dashboardData.withdrawals.slice(0, 3).map((withdrawal) =>
            React.createElement('div', { key: withdrawal.id, style: { marginBottom: '16px' } },
              React.createElement('div', {
                style: {
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #e2e8f0'
                }
              },
                React.createElement(Flex, {
                  justify: "space-between",
                  align: "center"
                },
                  React.createElement('div', null,
                    React.createElement(Text, {
                      size: "lg",
                      weight: "semibold"
                    }, "₹" + withdrawal.amount),
                    React.createElement(Text, {
                      size: "sm",
                      color: "secondary",
                      display: "block"
                    }, new Date(withdrawal.created_at).toLocaleDateString())
                  ),
                  React.createElement(Text, {
                    size: "sm",
                    weight: "semibold",
                    style: {
                      background:
                        withdrawal.status === 'approved' ? '#10b98120' :
                        withdrawal.status === 'pending' ? '#f59e0b20' :
                        '#ef444420',
                      color:
                        withdrawal.status === 'approved' ? '#10b981' :
                        withdrawal.status === 'pending' ? '#f59e0b' :
                        '#ef4444',
                      padding: '4px 8px',
                      borderRadius: '9999px'
                    }
                  }, withdrawal.status)
                )
              )
            )
          )
        )
      )
    )
  );
};

export default Dashboard;