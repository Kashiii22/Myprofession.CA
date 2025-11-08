'use client';

import React from 'react';
import { FaUserShield, FaTachometerAlt, FaCalendarAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function DashboardHeader({ title, breadcrumb = [] }) {
  const router = useRouter();

  return (
    <div className="bg-gray-800 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span>/</span>}
                <span 
                  className={item.active ? 'text-blue-400 font-medium' : 'text-gray-400 hover:text-white cursor-pointer transition-colors'}
                  onClick={() => item.path && router.push(item.path)}
                >
                  {item.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-3 rounded-lg">
            <FaUserShield className="text-blue-400 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 text-sm">System Administration Panel</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Administrator</div>
            <div className="text-xs text-green-400">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
              System Online
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtitle or Description */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-gray-300 text-sm">
          Manage and monitor all aspects of your mentor platform with comprehensive analytics and control tools.
        </p>
      </div>
    </div>
  );
}
