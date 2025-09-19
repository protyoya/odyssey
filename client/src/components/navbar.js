'use client';
import { useState, useEffect } from 'react';
import { Shield, Menu, X, User, Settings, LogOut, Home, MapPin, Users, AlertTriangle, Phone, UserPlus } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authorityData, setAuthorityData] = useState(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('authorityData');
      
      if (token && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          setIsAuthenticated(true);
          setAuthorityData(parsedUserData);
        } catch (error) {
          console.error('Error parsing authority data:', error);
          // Clear invalid data
          localStorage.removeItem('authToken');
          localStorage.removeItem('authorityData');
          setIsAuthenticated(false);
          setAuthorityData(null);
        }
      } else {
        setIsAuthenticated(false);
        setAuthorityData(null);
      }
    };

    checkAuth();

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileOpen(false);
      setIsMenuOpen(false);
    };
    
    if (isProfileOpen || isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isProfileOpen, isMenuOpen]);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Optional: Call logout API
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      await fetch(`${backendUrl}/api/auth/authorities/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authorityData');
      setIsAuthenticated(false);
      setAuthorityData(null);
      setIsProfileOpen(false);
      
      // Redirect to login or home page
      window.location.href = '/login';
    }
  };

  const navigationItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', active: true, authRequired: true },
    { name: 'Locations', icon: MapPin, href: '/locations', authRequired: true },
    { name: 'Authorities', icon: Users, href: '/authorities', authRequired: true },
    { name: 'Alerts', icon: AlertTriangle, href: '/alerts', authRequired: true },
    { name: 'Support', icon: Phone, href: '/support', authRequired: true }
  ];

  // Filter navigation items based on authentication status
  const filteredNavItems = navigationItems.filter(item => 
    !item.authRequired || isAuthenticated
  );

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/20 shadow-2xl shadow-black/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            
            {/* Logo Section */}
            <div className="flex items-center group cursor-pointer" onClick={() => window.location.href = '/'}>
              <div className="relative">
                <div className={`flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-2xl transition-all duration-300 group-hover:scale-105 ${
                  scrolled ? 'bg-white/10 border border-white/20' : 'bg-black/30 backdrop-blur-sm border border-white/30'
                }`}>
                  <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="ml-3 lg:ml-4">
                <h1 className="text-lg lg:text-xl xl:text-2xl font-bold text-white tracking-tight drop-shadow-lg">
                  ODYSSEY
                </h1>
                <p className="text-xs lg:text-sm text-gray-300/80 font-medium">
                  Tourist Safety Network
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {filteredNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`group relative flex items-center px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      item.active
                        ? 'text-white bg-white/15 backdrop-blur-sm'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 mr-2.5 transition-all duration-300 ${
                      item.active ? 'text-white' : 'text-gray-400 group-hover:text-white group-hover:scale-110'
                    }`} />
                    <span className="text-sm">{item.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              
              {/* Authentication Section */}
              {isAuthenticated ? (
                /* Profile Dropdown for Authenticated Users */
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileOpen(!isProfileOpen);
                    }}
                    className={`flex items-center space-x-2.5 p-2 lg:px-3 lg:py-2.5 rounded-xl transition-all duration-300 group ${
                      scrolled 
                        ? 'text-gray-300 hover:text-white hover:bg-white/15' 
                        : 'text-gray-200 hover:text-white hover:bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    <div className="relative w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-white/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <span className="text-xs font-semibold text-white">
                        {getUserInitials(authorityData?.fullName)}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-white">
                      {authorityData?.fullName?.split(' ')[0] || 'Authority'}
                    </span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                      <div className="px-4 py-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {getUserInitials(authorityData?.fullName)}
                            </span>
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">
                              {authorityData?.fullName || 'Authority User'}
                            </p>
                            <p className="text-gray-400 text-xs capitalize">
                              {authorityData?.department?.replace('_', ' ') || 'Department'}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {authorityData?.jurisdiction || 'Area of Jurisdiction'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <a href="/profile" className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group">
                          <User className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                          <span className="text-sm">Profile Settings</span>
                        </a>
                        <a href="/settings" className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group">
                          <Settings className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                          <span className="text-sm">Preferences</span>
                        </a>
                      </div>
                      
                      <div className="border-t border-white/10">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
                        >
                          <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Login Button for Non-Authenticated Users */
                <div className="hidden md:flex items-center space-x-2">
                  <a
                    href="/login"
                    className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 hover:border-white/30 rounded-xl text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-105"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Sign In</span>
                  </a>
                  <a
                    href="/signup"
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    <span className="text-sm">Register</span>
                  </a>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 group ${
                  scrolled 
                    ? 'text-gray-300 hover:text-white hover:bg-white/15' 
                    : 'text-gray-200 hover:text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <Menu className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-out overflow-hidden ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-black/90 backdrop-blur-xl border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {/* Mobile Navigation Items */}
              {filteredNavItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                      item.active
                        ? 'text-white bg-white/15 backdrop-blur-sm'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <IconComponent className={`w-5 h-5 mr-4 transition-all duration-300 ${
                      item.active ? 'text-white' : 'text-gray-400 group-hover:text-white group-hover:scale-110'
                    }`} />
                    <span>{item.name}</span>
                    {item.active && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </a>
                );
              })}

              {/* Mobile Auth Buttons */}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <a
                    href="/login"
                    className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                  >
                    <User className="w-5 h-5 mr-4" />
                    <span>Sign In</span>
                  </a>
                  <a
                    href="/signup"
                    className="flex items-center px-4 py-3 text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all duration-300"
                  >
                    <UserPlus className="w-5 h-5 mr-4" />
                    <span>Register</span>
                  </a>
                </div>
              )}

              {/* Mobile Profile Actions */}
              {isAuthenticated && (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="px-4 py-3 bg-white/5 rounded-xl">
                    <p className="text-white text-sm font-semibold">
                      {authorityData?.fullName || 'Authority User'}
                    </p>
                    <p className="text-gray-400 text-xs capitalize">
                      {authorityData?.department?.replace('_', ' ') || 'Department'}
                    </p>
                  </div>
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                  >
                    <User className="w-5 h-5 mr-4" />
                    <span>Profile Settings</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5 mr-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(-20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
      `}</style>
    </>
  );
}