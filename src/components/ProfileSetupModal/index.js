import React from 'react';
import { toast } from 'react-hot-toast';
import { 
  FaRocket,
  FaUser,
  FaClock,
  FaMoneyBillWave,
  FaCamera,
  FaTrash,
  FaPlus,
} from 'react-icons/fa';

import ProfilePictureStep from './ProfilePictureStep';
import AvailabilityStep from './AvailabilityStep';
import PricingStep from './PricingStep';
import FinishStep from './FinishStep';

function ProfileSetupModal({ onClose, setupData, onNext, onBack, onFinish, isLoading, error }) {
  const [currentData, setCurrentData] = React.useState(setupData);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const stepsConfig = ["Welcome", "Upload Photo", "Set Schedule", "Define Services", "Launch Profile"];
  const progress = ((currentData.step - 1) / (stepsConfig.length - 1)) * 100;

  React.useEffect(() => {
    setCurrentData(setupData);
  }, [setupData]);

  const handleProfilePictureSelect = (file) => {
    setCurrentData(prev => ({ ...prev, profilePicture: file }));
  };

  const handleAvailabilityUpdate = (availability, selectedDays) => {
    setCurrentData(prev => ({ ...prev, availability, selectedDays }));
  };

  const handlePricingUpdate = (minSessionDuration, pricing) => {
    setCurrentData(prev => ({ ...prev, minSessionDuration, pricing }));
  };

  const handleModalNext = () => {
    if (currentData.step < 5) {
      onNext(currentData);
    }
  };

  const handleModalBack = () => {
    if (currentData.step > 1) {
      onBack();
    }
  };

  const handleModalFinish = () => {
    onFinish(currentData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full h-[85vh] max-h-[85vh] overflow-hidden border border-gray-800 flex flex-col">
        {/* Modal Header */}
        <div className="flex-shrink-0 bg-gray-900 p-6 border-b border-gray-800 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-base font-medium text-blue-400">{stepsConfig[currentData.step - 1]}</span>
                <span className="text-sm font-medium text-blue-400">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="ml-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50 flex-shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Welcome Step */}
          {currentData.step === 1 && (
            <div className="text-center py-2 max-h-full flex flex-col justify-center">
              <div className="mx-auto mb-4 bg-gray-800 h-16 w-16 rounded-full flex items-center justify-center border-2 border-blue-500">
                <FaRocket className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Let's Launch Your Mentor Profile</h2>
              <p className="text-gray-300 max-w-xl mx-auto mb-6 text-sm">
                Congratulations on your approval! In just a few quick steps, you'll be ready to connect with mentees and start earning.
              </p>
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <h3 className="font-semibold text-blue-300 mb-2 text-sm">Why setup your profile now?</h3>
                <ul className="text-xs text-blue-100 space-y-1 text-left">
                  <li>• Start receiving booking requests immediately</li>
                  <li>• Set your own rates and schedule</li>
                  <li>• Build your reputation with reviews</li>
                  <li>• Access mentor analytics and insights</li>
                </ul>
              </div>
            </div>
          )}

          {/* Profile Picture Step */}
          {currentData.step === 2 && (
            <ProfilePictureStep 
              initialData={currentData.profilePicture}
              onSelect={handleProfilePictureSelect}
            />
          )}

          {/* Availability Step */}
          {currentData.step === 3 && (
            <AvailabilityStep 
              initialData={currentData.availability}
              selectedDays={currentData.selectedDays}
              onUpdate={handleAvailabilityUpdate}
            />
          )}

          {/* Pricing Step */}
          {currentData.step === 4 && (
            <PricingStep 
              initialData={currentData}
              onUpdate={handlePricingUpdate}
            />
          )}

          {/* Finish Step */}
          {currentData.step === 5 && (
            <FinishStep 
              profileData={currentData}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex-shrink-0 bg-gray-900 p-6 border-t border-gray-800 rounded-b-2xl">
          <div className="flex justify-between">
            {currentData.step > 1 && currentData.step < 5 && (
              <button
                onClick={handleModalBack}
                disabled={isLoading}
                className="px-6 py-2 rounded-full text-gray-300 hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50"
              >
                Back
              </button>
            )}
            {currentData.step === 1 && <div />}
            
            <div className="flex gap-3">
              {currentData.step === 5 && (
                <button
                  onClick={handleModalBack}
                  disabled={isLoading}
                  className="px-6 py-2 rounded-full text-gray-300 hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50"
                >
                  Make Changes
                </button>
              )}
              
              <button
                onClick={currentData.step === 5 ? handleModalFinish : handleModalNext}
                disabled={isLoading}
                className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-70 disabled:scale-100"
              >
                {isLoading ? "Processing..." : 
                 currentData.step === 1 ? "Start Setup" :
                 currentData.step === 2 ? "Next: Set Schedule" :
                 currentData.step === 3 ? "Next: Define Services" :
                 currentData.step === 4 ? "Next: Final Review" :
                 "Launch My Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetupModal;
