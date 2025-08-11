import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: '1',
      name: 'Arjun Mehta',
      qualification: 'CA',
      experience: 8,
      specializations: ['Taxation', 'GST'],
      status: 'pending',
      appliedAt: '2025-08-01',
      avatar: '/avatars/mentor1.jpg'
    },
    {
      id: '2',
      name: 'Neha Sharma',
      qualification: 'CMA',
      experience: 5,
      specializations: ['Audit', 'Financial Planning'],
      status: 'approved',
      appliedAt: '2025-07-20',
      avatar: '/avatars/mentor2.jpg'
    }
  ],
  filters: {
    search: '',
    status: 'all'
  }
};

const mentorSlice = createSlice({
  name: 'mentors',
  initialState,
  reducers: {
    approveMentor(state, action) {
      const mentor = state.items.find(m => m.id === action.payload);
      if (mentor) mentor.status = 'approved';
    },
    rejectMentor(state, action) {
      const mentor = state.items.find(m => m.id === action.payload);
      if (mentor) mentor.status = 'rejected';
    },
    setSearchFilter(state, action) {
      state.filters.search = action.payload;
    },
    setStatusFilter(state, action) {
      state.filters.status = action.payload;
    }
  }
});

export const { approveMentor, rejectMentor, setSearchFilter, setStatusFilter } = mentorSlice.actions;
export default mentorSlice.reducer;
