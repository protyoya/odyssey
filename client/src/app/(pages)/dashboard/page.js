'use client';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Tab,
    Tabs,
    Card,
    CardContent,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Badge,
    CircularProgress,
    LinearProgress,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    InputAdornment,
    ThemeProvider,
    createTheme,
    CssBaseline,
    alpha,
    useTheme
} from '@mui/material';
import {
    People as PeopleIcon,
    VerifiedUser as VerifiedIcon,
    Pending as PendingIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    FilterList as FilterIcon,
    Map as MapIcon,
    Security as SecurityIcon,
    Dashboard as DashboardIcon,
    TrendingUp as TrendingUpIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';

// Dark theme configuration
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5',
        },
        secondary: {
            main: '#ec4899',
            light: '#f472b6',
            dark: '#db2777',
        },
        background: {
            default: '#0f172a',
            paper: '#1e293b',
        },
        surface: {
            main: '#334155',
            light: '#475569',
            dark: '#1e293b',
        },
        text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
        },
        success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        info: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h4: {
            fontSize: '1.875rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h6: {
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        body1: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.75rem',
            lineHeight: 1.4,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    minHeight: '100vh',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontWeight: 500,
                },
                contained: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                        boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                    },
                },
                outlined: {
                    border: '1px solid rgba(99, 102, 241, 0.5)',
                    color: '#6366f1',
                    '&:hover': {
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid #6366f1',
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    minHeight: '48px',
                    '&.Mui-selected': {
                        color: '#6366f1',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: '#f8fafc',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                },
                body: {
                    fontSize: '0.8125rem',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    fontWeight: 500,
                },
            },
        },
    },
});


function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function Dashboard() {
    const [tabValue, setTabValue] = useState(0);
    const [tourists, setTourists] = useState([]);
    const [liveLocations, setLiveLocations] = useState([]);
    const [pendingKyc, setPendingKyc] = useState([]);
    const [kycStats, setKycStats] = useState({});
    const [selectedTourist, setSelectedTourist] = useState(null);
    const [kycDialogOpen, setKycDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [kycFilter, setKycFilter] = useState('all');
    const [refreshing, setRefreshing] = useState(false);

    const apiUri = process.env.NEXT_PUBLIC_BACKEND_URL;
    useEffect(() => {
        fetchDashboardData();

        // Auto-refresh every 30 seconds for live data
        const interval = setInterval(() => {
            fetchDashboardData(true);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async (showRefresh = false) => {
        try {
            if (showRefresh) setRefreshing(true);
            else setLoading(true);

            const token = localStorage.getItem('authToken');

            if (!token) {
                console.error('No auth token found');
                return;
            }

            console.log('Fetching data from:', apiUri);
            console.log('Using token:', token ? 'Present' : 'Missing');

            const [touristsRes, locationsRes, kycRes, statsRes] = await Promise.all([
                fetch(`${apiUri}/api/authorities/tourists?limit=50`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }),
                fetch(`${apiUri}/api/authorities/tourists/locations/live`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }),
                fetch(`${apiUri}/api/authorities/kyc/pending?limit=20`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }),
                fetch(`${apiUri}/api/authorities/kyc/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            ]);

            console.log('Response statuses:', {
                tourists: touristsRes.status,
                locations: locationsRes.status,
                kyc: kycRes.status,
                stats: statsRes.status
            });

            if (touristsRes.ok) {
                const touristsData = await touristsRes.json();
                setTourists(touristsData.data?.tourists || []);
            } else {
                console.error('Tourists fetch failed:', await touristsRes.text());
            }

            if (locationsRes.ok) {
                const locationsData = await locationsRes.json();
                setLiveLocations(locationsData.data || []);
            } else {
                console.error('Locations fetch failed:', await locationsRes.text());
            }

            if (kycRes.ok) {
                const kycData = await kycRes.json();
                setPendingKyc(kycData.data?.applications || []);
            } else {
                console.error('KYC fetch failed:', await kycRes.text());
            }

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setKycStats(statsData.data?.overview || {});
            } else {
                console.error('Stats fetch failed:', await statsRes.text());
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleKycAction = async (touristId, action, reason = '') => {
        try {
            const token = localStorage.getItem('authToken');
            const url = `${apiUri}/api/authorities/kyc/${touristId}/${action}`;
            const body = action === 'reject' ? { reason } : {};

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                setKycDialogOpen(false);
                setRejectionReason('');
                fetchDashboardData();
            }
        } catch (error) {
            console.error('Error processing KYC:', error);
        }
    };

    const getKycStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const handleTabChange = (_, newValue) => {
        setTabValue(newValue);
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchDashboardData();
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(
                `${apiUri}/api/authorities/tourists/search?q=${encodeURIComponent(searchQuery)}&kyc=${kycFilter}&verified=${statusFilter}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setTourists(data.data?.tourists || []);
            }
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const exportData = () => {
        if (tourists.length === 0) return;

        const data = tourists.map(tourist => ({
            name: tourist.fullName || tourist.username,
            email: tourist.email,
            phone: tourist.phone || 'N/A',
            kycStatus: tourist.kycStatus,
            locationTracking: tourist.locationTrackingEnabled ? 'Enabled' : 'Disabled',
            emergencyContacts: tourist.emergencyContacts?.length || 0,
            lastLogin: tourist.lastLogin ? new Date(tourist.lastLogin).toLocaleDateString() : 'Never'
        }));

        const csv = [
            Object.keys(data[0]).join(','),
            ...data.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tourists_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const testAuthentication = async () => {
        try {
            const token = localStorage.getItem('authToken');
            console.log('Testing auth with token:', token ? 'Present' : 'Missing');
            console.log('API URI:', apiUri);

            const response = await fetch(`${apiUri}/api/authorities/test`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Test response status:', response.status);
            const data = await response.json();
            console.log('Test response data:', data);

            if (response.ok) {
                alert(`Authentication successful!\nAuthority: ${data.authority.fullName}\nDepartment: ${data.authority.department}`);
            } else {
                alert(`Authentication failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Test authentication error:', error);
            alert(`Test failed: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Box
                    sx={{
                        minHeight: '100vh',
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Box textAlign="center">
                        <CircularProgress size={60} sx={{ color: '#6366f1', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Loading Dashboard...
                        </Typography>
                    </Box>
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh',mt: 10, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
                    {/* Enhanced Header with Dark Theme */}
                    <Box
                        sx={{
                            background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            p: 4,
                            mb: 4,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        <Grid container spacing={3} alignItems="center" >
                            <Grid item xs={12} md={8}>
                                <Box display="flex" alignItems="center" gap={2} mb={2}>
                                    <Box
                                        sx={{
                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            borderRadius: '12px',
                                            p: 1.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <SecurityIcon sx={{ color: 'white', fontSize: '2rem' }} />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="h4"
                                            component="h1"
                                            sx={{
                                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                color: 'transparent',
                                                fontWeight: 700,
                                                mb: 0.5,
                                            }}
                                        >
                                            Authorities Control Center
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Real-time monitoring • Location tracking • KYC verification
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Quick Stats Bar */}
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={3}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <PeopleIcon sx={{ color: '#10b981', fontSize: '1.2rem' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                <strong style={{ color: '#10b981' }}>{kycStats.totalTourists || 0}</strong> Tourists
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <LocationIcon sx={{ color: '#3b82f6', fontSize: '1.2rem' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                <strong style={{ color: '#3b82f6' }}>{liveLocations.length}</strong> Live
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <PendingIcon sx={{ color: '#f59e0b', fontSize: '1.2rem' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                <strong style={{ color: '#f59e0b' }}>{kycStats.pending || 0}</strong> Pending
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <VerifiedIcon sx={{ color: '#10b981', fontSize: '1.2rem' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                <strong style={{ color: '#10b981' }}>{kycStats.approved || 0}</strong> Verified
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Box display="flex" flexDirection="column" gap={1.5}>
                                    <Button
                                        variant="contained"
                                        onClick={() => fetchDashboardData(true)}
                                        disabled={refreshing}
                                        startIcon={refreshing ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />}
                                        fullWidth
                                        sx={{
                                            background: refreshing
                                                ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                                                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        }}
                                    >
                                        {refreshing ? 'Refreshing...' : 'Refresh Data'}
                                    </Button>

                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="outlined"
                                                onClick={exportData}
                                                startIcon={<DownloadIcon />}
                                                disabled={tourists.length === 0}
                                                fullWidth
                                                size="small"
                                            >
                                                Export
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="outlined"
                                                onClick={testAuthentication}
                                                startIcon={<VisibilityIcon />}
                                                fullWidth
                                                size="small"
                                            >
                                                Test Auth
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Enhanced Search and Filter Bar */}
                    <Paper
                        sx={{
                            p: 3,
                            mb: 4,
                            background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <SearchIcon sx={{ color: '#6366f1' }} />
                            <Typography variant="h6" color="text.primary">
                                Search & Filter
                            </Typography>
                        </Box>

                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth variant="outlined">
                                    <OutlinedInput
                                        placeholder="Search by name, email, phone, or passport..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: '#6366f1' }} />
                                            </InputAdornment>
                                        }
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(99, 102, 241, 0.3)',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(99, 102, 241, 0.5)',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#6366f1',
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: 'text.secondary' }}>Status</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        label="Status"
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(99, 102, 241, 0.3)',
                                            },
                                        }}
                                    >
                                        <MenuItem value="all">All Status</MenuItem>
                                        <MenuItem value="true">✅ Verified</MenuItem>
                                        <MenuItem value="false">⏳ Unverified</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: 'text.secondary' }}>KYC</InputLabel>
                                    <Select
                                        value={kycFilter}
                                        onChange={(e) => setKycFilter(e.target.value)}
                                        label="KYC"
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(99, 102, 241, 0.3)',
                                            },
                                        }}
                                    >
                                        <MenuItem value="all">All KYC</MenuItem>
                                        <MenuItem value="not_applied">🚫 Not Applied</MenuItem>
                                        <MenuItem value="pending">⏳ Pending</MenuItem>
                                        <MenuItem value="approved">✅ Approved</MenuItem>
                                        <MenuItem value="rejected">❌ Rejected</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSearch}
                                    startIcon={<SearchIcon />}
                                    sx={{
                                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                        height: '56px',
                                    }}
                                >
                                    Search
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                        setKycFilter('all');
                                        fetchDashboardData();
                                    }}
                                    startIcon={<FilterIcon />}
                                    sx={{ height: '56px' }}
                                >
                                    Clear All
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Enhanced Summary Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} lg={3}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                    borderRadius: '16px',
                                    p: 1,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 700, mb: 1 }}>
                                                {kycStats.totalTourists || 0}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                Total Tourists
                                            </Typography>
                                            <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                                                +12% from last month
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                                borderRadius: '12px',
                                                p: 1.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <PeopleIcon sx={{ color: 'white', fontSize: '1.8rem' }} />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={3}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    borderRadius: '16px',
                                    p: 1,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h3" sx={{ color: '#3b82f6', fontWeight: 700, mb: 1 }}>
                                                {liveLocations.length}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                Live Tracking
                                            </Typography>
                                            <Typography variant="body2" color="info.main" sx={{ mt: 0.5 }}>
                                                Real-time monitoring
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                                                borderRadius: '12px',
                                                p: 1.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <LocationIcon sx={{ color: 'white', fontSize: '1.8rem' }} />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={3}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                    borderRadius: '16px',
                                    p: 1,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h3" sx={{ color: '#f59e0b', fontWeight: 700, mb: 1 }}>
                                                {kycStats.pending || 0}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                Pending KYC
                                            </Typography>
                                            <Typography variant="body2" color="warning.main" sx={{ mt: 0.5 }}>
                                                Requires attention
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                                                borderRadius: '12px',
                                                p: 1.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <PendingIcon sx={{ color: 'white', fontSize: '1.8rem' }} />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} lg={3}>
                            <Card
                                sx={{
                                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                    borderRadius: '16px',
                                    p: 1,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 700, mb: 1 }}>
                                                {kycStats.approved || 0}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                Verified KYC
                                            </Typography>
                                            <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                                                Security verified
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                                borderRadius: '12px',
                                                p: 1.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <VerifiedIcon sx={{ color: 'white', fontSize: '1.8rem' }} />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Enhanced Tabs */}
                    <Paper
                        sx={{
                            width: '100%',
                            mb: 3,
                            background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                        }}
                    >
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="dashboard tabs"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                                    height: '3px',
                                    borderRadius: '2px',
                                },
                                '& .MuiTab-root': {
                                    color: '#cbd5e1',
                                    fontWeight: 500,
                                    fontSize: '0.875rem',
                                    textTransform: 'none',
                                    minHeight: '60px',
                                    '&.Mui-selected': {
                                        color: '#6366f1',
                                        fontWeight: 600,
                                    },
                                },
                            }}
                        >
                            <Tab
                                label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <DashboardIcon sx={{ fontSize: '1.1rem' }} />
                                        Overview
                                    </Box>
                                }
                            />
                            <Tab
                                label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LocationIcon sx={{ fontSize: '1.1rem' }} />
                                        Live Locations
                                        <Chip
                                            label={liveLocations.length}
                                            size="small"
                                            sx={{
                                                background: '#3b82f6',
                                                color: 'white',
                                                height: '20px',
                                                fontSize: '0.7rem',
                                            }}
                                        />
                                    </Box>
                                }
                            />
                            <Tab
                                label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <VerifiedIcon sx={{ fontSize: '1.1rem' }} />
                                        KYC Verification
                                        <Chip
                                            label={pendingKyc.length}
                                            size="small"
                                            sx={{
                                                background: '#f59e0b',
                                                color: 'white',
                                                height: '20px',
                                                fontSize: '0.7rem',
                                            }}
                                        />
                                    </Box>
                                }
                            />
                            <Tab
                                label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <PeopleIcon sx={{ fontSize: '1.1rem' }} />
                                        Tourist Management
                                        <Chip
                                            label={tourists.length}
                                            size="small"
                                            sx={{
                                                background: '#10b981',
                                                color: 'white',
                                                height: '20px',
                                                fontSize: '0.7rem',
                                            }}
                                        />
                                    </Box>
                                }
                            />
                        </Tabs>
                    </Paper>

            {/* Tab Panels */}
            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Recent Tourist Activity</Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tourist</TableCell>
                                            <TableCell>KYC Status</TableCell>
                                            <TableCell>Last Login</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tourists.slice(0, 5).map((tourist) => (
                                            <TableRow key={tourist._id}>
                                                <TableCell>{tourist.fullName || tourist.username}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={tourist.kycStatus}
                                                        color={getKycStatusColor(tourist.kycStatus)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {tourist.lastLogin ? new Date(tourist.lastLogin).toLocaleDateString() : 'Never'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>KYC Overview</Typography>
                            <Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography>Not Applied:</Typography>
                                    <Typography>{kycStats.notApplied || 0}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography>Pending:</Typography>
                                    <Typography color="warning.main">{kycStats.pending || 0}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography>Approved:</Typography>
                                    <Typography color="success.main">{kycStats.approved || 0}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography>Rejected:</Typography>
                                    <Typography color="error.main">{kycStats.rejected || 0}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Grid container spacing={3}>
                    {/* Live Locations Summary */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">Live Tourist Locations</Typography>
                                <Box display="flex" gap={1}>
                                    <Chip
                                        icon={<LocationIcon />}
                                        label={`${liveLocations.length} Active`}
                                        color="success"
                                        variant="outlined"
                                    />
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<MapIcon />}
                                        onClick={() => {
                                            // Future: Open map view
                                            alert('Map view coming soon!');
                                        }}
                                    >
                                        Map View
                                    </Button>
                                </Box>
                            </Box>

                            {liveLocations.length === 0 ? (
                                <Box textAlign="center" py={4}>
                                    <LocationIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">
                                        No Active Location Tracking
                                    </Typography>
                                    <Typography variant="body2" color="text.disabled">
                                        Tourists need to enable location tracking in their profile
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Tourist</TableCell>
                                                <TableCell>Contact</TableCell>
                                                <TableCell>KYC Status</TableCell>
                                                <TableCell>Location</TableCell>
                                                <TableCell>Last Update</TableCell>
                                                <TableCell>Emergency Contacts</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {liveLocations.map((tourist) => (
                                                <TableRow key={tourist.id}>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="bold">
                                                                {tourist.fullName || tourist.username}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                ID: {tourist.id.slice(-6)}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            {tourist.phone && (
                                                                <Typography variant="body2">
                                                                    📞 {tourist.phone}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={tourist.kycStatus}
                                                            color={getKycStatusColor(tourist.kycStatus)}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {tourist.location?.latitude && tourist.location?.longitude ? (
                                                            <Box>
                                                                <Typography variant="body2" fontFamily="monospace">
                                                                    {tourist.location.latitude.toFixed(4)}, {tourist.location.longitude.toFixed(4)}
                                                                </Typography>
                                                                {tourist.location.accuracy && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        ±{Math.round(tourist.location.accuracy)}m
                                                                    </Typography>
                                                                )}
                                                                {tourist.location.address && (
                                                                    <Typography variant="caption" display="block" color="text.secondary">
                                                                        {tourist.location.address}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        ) : 'No location'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {tourist.lastUpdate ? (
                                                            <Box>
                                                                <Typography variant="body2">
                                                                    {new Date(tourist.lastUpdate).toLocaleString()}
                                                                </Typography>
                                                                <Typography variant="caption" color={
                                                                    Date.now() - new Date(tourist.lastUpdate).getTime() > 300000
                                                                        ? 'error' : 'success'
                                                                }>
                                                                    {Date.now() - new Date(tourist.lastUpdate).getTime() < 60000
                                                                        ? 'Just now'
                                                                        : `${Math.round((Date.now() - new Date(tourist.lastUpdate).getTime()) / 60000)}min ago`}
                                                                </Typography>
                                                            </Box>
                                                        ) : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {tourist.emergencyContacts?.length > 0 ? (
                                                            <Tooltip title={`${tourist.emergencyContacts.length} emergency contact(s)`}>
                                                                <Badge badgeContent={tourist.emergencyContacts.length} color="primary">
                                                                    <PhoneIcon />
                                                                </Badge>
                                                            </Tooltip>
                                                        ) : (
                                                            <Typography variant="caption" color="text.disabled">
                                                                None
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" gap={1}>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() => {
                                                                    const lat = tourist.location?.latitude;
                                                                    const lng = tourist.location?.longitude;
                                                                    if (lat && lng) {
                                                                        window.open(`https://maps.google.com/maps?q=${lat},${lng}`, '_blank');
                                                                    }
                                                                }}
                                                                disabled={!tourist.location?.latitude || !tourist.location?.longitude}
                                                            >
                                                                View Map
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Pending KYC Applications</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tourist</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Passport</TableCell>
                                    <TableCell>Applied Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingKyc.map((tourist) => (
                                    <TableRow key={tourist._id}>
                                        <TableCell>{tourist.fullName || tourist.username}</TableCell>
                                        <TableCell>{tourist.email}</TableCell>
                                        <TableCell>{tourist.passportNumber || 'N/A'}</TableCell>
                                        <TableCell>
                                            {tourist.kycAppliedAt ? new Date(tourist.kycAppliedAt).toLocaleDateString() : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                sx={{ mr: 1 }}
                                                onClick={() => handleKycAction(tourist._id, 'approve')}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => {
                                                    setSelectedTourist(tourist._id);
                                                    setKycDialogOpen(true);
                                                }}
                                            >
                                                Reject
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>All Tourists</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>KYC Status</TableCell>
                                    <TableCell>Location Tracking</TableCell>
                                    <TableCell>Emergency Contacts</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tourists.map((tourist) => (
                                    <TableRow key={tourist._id}>
                                        <TableCell>{tourist.fullName || tourist.username}</TableCell>
                                        <TableCell>{tourist.email}</TableCell>
                                        <TableCell>{tourist.phone || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={tourist.kycStatus}
                                                color={getKycStatusColor(tourist.kycStatus)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={tourist.locationTrackingEnabled ? 'Enabled' : 'Disabled'}
                                                color={tourist.locationTrackingEnabled ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {tourist.emergencyContacts?.length > 0 ? (
                                                <Badge badgeContent={tourist.emergencyContacts.length} color="primary">
                                                    <PhoneIcon />
                                                </Badge>
                                            ) : 'None'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </TabPanel>

            {/* Enhanced KYC Rejection Dialog */}
            <Dialog
                open={kycDialogOpen}
                onClose={() => setKycDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            backdropFilter: 'blur(20px)',
                        },
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: 'text.primary',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        pb: 2,
                        fontWeight: 600,
                    }}
                >
                    🚫 Reject KYC Application
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Rejection Reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Please provide a detailed reason for rejecting this KYC application..."
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(239, 68, 68, 0.3)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(239, 68, 68, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ef4444',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'text.secondary',
                                '&.Mui-focused': {
                                    color: '#ef4444',
                                },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button
                        onClick={() => setKycDialogOpen(false)}
                        variant="outlined"
                        sx={{
                            borderColor: 'rgba(203, 213, 225, 0.3)',
                            color: 'text.secondary',
                            '&:hover': {
                                borderColor: 'rgba(203, 213, 225, 0.5)',
                                background: 'rgba(203, 213, 225, 0.1)',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleKycAction(selectedTourist, 'reject', rejectionReason)}
                        variant="contained"
                        disabled={!rejectionReason.trim()}
                        sx={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                            },
                            '&:disabled': {
                                background: 'rgba(100, 116, 139, 0.5)',
                                color: 'rgba(203, 213, 225, 0.5)',
                            },
                        }}
                    >
                        Reject Application
                    </Button>
                </DialogActions>
            </Dialog>
                </Container>
            </Box>
        </ThemeProvider>
    );
}