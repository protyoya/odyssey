// routes/authorities.js
const express = require('express');
const router = express.Router();
const Authority = require('../../../Models/Authorities/Authority');
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

module.exports = router;