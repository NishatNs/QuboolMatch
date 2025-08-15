import React from 'react';
import { Search, MessageSquare, Video, Heart, FileText, Headphones } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Search,
      title: "Advanced Profile Search",
      description: "Powerful search filters to find compatible matches based on age, location, education, profession, and more.",
      features: ["Custom filters", "Smart recommendations", "Saved searches"]
    },
    {
      icon: MessageSquare,
      title: "Secure Messaging",
      description: "Private, encrypted messaging system with photo sharing and voice messages for meaningful conversations.",
      features: ["End-to-end encryption", "Photo sharing", "Voice messages"]
    },
    {
      icon: Video,
      title: "Video Calls",
      description: "Safe video calling feature to connect face-to-face before meeting in person, building trust and comfort.",
      features: ["HD video quality", "Screen recording protection", "Time limits for safety"]
    },
    {
      icon: Heart,
      title: "Compatibility Matching",
      description: "AI-powered compatibility analysis based on personality, values, lifestyle, and relationship goals.",
      features: ["Personality assessment", "Value matching", "Lifestyle compatibility"]
    },
    {
      icon: FileText,
      title: "Profile Verification",
      description: "Comprehensive verification process including ID verification, education, and profession validation.",
      features: ["ID verification", "Education verification", "Professional validation"]
    },
    {
      icon: Headphones,
      title: "Relationship Counseling",
      description: "Expert relationship counselors available to guide you through your journey to finding love.",
      features: ["Expert counselors", "Pre-marriage guidance", "24/7 availability"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive matrimonial services designed to help you find your perfect life partner 
            safely and efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100"
            >
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-rose-600 transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-lg text-gray-600">Simple steps to find your perfect match</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Sign Up", desc: "Create your profile with detailed information" },
              { step: "2", title: "Get Verified", desc: "Complete our verification process for safety" },
              { step: "3", title: "Browse & Connect", desc: "Find and connect with compatible matches" },
              { step: "4", title: "Meet & Marry", desc: "Build relationships that lead to marriage" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;