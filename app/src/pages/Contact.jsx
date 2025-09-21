import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  AlertTriangle,
  MessageCircle,
  Users,
  Globe,
  Shield
} from 'lucide-react';

const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Emergency Hotline',
      value: '1-800-ODYSSEY',
      description: '24/7 emergency response',
      color: 'red',
      urgent: true
    },
    {
      icon: Phone,
      title: 'Support Line',
      value: '+1 (555) 123-4567',
      description: 'General inquiries and support',
      color: 'blue'
    },
    {
      icon: Mail,
      title: 'Email Support',
      value: 'support@odyssey-safety.com',
      description: 'Response within 24 hours',
      color: 'green'
    },
    {
      icon: MapPin,
      title: 'Headquarters',
      value: '123 Safety Plaza, New York, NY 10001',
      description: 'Visit our main office',
      color: 'purple'
    }
  ];

  const departments = [
    {
      icon: AlertTriangle,
      title: 'Emergency Response',
      description: 'Immediate assistance for urgent situations',
      contact: 'emergency@odyssey-safety.com'
    },
    {
      icon: Users,
      title: 'Customer Support',
      description: 'General questions and account assistance',
      contact: 'support@odyssey-safety.com'
    },
    {
      icon: Shield,
      title: 'Safety Partnerships',
      description: 'Collaboration with authorities and organizations',
      contact: 'partnerships@odyssey-safety.com'
    },
    {
      icon: Globe,
      title: 'Business Inquiries',
      description: 'Enterprise solutions and custom implementations',
      contact: 'business@odyssey-safety.com'
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM EST' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM EST' },
    { day: 'Sunday', hours: 'Emergency only' },
    { day: 'Emergency Line', hours: '24/7 Available' }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="container-custom">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 border border-blue-500/30 bg-blue-500/10">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">
                Get In Touch
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              We're Here to <span className="gradient-text">Help</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Whether you need emergency assistance, have questions about our services,
              or want to partner with us, we're available 24/7 to support you.
            </p>

            {/* Emergency Alert */}
            <div className="glass-card border-red-500/50 bg-red-500/10 p-6 max-w-2xl mx-auto">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-white font-semibold text-lg">
                    Emergency? Call Now!
                  </h3>
                  <p className="text-red-200 text-sm mb-2">
                    For immediate assistance, don't use this form
                  </p>
                  <a
                    href="tel:1-800-ODYSSEY"
                    className="text-red-300 font-bold text-xl hover:text-red-200 transition-colors"
                  >
                    1-800-ODYSSEY
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Contact <span className="gradient-text">Methods</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Multiple ways to reach us, available when you need support most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className={`glass-card p-6 text-center card-hover animate-slide-up ${
                  method.urgent ? 'border-red-500/50 bg-red-500/5' : ''
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`inline-flex p-4 rounded-full mb-6 bg-${method.color}-500/20 border border-${method.color}-500/30`}>
                  <method.icon className={`w-8 h-8 text-${method.color}-400`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {method.title}
                </h3>
                <div className={`text-lg font-medium mb-2 ${method.urgent ? 'text-red-300' : 'text-blue-400'}`}>
                  {method.value}
                </div>
                <p className="text-gray-300 text-sm">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding bg-gradient-to-b from-black/20 to-transparent">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="animate-slide-up">
              <div className="space-y-6 mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Send Us a <span className="gradient-text">Message</span>
                </h2>
                <p className="text-xl text-gray-300">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="input-glass"
                      placeholder="Your first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className="input-glass"
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="input-glass"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="input-glass"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Department
                  </label>
                  <select className="input-glass">
                    <option value="">Select a department</option>
                    <option value="support">Customer Support</option>
                    <option value="emergency">Emergency Response</option>
                    <option value="partnerships">Safety Partnerships</option>
                    <option value="business">Business Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    className="input-glass"
                    placeholder="Brief description of your inquiry"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    rows="6"
                    className="input-glass resize-none"
                    placeholder="Please provide detailed information about your inquiry..."
                    required
                  ></textarea>
                </div>

                <button className="btn-primary w-full flex items-center justify-center space-x-2 text-lg py-4">
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>

                <p className="text-gray-400 text-sm text-center">
                  * Required fields. We'll respond within 24 hours.
                </p>
              </form>
            </div>

            {/* Departments & Hours */}
            <div className="space-y-8 animate-slide-up animate-delay-200">
              {/* Departments */}
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Departments
                </h3>
                <div className="space-y-6">
                  {departments.map((dept, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="glass rounded-lg p-2 border border-blue-500/30 bg-blue-500/10 flex-shrink-0">
                        <dept.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">
                          {dept.title}
                        </h4>
                        <p className="text-gray-300 text-sm mb-2">
                          {dept.description}
                        </p>
                        <a
                          href={`mailto:${dept.contact}`}
                          className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                        >
                          {dept.contact}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-blue-400" />
                  Office Hours
                </h3>
                <div className="space-y-4">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                      <span className="text-gray-300 font-medium">
                        {schedule.day}
                      </span>
                      <span className={`font-semibold ${
                        schedule.day === 'Emergency Line' ? 'text-red-400' : 'text-blue-400'
                      }`}>
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Quick answers to common questions about our services and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: "How fast is your emergency response?",
                a: "Our average response time is under 2 minutes, with emergency services typically dispatched within 5 minutes of alert."
              },
              {
                q: "Is the service available internationally?",
                a: "Yes, we operate in 25+ countries with local partnerships and multilingual support available 24/7."
              },
              {
                q: "What information do you need in an emergency?",
                a: "Our system automatically captures your GPS location. Just press the emergency button or call our hotline."
              },
              {
                q: "How do I update my emergency contacts?",
                a: "You can update emergency contacts through our mobile app or by contacting customer support."
              },
              {
                q: "Is there a cost for emergency services?",
                a: "Emergency response is included in all plans. Additional services may apply depending on your location and situation."
              },
              {
                q: "Can I use the service offline?",
                a: "Basic emergency features work offline. GPS location can still be transmitted even without internet connectivity."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="glass-card p-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {faq.q}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;