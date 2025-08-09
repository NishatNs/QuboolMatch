import React from 'react';
import { Heart, Shield, Users, Award } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">Qubool Match</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're not just another matrimonial platform. We're a community dedicated to fostering 
            genuine, respectful connections that lead to lifelong partnerships.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">
                Our Mission: Ethical Matchmaking for Everyone
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Qubool Match, we believe that finding love should be safe, respectful, and meaningful. 
                Our platform is built on the foundation of ethical practices, ensuring that every interaction 
                is conducted with dignity and respect.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We prevent offensive conduct between individuals through advanced verification systems, 
                community guidelines, and active moderation. Your safety and comfort are our top priorities.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-rose-100 p-3 rounded-xl">
                  <Heart className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Genuine Connections</h4>
                  <p className="text-gray-600 text-sm">Focus on meaningful relationships built on shared values</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Safe Environment</h4>
                  <p className="text-gray-600 text-sm">Protected platform with verified profiles and secure messaging</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Diverse Community</h4>
                  <p className="text-gray-600 text-sm">Members from all backgrounds and communities welcome</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-xl">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Proven Success</h4>
                  <p className="text-gray-600 text-sm">Thousands of successful matches and happy marriages</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/1024994/pexels-photo-1024994.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Happy couple"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-3 rounded-xl">
                  <Heart className="h-6 w-6 text-white" fill="currentColor" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">15,000+</div>
                  <div className="text-gray-600">Happy Couples</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;