import {
  Shield,
  MapPin,
  Phone,
  Clock,
  AlertTriangle,
  Users,
  Heart,
  Info,
  Zap,
  CheckCircle,
  ArrowRight,
  Globe,
  Camera,
  Navigation,
  Headphones
} from 'lucide-react';

const Services = () => {
  const mainServices = [
    {
      id: 'emergency',
      icon: AlertTriangle,
      title: 'Emergency Response',
      description: 'Instant emergency assistance with 24/7 monitoring and rapid response teams.',
      features: [
        'One-touch emergency alert',
        'GPS location tracking',
        'Direct connection to local authorities',
        'Multi-language support',
        'Family notification system'
      ],
      color: 'red'
    },
    {
      id: 'assistance',
      icon: Users,
      title: 'Tourist Assistance',
      description: 'Comprehensive support services for all your travel needs and concerns.',
      features: [
        'Lost item recovery',
        'Medical assistance coordination',
        'Embassy contact facilitation',
        'Travel insurance support',
        'Local guide recommendations'
      ],
      color: 'blue'
    },
    {
      id: 'safety',
      icon: Shield,
      title: 'Safety Guidelines',
      description: 'Personalized safety recommendations based on your destination and activities.',
      features: [
        'Real-time risk assessments',
        'Area-specific safety tips',
        'Weather and hazard alerts',
        'Cultural awareness guidance',
        'Safe zone identification'
      ],
      color: 'green'
    },
    {
      id: 'info',
      icon: Info,
      title: 'Local Information',
      description: 'Essential local knowledge to help you navigate your destination safely.',
      features: [
        'Local emergency numbers',
        'Hospital and clinic locations',
        'Police station directories',
        'Safe transportation options',
        'Tourist-friendly establishments'
      ],
      color: 'purple'
    }
  ];

  const additionalServices = [
    {
      icon: Camera,
      title: 'Smart Monitoring',
      description: 'AI-powered surveillance in tourist areas for enhanced security.',
      color: 'blue'
    },
    {
      icon: Navigation,
      title: 'Safe Route Planning',
      description: 'Optimized routes avoiding high-risk areas and dangerous zones.',
      color: 'green'
    },
    {
      icon: Headphones,
      title: '24/7 Support Hotline',
      description: 'Round-the-clock assistance available in multiple languages.',
      color: 'purple'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Services available in 25+ countries with local partnerships.',
      color: 'orange'
    }
  ];

  const pricingPlans = [
    {
      name: 'Basic Protection',
      price: 'Free',
      period: '',
      description: 'Essential safety features for casual travelers',
      features: [
        'Emergency response access',
        'Basic location tracking',
        'Safety alerts',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Premium Safety',
      price: '$9.99',
      period: '/month',
      description: 'Advanced protection for frequent travelers',
      features: [
        'Priority emergency response',
        'Real-time family updates',
        'Comprehensive travel insurance',
        'Phone support',
        'Offline safety maps',
        'Personal safety consultant'
      ],
      cta: 'Start Premium',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Tailored solutions for organizations and groups',
      features: [
        'Group management dashboard',
        'Custom safety protocols',
        'Dedicated account manager',
        'API integration',
        'Custom reporting',
        'Training sessions'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const stats = [
    { number: '< 2min', label: 'Average Response Time', icon: Clock },
    { number: '99.8%', label: 'Successful Resolutions', icon: CheckCircle },
    { number: '25+', label: 'Countries Covered', icon: Globe },
    { number: '24/7', label: 'Support Availability', icon: Headphones }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="container-custom">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 border border-blue-500/30 bg-blue-500/10">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">
                Comprehensive Safety Solutions
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Complete <span className="gradient-text">Safety Ecosystem</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              From emergency response to daily safety guidance, our comprehensive suite of services
              ensures you're protected at every step of your journey.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-12 border-t border-white/10">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center space-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold gradient-text">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Core <span className="gradient-text">Services</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Four pillars of protection designed to keep you safe wherever your adventures take you.
            </p>
          </div>

          <div className="space-y-16">
            {mainServices.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-slide-up ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className={`inline-flex p-4 rounded-xl bg-${service.color}-500/20 border border-${service.color}-500/30`}>
                    <service.icon className={`w-8 h-8 text-${service.color}-400`} />
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-bold text-white">
                    {service.title}
                  </h3>

                  <p className="text-xl text-gray-300 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className={`w-5 h-5 text-${service.color}-400 flex-shrink-0`} />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`btn-primary flex items-center space-x-2`}>
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="glass-card p-8 h-80 flex items-center justify-center">
                    <service.icon className={`w-32 h-32 text-${service.color}-400/50`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-padding bg-gradient-to-b from-black/20 to-transparent">
        <div className="container-custom">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Enhanced <span className="gradient-text">Features</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Additional capabilities that make our safety platform comprehensive and reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="glass-card p-6 text-center card-hover animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`inline-flex p-4 rounded-full mb-6 bg-${service.color}-500/20 border border-${service.color}-500/30`}>
                  <service.icon className={`w-8 h-8 text-${service.color}-400`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Choose Your <span className="gradient-text">Protection Level</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Flexible plans designed to meet different travel needs and budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`glass-card p-8 card-hover animate-slide-up relative ${
                  plan.popular ? 'border-blue-500/50 bg-blue-500/5' : ''
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-4xl font-bold gradient-text">
                      {plan.price}
                    </div>
                    {plan.period && (
                      <div className="text-gray-400 text-sm">
                        {plan.period}
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Process */}
      <section className="section-padding bg-gradient-to-b from-red-500/5 to-transparent">
        <div className="container-custom">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">
              How <span className="gradient-text-red">Emergency Response</span> Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our streamlined process ensures you get help when you need it most.
            </p>
          </div>

          <div className="glass-card p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'Alert Triggered', desc: 'Press emergency button or call hotline' },
                { step: '2', title: 'Location Detected', desc: 'GPS coordinates sent to response center' },
                { step: '3', title: 'Authorities Notified', desc: 'Local emergency services contacted immediately' },
                { step: '4', title: 'Help Dispatched', desc: 'Nearest responders sent to your location' }
              ].map((item, index) => (
                <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="w-16 h-16 mx-auto mb-4 glass-card border-red-500/30 bg-red-500/10 rounded-full flex items-center justify-center text-2xl font-bold text-red-400">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="glass-card p-12 text-center space-y-8 border-blue-500/30 bg-blue-500/5">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Ready to Stay <span className="gradient-text">Protected?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of travelers who trust Odyssey for their safety.
              Get started with our free plan or upgrade to premium protection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="btn-danger flex items-center space-x-2 text-lg px-8 py-4">
                <AlertTriangle className="w-5 h-5" />
                <span>Emergency Access</span>
              </button>
              <button className="btn-primary flex items-center space-x-2 text-lg px-8 py-4">
                <Shield className="w-5 h-5" />
                <span>Choose Your Plan</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;