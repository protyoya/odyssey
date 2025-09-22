'use client';
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Avatar,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Alert,
    Fab,
    Snackbar
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    Refresh as RefreshIcon,
    Phone as PhoneIcon,
    Navigation as NavigationIcon,
    Map as MapIcon,
    Close as CloseIcon,
    ZoomIn as ZoomInIcon,
    ZoomOut as ZoomOutIcon,
    CenterFocusStrong as CenterIcon,
    MyLocation as MyLocationIcon
} from '@mui/icons-material';

// Dark theme for consistency with dashboard
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
        text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
        },
        success: {
            main: '#10b981',
        },
        warning: {
            main: '#f59e0b',
        },
        error: {
            main: '#ef4444',
        },
        info: {
            main: '#3b82f6',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
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
                contained: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                    },
                },
            },
        },
    },
});

// Dynamic import for Leaflet map to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
    ssr: false,
    loading: () => (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '16px',
            }}
        >
            <Box textAlign="center">
                <CircularProgress size={60} sx={{ color: '#6366f1', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    Loading OpenStreetMap...
                </Typography>
            </Box>
        </Box>
    ),
});

const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Custom Map Component
const LiveTrackingMap = ({ tourists, selectedTourist, onTouristSelect, autoRefresh }) => {
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log('Geolocation error:', error);
                    // Default to New York if geolocation fails
                    setUserLocation({ lat: 40.7128, lng: -74.0060 });
                }
            );
        } else {
            setUserLocation({ lat: 40.7128, lng: -74.0060 });
        }
    }, []);

    const getMarkerColor = (tourist) => {
        const lastUpdate = new Date(tourist.lastUpdate);
        const now = new Date();
        const timeDiff = now - lastUpdate;

        if (timeDiff < 60000) return '#10b981'; // Green - recent
        if (timeDiff < 300000) return '#f59e0b'; // Yellow - 5 min ago
        return '#ef4444'; // Red - old
    };

    const getStatusText = (tourist) => {
        const lastUpdate = new Date(tourist.lastUpdate);
        const now = new Date();
        const timeDiff = now - lastUpdate;

        if (timeDiff < 60000) return 'Live';
        if (timeDiff < 300000) return `${Math.round(timeDiff / 60000)}m ago`;
        return 'Offline';
    };

    // Create custom icon for markers
    const createCustomIcon = (color, isSelected = false) => {
        if (typeof window === 'undefined') return null;

        const L = require('leaflet');
        return L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    width: ${isSelected ? '32px' : '24px'};
                    height: ${isSelected ? '32px' : '24px'};
                    background-color: ${color};
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    transform: translate(-50%, -50%);
                    ${isSelected ? 'animation: pulse 2s infinite;' : ''}
                "></div>
                <style>
                    @keyframes pulse {
                        0% { box-shadow: 0 0 0 0 ${color}40; }
                        70% { box-shadow: 0 0 0 10px ${color}00; }
                        100% { box-shadow: 0 0 0 0 ${color}00; }
                    }
                </style>
            `,
            iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
            iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
        });
    };

    if (!userLocation) {
        return (
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    borderRadius: '16px',
                }}
            >
                <Box textAlign="center">
                    <CircularProgress size={60} sx={{ color: '#6366f1', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Initializing Map...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
            {/* Map Header */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    right: 16,
                    zIndex: 1000,
                    background: 'rgba(30, 41, 59, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    p: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={2}>
                        <MapIcon sx={{ color: '#6366f1' }} />
                        <Typography variant="h6" color="text.primary">
                            Live Tourist Tracking
                        </Typography>
                        {autoRefresh && (
                            <Chip
                                icon={<NavigationIcon />}
                                label="Auto-refresh ON"
                                size="small"
                                sx={{ background: '#10b981', color: 'white' }}
                            />
                        )}
                    </Box>
                    <Box display="flex" gap={1}>
                        <Chip
                            label={`${tourists.length} Active`}
                            sx={{ background: '#3b82f6', color: 'white' }}
                        />
                        <Chip
                            label={`${tourists.filter(t => getStatusText(t) === 'Live').length} Live`}
                            sx={{ background: '#10b981', color: 'white' }}
                        />
                    </Box>
                </Box>
            </Box>

            <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                whenCreated={setMap}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Tourist Markers */}
                {tourists.map((tourist) => (
                    tourist.location?.latitude && tourist.location?.longitude && (
                        <Marker
                            key={tourist.id}
                            position={[tourist.location.latitude, tourist.location.longitude]}
                            icon={createCustomIcon(
                                getMarkerColor(tourist),
                                selectedTourist?.id === tourist.id
                            )}
                            eventHandlers={{
                                click: () => onTouristSelect(tourist),
                            }}
                        >
                            <Popup>
                                <Box sx={{ minWidth: 200, p: 1, z:2000 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        {tourist.fullName || tourist.username}
                                    </Typography>

                                    <Box mb={1}>
                                        <Chip
                                            label={getStatusText(tourist)}
                                            color={
                                                getStatusText(tourist) === 'Live' ? 'success' :
                                                getStatusText(tourist).includes('m ago') ? 'warning' : 'error'
                                            }
                                            size="small"
                                        />
                                    </Box>

                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        <strong>Phone:</strong> {tourist.phone || 'N/A'}
                                    </Typography>

                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        <strong>KYC:</strong> {tourist.kycStatus}
                                    </Typography>

                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        <strong>Emergency Contacts:</strong> {tourist.emergencyContacts?.length || 0}
                                    </Typography>

                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        <strong>Last Update:</strong><br />
                                        {new Date(tourist.lastUpdate).toLocaleString()}
                                    </Typography>

                                    <Box mt={1} display="flex" gap={1}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => onTouristSelect(tourist)}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => {
                                                const { latitude, longitude } = tourist.location;
                                                window.open(`https://maps.google.com/maps?q=${latitude},${longitude}`, '_blank');
                                            }}
                                        >
                                            Google Maps
                                        </Button>
                                    </Box>
                                </Box>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>

            {/* Map Controls */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    zIndex: 1000,
                }}
            >
                <Fab
                    size="small"
                    sx={{
                        background: 'rgba(30, 41, 59, 0.95)',
                        color: '#6366f1',
                        '&:hover': {
                            background: 'rgba(99, 102, 241, 0.2)',
                        },
                    }}
                    onClick={() => map?.zoomIn()}
                >
                    <ZoomInIcon />
                </Fab>
                <Fab
                    size="small"
                    sx={{
                        background: 'rgba(30, 41, 59, 0.95)',
                        color: '#6366f1',
                        '&:hover': {
                            background: 'rgba(99, 102, 241, 0.2)',
                        },
                    }}
                    onClick={() => map?.zoomOut()}
                >
                    <ZoomOutIcon />
                </Fab>
                <Fab
                    size="small"
                    sx={{
                        background: 'rgba(30, 41, 59, 0.95)',
                        color: '#6366f1',
                        '&:hover': {
                            background: 'rgba(99, 102, 241, 0.2)',
                        },
                    }}
                    onClick={() => {
                        if (map && userLocation) {
                            map.setView([userLocation.lat, userLocation.lng], 12);
                        }
                    }}
                >
                    <CenterIcon />
                </Fab>
                <Fab
                    size="small"
                    sx={{
                        background: 'rgba(30, 41, 59, 0.95)',
                        color: '#10b981',
                        '&:hover': {
                            background: 'rgba(16, 185, 129, 0.2)',
                        },
                    }}
                    onClick={() => {
                        if (map && tourists.length > 0) {
                            const bounds = tourists
                                .filter(t => t.location?.latitude && t.location?.longitude)
                                .map(t => [t.location.latitude, t.location.longitude]);
                            if (bounds.length > 0) {
                                map.fitBounds(bounds, { padding: [20, 20] });
                            }
                        }
                    }}
                >
                    <MyLocationIcon />
                </Fab>
            </Box>
        </Box>
    );
};

export default function LocationsPage() {
    const [tourists, setTourists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTourist, setSelectedTourist] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [filter, setFilter] = useState('all');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const apiUri = process.env.NEXT_PUBLIC_BACKEND_URL;

    const fetchTouristLocations = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');

            if (!token) {
                setSnackbar({ open: true, message: 'Authentication required', severity: 'error' });
                return;
            }

            const response = await fetch(`${apiUri}/api/authorities/tourists/locations/live`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                let filteredTourists = data.data || [];

                // Apply filters
                if (filter !== 'all') {
                    filteredTourists = filteredTourists.filter(tourist => {
                        switch (filter) {
                            case 'live':
                                const timeDiff = Date.now() - new Date(tourist.lastUpdate).getTime();
                                return timeDiff < 60000;
                            case 'verified':
                                return tourist.kycStatus === 'approved';
                            case 'emergency':
                                return tourist.emergencyContacts?.length > 0;
                            default:
                                return true;
                        }
                    });
                }

                setTourists(filteredTourists);
                setSnackbar({
                    open: true,
                    message: `Updated: ${filteredTourists.length} tourists found`,
                    severity: 'success'
                });
            } else {
                const errorData = await response.json();
                setSnackbar({
                    open: true,
                    message: `Failed to fetch locations: ${errorData.message || 'Unknown error'}`,
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Error fetching tourist locations:', error);
            setSnackbar({
                open: true,
                message: 'Network error occurred',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    }, [apiUri, filter]);

    useEffect(() => {
        fetchTouristLocations();
    }, [fetchTouristLocations]);

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchTouristLocations();
            }, 15000); // Refresh every 15 seconds

            return () => clearInterval(interval);
        }
    }, [autoRefresh, fetchTouristLocations]);

    const handleTouristSelect = (tourist) => {
        setSelectedTourist(tourist);
        setDrawerOpen(true);
    };

    const getStatusColor = (tourist) => {
        const timeDiff = Date.now() - new Date(tourist.lastUpdate).getTime();
        if (timeDiff < 60000) return 'success';
        if (timeDiff < 300000) return 'warning';
        return 'error';
    };

    const getStatusText = (tourist) => {
        const timeDiff = Date.now() - new Date(tourist.lastUpdate).getTime();
        if (timeDiff < 60000) return 'Live';
        if (timeDiff < 300000) return `${Math.round(timeDiff / 60000)}m ago`;
        return 'Offline';
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh',mt: 10, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <Container maxWidth="xl" sx={{ pt: 2, pb: 4 }}>
                    {/* Header */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: '16px' }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Box display="flex" alignItems="center" gap={2}>
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
                                        <LocationIcon sx={{ color: 'white', fontSize: '2rem' }} />
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
                                            Live Location Tracking
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Real-time monitoring with OpenStreetMap " Emergency contacts " Location history
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Filter</InputLabel>
                                            <Select
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                                label="Filter"
                                            >
                                                <MenuItem value="all">All Tourists</MenuItem>
                                                <MenuItem value="live">=� Live Only</MenuItem>
                                                <MenuItem value="verified"> Verified KYC</MenuItem>
                                                <MenuItem value="emergency">=� With Emergency Contacts</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            onClick={fetchTouristLocations}
                                            disabled={loading}
                                            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />}
                                            fullWidth
                                        >
                                            {loading ? 'Loading...' : 'Refresh'}
                                        </Button>
                                    </Grid>
                                </Grid>

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={autoRefresh}
                                            onChange={(e) => setAutoRefresh(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Auto-refresh (15s)"
                                    sx={{ mt: 1, color: 'text.secondary' }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Stats Bar */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={6} md={3}>
                            <Card sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                                    {tourists.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Active Tourists
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Card sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                                    {tourists.filter(t => getStatusText(t) === 'Live').length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Live Now
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Card sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                                    {tourists.filter(t => t.kycStatus === 'approved').length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Verified KYC
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Card sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="h4" sx={{ color: '#ec4899', fontWeight: 700 }}>
                                    {tourists.filter(t => t.emergencyContacts?.length > 0).length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    With Emergency Contacts
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Main Map Container */}
                    <Paper sx={{ height: '70vh', borderRadius: '16px', overflow: 'hidden' }}>
                        {tourists.length === 0 && !loading ? (
                            <Box
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <Box>
                                    <LocationIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                                    <Typography variant="h5" color="text.secondary" gutterBottom>
                                        No Active Locations
                                    </Typography>
                                    <Typography variant="body1" color="text.disabled" sx={{ mb: 2 }}>
                                        No tourists are currently sharing their location
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={fetchTouristLocations}
                                        startIcon={<RefreshIcon />}
                                    >
                                        Check Again
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <LiveTrackingMap
                                tourists={tourists}
                                selectedTourist={selectedTourist}
                                onTouristSelect={handleTouristSelect}
                                autoRefresh={autoRefresh}
                            />
                        )}
                    </Paper>

                    {/* Tourist Details Drawer */}
                    <Drawer
                        anchor="right"
                        open={drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                        slotProps={{
                            paper: {
                                sx: {
                                    width: 400,
                                    background: 'linear-gradient(145deg, #1e293b 0%, #334155 100%)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                },
                            },
                        }}
                    >
                        {selectedTourist && (
                            <Box sx={{ p: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <Typography variant="h6" color="text.primary">
                                        Tourist Details
                                    </Typography>
                                    <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'text.secondary' }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>

                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                                            <Avatar
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    bgcolor: '#6366f1',
                                                    fontSize: '1.5rem',
                                                }}
                                            >
                                                {selectedTourist.fullName?.charAt(0) || 'T'}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" color="text.primary">
                                                    {selectedTourist.fullName || selectedTourist.username}
                                                </Typography>
                                                <Chip
                                                    label={getStatusText(selectedTourist)}
                                                    color={getStatusColor(selectedTourist)}
                                                    size="small"
                                                />
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Phone
                                                </Typography>
                                                <Typography variant="body1">
                                                    {selectedTourist.phone || 'N/A'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">
                                                    KYC Status
                                                </Typography>
                                                <Chip
                                                    label={selectedTourist.kycStatus}
                                                    color={selectedTourist.kycStatus === 'approved' ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                {/* Location Details */}
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" color="text.primary" gutterBottom>
                                            Location Information
                                        </Typography>

                                        {selectedTourist.location && (
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Coordinates
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                                                    {selectedTourist.location.latitude.toFixed(6)}, {selectedTourist.location.longitude.toFixed(6)}
                                                </Typography>

                                                {selectedTourist.location.accuracy && (
                                                    <>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Accuracy
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                                            �{Math.round(selectedTourist.location.accuracy)}m
                                                        </Typography>
                                                    </>
                                                )}

                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Last Update
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    {new Date(selectedTourist.lastUpdate).toLocaleString()}
                                                </Typography>

                                                <Button
                                                    variant="outlined"
                                                    fullWidth
                                                    startIcon={<MapIcon />}
                                                    onClick={() => {
                                                        const { latitude, longitude } = selectedTourist.location;
                                                        window.open(`https://maps.google.com/maps?q=${latitude},${longitude}`, '_blank');
                                                    }}
                                                >
                                                    View on Google Maps
                                                </Button>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Emergency Contacts */}
                                {selectedTourist.emergencyContacts?.length > 0 && (
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" color="text.primary" gutterBottom>
                                                Emergency Contacts
                                            </Typography>
                                            <List dense>
                                                {selectedTourist.emergencyContacts.map((contact, index) => (
                                                    <ListItem key={index} sx={{ px: 0 }}>
                                                        <ListItemIcon>
                                                            <PhoneIcon sx={{ color: '#ef4444' }} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={contact.name}
                                                            secondary={`${contact.relationship} " ${contact.phone}`}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                )}
                            </Box>
                        )}
                    </Drawer>

                    {/* Snackbar for notifications */}
                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert
                            onClose={() => setSnackbar({ ...snackbar, open: false })}
                            severity={snackbar.severity}
                            sx={{ width: '100%' }}
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </ThemeProvider>
    );
}