'use client';
import { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye, 
  MoreVertical, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  RefreshCw,
  RotateCcw
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AuthorityManagement() {
  const [authorities, setAuthorities] = useState([]);
  const [filteredAuthorities, setFilteredAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [showActionDropdown, setShowActionDropdown] = useState(null);

  // Fetch authorities data
  useEffect(() => {
    fetchAuthorities();
  }, []);

  // Filter authorities based on search and filters
  useEffect(() => {
    let filtered = authorities;

    if (searchTerm) {
      filtered = filtered.filter(auth => 
        auth.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auth.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auth.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auth.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(auth => auth.status === statusFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(auth => auth.department === departmentFilter);
    }

    setFilteredAuthorities(filtered);
  }, [authorities, searchTerm, statusFilter, departmentFilter]);

  const fetchAuthorities = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${backendUrl}/api/authorities/administration/authorities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuthorities(data.data || []);
      } else {
        console.error('Failed to fetch authorities');
        setAuthorities([]); // Clear data on failure
      }
    } catch (error) {
      console.error('Error fetching authorities:', error);
      setAuthorities([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (authorityId, newStatus) => {
    try {
      setActionLoading(authorityId);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const token = localStorage.getItem('authToken');
      
      // Fixed URL to match the backend route
      const response = await fetch(`${backendUrl}/api/authorities/administration/authorities/${authorityId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setAuthorities(prev => 
          prev.map(auth => 
            auth._id === authorityId 
              ? { ...auth, status: newStatus, approvedAt: newStatus === 'approved' ? new Date() : auth.approvedAt }
              : auth
          )
        );
        // Close dropdown after action
        setShowActionDropdown(null);
      } else {
        console.error('Failed to update authority status');
      }
    } catch (error) {
      console.error('Error updating authority status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { 
        icon: Clock, 
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        text: 'Pending'
      },
      approved: { 
        icon: CheckCircle, 
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        text: 'Approved'
      },
      rejected: { 
        icon: XCircle, 
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        text: 'Rejected'
      },
      suspended: { 
        icon: Pause, 
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        text: 'Suspended'
      }
    };

    const badge = badges[status] || badges.pending;
    const IconComponent = badge.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${badge.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    );
  };

  const getDepartmentName = (dept) => {
    const departments = {
      police: 'Police Department',
      tourism: 'Tourism Board',
      emergency: 'Emergency Services',
      customs: 'Customs & Immigration',
      transport: 'Transport Authority',
      administration: 'Administration'
    };
    return departments[dept] || dept;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvailableActions = (authority) => {
    const actions = [];
    
    switch (authority.status) {
      case 'pending':
        actions.push(
          { label: 'Approve', action: 'approved', icon: Check, color: 'text-green-400' },
          { label: 'Reject', action: 'rejected', icon: X, color: 'text-red-400' }
        );
        break;
      case 'approved':
        actions.push(
          { label: 'Suspend', action: 'suspended', icon: Pause, color: 'text-orange-400' }
        );
        break;
      case 'suspended':
        actions.push(
          { label: 'Reactivate', action: 'approved', icon: RotateCcw, color: 'text-green-400' },
          { label: 'Reject', action: 'rejected', icon: X, color: 'text-red-400' }
        );
        break;
      case 'rejected':
        actions.push(
          { label: 'Approve', action: 'approved', icon: Check, color: 'text-green-400' },
          { label: 'Set Pending', action: 'pending', icon: Clock, color: 'text-yellow-400' }
        );
        break;
    }
    
    return actions;
  };

  return (
    <ProtectedRoute department="administration">
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white bg-gradient-to-br from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Authority Management
                </h1>
                <p className="text-gray-300 text-sm">
                  Review and manage authority registrations
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Authorities', value: authorities.length, icon: Shield, color: 'from-blue-500 to-blue-600' },
                { label: 'Pending', value: authorities.filter(a => a.status === 'pending').length, icon: Clock, color: 'from-yellow-500 to-yellow-600' },
                { label: 'Approved', value: authorities.filter(a => a.status === 'approved').length, icon: CheckCircle, color: 'from-green-500 to-green-600' },
                { label: 'Rejected/Suspended', value: authorities.filter(a => ['rejected', 'suspended'].includes(a.status)).length, icon: XCircle, color: 'from-red-500 to-red-600' }
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl shadow-black/40 transition-all duration-300 ease-in-out">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl shadow-black/40 transition-all duration-300 ease-in-out">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Search authorities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 min-h-[2.75rem] flex items-center bg-black/30 backdrop-blur-md border border-white/20 rounded-xl text-white text-base md:text-sm leading-5 transition-all duration-300 ease-in-out focus:bg-black/50 focus:border-blue-500/60 focus:ring-3 focus:ring-blue-500/10 focus:outline-none placeholder:text-gray-400/80 placeholder:text-sm"
                />
              </div>

              {/* Status Filter and Department Filter */}
              {['status', 'department'].map((filterType) => (
                <div key={filterType} className="relative">
                   {filterType === 'status' && <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />}
                   <select
                     value={filterType === 'status' ? statusFilter : departmentFilter}
                     onChange={(e) => filterType === 'status' ? setStatusFilter(e.target.value) : setDepartmentFilter(e.target.value)}
                     className={`w-full ${filterType === 'status' ? 'pl-10' : 'pl-4'} pr-8 py-3 min-h-[2.75rem] flex items-center bg-black/30 backdrop-blur-md border border-white/20 rounded-xl text-white text-base md:text-sm leading-5 transition-all duration-300 ease-in-out focus:bg-black/50 focus:border-blue-500/60 focus:ring-3 focus:ring-blue-500/10 focus:outline-none appearance-none cursor-pointer`}
                   >
                     {filterType === 'status' ? (
                        <>
                          <option value="all">All Statuses</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="suspended">Suspended</option>
                        </>
                     ) : (
                        <>
                           <option value="all">All Departments</option>
                           <option value="police">Police Department</option>
                           <option value="tourism">Tourism Board</option>
                           <option value="emergency">Emergency Services</option>
                           <option value="customs">Customs & Immigration</option>
                           <option value="transport">Transport Authority</option>
                           <option value="administration">Administration</option>
                        </>
                     )}
                   </select>
                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                     <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                     </svg>
                   </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-400 text-sm">
                Showing {filteredAuthorities.length} of {authorities.length} authorities
              </p>
              <button 
                onClick={fetchAuthorities}
                className="flex items-center bg-black/30 backdrop-blur-md border border-white/20 text-white py-2 px-4 rounded-xl font-medium text-sm transition-all duration-300 ease-in-out hover:bg-black/50 hover:border-white/30 hover:-translate-y-px hover:shadow-lg hover:shadow-black/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Authorities Table */}
          <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 transition-all duration-300 ease-in-out">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="w-5 h-5 border-2 border-white/30 rounded-full border-t-white animate-spin mr-3"></div>
                <span className="text-gray-300">Loading authorities...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Authority</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Registration Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredAuthorities.map((authority) => (
                      <tr key={authority._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mr-3 shrink-0">
                              <span className="text-sm font-semibold text-white">
                                {authority.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{authority.fullName}</div>
                              <div className="text-sm text-gray-400">{authority.email}</div>
                              <div className="text-xs text-gray-500">Badge: {authority.badgeNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{getDepartmentName(authority.department)}</div>
                          <div className="text-sm text-gray-400">{authority.jurisdiction}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(authority.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(authority.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {/* View Details Button */}
                            <button 
                              onClick={() => { setSelectedAuthority(authority); setShowDetailModal(true); }} 
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            {/* Quick Actions for Pending */}
                            {authority.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleStatusChange(authority._id, 'approved')} 
                                  disabled={actionLoading === authority._id} 
                                  className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {actionLoading === authority._id ? 
                                    <div className="w-4 h-4 border-2 border-white/30 rounded-full border-t-white animate-spin"></div> : 
                                    <Check className="w-4 h-4" />
                                  }
                                </button>
                                <button 
                                  onClick={() => handleStatusChange(authority._id, 'rejected')} 
                                  disabled={actionLoading === authority._id} 
                                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            
                            {/* More Actions Dropdown for other statuses */}
                            {authority.status !== 'pending' && (
                              <div className="relative">
                                <button 
                                  onClick={() => setShowActionDropdown(showActionDropdown === authority._id ? null : authority._id)}
                                  className="p-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                
                                {showActionDropdown === authority._id && (
                                  <div className="absolute right-0 top-full mt-1 bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg z-50 min-w-[140px]">
                                    {getAvailableActions(authority).map((action, index) => {
                                      const IconComponent = action.icon;
                                      return (
                                        <button
                                          key={index}
                                          onClick={() => handleStatusChange(authority._id, action.action)}
                                          disabled={actionLoading === authority._id}
                                          className={`w-full flex items-center px-3 py-2 text-sm ${action.color} hover:bg-white/10 transition-colors disabled:opacity-50 first:rounded-t-lg last:rounded-b-lg`}
                                        >
                                          {actionLoading === authority._id ? (
                                            <div className="w-4 h-4 border-2 border-white/30 rounded-full border-t-white animate-spin mr-2"></div>
                                          ) : (
                                            <IconComponent className="w-4 h-4 mr-2" />
                                          )}
                                          {action.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredAuthorities.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No authorities found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedAuthority && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowDetailModal(false);
              }
            }}
          >
            <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white">Authority Details</h2>
                <button 
                  onClick={() => setShowDetailModal(false)} 
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/30 backdrop-blur-md border border-white/[.15] rounded-xl p-4">
                        <div className="flex items-center mb-3">
                          <User className="w-5 h-5 text-blue-400 mr-2" />
                          <h3 className="font-semibold text-white">Personal Information</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-400">Full Name:</span> <span className="text-white">{selectedAuthority.fullName}</span></p>
                            <p><span className="text-gray-400">Email:</span> <span className="text-white">{selectedAuthority.email}</span></p>
                            <p><span className="text-gray-400">Phone:</span> <span className="text-white">{selectedAuthority.phone || 'N/A'}</span></p>
                        </div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-md border border-white/[.15] rounded-xl p-4">
                        <div className="flex items-center mb-3">
                          <Shield className="w-5 h-5 text-green-400 mr-2" />
                          <h3 className="font-semibold text-white">Authority Details</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-400">Department:</span> <span className="text-white">{getDepartmentName(selectedAuthority.department)}</span></p>
                            <p><span className="text-gray-400">Badge Number:</span> <span className="text-white">{selectedAuthority.badgeNumber}</span></p>
                            <p><span className="text-gray-400">Jurisdiction:</span> <span className="text-white">{selectedAuthority.jurisdiction}</span></p>
                        </div>
                    </div>
                </div>
                <div className="bg-black/30 backdrop-blur-md border border-white/[.15] rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <Calendar className="w-5 h-5 text-purple-400 mr-2" />
                    <h3 className="font-semibold text-white">Status & Timeline</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Current Status</p>
                      {getStatusBadge(selectedAuthority.status)}
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Registration Date</p>
                      <p className="text-white">{formatDate(selectedAuthority.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Last Login</p>
                      <p className="text-white">{formatDate(selectedAuthority.lastLogin)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons in Modal */}
                <div className="flex flex-wrap gap-3">
                  {getAvailableActions(selectedAuthority).map((action, index) => {
                    const IconComponent = action.icon;
                    const isLoading = actionLoading === selectedAuthority._id;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          handleStatusChange(selectedAuthority._id, action.action);
                          setShowDetailModal(false);
                        }}
                        disabled={isLoading}
                        className={`flex items-center justify-center px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ease-in-out disabled:opacity-50 ${
                          action.action === 'approved' 
                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/40'
                            : action.action === 'rejected'
                            ? 'bg-red-600 hover:bg-red-500 text-white'
                            : action.action === 'suspended'
                            ? 'bg-orange-600 hover:bg-orange-500 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 rounded-full border-t-white animate-spin mr-2"></div>
                        ) : (
                          <IconComponent className="w-4 h-4 mr-2" />
                        )}
                        {action.label} Authority
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
    </ProtectedRoute>
  );
}