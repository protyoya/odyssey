'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Avatar,
  IconButton,
  Paper,
  Stack,
  Container,
  Fade,
  Slide,
  Zoom
} from '@mui/material';
import {
  QrCodeScanner,
  CameraAlt,
  Stop,
  Person,
  Phone,
  Email,
  VerifiedUser,
  Close,
  CheckCircle,
  Error as ErrorIcon,
  Info,
  Security,
  Shield,
  Radar,
  FlashOn,
  Visibility
} from '@mui/icons-material';
import { BrowserMultiFormatReader } from '@zxing/library';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const scannerTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff88',
      dark: '#00cc6a',
      light: '#33ff9d'
    },
    secondary: {
      main: '#ff0080',
      dark: '#cc0066',
      light: '#ff3399'
    },
    background: {
      default: '#000000',
      paper: '#0a0a0a'
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0'
    },
    success: {
      main: '#00ff88',
      dark: '#00cc6a'
    },
    warning: {
      main: '#ffaa00',
      dark: '#cc8800'
    },
    error: {
      main: '#ff4444',
      dark: '#cc3333'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
          border: '1px solid #333',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
          border: '1px solid #333',
          borderRadius: '16px'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)'
        }
      }
    }
  }
});

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  useEffect(() => {
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const startScanning = useCallback(async () => {
    try {
      setError('');
      setScannedData(null);
      setVerificationStatus(null);
      setIsScanning(true);
      setLoading(true);

      const codeReader = new BrowserMultiFormatReader();
      codeReaderRef.current = codeReader;

      const videoInputDevices = await codeReader.listVideoInputDevices();

      if (videoInputDevices.length === 0) {
        throw new Error('No camera devices found');
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;

      codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result) => {
        if (result) {
          handleScanResult(result.getText());
          stopScanning();
        }
      });

      setLoading(false);
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError(`Failed to start camera: ${err.message}`);
      setIsScanning(false);
      setLoading(false);
    }
  }, []);

  const stopScanning = useCallback(() => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setIsScanning(false);
    setLoading(false);
  }, []);

  const handleScanResult = async (qrData) => {
    try {
      setLoading(true);
      const parsedData = JSON.parse(qrData);

      // Check if it's the Odyssey KYC verification format
      if (!parsedData.id || !parsedData.type || parsedData.type !== 'odyssey_kyc_verification') {
        throw new Error('Invalid QR code format - not an Odyssey KYC verification code');
      }

      // Transform the data to match expected format
      const transformedData = {
        userId: parsedData.id,
        profile: {
          fullName: parsedData.fullName,
          email: parsedData.email,
          phone: parsedData.phone,
          dateOfBirth: parsedData.dateOfBirth,
          nationality: parsedData.nationality,
          passportNumber: parsedData.passportNumber,
          gender: parsedData.gender,
          address: parsedData.address
        },
        kyc: {
          status: parsedData.kycStatus,
          verifiedAt: parsedData.kycVerifiedAt,
          verifiedBy: parsedData.kycVerifiedBy
        },
        emergencyContacts: parsedData.emergencyContacts,
        verificationTimestamp: parsedData.verificationTimestamp
      };

      setScannedData(transformedData);

      const verification = await verifyTourist(transformedData);
      setVerificationStatus(verification);
      setShowDetails(true);

    } catch (err) {
      console.error('Error processing QR code:', err);
      setError(`Invalid QR code: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyTourist = async (data) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/authorities/verify-tourist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: data.userId,
          qrCodeData: data
        })
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      console.error('Verification error:', err);
      return {
        success: false,
        error: err.message,
        status: 'error'
      };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'rejected': return <ErrorIcon />;
      case 'pending': return <Info />;
      default: return <Info />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ThemeProvider theme={scannerTheme}>
      <Box sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 20% 80%, #001122 0%, #000000 50%, #002211 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 0, 128, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(0, 255, 255, 0.05) 0%, transparent 50%)
          `,
          animation: 'pulse 4s ease-in-out infinite alternate'
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1,mt:10, py: 4 }}>
          {/* Header Section */}
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Shield sx={{
                  fontSize: 48,
                  color: 'primary.main',
                  mr: 2,
                  filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.5))'
                }} />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    background: 'linear-gradient(45deg, #00ff88, #00ffff, #ff0080)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
                    letterSpacing: 2
                  }}
                >
                  QUANTUM SCANNER
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 300,
                  letterSpacing: 1
                }}
              >
                Advanced Tourist Verification System
              </Typography>
              <Box sx={{
                width: 100,
                height: 3,
                background: 'linear-gradient(90deg, #00ff88, #00ffff)',
                margin: '20px auto',
                borderRadius: 2,
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)'
              }} />
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {/* Scanner Section */}
            <Grid item xs={12} lg={7}>
              <Slide direction="right" in timeout={1200}>
                <Card sx={{
                  height: 'fit-content',
                  background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
                  border: '2px solid #333',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* Card Header */}
                  <Box sx={{
                    background: 'linear-gradient(90deg, #00ff88, #00ffff)',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Radar sx={{ mr: 2, color: '#000' }} />
                    <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
                      QR Code Scanner
                    </Typography>
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                      {isScanning && (
                        <Chip
                          icon={<FlashOn />}
                          label="SCANNING"
                          size="small"
                          sx={{
                            bgcolor: '#ff0080',
                            color: 'white',
                            animation: 'pulse 1s infinite'
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      {!isScanning ? (
                        <Zoom in timeout={800}>
                          <Box>
                            {/* Scanner Placeholder */}
                            <Box sx={{
                              width: 350,
                              height: 350,
                              mx: 'auto',
                              mb: 3,
                              background: 'radial-gradient(circle, #001122 0%, #000000 70%)',
                              border: '3px dashed #00ff88',
                              borderRadius: 4,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              overflow: 'hidden'
                            }}>
                              {/* Animated Corner Brackets */}
                              <Box sx={{
                                position: 'absolute',
                                top: 20,
                                left: 20,
                                width: 40,
                                height: 40,
                                borderTop: '4px solid #00ff88',
                                borderLeft: '4px solid #00ff88',
                                animation: 'glow 2s ease-in-out infinite alternate'
                              }} />
                              <Box sx={{
                                position: 'absolute',
                                top: 20,
                                right: 20,
                                width: 40,
                                height: 40,
                                borderTop: '4px solid #00ff88',
                                borderRight: '4px solid #00ff88',
                                animation: 'glow 2s ease-in-out infinite alternate'
                              }} />
                              <Box sx={{
                                position: 'absolute',
                                bottom: 20,
                                left: 20,
                                width: 40,
                                height: 40,
                                borderBottom: '4px solid #00ff88',
                                borderLeft: '4px solid #00ff88',
                                animation: 'glow 2s ease-in-out infinite alternate'
                              }} />
                              <Box sx={{
                                position: 'absolute',
                                bottom: 20,
                                right: 20,
                                width: 40,
                                height: 40,
                                borderBottom: '4px solid #00ff88',
                                borderRight: '4px solid #00ff88',
                                animation: 'glow 2s ease-in-out infinite alternate'
                              }} />

                              <QrCodeScanner sx={{
                                fontSize: 80,
                                color: '#00ff88',
                                filter: 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.7))'
                              }} />
                            </Box>

                            <Button
                              variant="contained"
                              size="large"
                              startIcon={<CameraAlt />}
                              onClick={startScanning}
                              sx={{
                                px: 6,
                                py: 2,
                                fontSize: '1.2rem',
                                background: 'linear-gradient(45deg, #00ff88, #00ffff)',
                                color: '#000',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #00cc6a, #00cccc)',
                                  transform: 'scale(1.05)'
                                }
                              }}
                            >
                              Initiate Scan
                            </Button>
                          </Box>
                        </Zoom>
                      ) : (
                        <Box>
                          <Box sx={{
                            position: 'relative',
                            mb: 3,
                            display: 'inline-block'
                          }}>
                            {/* Scanner Frame */}
                            <Box sx={{
                              position: 'absolute',
                              top: -10,
                              left: -10,
                              right: -10,
                              bottom: -10,
                              border: '3px solid #00ff88',
                              borderRadius: 3,
                              animation: 'scannerGlow 2s ease-in-out infinite alternate'
                            }} />

                            <video
                              ref={videoRef}
                              style={{
                                width: 350,
                                height: 350,
                                objectFit: 'cover',
                                borderRadius: 16,
                                border: '2px solid #333'
                              }}
                              autoPlay
                              playsInline
                            />

                            {/* Scanning Line */}
                            <Box sx={{
                              position: 'absolute',
                              left: 0,
                              right: 0,
                              height: '2px',
                              background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
                              animation: 'scanLine 2s linear infinite'
                            }} />

                            {loading && (
                              <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                bgcolor: 'rgba(0,0,0,0.8)',
                                borderRadius: 2,
                                p: 2
                              }}>
                                <CircularProgress
                                  size={40}
                                  sx={{ color: '#00ff88' }}
                                />
                              </Box>
                            )}
                          </Box>

                          <Button
                            variant="outlined"
                            startIcon={<Stop />}
                            onClick={stopScanning}
                            sx={{
                              borderColor: '#ff0080',
                              color: '#ff0080',
                              '&:hover': {
                                borderColor: '#ff3399',
                                bgcolor: 'rgba(255, 0, 128, 0.1)'
                              }
                            }}
                          >
                            Stop Scanning
                          </Button>
                        </Box>
                      )}
                    </Box>

                    {error && (
                      <Fade in>
                        <Alert
                          severity="error"
                          sx={{
                            mt: 3,
                            bgcolor: 'rgba(255, 68, 68, 0.1)',
                            border: '1px solid #ff4444',
                            '& .MuiAlert-icon': {
                              color: '#ff4444'
                            }
                          }}
                        >
                          {error}
                        </Alert>
                      </Fade>
                    )}
                  </CardContent>
                </Card>
              </Slide>
            </Grid>

            {/* Results Section */}
            <Grid item xs={12} lg={5}>
              {scannedData ? (
                <Slide direction="left" in timeout={1400}>
                  <Card sx={{
                    background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
                    border: '2px solid #333',
                    borderRadius: '24px',
                    overflow: 'hidden'
                  }}>
                    {/* Results Header */}
                    <Box sx={{
                      background: verificationStatus?.success
                        ? 'linear-gradient(90deg, #00ff88, #00ffaa)'
                        : 'linear-gradient(90deg, #ff4444, #ff6666)',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <Security sx={{ mr: 2, color: '#000' }} />
                      <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
                        Verification Results
                      </Typography>
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                      <Stack spacing={3}>
                        {/* Tourist Info */}
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          background: 'linear-gradient(145deg, #001122, #002233)',
                          borderRadius: 3,
                          border: '1px solid #00ff88'
                        }}>
                          <Avatar sx={{
                            bgcolor: '#00ff88',
                            width: 60,
                            height: 60,
                            color: '#000'
                          }}>
                            <Person fontSize="large" />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#00ff88' }}>
                              {scannedData.profile.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {scannedData.userId.slice(-8)}
                            </Typography>
                            <Typography variant="caption" color="primary.main">
                              Tourist Profile
                            </Typography>
                          </Box>
                        </Box>

                        {/* Status Chip */}
                        <Box sx={{ textAlign: 'center' }}>
                          <Chip
                            icon={getStatusIcon(scannedData.kyc?.status)}
                            label={scannedData.kyc?.status?.toUpperCase() || 'NOT APPLIED'}
                            sx={{
                              px: 2,
                              py: 1,
                              fontSize: '1rem',
                              fontWeight: 'bold',
                              background: getStatusColor(scannedData.kyc?.status) === 'success'
                                ? 'linear-gradient(45deg, #00ff88, #00ffaa)'
                                : getStatusColor(scannedData.kyc?.status) === 'error'
                                ? 'linear-gradient(45deg, #ff4444, #ff6666)'
                                : 'linear-gradient(45deg, #ffaa00, #ffcc00)',
                              color: '#000',
                              border: 'none'
                            }}
                          />
                        </Box>

                        {/* Verification Status */}
                        {verificationStatus && (
                          <Fade in>
                            <Alert
                              severity={verificationStatus.success ? 'success' : 'error'}
                              icon={verificationStatus.success ? <VerifiedUser /> : <ErrorIcon />}
                              sx={{
                                bgcolor: verificationStatus.success
                                  ? 'rgba(0, 255, 136, 0.1)'
                                  : 'rgba(255, 68, 68, 0.1)',
                                border: verificationStatus.success
                                  ? '1px solid #00ff88'
                                  : '1px solid #ff4444',
                                borderRadius: 2,
                                '& .MuiAlert-icon': {
                                  color: verificationStatus.success ? '#00ff88' : '#ff4444'
                                }
                              }}
                            >
                              <Typography fontWeight="bold">
                                {verificationStatus.success
                                  ? 'VERIFICATION SUCCESSFUL'
                                  : `VERIFICATION FAILED: ${verificationStatus.error}`
                                }
                              </Typography>
                            </Alert>
                          </Fade>
                        )}

                        {/* Action Button */}
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<Visibility />}
                          onClick={() => setShowDetails(true)}
                          sx={{
                            py: 2,
                            fontSize: '1.1rem',
                            background: 'linear-gradient(45deg, #00ffff, #0099ff)',
                            color: '#000',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #00cccc, #0077cc)',
                              transform: 'scale(1.02)'
                            }
                          }}
                        >
                          View Complete Profile
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Slide>
              ) : (
                <Fade in timeout={1600}>
                  <Card sx={{
                    background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
                    border: '2px dashed #333',
                    borderRadius: '24px',
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <QrCodeScanner sx={{
                        fontSize: 80,
                        color: '#333',
                        mb: 2
                      }} />
                      <Typography variant="h6" color="text.secondary">
                        Scan a QR code to view results
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Point your camera at a tourist's QR code
                      </Typography>
                    </Box>
                  </Card>
                </Fade>
              )}
            </Grid>
          </Grid>
        </Container>

        {/* CSS Animations */}
        <style jsx global>{`
          @keyframes glow {
            0% { box-shadow: 0 0 5px #00ff88; }
            100% { box-shadow: 0 0 20px #00ff88, 0 0 30px #00ff88; }
          }

          @keyframes scannerGlow {
            0% { box-shadow: 0 0 10px #00ff88; }
            100% { box-shadow: 0 0 30px #00ff88, 0 0 40px #00ff88; }
          }

          @keyframes scanLine {
            0% { top: 0; }
            100% { top: 100%; }
          }

          @keyframes pulse {
            0% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `}</style>

        {/* Enhanced Dialog */}
        <Dialog
          open={showDetails}
          onClose={() => setShowDetails(false)}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%)',
                border: '2px solid #333',
                borderRadius: '20px',
                color: 'white'
              }
            }
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(90deg, #00ff88, #00ffff)',
            color: '#000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Security sx={{ mr: 2 }} />
              Tourist Verification Details
            </Box>
            <IconButton onClick={() => setShowDetails(false)} sx={{ color: '#000' }}>
              <Close />
            </IconButton>
          </DialogTitle>

        <DialogContent>
          {scannedData && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Profile Information
                    </Typography>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Full Name</Typography>
                        <Typography variant="body1">{scannedData.profile.fullName}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{scannedData.profile.email}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{scannedData.profile.phone}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                        <Typography variant="body1">
                          {scannedData.profile.dateOfBirth ? formatDate(scannedData.profile.dateOfBirth) : 'Not provided'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Nationality</Typography>
                        <Typography variant="body1">{scannedData.profile.nationality || 'Not provided'}</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      KYC Information
                    </Typography>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Status</Typography>
                        <Chip
                          icon={getStatusIcon(scannedData.kyc?.status)}
                          label={scannedData.kyc?.status?.toUpperCase() || 'NOT APPLIED'}
                          color={getStatusColor(scannedData.kyc?.status)}
                          size="small"
                        />
                      </Box>
                      {scannedData.kyc?.appliedDate && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Applied Date</Typography>
                          <Typography variant="body1">{formatDate(scannedData.kyc.appliedDate)}</Typography>
                        </Box>
                      )}
                      {scannedData.kyc?.verifiedDate && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Verified Date</Typography>
                          <Typography variant="body1">{formatDate(scannedData.kyc.verifiedDate)}</Typography>
                        </Box>
                      )}
                      {scannedData.kyc?.verifiedBy && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Verified By</Typography>
                          <Typography variant="body1">{scannedData.kyc.verifiedBy}</Typography>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                </Grid>

                {scannedData.emergencyContacts && scannedData.emergencyContacts.length > 0 && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Emergency Contacts
                      </Typography>
                      <Grid container spacing={2}>
                        {scannedData.emergencyContacts.map((contact, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <Box sx={{
                              p: 2,
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1,
                              bgcolor: contact.isPrimary ? 'action.hover' : 'transparent'
                            }}>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                <Person fontSize="small" />
                                <Typography variant="subtitle2">{contact.name}</Typography>
                                {contact.isPrimary && (
                                  <Chip label="Primary" size="small" color="primary" />
                                )}
                              </Stack>
                              <Stack spacing={0.5}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Phone fontSize="small" color="action" />
                                  <Typography variant="body2">{contact.phone}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Email fontSize="small" color="action" />
                                  <Typography variant="body2">{contact.email}</Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  Relationship: {contact.relationship}
                                </Typography>
                              </Stack>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setShowDetails(false)}
              variant="outlined"
              sx={{
                borderColor: '#ff0080',
                color: '#ff0080',
                '&:hover': {
                  borderColor: '#ff3399',
                  bgcolor: 'rgba(255, 0, 128, 0.1)'
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}