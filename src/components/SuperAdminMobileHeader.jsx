'use client';

import React from 'react';
import { FaUserShield, FaArrowRight } from 'react-icons/fa';

export default function SuperAdminMobileHeader({ title, pageTitle }) {
  return (
    <div className="md:hidden bg-gray-900 border-b border-blue-800 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaUserShield className="text-blue-500 text-lg" />
          <span className="text-white text-lg font-bold">SuperAdmin</span>
        </div>
        <button
          onClick={() => {
            const sidebar = document.querySelector('[data-sidebar-mobile]');
            sidebar?.classList.remove('translate-x-full');
          }}
          className="text-white bg-blue-800 hover:bg-blue-700 rounded-lg p-2 transition-colors"
          aria-label="Open Menu"
        >
          <FaArrowRight className="text-lg" />
        </button>
      </div>
      
      {pageTitle && (
        <h1 className="text-xl font-semibold text-white mt-3">{pageTitle}</h1>
      )}
    </div>
  );
}
