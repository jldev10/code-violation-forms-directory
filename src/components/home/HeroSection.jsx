import React from 'react';
import { motion } from 'framer-motion';
import { FileText, MapPin, Clock, Shield } from 'lucide-react';

const stats = [
  { icon: MapPin, value: '15', label: 'States Covered' },
  { icon: FileText, value: '800+', label: 'Cities Listed' },
  { icon: Clock, value: '24/7', label: 'Accessibility' }
];

export default function HeroSection({ isDarkMode }) {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">Professional Directory for Public Records</span>
          </motion.div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Code Violation Forms Directory
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Access over 800 direct links to code violation reporting forms across 15 states. 
            Streamline your compliance process with our comprehensive, organized database for cities.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex flex-col items-center px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl min-w-[140px]"
              >
                <stat.icon className="w-6 h-6 text-emerald-400 mb-2" />
                <span className="text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-slate-400">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Custom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-20 md:h-32" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
            className={`transition-colors ${isDarkMode ? 'fill-slate-900' : 'fill-white'}`}
          />
        </svg>
      </div>
    </section>
  );
}