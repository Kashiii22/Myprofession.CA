import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  slots: [
    { id: 1, day: "Monday", time: "10:00 AM - 12:00 PM", platform: "Zoom" },
    { id: 2, day: "Tuesday", time: "2:00 PM - 4:00 PM", platform: "Google Meet" },
    { id: 3, day: "Wednesday", time: "11:00 AM - 1:00 PM", platform: "Teams" },
    { id: 4, day: "Thursday", time: "3:00 PM - 5:00 PM", platform: "Zoom" },
    { id: 5, day: "Friday", time: "9:00 AM - 11:00 AM", platform: "Google Meet" },
  ],
};

const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {
    addSlot: (state, action) => {
      const newSlot = {
        id: Date.now(), // generate unique id
        ...action.payload,
      };
      state.slots.push(newSlot);
    },
    removeSlot: (state, action) => {
      state.slots = state.slots.filter(slot => slot.id !== action.payload);
    },
  },
});

export const { addSlot, removeSlot } = availabilitySlice.actions;
export default availabilitySlice.reducer;
