'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Tab,
  Tabs,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Badge,
  Paper,
  Stack,
  Divider,
  LinearProgress,
  Tooltip,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Person,
  Pending,
  CheckCircle,
  Cancel,
  Info,
  Close,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  Badge as BadgeIcon,
  Visibility,
  Check,
  Clear,
  FilterList,
  Refresh,
  MoreVert,
  Download,
  Search,
  Assignment
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      dark: '#4f46e5',
      light: '#818cf8'
    },
    secondary: {
      main: '#8b5cf6',
      dark: '#7c3aed',
      light: '#a78bfa'
    },
    background: {
      default: '#0f0f23',
      paper: '#1e1e3f'
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8'
    },
    success: {
      main: '#10b981',
      dark: '#059669'
    },
    warning: {
      main: '#f59e0b',
      dark: '#d97706'
    },
    error: {
      main: '#ef4444',
      dark: '#dc2626'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }
      }
    }
  }
});

export default function KYCManagementPage() {
  const [tabValue, setTabValue] = useState(0);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [stats, setStats] = useState({});
  const [filterAnchor, setFilterAnchor] = useState(null);

  useEffect(() => {
    fetchKYCData();
  }, [tabValue]);

  const fetchKYCData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      // Fetch applications and stats
      const [applicationsRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/authorities/kyc/pending`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/authorities/kyc/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const applicationsData = await applicationsRes.json();
      const statsData = await statsRes.json();

      if (applicationsData.success) {
        setApplications(applicationsData.data.applications);
      }

      if (statsData.success) {
        setStats(statsData.data.overview);
      }
    } catch (error) {
      console.error('Error fetching KYC data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (touristId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/authorities/kyc/${touristId}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchKYCData();
        setDetailsOpen(false);
      }
    } catch (error) {
      console.error('Error approving KYC:', error);
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/authorities/kyc/${selectedApplication._id}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      if (response.ok) {
        fetchKYCData();
        setRejectOpen(false);
        setDetailsOpen(false);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error rejecting KYC:', error);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'warning', icon: <Pending />, label: 'Pending Review' },
      approved: { color: 'success', icon: <CheckCircle />, label: 'Approved' },
      rejected: { color: 'error', icon: <Cancel />, label: 'Rejected' },
      not_applied: { color: 'default', icon: <Info />, label: 'Not Applied' }
    };

    const config = statusConfig[status] || statusConfig.not_applied;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        variant="outlined"
        size="small"
      />
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 100,
        height: 100,
        background: `linear-gradient(45deg, ${color}20, ${color}05)`,
        borderRadius: '50%',
        transform: 'translate(30px, -30px)'
      }} />
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            background: `linear-gradient(45deg, ${color}40, ${color}20)`,
            color: color
          }}>
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            <Typography variant="h6" color="text.primary" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1e1e3f 50%, #2d1b69 100%)',
        p: 3
      }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h3" fontWeight="bold" sx={{
                  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  KYC Management
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Review and manage tourist verification applications
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Tooltip title="Refresh Data">
                  <IconButton
                    onClick={fetchKYCData}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  sx={{
                    background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                    px: 3
                  }}
                >
                  Export Report
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Applications"
                value={stats.totalTourists || 0}
                icon={<Assignment />}
                color="#6366f1"
                subtitle="All time registrations"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Review"
                value={stats.pending || 0}
                icon={<Pending />}
                color="#f59e0b"
                subtitle="Awaiting verification"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Approved"
                value={stats.approved || 0}
                icon={<CheckCircle />}
                color="#10b981"
                subtitle="Verified tourists"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Rejected"
                value={stats.rejected || 0}
                icon={<Cancel />}
                color="#ef4444"
                subtitle="Failed verification"
              />
            </Grid>
          </Grid>

          {/* Main Content */}
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab
                  label={
                    <Badge badgeContent={stats.pending || 0} color="warning">
                      <span>Pending Applications</span>
                    </Badge>
                  }
                />
                <Tab label="All Applications" />
                <Tab label="Recent Activity" />
              </Tabs>
            </Box>

            <CardContent sx={{ p: 0 }}>
              {loading ? (
                <Box sx={{ p: 4 }}>
                  <LinearProgress sx={{ mb: 2 }} />
                  <Typography align="center" color="text.secondary">
                    Loading KYC applications...
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                  {applications.length === 0 ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                      <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No pending applications
                      </Typography>
                      <Typography color="text.secondary">
                        All applications have been processed
                      </Typography>
                    </Box>
                  ) : (
                    applications.map((application, index) => (
                      <Paper
                        key={application._id}
                        sx={{
                          m: 2,
                          p: 3,
                          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
                          }
                        }}
                      >
                        <Grid container spacing={3} alignItems="center">
                          <Grid item xs={12} sm={6} md={3}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar sx={{
                                bgcolor: 'primary.main',
                                width: 56,
                                height: 56
                              }}>
                                <Person fontSize="large" />
                              </Avatar>
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  {application.fullName || application.username}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  ID: {application._id.slice(-8)}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                  {getStatusChip(application.kycStatus)}
                                </Stack>
                              </Box>
                            </Stack>
                          </Grid>

                          <Grid item xs={12} sm={6} md={3}>
                            <Stack spacing={1}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Email fontSize="small" color="action" />
                                <Typography variant="body2">{application.email}</Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Phone fontSize="small" color="action" />
                                <Typography variant="body2">{application.phone || 'Not provided'}</Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarToday fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {application.kycAppliedAt ? formatDate(application.kycAppliedAt) : 'Recently'}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Grid>

                          <Grid item xs={12} sm={6} md={3}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Profile Completion
                              </Typography>
                              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={application.profileCompletionPercentage || 0}
                                  sx={{
                                    width: 80,
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: 'rgba(255,255,255,0.1)'
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  {application.profileCompletionPercentage || 0}%
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={12} sm={6} md={3}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Visibility />}
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setDetailsOpen(true);
                                }}
                              >
                                Review
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                startIcon={<Check />}
                                onClick={() => handleApprove(application._id)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                color="error"
                                startIcon={<Clear />}
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setRejectOpen(true);
                                }}
                              >
                                Reject
                              </Button>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Application Details Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
            color: 'white'
          }}>
            Tourist Application Details
            <IconButton onClick={() => setDetailsOpen(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 0 }}>
            {selectedApplication && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Personal Information
                      </Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Full Name</Typography>
                          <Typography variant="body1">{selectedApplication.fullName}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Email</Typography>
                          <Typography variant="body1">{selectedApplication.email}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Phone</Typography>
                          <Typography variant="body1">{selectedApplication.phone || 'Not provided'}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Nationality</Typography>
                          <Typography variant="body1">{selectedApplication.nationality || 'Not provided'}</Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Application Status
                      </Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Current Status</Typography>
                          {getStatusChip(selectedApplication.kycStatus)}
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Applied Date</Typography>
                          <Typography variant="body1">
                            {selectedApplication.kycAppliedAt ? formatDate(selectedApplication.kycAppliedAt) : 'Recently'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Profile Completion</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={selectedApplication.profileCompletionPercentage || 0}
                            sx={{ mt: 1 }}
                          />
                          <Typography variant="caption">
                            {selectedApplication.profileCompletionPercentage || 0}% Complete
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setDetailsOpen(false)}>
              Close
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<Check />}
              onClick={() => {
                if (selectedApplication) {
                  handleApprove(selectedApplication._id);
                }
              }}
            >
              Approve Application
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Clear />}
              onClick={() => {
                setRejectOpen(true);
                setDetailsOpen(false);
              }}
            >
              Reject Application
            </Button>
          </DialogActions>
        </Dialog>

        {/* Rejection Dialog */}
        <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle color="error.main">Reject KYC Application</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Please provide a reason for rejecting this application:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button
              onClick={handleReject}
              variant="contained"
              color="error"
              disabled={!rejectionReason.trim()}
            >
              Reject Application
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}