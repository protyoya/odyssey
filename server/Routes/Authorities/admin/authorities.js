// routes/authorities.js
const express = require('express');
const router = express.Router();
const Authority = require('../../../Models/Authorities/Authority');
const Tourist = require('../../../Models/Tourist/Tourist');
const {
  authenticate,
  isAdministration
} = require('../../../Middlewares/auth');

// Update authority status (matches your frontend API call)
router.patch('/administration/authorities/:id/status', authenticate, isAdministration, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.authority._id;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected, suspended'
      });
    }

    // Check if authority exists
    const authority = await Authority.findById(id);
    if (!authority) {
      return res.status(404).json({
        success: false,
        message: 'Authority not found'
      });
    }

    // Prepare update data
    const updateData = { status };
    
    if (status === 'approved') {
      updateData.approvedBy = adminId;
      updateData.approvedAt = new Date();
    } else if (status === 'rejected' || status === 'suspended') {
      updateData.approvedBy = null;
      updateData.approvedAt = null;
    }

    // Update authority
    const updatedAuthority = await Authority.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').populate('approvedBy', 'fullName email');

    res.json({
      success: true,
      data: updatedAuthority,
      message: `Authority status updated to ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating authority status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update authority status'
    });
  }
});

// Get all authorities (Administration only)
router.get('/administration/authorities', authenticate, isAdministration, async (req, res) => {
  try {
    const authorities = await Authority.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: authorities,
      message: 'Authorities fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching authorities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch authorities'
    });
  }
});

// Get authorities by status (Administration only)
router.get('/administration/authorities/status/:status', authenticate, isAdministration, async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected, suspended'
      });
    }

    const authorities = await Authority.find({ status })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: authorities,
      message: `${status} authorities fetched successfully`
    });
  } catch (error) {
    console.error('Error fetching authorities by status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch authorities'
    });
  }
});

// Get authorities by department (Administration only)
router.get('/administration/authorities/department/:department', authenticate, isAdministration, async (req, res) => {
  try {
    const { department } = req.params;
    const validDepartments = ['police', 'tourism', 'emergency', 'customs', 'transport', 'administration'];
    
    if (!validDepartments.includes(department)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department'
      });
    }

    const authorities = await Authority.find({ department })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: authorities,
      message: `${department} authorities fetched successfully`
    });
  } catch (error) {
    console.error('Error fetching authorities by department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch authorities'
    });
  }
});

// Get authority by ID (Administration only)
router.get('/administration/authorities/:id', authenticate, isAdministration, async (req, res) => {
  try {
    const { id } = req.params;
    
    const authority = await Authority.findById(id)
      .select('-password')
      .populate('approvedBy', 'fullName email');

    if (!authority) {
      return res.status(404).json({
        success: false,
        message: 'Authority not found'
      });
    }

    res.json({
      success: true,
      data: authority,
      message: 'Authority fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching authority:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch authority'
    });
  }
});

// Update authority status (Administration only)
router.patch('/administration/authorities/:id/status', authenticate, isAdministration, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.authority._id;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected, suspended'
      });
    }

    // Check if authority exists
    const authority = await Authority.findById(id);
    if (!authority) {
      return res.status(404).json({
        success: false,
        message: 'Authority not found'
      });
    }

    // Prepare update data
    const updateData = { status };
    
    if (status === 'approved') {
      updateData.approvedBy = adminId;
      updateData.approvedAt = new Date();
    } else if (status === 'rejected' || status === 'suspended') {
      updateData.approvedBy = null;
      updateData.approvedAt = null;
    }

    // Update authority
    const updatedAuthority = await Authority.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').populate('approvedBy', 'fullName email');

    res.json({
      success: true,
      data: updatedAuthority,
      message: `Authority status updated to ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating authority status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update authority status'
    });
  }
});

// Get authority statistics (Administration only)
router.get('/administration/stats', authenticate, isAdministration, async (req, res) => {
  try {
    const stats = await Authority.aggregate([
      {
        $group: {
          _id: null,
          totalAuthorities: { $sum: 1 },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          approvedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          },
          suspendedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] }
          }
        }
      }
    ]);

    const departmentStats = await Authority.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalAuthorities: 0,
          pendingCount: 0,
          approvedCount: 0,
          rejectedCount: 0,
          suspendedCount: 0
        },
        departments: departmentStats
      },
      message: 'Authority statistics fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching authority statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch authority statistics'
    });
  }
});

// Search authorities (Administration only)
router.get('/administration/search', authenticate, isAdministration, async (req, res) => {
  try {
    const { q, status, department, limit = 50, page = 1 } = req.query;
    
    // Build search query
    const searchQuery = {};
    
    if (q) {
      searchQuery.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { badgeNumber: { $regex: q, $options: 'i' } },
        { jurisdiction: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      searchQuery.status = status;
    }
    
    if (department && department !== 'all') {
      searchQuery.department = department;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [authorities, totalCount] = await Promise.all([
      Authority.find(searchQuery)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Authority.countDocuments(searchQuery)
    ]);

    res.json({
      success: true,
      data: {
        authorities,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: skip + authorities.length < totalCount,
          hasPrev: parseInt(page) > 1
        }
      },
      message: 'Search results fetched successfully'
    });
  } catch (error) {
    console.error('Error searching authorities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search authorities'
    });
  }
});

// Bulk update authority statuses (Administration only)
router.patch('/administration/authorities/bulk-update', authenticate, isAdministration, async (req, res) => {
  try {
    const { authorityIds, status } = req.body;
    const adminId = req.authority._id;

    if (!authorityIds || !Array.isArray(authorityIds) || authorityIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Authority IDs array is required'
      });
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Prepare update data
    const updateData = { status };
    
    if (status === 'approved') {
      updateData.approvedBy = adminId;
      updateData.approvedAt = new Date();
    } else if (status === 'rejected' || status === 'suspended') {
      updateData.approvedBy = null;
      updateData.approvedAt = null;
    }

    const result = await Authority.updateMany(
      { _id: { $in: authorityIds } },
      updateData
    );

    res.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      },
      message: `Successfully updated ${result.modifiedCount} authorities to ${status}`
    });
  } catch (error) {
    console.error('Error bulk updating authorities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk update authorities'
    });
  }
});

// Delete authority (Administration only) - Use with caution
router.delete('/administration/authorities/:id', authenticate, isAdministration, async (req, res) => {
  try {
    const { id } = req.params;
    
    const authority = await Authority.findById(id);
    if (!authority) {
      return res.status(404).json({
        success: false,
        message: 'Authority not found'
      });
    }

    // Prevent deletion of approved authorities for data integrity
    if (authority.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete approved authority. Consider suspending instead.'
      });
    }

    await Authority.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Authority deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting authority:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete authority'
    });
  }
});

// ==================== TEST ENDPOINT ====================

// Test endpoint to verify authentication is working
router.get('/test', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Authentication working',
      authority: {
        id: req.authority._id,
        fullName: req.authority.fullName,
        department: req.authority.department,
        status: req.authority.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test endpoint error',
      error: error.message
    });
  }
});

// ==================== TOURIST MANAGEMENT ====================

// Get all tourists with live locations and KYC status
router.get('/tourists', authenticate, async (req, res) => {
  try {
    const { status, kyc, location, limit = 50, page = 1 } = req.query;

    const query = {};

    if (status) {
      query.isVerified = status === 'verified';
    }

    if (kyc && kyc !== 'all') {
      query.kycStatus = kyc;
    }

    if (location === 'tracking') {
      query.locationTrackingEnabled = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tourists, totalCount] = await Promise.all([
      Tourist.find(query)
        .select('-password')
        .sort({ lastLogin: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('kycVerifiedBy', 'fullName badgeNumber'),
      Tourist.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        tourists,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: skip + tourists.length < totalCount,
          hasPrev: parseInt(page) > 1
        }
      },
      message: 'Tourists fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching tourists:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tourists'
    });
  }
});

// Get tourist by ID with full details
router.get('/tourists/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const tourist = await Tourist.findById(id)
      .select('-password')
      .populate('kycVerifiedBy', 'fullName badgeNumber department');

    if (!tourist) {
      return res.status(404).json({
        success: false,
        message: 'Tourist not found'
      });
    }

    res.json({
      success: true,
      data: tourist,
      message: 'Tourist details fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching tourist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tourist details'
    });
  }
});

// Get all tourists with live locations (for map view)
router.get('/tourists/locations/live', authenticate, async (req, res) => {
  try {
    const tourists = await Tourist.find({
      locationTrackingEnabled: true,
      'currentLocation.latitude': { $exists: true },
      'currentLocation.longitude': { $exists: true }
    })
    .select('username fullName currentLocation phone kycStatus emergencyContacts')
    .sort({ 'currentLocation.timestamp': -1 });

    const locationData = tourists.map(tourist => ({
      id: tourist._id,
      username: tourist.username,
      fullName: tourist.fullName || tourist.username,
      phone: tourist.phone,
      kycStatus: tourist.kycStatus,
      location: tourist.currentLocation,
      emergencyContacts: tourist.emergencyContacts,
      lastUpdate: tourist.currentLocation.timestamp
    }));

    res.json({
      success: true,
      data: locationData,
      message: 'Live tourist locations fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching live locations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live locations'
    });
  }
});

// Get tourist location history
router.get('/tourists/:id/location-history', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const tourist = await Tourist.findById(id).select('locationHistory username fullName');

    if (!tourist) {
      return res.status(404).json({
        success: false,
        message: 'Tourist not found'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const locationHistory = tourist.locationHistory
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: {
        tourist: {
          id: tourist._id,
          username: tourist.username,
          fullName: tourist.fullName
        },
        locationHistory,
        pagination: {
          currentPage: parseInt(page),
          totalEntries: tourist.locationHistory.length,
          hasNext: skip + locationHistory.length < tourist.locationHistory.length,
          hasPrev: parseInt(page) > 1
        }
      },
      message: 'Location history fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching location history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location history'
    });
  }
});

// ==================== KYC MANAGEMENT ====================

// Get all pending KYC applications
router.get('/kyc/pending', authenticate, async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, totalCount] = await Promise.all([
      Tourist.find({ kycStatus: 'pending' })
        .select('-password')
        .sort({ kycAppliedAt: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Tourist.countDocuments({ kycStatus: 'pending' })
    ]);

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: skip + applications.length < totalCount,
          hasPrev: parseInt(page) > 1
        }
      },
      message: 'Pending KYC applications fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching pending KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending KYC applications'
    });
  }
});

// Approve KYC application
router.patch('/kyc/:touristId/approve', authenticate, async (req, res) => {
  try {
    const { touristId } = req.params;
    const authorityId = req.authority._id;

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({
        success: false,
        message: 'Tourist not found'
      });
    }

    if (tourist.kycStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'KYC application is not in pending status'
      });
    }

    tourist.kycStatus = 'approved';
    tourist.kycVerifiedAt = new Date();
    tourist.kycVerifiedBy = authorityId;
    tourist.kycRejectionReason = undefined;
    await tourist.save();

    const updatedTourist = await Tourist.findById(touristId)
      .select('-password')
      .populate('kycVerifiedBy', 'fullName badgeNumber department');

    res.json({
      success: true,
      data: updatedTourist,
      message: 'KYC application approved successfully'
    });
  } catch (error) {
    console.error('Error approving KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve KYC application'
    });
  }
});

// Reject KYC application
router.patch('/kyc/:touristId/reject', authenticate, async (req, res) => {
  try {
    const { touristId } = req.params;
    const { reason } = req.body;
    const authorityId = req.authority._id;

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({
        success: false,
        message: 'Tourist not found'
      });
    }

    if (tourist.kycStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'KYC application is not in pending status'
      });
    }

    tourist.kycStatus = 'rejected';
    tourist.kycRejectionReason = reason.trim();
    tourist.kycVerifiedAt = new Date();
    tourist.kycVerifiedBy = authorityId;
    await tourist.save();

    const updatedTourist = await Tourist.findById(touristId)
      .select('-password')
      .populate('kycVerifiedBy', 'fullName badgeNumber department');

    res.json({
      success: true,
      data: updatedTourist,
      message: 'KYC application rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting KYC:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject KYC application'
    });
  }
});

// Get KYC statistics
router.get('/kyc/stats', authenticate, async (req, res) => {
  try {
    const stats = await Tourist.aggregate([
      {
        $group: {
          _id: null,
          totalTourists: { $sum: 1 },
          notApplied: {
            $sum: { $cond: [{ $eq: ['$kycStatus', 'not_applied'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$kycStatus', 'pending'] }, 1, 0] }
          },
          approved: {
            $sum: { $cond: [{ $eq: ['$kycStatus', 'approved'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$kycStatus', 'rejected'] }, 1, 0] }
          }
        }
      }
    ]);

    const recentActivity = await Tourist.find({
      kycStatus: { $in: ['approved', 'rejected'] }
    })
    .select('username fullName kycStatus kycVerifiedAt kycVerifiedBy')
    .populate('kycVerifiedBy', 'fullName badgeNumber')
    .sort({ kycVerifiedAt: -1 })
    .limit(10);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalTourists: 0,
          notApplied: 0,
          pending: 0,
          approved: 0,
          rejected: 0
        },
        recentActivity
      },
      message: 'KYC statistics fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching KYC stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KYC statistics'
    });
  }
});

// Search tourists
router.get('/tourists/search', authenticate, async (req, res) => {
  try {
    const { q, kyc, verified, location, limit = 50, page = 1 } = req.query;

    const searchQuery = {};

    if (q) {
      searchQuery.$or = [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { passportNumber: { $regex: q, $options: 'i' } }
      ];
    }

    if (kyc && kyc !== 'all') {
      searchQuery.kycStatus = kyc;
    }

    if (verified && verified !== 'all') {
      searchQuery.isVerified = verified === 'true';
    }

    if (location === 'tracking') {
      searchQuery.locationTrackingEnabled = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tourists, totalCount] = await Promise.all([
      Tourist.find(searchQuery)
        .select('-password')
        .sort({ lastLogin: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('kycVerifiedBy', 'fullName badgeNumber'),
      Tourist.countDocuments(searchQuery)
    ]);

    res.json({
      success: true,
      data: {
        tourists,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: skip + tourists.length < totalCount,
          hasPrev: parseInt(page) > 1
        }
      },
      message: 'Search results fetched successfully'
    });
  } catch (error) {
    console.error('Error searching tourists:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search tourists'
    });
  }
});

// ==================== QR CODE VERIFICATION ====================

// Verify tourist QR code
router.post('/verify-tourist', authenticate, async (req, res) => {
  try {
    const { userId, qrCodeData } = req.body;
    const authorityId = req.authority._id;

    if (!userId || !qrCodeData) {
      return res.status(400).json({
        success: false,
        error: 'User ID and QR code data are required',
        status: 'error'
      });
    }

    const tourist = await Tourist.findById(userId)
      .select('-password')
      .populate('kycVerifiedBy', 'fullName badgeNumber department');

    if (!tourist) {
      return res.status(404).json({
        success: false,
        error: 'Tourist not found',
        status: 'error'
      });
    }

    const isDataValid = (
      qrCodeData.profile.fullName === tourist.fullName &&
      qrCodeData.profile.email === tourist.email &&
      qrCodeData.profile.phone === tourist.phone &&
      qrCodeData.kyc?.status === tourist.kycStatus
    );

    if (!isDataValid) {
      return res.status(400).json({
        success: false,
        error: 'QR code data does not match tourist records',
        status: 'error'
      });
    }

    if (tourist.kycStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        error: `Tourist KYC status is ${tourist.kycStatus}, not approved`,
        status: 'warning'
      });
    }

    const verificationLog = {
      verifiedBy: authorityId,
      verifiedAt: new Date(),
      qrCodeData: {
        scannedAt: new Date(),
        verificationMethod: 'qr_scan'
      }
    };

    if (!tourist.verificationHistory) {
      tourist.verificationHistory = [];
    }
    tourist.verificationHistory.push(verificationLog);
    await tourist.save();

    res.json({
      success: true,
      data: {
        tourist: {
          id: tourist._id,
          fullName: tourist.fullName,
          email: tourist.email,
          phone: tourist.phone,
          kycStatus: tourist.kycStatus,
          kycVerifiedAt: tourist.kycVerifiedAt,
          kycVerifiedBy: tourist.kycVerifiedBy,
          emergencyContacts: tourist.emergencyContacts
        },
        verification: verificationLog
      },
      message: 'Tourist QR code verified successfully',
      status: 'success'
    });
  } catch (error) {
    console.error('Error verifying tourist QR code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify tourist QR code',
      status: 'error'
    });
  }
});

module.exports = router;