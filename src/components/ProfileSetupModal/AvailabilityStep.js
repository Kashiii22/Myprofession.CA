import React from 'react';
import { 
  FaClock,
  FaTrash,
  FaPlus,
} from 'react-icons/fa';

function AvailabilityStep({ initialData, selectedDays, onUpdate }) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [availability, setAvailability] = React.useState(() => 
    daysOfWeek.map(day => initialData.find(d => d.day === day) || { day, slots: [] })
  );
  const [selectedDaysState, setSelectedDaysState] = React.useState(() => {
    if (selectedDays && Array.isArray(selectedDays)) {
      return selectedDays;
    }
    const daysWithSlots = initialData.filter(d => d.slots && d.slots.length > 0).map(d => d.day);
    return daysWithSlots;
  });
  const [validationErrors, setValidationErrors] = React.useState({});

  const updateAvailability = (currentAvailability, newSelectedDays) => {
    const templateDay = currentAvailability.find(d => d.day === newSelectedDays[0]);
    const displayedSlots = templateDay ? templateDay.slots : [];
    
    const newAvailability = currentAvailability.map(dayState => 
      newSelectedDays.includes(dayState.day) 
        ? { ...dayState, slots: displayedSlots } 
        : dayState
    );
    
    setAvailability(newAvailability);
    onUpdate(newAvailability, newSelectedDays);
  };

  const validateTimeSlot = (startTime, endTime, slotIndex) => {
    const errors = {};
    
    // Validate start time is before end time
    if (startTime && endTime && startTime >= endTime) {
      errors[`slot_${slotIndex}`] = 'Start time must be before end time';
    }
    
    // Validate times are within reasonable business hours (6 AM to 11 PM)
    if (startTime && (startTime < '06:00' || startTime > '23:00')) {
      errors[`slot_${slotIndex}_start`] = 'Start time should be between 6 AM and 11 PM';
    }
    
    if (endTime && (endTime < '06:00' || endTime > '23:00')) {
      errors[`slot_${slotIndex}_end`] = 'End time should be between 6 AM and 11 PM';
    }
    
    return errors;
  };

  const handleDayClick = (day) => { 
    setSelectedDays(prev => { 
      const isSelected = prev.includes(day); 
      if (isSelected) { 
        return prev.filter(d => d !== day); 
      } 
      return [...prev, day]; 
    }); 
    
    // Update availability immediately
    updateAvailability(availability, selectedDaysState.includes(day) 
      ? selectedDaysState.filter(d => d !== day) 
      : [...selectedDaysState, day]);
  };

  React.useEffect(() => {
    onUpdate(availability, selectedDaysState);
  }, [availability, selectedDaysState]);

  const templateDay = availability.find(d => d.day === selectedDaysState[0]);
  const displayedSlots = templateDay ? templateDay.slots : [];
  const performBulkSlotAction = (newSlots) => { 
    setAvailability(prev => prev.map(dayState => 
      selectedDaysState.includes(dayState.day) ? { ...dayState, slots: newSlots } : dayState
    )); 
  };

  const addSlot = () => {
    const newSlot = { startTime: "10:00", endTime: "11:00" };
    performBulkSlotAction([...displayedSlots, newSlot]);
    // Clear validation errors for new slot
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`slot_${displayedSlots.length}`];
      return newErrors;
    });
  };

  const removeSlot = (index) => {
    performBulkSlotAction(displayedSlots.filter((_, i) => i !== index));
    // Clear validation errors for removed slot
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`slot_${index}`];
      delete newErrors[`slot_${index}_start`];
      delete newErrors[`slot_${index}_end`];
      return newErrors;
    });
  };

  const updateSlot = (index, field, value) => {
    const newSlots = displayedSlots.map((slot, i) => i === index ? { ...slot, [field]: value } : slot);
    
    // Validate the updated slot
    const slot = newSlots[index];
    const errors = validateTimeSlot(slot.startTime, slot.endTime, index);
    
    // Update validation errors
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      // Remove old errors for this slot
      delete newErrors[`slot_${index}`];
      delete newErrors[`slot_${index}_start`];
      delete newErrors[`slot_${index}_end`];
      // Add new errors
      Object.assign(newErrors, errors);
      return newErrors;
    });
    
    performBulkSlotAction(newSlots);
  };
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <FaClock className="w-5 h-5 mr-3 text-cyan-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Set Your Weekly Schedule</h2>
          <p className="text-gray-400 text-sm">Select one or more days to apply a schedule to them all at once.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-6 border-b border-gray-700 pb-4">
        {daysOfWeek.map(day => (
          <button 
            key={day} 
            onClick={() => handleDayClick(day)} 
            className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-colors duration-300 ${
              selectedDaysState.includes(day) ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {day}
          </button>
        ))} 
      </div>
      <div className="min-h-[16rem] p-4 bg-black/20 rounded-lg">
        <h3 className="font-semibold text-lg text-white mb-4">
          Editing Schedule for: <span className="text-cyan-300">
            {selectedDaysState.length > 0 ? selectedDaysState.join(', ') : 'Select days above'}
          </span>
        </h3>
        {selectedDaysState.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 text-gray-500">
            <p>Please select one or more days to set your availability.</p>
            <p className="text-sm">Click on the days above to get started.</p>
          </div>
        ) : displayedSlots.length > 0 ? (
          <div className="space-y-3">
            {displayedSlots.map((slot, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <input 
                    type="time" 
                    value={slot.startTime} 
                    onChange={(e) => updateSlot(index, 'startTime', e.target.value)} 
                    className={`bg-gray-700 p-2 rounded-md border ${
                      validationErrors[`slot_${index}_start`] ? 'border-red-500' : 'border-gray-600'
                    } w-full`} 
                  />
                  {validationErrors[`slot_${index}_start`] && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors[`slot_${index}_start`]}</p>
                  )}
                </div>
                <span className="text-gray-400">to</span>
                <div className="flex-1">
                  <input 
                    type="time" 
                    value={slot.endTime} 
                    onChange={(e) => updateSlot(index, 'endTime', e.target.value)} 
                    className={`bg-gray-700 p-2 rounded-md border ${
                      validationErrors[`slot_${index}_end`] ? 'border-red-500' : 'border-gray-600'
                    } w-full`} 
                  />
                  {validationErrors[`slot_${index}_end`] && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors[`slot_${index}_end`]}</p>
                  )}
                </div>
                <button 
                  onClick={() => removeSlot(index)} 
                  className="text-red-500 hover:text-red-400 p-2 rounded-full bg-gray-700 hover:bg-red-500/20 transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
            {validationErrors[`slot_${displayedSlots.length - 1}`] && (
              <div className="text-red-400 text-sm mt-2">
                {validationErrors[`slot_${displayedSlots.length - 1}`]}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 text-gray-500">
            <p>You are unavailable on the selected day(s).</p>
            <p className="text-sm">Click "Add Time Slot" to set your hours.</p>
          </div>
        )}
        {selectedDaysState.length > 0 && (
          <button 
            onClick={addSlot} 
            className="flex items-center gap-2 text-cyan-400 font-semibold mt-4 hover:text-cyan-300 transition-colors"
          >
            <FaPlus /> Add Time Slot
          </button>
        )}
      </div>
    </div>
  );
}

export default AvailabilityStep;
