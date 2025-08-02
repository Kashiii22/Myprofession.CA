// redux/dashboardSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: {
    earnings: "8230",
    settlements: "1200",
    students: 128,
    forms: 14,
  },
  meetings: [
    {
      date: "2025-08-04",
      time: "10:00 AM",
      with: "John Doe",
      topic: "Tax Planning",
    },
    {
      date: "2025-08-05",
      time: "3:00 PM",
      with: "Jane Smith",
      topic: "Audit Review",
    },
    {
      date: "2025-08-06",
      time: "12:00 PM",
      with: "Mark Lee",
      topic: "CA Foundation Guidance",
    },
  ],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Optional: add reducers here
  },
});

export default dashboardSlice.reducer;
