"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header"; // Your site's Header
import Footer from "@/components/Footer"; // Your site's Footer

// --- Helper Icon Components ---
const CheckIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
const ClockIcon = () => <svg className="w-6 h-6 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PriceIcon = () => <svg className="w-6 h-6 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01M12 14v4m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 14c-1.657 0-3-.895-3-2s1.343-2 3-2m0 0c1.11 0 2.08.402 2.599 1M12 14v-1" /></svg>;
const RocketIcon = () => <svg className="w-6 h-6 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const ShieldIcon = () => <svg className="w-6 h-6 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056c.343-.343.672-.694.988-1.056A11.953 11.953 0 0121 12c0-1.773-.267-3.482-.744-5.016z" /></svg>;
const PlusIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const TrashIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

// --- MAIN WIZARD PAGE COMPONENT ---
export default function CompleteProfileWizard() {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    password: "",
    availability: [],
    pricing: [],
    minSessionDuration: 15,
  });

  const stepsConfig = ["Welcome", "Create Password", "Set Schedule", "Define Services", "Launch Profile"];
  const progress = ((step - 1) / (stepsConfig.length - 1)) * 100;

  const handleNext = (data) => {
    setProfileData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleFinish = (data) => {
    const finalData = { ...profileData, ...data };
    // Password should be handled carefully and not logged in production
    console.log("Final Profile Data for API:", {
        ...finalData,
        password: "REDACTED_FOR_SECURITY"
    });
    alert("Your profile is now live! Congratulations!");
    setStep(prev => prev + 1); // Move to success screen
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
        <div className="w-full max-w-3xl space-y-6">
          {step <= stepsConfig.length && (
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-base font-medium text-blue-400">{stepsConfig[step - 1]}</span>
                <span className="text-sm font-medium text-blue-400">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          <div className="bg-gray-900 p-6 sm:p-10 rounded-2xl border border-gray-800 shadow-2xl shadow-blue-900/10">
            {step === 1 && <WelcomeStep onNext={() => setStep(2)} />}
            {step === 2 && <CreatePasswordStep onNext={handleNext} onBack={handleBack} />}
            {step === 3 && <AvailabilityStep onNext={handleNext} onBack={handleBack} initialData={profileData.availability} />}
            {step === 4 && <PricingStep onNext={handleNext} onBack={handleBack} initialData={profileData} />}
            {step === 5 && <FinishStep onFinish={handleFinish} onBack={handleBack} profileData={profileData} />}
            {step === 6 && <SuccessStep />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// --- Wizard Steps ---

const WelcomeStep = ({ onNext }) => (
  <div className="text-center py-4">
    <div className="mx-auto mb-6 bg-gray-800 h-16 w-16 rounded-full flex items-center justify-center border-2 border-blue-500"><RocketIcon /></div>
    <h2 className="text-3xl font-bold text-white mb-4">Let's Launch Your Mentor Profile</h2>
    <p className="text-gray-300 max-w-xl mx-auto mb-10">Congratulations on your approval! In just a few quick steps, you'll be ready to connect with mentees.</p>
    <button onClick={onNext} className="px-10 py-3 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-full hover:scale-105 transition-transform duration-300">Start Setup</button>
  </div>
);

const CreatePasswordStep = ({ onNext, onBack }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validation, setValidation] = useState({
        length: false,
        number: false,
        match: false,
    });

    useEffect(() => {
        const hasNumber = /\d/.test(password);
        const hasMinLength = password.length >= 8;
        const doPasswordsMatch = password && password === confirmPassword;

        setValidation({
            length: hasMinLength,
            number: hasNumber,
            match: doPasswordsMatch,
        });

    }, [password, confirmPassword]);

    const canProceed = validation.length && validation.number && validation.match;

    return (
        <div>
            <div className="flex items-center mb-8"><ShieldIcon />
                <div>
                    <h2 className="text-2xl font-bold text-white">Secure Your Account</h2>
                    <p className="text-gray-400">Create a strong password to keep your account safe.</p>
                </div>
            </div>
            <div className="space-y-6">
                <input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800 p-4 rounded-lg border border-gray-700" />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-800 p-4 rounded-lg border border-gray-700" />
            </div>
            <div className="mt-6 space-y-2 text-sm">
                <p className={`transition-colors ${validation.length ? 'text-green-400' : 'text-gray-400'}`}>✓ At least 8 characters</p>
                <p className={`transition-colors ${validation.number ? 'text-green-400' : 'text-gray-400'}`}>✓ Contains at least one number</p>
                <p className={`transition-colors ${validation.match ? 'text-green-400' : 'text-gray-400'}`}>✓ Passwords match</p>
            </div>
            <div className="flex justify-between mt-12">
                <button onClick={onBack} className="px-6 py-2 rounded-full text-gray-300 hover:bg-gray-800 transition-colors">Back</button>
                <button onClick={() => onNext({ password })} disabled={!canProceed} className="px-8 py-3 bg-blue-600 rounded-full font-semibold hover:bg-blue-500 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed">Next: Set Schedule</button>
            </div>
        </div>
    );
};

const AvailabilityStep = ({ onNext, onBack, initialData }) => {
  // (Code for this component is unchanged from the previous version)
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [availability, setAvailability] = useState(() => daysOfWeek.map(day => initialData.find(d => d.day === day) || { day, slots: [] }));
  const [selectedDays, setSelectedDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const handleDayClick = (day) => { setSelectedDays(prev => { const isSelected = prev.includes(day); if (isSelected) { return prev.length > 1 ? prev.filter(d => d !== day) : prev; } return [...prev, day]; }); };
  const templateDay = availability.find(d => d.day === selectedDays[0]);
  const displayedSlots = templateDay ? templateDay.slots : [];
  const performBulkSlotAction = (newSlots) => { setAvailability(prev => prev.map(dayState => selectedDays.includes(dayState.day) ? { ...dayState, slots: newSlots } : dayState)); };
  const addSlot = () => performBulkSlotAction([...displayedSlots, { startTime: "10:00", endTime: "11:00" }]);
  const removeSlot = (index) => performBulkSlotAction(displayedSlots.filter((_, i) => i !== index));
  const updateSlot = (index, field, value) => { const newSlots = displayedSlots.map((slot, i) => i === index ? { ...slot, [field]: value } : slot); performBulkSlotAction(newSlots); };
  return (
    <div>
      <div className="flex items-center mb-8"><ClockIcon />
        <div><h2 className="text-2xl font-bold text-white">Set Your Weekly Schedule</h2><p className="text-gray-400">Select one or more days to apply a schedule to them all at once.</p></div>
      </div>
      <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-700 pb-6">
        {daysOfWeek.map(day => (<button key={day} onClick={() => handleDayClick(day)} className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-colors duration-300 ${selectedDays.includes(day) ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-800 hover:bg-gray-700'}`}>{day}</button>))}
      </div>
      <div className="min-h-[16rem] p-4 bg-black/20 rounded-lg">
        <h3 className="font-semibold text-lg text-white mb-4">Editing Schedule for: <span className="text-cyan-400">{selectedDays.join(', ')}</span></h3>
        {displayedSlots.length > 0 ? (<div className="space-y-3">{displayedSlots.map((slot, index) => (<div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg"><input type="time" value={slot.startTime} onChange={(e) => updateSlot(index, 'startTime', e.target.value)} className="bg-gray-700 p-2 rounded-md border-gray-600 w-full" /><span className="text-gray-400">to</span><input type="time" value={slot.endTime} onChange={(e) => updateSlot(index, 'endTime', e.target.value)} className="bg-gray-700 p-2 rounded-md border-gray-600 w-full" /><button onClick={() => removeSlot(index)} className="text-red-500 hover:text-red-400 p-2 rounded-full bg-gray-700 hover:bg-red-500/20 transition-colors"><TrashIcon /></button></div>))}</div>
        ) : (<div className="flex flex-col items-center justify-center h-full text-center py-8 text-gray-500"><p>You are unavailable on the selected day(s).</p><p className="text-sm">Click "Add Time Slot" to set your hours.</p></div>)}
        <button onClick={addSlot} className="flex items-center gap-2 text-cyan-400 font-semibold mt-4 hover:text-cyan-300 transition-colors"><PlusIcon /> Add Time Slot</button>
      </div>
      <div className="flex justify-between mt-12">
        <button onClick={onBack} className="px-6 py-2 rounded-full text-gray-300 hover:bg-gray-800 transition-colors">Back</button>
        <button onClick={() => onNext({ availability: availability.filter(d => d.slots.length > 0) })} className="px-8 py-3 bg-blue-600 rounded-full font-semibold hover:bg-blue-500 transition-colors">Next: Define Services</button>
      </div>
    </div>
  );
};

const PricingStep = ({ onNext, onBack, initialData }) => {
  // (Code for this component is unchanged from the previous version)
  const defaultPricing = [{ type: "chat", price: 10, enabled: false, description: "Live text-based mentoring." },{ type: "voice", price: 20, enabled: false, description: "Audio call session." },{ type: "video", price: 30, enabled: false, description: "Face-to-face video call." },];
  const [pricing, setPricing] = useState(() => defaultPricing.map(p => ({ ...p, ...(initialData.pricing.find(i => i.type === p.type) || {}), enabled: !!initialData.pricing.find(i => i.type === p.type) })));
  const [minDuration, setMinDuration] = useState(initialData.minSessionDuration);
  const updatePricing = (index, field, value) => { setPricing(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p)); };
  const toggleService = (index) => { setPricing(prev => prev.map((p, i) => i === index ? { ...p, enabled: !p.enabled } : p)); };
  return (
    <div>
      <div className="flex items-center mb-8"><PriceIcon />
        <div><h2 className="text-2xl font-bold text-white">Define Your Services</h2><p className="text-gray-400">Set your per-minute rates and minimum session time.</p></div>
      </div>
      <div className="bg-gray-800 p-5 rounded-lg mb-8"><label className="font-semibold text-white text-lg">Minimum Session Duration</label><p className="text-sm text-gray-400 mb-3">The shortest booking time a mentee can request.</p><select value={minDuration} onChange={e => setMinDuration(e.target.value)} className="w-full sm:w-1/2 mt-1 bg-gray-700 p-3 rounded-md"><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="20">20 minutes</option><option value="30">30 minutes</option></select></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{pricing.map((service, index) => (<div key={service.type} className={`p-6 rounded-xl border-2 transition-all duration-300 ${service.enabled ? 'border-blue-600 bg-gray-800' : 'border-gray-700 bg-gray-800/50'}`}><div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold capitalize text-white">{service.type}</h3><input type="checkbox" checked={service.enabled} onChange={() => toggleService(index)} className="toggle-checkbox" /></div><p className="text-gray-400 text-sm mb-4 h-10">{service.description}</p><div className={`space-y-4 transition-opacity duration-300 ${service.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}><div><label className="text-sm text-gray-400">Rate per minute (INR)</label><input type="number" min="0" step="1" value={service.price} onChange={e => updatePricing(index, 'price', e.target.value)} className="w-full mt-1 bg-gray-700 p-3 rounded-md" /></div></div></div>))}</div>
      <div className="flex justify-between mt-12">
        <button onClick={onBack} className="px-6 py-2 rounded-full text-gray-300 hover:bg-gray-800 transition-colors">Back</button>
        <button onClick={() => onNext({ minSessionDuration: minDuration, pricing: pricing.filter(p => p.enabled).map(({ enabled, description, ...rest }) => rest) })} className="px-8 py-3 bg-blue-600 rounded-full font-semibold hover:bg-blue-500 transition-colors">Next: Final Review</button>
      </div>
    </div>
  );
};

const FinishStep = ({ onFinish, onBack, profileData }) => (
    <div className="text-left">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Go Live?</h2>
        <p className="text-gray-300 mb-8">Please review your settings. Once you launch, mentees can book sessions based on this information.</p>
        <div className="space-y-6 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div><h3 className="font-semibold text-cyan-400 text-lg">Your Schedule</h3><p className="text-gray-300 mt-1">{profileData.availability?.length > 0 ? `You are available on ${profileData.availability.map(d => d.day).join(', ')}.` : "No available days set."}</p></div>
            <div className="pt-6 border-t border-gray-700"><h3 className="font-semibold text-cyan-400 text-lg">Your Services & Rates</h3><p className="text-gray-300 mt-1 mb-3">Minimum session duration: <strong>{profileData.minSessionDuration} minutes</strong></p>
            {profileData.pricing?.length > 0 ? (<ul className="list-disc list-inside text-gray-300 space-y-1">{profileData.pricing.map(p => <li key={p.type}>{p.type.charAt(0).toUpperCase() + p.type.slice(1)}: <strong>₹{p.price}/minute</strong></li>)}</ul>
            ) : (<p className="text-gray-400">No services enabled.</p>)}</div>
        </div>
        <div className="flex justify-between mt-12">
            <button onClick={onBack} className="px-8 py-3 rounded-full text-gray-300 hover:bg-gray-800 transition-colors font-semibold">Make Changes</button>
            <button onClick={() => onFinish(profileData)} className="px-10 py-3 text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full hover:scale-105 transition-transform duration-300">Launch My Profile</button>
        </div>
    </div>
);

const SuccessStep = () => (
    <div className="text-center py-10">
        <div className="mx-auto mb-6 bg-green-500 h-16 w-16 rounded-full flex items-center justify-center border-2 border-green-400"><CheckIcon /></div>
        <h2 className="text-3xl font-bold text-white mb-4">You're All Set!</h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-8">Your mentor profile is now live. Welcome to the community! You can now head to your dashboard to manage your sessions.</p>
        <a href="/dashboard" className="px-10 py-3 text-lg bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-colors">Go to Dashboard</a>
    </div>
);