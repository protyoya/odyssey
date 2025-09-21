import React, { useState, useEffect } from 'react';
import { Shield, MapPin, Zap, Globe, Users, AlertTriangle, ChevronRight, Play, Star, ArrowRight, Lock, Smartphone, Eye, MessageSquare } from 'lucide-react';

const OdysseyHomepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Blockchain Digital IDs",
      description: "Secure, tamper-proof tourist identification at every entry point"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "AI Anomaly Detection",
      description: "Real-time monitoring with intelligent threat assessment"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Geo-fencing Alerts",
      description: "Instant warnings for restricted and high-risk zones"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Emergency Response",
      description: "One-tap panic button with automatic dispatch system"
    }
  ];

  const stats = [
    { number: "10M+", label: "Tourists Protected" },
    { number: "99.9%", label: "Response Time" },
    { number: "15+", label: "Languages Supported" },
    { number: "24/7", label: "Monitoring" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/3 to-transparent rounded-full"></div>
      </div>

    

      {/* Hero Section */}
      <section className="relative mt-20 z-10 px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-6">
                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm font-medium">India's Most Advanced Tourism Safety Platform</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Smart Tourist
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Safety System
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed mb-8 max-w-2xl">
                Revolutionary AI-powered platform protecting tourists across India's diverse regions with blockchain security, 
                real-time monitoring, and instant emergency response capabilities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="group bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center">
                  <span className="font-semibold mr-2">Experience Demo</span>
                  <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-gray-700 hover:border-purple-400 px-8 py-4 rounded-xl hover:bg-purple-500/10 transition-all duration-300 flex items-center justify-center">
                  <span className="font-semibold mr-2">Learn More</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Feature Showcase */}
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative">
                <div className="bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-800/80">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">Core Features</h3>
                    <p className="text-gray-500">Advanced technology stack for comprehensive tourist protection</p>
                  </div>

                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl border transition-all duration-500 cursor-pointer ${
                          currentFeature === index 
                            ? 'bg-gradient-to-r from-purple-500/15 to-blue-500/15 border-purple-500/60 transform scale-105' 
                            : 'bg-black/60 border-gray-800/60 hover:border-gray-700/60'
                        }`}
                        onClick={() => setCurrentFeature(index)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-lg transition-all duration-300 ${
                            currentFeature === index 
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                              : 'bg-gray-800 text-gray-400'
                          }`}>
                            {feature.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold mb-1">{feature.title}</h4>
                            <p className="text-gray-500 text-sm">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="relative z-10 px-6 lg:px-12 py-20 border-t border-gray-900/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Powered by <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Next-Gen Technology</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Cutting-edge AI, blockchain security, and IoT integration designed specifically for India's tourism ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Shield className="w-8 h-8" />, title: "Blockchain Security", desc: "Immutable tourist records" },
              { icon: <Eye className="w-8 h-8" />, title: "AI Monitoring", desc: "Intelligent threat detection" },
              { icon: <Smartphone className="w-8 h-8" />, title: "IoT Integration", desc: "Connected safety devices" },
              { icon: <MessageSquare className="w-8 h-8" />, title: "Multilingual Support", desc: "15+ Indian languages" }
            ].map((tech, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-800/80 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/15 to-blue-500/15 rounded-xl flex items-center justify-center mb-4 group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-300">
                    {tech.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{tech.title}</h3>
                  <p className="text-gray-500">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 backdrop-blur-lg rounded-3xl p-12 border border-purple-500/30">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Tourist Safety?
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join leading tourism departments across India in implementing the most advanced safety monitoring system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center">
                Request Demo
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border-2 border-gray-700 hover:border-purple-400 px-8 py-4 rounded-xl hover:bg-purple-500/10 transition-all duration-300 font-semibold">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OdysseyHomepage;