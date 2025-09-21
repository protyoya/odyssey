import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Menu,
  X,
  ChevronDown,
  Globe,
  Phone,
  Mail,
  MapPin,
  User,
  FileCheck,
  Navigation,
  AlertTriangle,
  LogOut,
  Settings
} from "lucide-react";

const OdysseyNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Routes where transparent navbar should be shown
  const transparentRoutes = ["/", "/login", "/register"];
  const isTransparentRoute = transparentRoutes.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('odyssey_token');
      const userData = localStorage.getItem('odyssey_user');
      
      if (token && userData) {
        setIsLoggedIn(true);
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          handleLogout();
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (for logout from other tabs)
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  // Function to handle navigation
  const handleNavigation = (path, event) => {
    event.preventDefault();
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    
    // Navigate to the route
    navigate(path);
  };

  // Handle external links
  const handleExternalLink = (url, event) => {
    event.preventDefault();
    window.open(url, '_blank');
    setIsMobileMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('odyssey_token');
    localStorage.removeItem('odyssey_user');
    setIsLoggedIn(false);
    setUser(null);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    
    // Navigate to home page
    navigate('/');
  };

  // Handle login navigation
  const handleLogin = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  // Guest navigation items (before login) - mapped to your actual routes
  const guestNavItems = [
    {
      name: "Platform",
      href: "/services",
      dropdown: [
        {
          name: "AI Monitoring",
          href: "/services#ai-monitoring",
          desc: "Real-time threat detection",
        },
        {
          name: "Blockchain Security",
          href: "/services#blockchain",
          desc: "Immutable tourist records",
        },
        {
          name: "Emergency Response",
          href: "/services#emergency",
          desc: "Instant help dispatch",
        },
        {
          name: "Analytics Dashboard",
          href: "/services#analytics",
          desc: "Comprehensive insights",
        },
      ],
    },
    {
      name: "Solutions",
      href: "/services",
      dropdown: [
        {
          name: "Tourism Departments",
          href: "/services#tourism-dept",
          desc: "Government solutions",
        },
        {
          name: "Law Enforcement",
          href: "/services#law-enforcement",
          desc: "Police integration",
        },
        {
          name: "Hotels & Resorts",
          href: "/services#hospitality",
          desc: "Hospitality safety",
        },
        {
          name: "Adventure Tourism",
          href: "/services#adventure",
          desc: "High-risk area monitoring",
        },
      ],
    },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  // Authenticated user navigation items (after login)
  const userNavItems = [
    { 
      name: "Profile", 
      href: "/profile", 
      icon: User,
      dropdown: [
        {
          name: "Personal Info",
          href: "/profile#personal-info",
          desc: "Manage your details",
        },
        {
          name: "Travel History",
          href: "/profile#travel-history",
          desc: "Your past trips",
        },
        {
          name: "Preferences",
          href: "/profile#preferences",
          desc: "Safety & notification settings",
        },
        {
          name: "Emergency Contacts",
          href: "/profile#emergency-contacts",
          desc: "Trusted contacts list",
        },
      ],
    },
    { 
      name: "KYC", 
      href: "/kyc", 
      icon: FileCheck,
      dropdown: [
        {
          name: "Document Verification",
          href: "/kyc#document-verification",
          desc: "Upload and verify documents",
        },
        {
          name: "Identity Status",
          href: "/kyc#identity-status",
          desc: "Check verification status",
        },
        {
          name: "Travel Authorization",
          href: "/kyc#travel-authorization",
          desc: "Regional access permits",
        },
      ],
    },
    { 
      name: "Geofencing", 
      href: "/geofencing", 
      icon: Navigation,
      dropdown: [
        {
          name: "Safe Zones",
          href: "/geofencing#safe-zones",
          desc: "Approved travel areas",
        },
        {
          name: "Restricted Areas",
          href: "/geofencing#restricted-areas",
          desc: "Areas to avoid",
        },
        {
          name: "Location Tracking",
          href: "/geofencing#location-tracking",
          desc: "Real-time location sharing",
        },
        {
          name: "Zone Alerts",
          href: "/geofencing#zone-alerts",
          desc: "Boundary notifications",
        },
      ],
    },
    { 
      name: "SOS", 
      href: "/sos", 
      icon: AlertTriangle,
      dropdown: [
        {
          name: "Emergency Alert",
          href: "/sos#emergency-alert",
          desc: "Send instant SOS",
        },
        {
          name: "Quick Contacts",
          href: "/sos#quick-contacts",
          desc: "Emergency contact list",
        },
        {
          name: "Medical Info",
          href: "/sos#medical-info",
          desc: "Health conditions & allergies",
        },
        {
          name: "Alert History",
          href: "/sos#alert-history",
          desc: "Past emergency alerts",
        },
      ],
    },
  ];

  const currentNavItems = isLoggedIn ? userNavItems : guestNavItems;

  // Function to get navbar background styles
  const getNavbarStyles = () => {
    if (isTransparentRoute) {
      // For transparent routes (home, login), use the scroll-based transparency
      return isScrolled
        ? "bg-black/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl"
        : "bg-transparent";
    } else {
      // For all other routes, always show solid background
      return "bg-black/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl";
    }
  };

  return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarStyles()}`}
      >

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={(e) => handleNavigation("/", e)}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Odyssey
                </span>
                <div className="text-xs text-gray-500 -mt-1">
                  {isLoggedIn ? "Tourist Dashboard" : "Smart Tourist Safety"}
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {currentNavItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="relative group"
                    onMouseEnter={() =>
                      setActiveDropdown(item.dropdown ? index : null)
                    }
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      onClick={(e) => handleNavigation(item.href, e)}
                      className={`flex items-center space-x-2 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-800/30 ${
                        location.pathname === item.href
                          ? "text-purple-400"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      <span className="font-medium">{item.name}</span>
                      {item.dropdown && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === index ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {item.dropdown && (
                      <div
                        className={`absolute top-full left-0 mt-2 w-80 bg-black/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl transition-all duration-300 ${
                          activeDropdown === index
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible translate-y-2"
                        }`}
                      >
                        <div className="p-4">
                          {item.dropdown.map((dropItem, dropIndex) => (
                            <button
                              key={dropIndex}
                              onClick={(e) => handleNavigation(dropItem.href, e)}
                              className="block w-full text-left p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all duration-200 group/item"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 group-hover/item:bg-blue-400 transition-colors"></div>
                                <div>
                                  <h4 className="font-semibold text-white group-hover/item:text-purple-400 transition-colors">
                                    {dropItem.name}
                                  </h4>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {dropItem.desc}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm">
                      <div className="text-white font-medium">
                        {user?.fullName || user?.username || 'User'}
                      </div>
                      <div className="text-gray-400 -mt-1">
                        {user?.isVerified ? 'Verified' : 'Unverified'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-gray-800/30"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800/30"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleLogin}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                  >
                    Register
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-lg bg-gray-800/30 flex items-center justify-center hover:bg-gray-700/30 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-black/95 backdrop-blur-xl border-t border-gray-800/50">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="space-y-4">
                {/* User info for mobile (if logged in) */}
                {isLoggedIn && user && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-gray-800/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {user.fullName || user.username}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {user.isVerified ? 'Verified Account' : 'Unverified Account'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentNavItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index}>
                      <button
                        onClick={(e) => handleNavigation(item.href, e)}
                        className={`flex items-center space-x-3 w-full text-left transition-colors py-3 px-4 rounded-lg hover:bg-gray-800/30 ${
                          location.pathname === item.href
                            ? "text-purple-400"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5" />}
                        <span>{item.name}</span>
                      </button>
                      {item.dropdown && (
                        <div className="ml-8 mt-2 space-y-2">
                          {item.dropdown.map((dropItem, dropIndex) => (
                            <button
                              key={dropIndex}
                              onClick={(e) => handleNavigation(dropItem.href, e)}
                              className="block w-full text-left text-gray-400 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-gray-800/20 text-sm"
                            >
                              {dropItem.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="pt-4 border-t border-gray-800/50 space-y-3">
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full text-left text-red-400 hover:text-red-300 transition-colors py-3 px-4 rounded-lg hover:bg-gray-800/30"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleLogin}
                        className="block w-full text-left text-gray-300 hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-gray-800/30"
                      >
                        Login
                      </button>
                      <button
                        onClick={handleLogin}
                        className="block w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-center"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

  );
};

export default OdysseyNavbar;