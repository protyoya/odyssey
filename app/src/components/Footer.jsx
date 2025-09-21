import React from 'react';
import { 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Twitter, 
  Linkedin, 
  Github,
  ArrowRight,
  Award,
  Lock,
  Zap,
  Users,
  Heart,
  ExternalLink
} from 'lucide-react';

const OdysseyFooter = () => {
  const quickLinks = [
    { name: 'AI Monitoring', href: '#ai-monitoring' },
    { name: 'Blockchain Security', href: '#blockchain' },
    { name: 'Emergency Response', href: '#emergency' },
    { name: 'Analytics Dashboard', href: '#analytics' },
    { name: 'API Documentation', href: '#api-docs' },
    { name: 'Developer Resources', href: '#dev-resources' }
  ];

  const solutions = [
    { name: 'Tourism Departments', href: '#tourism' },
    { name: 'Law Enforcement', href: '#law-enforcement' },
    { name: 'Hotels & Resorts', href: '#hospitality' },
    { name: 'Adventure Tourism', href: '#adventure' },
    { name: 'Travel Agencies', href: '#travel-agencies' },
    { name: 'Emergency Services', href: '#emergency-services' }
  ];

  const regions = [
    { name: 'Northeast India', href: '#northeast' },
    { name: 'Kashmir Valley', href: '#kashmir' },
    { name: 'Himachal Pradesh', href: '#himachal' },
    { name: 'Uttarakhand', href: '#uttarakhand' },
    { name: 'Rajasthan', href: '#rajasthan' },
    { name: 'Kerala Backwaters', href: '#kerala' }
  ];

  const certifications = [
    { name: 'ISO 27001', desc: 'Information Security' },
    { name: 'GDPR Compliant', desc: 'Data Protection' },
    { name: 'SOC 2 Type II', desc: 'Security Controls' },
    { name: 'CERT-In Approved', desc: 'Indian Certification' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-black via-gray-900 to-black border-t border-gray-800/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                Stay Updated with
                <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Security Insights
                </span>
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Get the latest updates on tourist safety, security alerts, and platform enhancements 
                delivered directly to your inbox.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                />
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg">
                  Subscribe
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Your data is secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>10,000+ subscribers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-pulse"></div>
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Odyssey
                </span>
                <div className="text-sm text-gray-500">Smart Tourist Safety Platform</div>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed max-w-md">
              India's most advanced Smart Tourist Safety Monitoring & Incident Response System, 
              protecting millions of travelers with cutting-edge AI, blockchain technology, and IoT integration.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>New Delhi, India - Government of India Initiative</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-purple-400" />
                <span>24/7 Emergency: +91-1800-Odyssey</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-purple-400" />
                <span>support@Odyssey.gov.in</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {[
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Github, href: '#', label: 'GitHub' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800/50 rounded-xl flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 group"
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Platform</h4>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Solutions</h4>
            <ul className="space-y-4">
              {solutions.map((solution, index) => (
                <li key={index}>
                  <a
                    href={solution.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                  >
                    <span>{solution.name}</span>
                    <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Coverage Areas</h4>
            <ul className="space-y-4">
              {regions.map((region, index) => (
                <li key={index}>
                  <a
                    href={region.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                  >
                    <span>{region.name}</span>
                    <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-800/50 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6 text-gray-400 text-sm">
              <span>© 2025 Odyssey - Smart Tourist Safety Platform. All rights reserved.</span>
              <span className="hidden lg:block">•</span>
              <span>A Government of India Initiative</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              <div className="flex items-center space-x-2 text-gray-400">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Made in India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default OdysseyFooter;