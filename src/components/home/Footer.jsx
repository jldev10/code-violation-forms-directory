import React from 'react';
import { FileText, MapPin, Building2, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">CodeViolation</h3>
                <p className="text-emerald-400 text-sm font-medium">Forms Directory</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              A comprehensive directory of municipal code violation reporting forms across the United States. 
              Streamlining compliance and access to local government resources.
            </p>
          </div>
          
          {/* About */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              About This Directory
            </h4>
            <p className="text-slate-400 leading-relaxed">
              This directory consolidates access to code violation reporting forms from over 
              <span className="text-emerald-400 font-semibold"> 800 municipalities</span> across 
              <span className="text-emerald-400 font-semibold"> 15 states</span>, saving time for professionals 
              in real estate, construction, property management, and legal compliance.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#states" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Browse States
                </a>
              </li>
              <li>
                <a href="#search" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Search Cities
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#script-generator" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Script Generator
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-700/50 text-center">
          <p className="text-slate-400 text-sm">
            © Speedy Homes {new Date().getFullYear()}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}