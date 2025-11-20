"use client";

import { useEffect, useState } from "react";

export default function WebsiteLoader({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show loader for 1 second then start fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1000);

    // Complete hide after fade animation
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1300);

    // Clean up timers
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className={`fixed inset-0 bg-black z-[9999] flex items-center justify-center transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        {/* Simple spinning logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-3 border-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-blue-500 text-2xl font-bold">MC</div>
            </div>
          </div>
          
          {/* Simple loading text */}
          <div className="text-center">
            <h1 className="text-xl font-bold text-white mb-2">MyProfession.CA</h1>
            <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
