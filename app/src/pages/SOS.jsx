import React, { useState } from 'react';
import { Phone, MapPin, Heart, Shield, Flame, Car, Users, AlertTriangle, Clock, Star, Zap, Search, Menu } from 'lucide-react';

const SOSPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const emergencyContacts = [
    {
      id: 1,
      category: "Critical Emergency",
      priority: "high",
      contacts: [
        { id: 'police', name: "Police", number: "100", icon: Shield, priority: "critical", description: "Law enforcement emergency" },
        { id: 'fire', name: "Fire Brigade", number: "101", icon: Flame, priority: "critical", description: "Fire & rescue services" },
        { id: 'ambulance', name: "Ambulance", number: "102", icon: Heart, priority: "critical", description: "Medical emergency transport" },
        { id: 'disaster', name: "Disaster Management", number: "108", icon: AlertTriangle, priority: "high", description: "Natural disaster response" }
      ]
    },
    {
      id: 2,
      category: "Medical Services",
      priority: "high",
      contacts: [
        { id: 'medical', name: "Medical Emergency", number: "108", icon: Heart, priority: "high", description: "General medical emergency" },
        { id: 'ambulance_private', name: "Private Ambulance", number: "1298", icon: Car, priority: "medium", description: "Private medical transport" },
        { id: 'blood_bank', name: "Blood Bank", number: "104", icon: Heart, priority: "medium", description: "Blood donation & supply" }
      ]
    },
    {
      id: 3,
      category: "Safety Helplines",
      priority: "medium",
      contacts: [
        { id: 'women', name: "Women Helpline", number: "1091", icon: Users, priority: "high", description: "Women safety & support" },
        { id: 'child', name: "Child Helpline", number: "1098", icon: Users, priority: "high", description: "Child protection services" },
        { id: 'senior', name: "Senior Citizens", number: "14567", icon: Users, priority: "medium", description: "Elderly care & support" },
        { id: 'cyber', name: "Cyber Crime", number: "155", icon: Shield, priority: "medium", description: "Online fraud & cyber crimes" }
      ]
    },
    {
      id: 4,
      category: "Transport & Travel",
      priority: "medium",
      contacts: [
        { id: 'tourist', name: "Tourist Help", number: "1363", icon: MapPin, priority: "low", description: "Tourist assistance & info" },
        { id: 'highway', name: "Highway Emergency", number: "1033", icon: Car, priority: "medium", description: "Road emergency assistance" },
        { id: 'railway', name: "Railway Enquiry", number: "139", icon: Car, priority: "low", description: "Train info & emergencies" }
      ]
    },
    {
      id: 5,
      category: "Utilities",
      priority: "medium",
      contacts: [
        { id: 'gas', name: "LPG Gas Leak", number: "1906", icon: Flame, priority: "high", description: "Gas leak emergency" },
        { id: 'electricity', name: "Power Outage", number: "1912", icon: Zap, priority: "medium", description: "Electrical emergencies" },
        { id: 'water', name: "Water Supply", number: "1916", icon: AlertTriangle, priority: "low", description: "Water supply issues" }
      ]
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/10 border-red-500/20';
      case 'high': return 'bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 border-green-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const makeCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const filteredContacts = emergencyContacts.map(category => ({
    ...category,
    contacts: category.contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.number.includes(searchTerm) ||
      contact.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.contacts.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(147, 51, 234, 0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Professional Header */}
        <header className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50">
          <div className="max-w-7xl mt-20 mx-auto px-6 py-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-2xl mb-4 border border-gray-700">
                <AlertTriangle className="w-8 h-8 text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Emergency Services Directory
              </h1>
              <p className="text-gray-400 text-lg">India • Available 24/7</p>
              <div className="flex items-center justify-center mt-4 text-gray-500">
                <Clock size={16} className="mr-2" />
                <span className="text-sm font-medium">Last updated: September 2025</span>
              </div>
            </div>
          </div>
        </header>

        {/* Search and Quick Stats */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search emergency services, numbers, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Services</p>
                  <p className="text-white text-2xl font-bold">
                    {emergencyContacts.reduce((acc, cat) => acc + cat.contacts.length, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Critical Emergency Cards */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <div className="w-2 h-8 bg-red-500 rounded-full mr-4"></div>
              Critical Emergency Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {emergencyContacts[0].contacts.map((contact) => {
                const IconComponent = contact.icon;
                const isFavorite = favorites.includes(contact.id);
                
                return (
                  <div
                    key={contact.id}
                    className="group bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${getPriorityBg(contact.priority)} border`}>
                        <IconComponent size={24} className={getPriorityColor(contact.priority)} />
                      </div>
                      <button
                        onClick={() => toggleFavorite(contact.id)}
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Star 
                          size={18} 
                          className={isFavorite ? "text-yellow-400 fill-current" : "text-gray-500"} 
                        />
                      </button>
                    </div>
                    
                    <h3 className="font-semibold text-white mb-1">{contact.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{contact.description}</p>
                    
                    <button
                      onClick={() => makeCall(contact.number)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Phone size={18} />
                      <span>{contact.number}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* All Services */}
        <section className="max-w-7xl mx-auto px-6 pb-12">
          {filteredContacts.slice(1).map((category, categoryIndex) => (
            <div key={category.id} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <div className="w-2 h-6 bg-purple-500 rounded-full mr-4"></div>
                  {category.category}
                </h2>
                <button
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Menu size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.contacts.map((contact) => {
                  const IconComponent = contact.icon;
                  const isFavorite = favorites.includes(contact.id);
                  
                  return (
                    <div
                      key={contact.id}
                      className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-700 rounded-lg">
                            <IconComponent size={20} className="text-gray-300" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">{contact.name}</h3>
                            <p className="text-gray-400 text-xs">{contact.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(contact.priority).replace('text-', 'bg-')}`}></div>
                          <button
                            onClick={() => toggleFavorite(contact.id)}
                            className="p-1 rounded hover:bg-gray-700 transition-colors"
                          >
                            <Star 
                              size={16} 
                              className={isFavorite ? "text-yellow-400 fill-current" : "text-gray-500"} 
                            />
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => makeCall(contact.number)}
                        className="w-full bg-gray-700 hover:bg-purple-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Phone size={16} />
                        <span>{contact.number}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Professional Footer with Important Information */}
        <footer className="bg-gray-900 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {/* Important Notes */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                  Emergency Guidelines
                </h3>
                <div className="space-y-3 text-gray-400 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Keep your device charged and know your exact location before calling</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Stay calm and provide clear, accurate information to emergency responders</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>All emergency numbers are toll-free and operate 24/7 across India</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Some services may have regional variations - verify local numbers when possible</p>
                  </div>
                </div>
              </div>

              {/* Priority Legend */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Priority Levels</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-gray-400 text-sm">Critical - Immediate life threat</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <span className="text-gray-400 text-sm">High - Urgent assistance needed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-400 text-sm">Medium - Important services</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-400 text-sm">Low - General assistance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-700 pt-6 text-center">
              <p className="text-gray-500 text-sm mb-2">
                Emergency Services Directory for India • Data verified as of September 2025
              </p>
              <div className="flex items-center justify-center space-x-6 text-gray-600 text-xs">
                <span>Reliable</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span>Accessible</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <span>Always Available</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SOSPage;