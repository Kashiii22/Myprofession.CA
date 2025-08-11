'use client';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchFilter, setStatusFilter } from '../redux/mentorSlice';

export default function FiltersBar() {
  const dispatch = useDispatch();
  const { search, status } = useSelector(state => state.mentors.filters);

  return (
    <div className="flex items-center gap-4 mb-6">
      <input
        className="bg-gray-800 px-3 py-2 rounded-lg outline-none w-1/3"
        placeholder="Search mentor..."
        value={search}
        onChange={e => dispatch(setSearchFilter(e.target.value))}
      />
      <select
        className="bg-gray-800 px-3 py-2 rounded-lg"
        value={status}
        onChange={e => dispatch(setStatusFilter(e.target.value))}
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );
}
