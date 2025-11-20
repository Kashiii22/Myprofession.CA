import React from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';

function PricingStep({ initialData, onUpdate }) {
  const [pricing, setPricing] = React.useState(() => {
    const defaultPricing = [
      { type: "chat", price: 10, enabled: false, description: "" },
      { type: "video", price: 30, enabled: false, description: "" },
    ];
    return defaultPricing.map(p => ({ 
      ...p, 
      ...(initialData.pricing?.find(i => i.type === p.type) || {}), 
      enabled: !!initialData.pricing?.find(i => i.type === p.type) 
    })); 
  });
  const [minDuration, setMinDuration] = React.useState(initialData.minSessionDuration);

  React.useEffect(() => {
    const enabledPricing = pricing.filter(p => p.enabled).map(({ enabled, description, ...rest }) => rest);
    onUpdate(minDuration, enabledPricing);
  }, [pricing, minDuration, onUpdate]);

  const updatePricing = (index, field, value) => {
    setPricing(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const toggleService = (index) => {
    setPricing(prev => prev.map((p, i) => i === index ? { ...p, enabled: !p.enabled } : p));
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <FaMoneyBillWave className="w-5 h-5 mr-3 text-cyan-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Define Your Services</h2>
          <p className="text-gray-400 text-sm">Set your per-minute rates and minimum session time.</p>
        </div>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <label className="font-semibold text-white text-base">Minimum Session Duration</label>
        <p className="text-xs text-gray-400 mb-2">The shortest booking time a mentee can request.</p>
        <select 
          value={minDuration} 
          onChange={e => setMinDuration(e.target.value)} 
          className="w-full sm:w-1/2 mt-1 bg-gray-700 p-2 rounded-md text-sm"
        >
          <option value="10">10 minutes</option>
          <option value="15">15 minutes</option>
          <option value="20">20 minutes</option>
          <option value="30">30 minutes</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pricing.map((service, index) => (
          <div key={service.type} className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            service.enabled ? 'border-blue-600 bg-gray-800' : 'border-gray-700 bg-gray-800/50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold capitalize text-white">{service.type}</h3>
              <input 
                type="checkbox" 
                checked={service.enabled} 
                onChange={() => toggleService(index)} 
                className="toggle-checkbox" 
              />
            </div>
            <p className="text-gray-400 text-xs mb-3 h-6">{service.description}</p>
            <div className={`space-y-3 transition-opacity duration-300 ${
              service.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'
            }`}>
              <div>
                <label className="text-xs text-gray-400">Rate per minute (INR)</label>
                <input 
                  type="number" 
                  min="0" 
                  step="1" 
                  value={service.price} 
                  onChange={e => updatePricing(index, 'price', e.target.value)} 
                  className="w-full mt-1 bg-gray-700 p-2 rounded-md text-sm" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingStep;
