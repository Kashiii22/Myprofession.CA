'use client';

import React from 'react';
import Link from 'next/link';
import { FaLock } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function UnauthorizedPage() {

  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Branding */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            MyProfession.<span className="text-blue-500">CA</span>
          </h2>
          <p className="text-xs text-gray-500">Unauthorized Access</p>
        </div>

        {/* Status Code */}
        <div className="text-6xl md:text-8xl font-bold text-red-500 mb-4">401</div>
        
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-600/20 rounded-full p-6">
            <FaLock className="text-red-400 text-4xl" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">Unauthorized</h1>

        {/* Action Buttons */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Homepage
          </Link>
        </div>

        {/* Footer Branding */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <span>© {new Date().getFullYear()}</span>
            <span className="text-white">MyProfession.CA</span>
            <span>•</span>
            <span>Access Denied</span>
          </div>
        </div>
      </div>
    </div>
  );
}
