import React from 'react';
import { Shield, Heart, Users, Star, Clock, MessageCircle } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Shield,
      title: "100% Verified Profiles",
      description: "Every profile goes through our rigorous verification process to ensure authenticity and safety.",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Heart,
      title: "Ethical Matchmaking",
      description: "Our platform promotes respectful interactions and prevents any form of offensive behavior.",
      color: "from-rose-500 to-rose-600"
    },
    {
      icon: Users,
      title: "Personalized Matches",
      description: "Advanced AI algorithms suggest compatible profiles based on your preferences and values.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Star,
      title: "Premium Success Rate",
      description: "Over 85% of our premium members find their life partner within 12 months.",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support and relationship counseling services available.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: MessageCircle,
      title: "Secure Communication",
      description: "End-to-end encrypted messaging with privacy controls and content moderation.",
      color: "from-teal-500 to-teal-600"
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">Qubool Match?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're committed to creating a safe, respectful, and effective platform where genuine 
            connections flourish into lasting relationships.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-rose-600 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-8 lg:p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community of genuine people looking for meaningful relationships. 
              Your perfect match is just a click away.
            </p>
            <button className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:from-rose-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;