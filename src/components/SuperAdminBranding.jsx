'use client';

import React from 'react';
import { FaUserShield, FaChartLine } from 'react-icons/fa';

export default function SuperAdminBranding() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <FaUserShield className="text-3xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">MyProfession.CA</h1>
            <p className="text-blue-100 text-sm">SuperAdmin Control Center</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm">
            <FaChartLine />
            <span>Professional Mentor Management</span>
          </div>
          <div className="text-blue-100 text-xs mt-1">
            Empowering Excellence | Building Futures
          </div>
        </div>
      </div>
      
      {/* Tagline */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
          Premium Mentor Platform
        </span>
        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
          Expert Vetting System
        </span>
        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
          Quality Education
        </span>
      </div>
    </div>
  );
}
