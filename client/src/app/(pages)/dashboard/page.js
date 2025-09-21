'use client';
import React from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';


export default function Dashboard() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>
            
            <Grid container spacing={3}>
                {/* Summary Cards */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >
                        <Typography variant="h6">Total Users</Typography>
                        {/* Add your content here */}
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >
                        <Typography variant="h6">Recent Activity</Typography>
                        {/* Add your content here */}
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >
                        <Typography variant="h6">Statistics</Typography>
                        {/* Add your content here */}
                    </Paper>
                </Grid>

                {/* Main Content */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom>
                            Overview
                        </Typography>
                        {/* Add your main content here */}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}