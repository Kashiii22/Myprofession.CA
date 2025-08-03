// src/redux/slices/classesSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch class data
export const fetchClasses = createAsyncThunk("classes/fetchClasses", async () => {
  const res = await fetch("/api/classes"); // replace with your API endpoint
  if (!res.ok) throw new Error("Failed to fetch classes");
  return await res.json();
});

const classesSlice = createSlice({
  name: "classes",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default classesSlice.reducer;
