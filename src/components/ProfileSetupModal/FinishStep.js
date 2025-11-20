import React from 'react';

function FinishStep({ profileData, isLoading }) {
  return (
    <div className="text-left max-h-full flex flex-col justify-center">
      <h2 className="text-2xl font-bold text-white mb-4">Ready to Go Live?</h2>
      <p className="text-gray-300 mb-6 text-sm">
        Please review your settings. Once you launch, mentees can book sessions based on this information.
      </p>
      
      <div className="space-y-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div>
          <h3 className="font-semibold text-cyan-400 text-base">Your Profile Picture</h3>
          {profileData.profilePicture ? (
            <p className="text-gray-300 mt-1 text-sm">File selected: <strong>{profileData.profilePicture.name}</strong></p>
          ) : (
            <p className="text-gray-400 mt-1 text-sm">No profile picture uploaded.</p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-700">
          <h3 className="font-semibold text-cyan-400 text-base">Your Schedule</h3>
          <p className="text-gray-300 mt-1 text-sm">
            {profileData.availability?.length > 0 
              ? `You are available on ${profileData.availability.map(d => d.day).join(', ')}.` 
              : "No available days set."}
          </p>
        </div>
        
        <div className="pt-4 border-t border-gray-700">
          <h3 className="font-semibold text-cyan-400 text-base">Your Services & Rates</h3>
          <p className="text-gray-300 mt-1 mb-3 text-sm">
            Minimum session duration: <strong>{profileData.minSessionDuration} minutes</strong>
          </p>
          {profileData.pricing?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
              {profileData.pricing.map(p => (
                <li key={p.type}>
                  {p.type.charAt(0).toUpperCase() + p.type.slice(1)}: <strong>₹{p.price}/minute</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No services enabled.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinishStep;
