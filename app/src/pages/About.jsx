import {
  Shield,
  Target,
  Users,
  Award,
  MapPin,
  Globe,
  Clock,
  Heart,
  TrendingUp,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Every decision we make prioritizes the safety and security of travelers worldwide.',
      color: 'blue'
    },
    {
      icon: Heart,
      title: 'Care & Compassion',
      description: 'We treat every traveler with empathy and provide support when they need it most.',
      color: 'red'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Constantly evolving our technology to stay ahead of emerging safety challenges.',
      color: 'yellow'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a global network of travelers, authorities, and safety professionals.',
      color: 'green'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'Started with a vision to revolutionize tourist safety through technology'
    },
    {
      year: '2021',
      title: 'First Partnership',
      description: 'Partnered with local authorities to pilot our emergency response system'
    },
    {
      year: '2022',
      title: '10,000 Users',
      description: 'Reached our first major milestone of protecting 10,000 travelers'
    },
    {
      year: '2023',
      title: 'International Expansion',
      description: 'Expanded to 15 countries with 24/7 multilingual support'
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Launched AI-powered predictive safety analytics and real-time risk assessment'
    }
  ];

  const team = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      description: 'Former emergency services coordinator with 15+ years of experience in public safety.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Sarah Kim',
      role: 'CTO',
      description: 'Technology leader specializing in real-time systems and emergency response platforms.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Miguel Santos',
      role: 'Head of Operations',
      description: 'International crisis management expert with extensive field experience.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Dr. Emily Chen',
      role: 'Safety Director',
      description: 'PhD in Risk Management with focus on tourist safety and behavioral analysis.',
      image: '/api/placeholder/150/150'
    }
  ];

  const achievements = [
    { icon: Users, number: '50K+', label: 'Travelers Protected' },
    { icon: Globe, number: '25', label: 'Countries Covered' },
    { icon: Clock, number: '2min', label: 'Average Response Time' },
    { icon: Award, number: '99.8%', label: 'Success Rate' }
  ];

  const certifications = [
    'ISO 27001 Certified',
    'SOC 2 Type II Compliant',
    'GDPR Compliant',
    'Emergency Response Certified'
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="container-custom">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 border border-blue-500/30 bg-blue-500/10">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">
                Our Mission & Vision
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Protecting Travelers <span className="gradient-text">Worldwide</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We're on a mission to make travel safer for everyone. Through innovative technology,
              dedicated partnerships, and unwavering commitment to safety, we're building a world
              where every journey is protected.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Our <span className="gradient-text">Mission</span>
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To provide comprehensive safety solutions that empower travelers to explore
                  the world with confidence, knowing that help is always just a moment away.
                  We believe that safety should never limit adventure.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Our <span className="gradient-text">Vision</span>
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  A world where every traveler, regardless of destination or circumstances,
                  has access to immediate, reliable safety support. We envision a global
                  network that makes travel incidents a thing of the past.
                </p>
              </div>
            </div>

            <div className="glass-card p-8 animate-slide-up animate-delay-200">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Key Achievements</h3>
                <div className="grid grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div className="flex items-center justify-center mb-2">
                        <achievement.icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold gradient-text">
                        {achievement.number}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {achievement.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gradient-to-b from-black/20 to-transparent">
        <div className="container-custom">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Our <span className="gradient-text">Core Values</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our approach to traveler safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="glass-card p-6 text-center card-hover animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`inline-flex p-4 rounded-full mb-6 bg-${value.color}-500/20 border border-${value.color}-500/30`}>
                  <value.icon className={`w-8 h-8 text-${value.color}-400`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Our <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From a simple idea to a global safety network, here's how we've grown.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-gradient-to-b from-blue-500 to-purple-500 hidden lg:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row items-center animate-slide-up ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:text-right lg:pr-8' : 'lg:text-left lg:pl-8'}`}>
                    <div className="glass-card p-6">
                      <div className="text-3xl font-bold gradient-text mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-300">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex w-2/12 justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-black"></div>
                  </div>

                  <div className="w-full lg:w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gradient-to-b from-black/20 to-transparent">
        <div className="container-custom">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The dedicated professionals working around the clock to keep travelers safe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="glass-card p-6 text-center card-hover animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-24 h-24 mx-auto mb-4 glass rounded-full overflow-hidden border border-white/20">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Users className="w-12 h-12 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-400 text-sm font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Trust */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="glass-card p-12 text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Trusted & <span className="gradient-text">Certified</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We maintain the highest standards of security, compliance, and operational excellence.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="glass rounded-lg p-4 border border-green-500/30 bg-green-500/10 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-green-300 text-sm font-medium">
                    {cert}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-2 text-yellow-400 mt-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-current" />
              ))}
              <span className="text-white ml-2 font-semibold">
                4.9/5 User Rating
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="glass-card p-12 text-center space-y-8 border-blue-500/30 bg-blue-500/5">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Join Our <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Whether you're a traveler seeking protection or an authority wanting to partner with us,
              we're here to make travel safer for everyone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="btn-primary flex items-center space-x-2 text-lg px-8 py-4">
                <Shield className="w-5 h-5" />
                <span>Get Protected</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4">
                <Users className="w-5 h-5" />
                <span>Partner With Us</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;