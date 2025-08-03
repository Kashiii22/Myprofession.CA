import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSlot } from "../redux/availabilitySlice";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";

const AddSlotForm = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const slots = useSelector((state) => state.availability.slots);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time.");
      return;
    }

    const combinedDateTime = dayjs(selectedDate)
      .hour(dayjs(selectedTime).hour())
      .minute(dayjs(selectedTime).minute())
      .second(0);

    const formattedDate = combinedDateTime.format("YYYY-MM-DD");
    const formattedTime = combinedDateTime.format("hh:mm A");

    const isDuplicate = slots.some(
      (slot) => slot.day === formattedDate && slot.time === formattedTime
    );

    if (isDuplicate) {
      setError("Slot already exists.");
      return;
    }

    dispatch(addSlot({ day: formattedDate, time: formattedTime }));
    setSelectedDate(null);
    setSelectedTime(null);
    setError("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mb-6 p-6 rounded-xl border border-blue-900 bg-blue-950/40 shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-semibold mb-4 text-blue-300">
        Add Your Availability
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Picker */}
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-blue-200">Select Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            placeholderText="Click to select a date"
            className="p-2 rounded bg-black border border-gray-700 text-white w-full h-[44px]"
            calendarClassName="!bg-gray-900 !text-white"
            dayClassName={() => "!bg-gray-900 !text-white hover:!bg-blue-700"}
          />
        </div>

        {/* Time Picker */}
        <div className="flex flex-col">
          <label className="text-sm mb-1 text-blue-200">Select Time</label>
          <DatePicker
            selected={selectedTime}
            onChange={(time) => setSelectedTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="hh:mm aa"
            placeholderText="Click to select a time"
            className="p-2 rounded bg-black border border-gray-700 text-white w-full h-[44px]"
            calendarClassName="!bg-gray-900 !text-white"
            dayClassName={() => "!bg-gray-900 !text-white"}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add Slot
          </button>
        </div>
      </div>

      {/* Feedback */}
      {error && <p className="mt-3 text-sm text-red-400">⚠️ {error}</p>}
      {success && (
        <motion.p
          className="mt-3 text-sm text-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ✅ Slot added successfully!
        </motion.p>
      )}
    </motion.form>
  );
};

export default AddSlotForm;
