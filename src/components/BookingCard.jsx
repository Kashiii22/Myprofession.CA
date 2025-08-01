import Image from "next/image";
import {
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaMapMarkerAlt,
} from "react-icons/fa";

const statusStyles = {
  upcoming: "text-green-400 bg-green-900/30",
  completed: "text-blue-400 bg-blue-900/30",
  cancelled: "text-red-400 bg-red-900/30",
};

export default function BookingCard({ booking }) {
  const { mentorImage, mentorName, subject, status, dateTime, duration, mode } = booking;

  const renderModeIcon = () =>
    mode.includes("Online") ? (
      <FaVideo className="text-blue-400" />
    ) : (
      <FaMapMarkerAlt className="text-blue-400" />
    );

  const renderActionButton = () => {
    switch (status) {
      case "upcoming":
        return (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm shadow-sm">
            Join Now
          </button>
        );
      case "completed":
        return (
          <button className="border border-blue-400 text-blue-300 px-4 py-1.5 rounded text-sm hover:bg-blue-800/20 transition">
            Give Feedback
          </button>
        );
      case "cancelled":
        return <p className="text-sm text-red-400 font-medium">Booking Cancelled</p>;
      default:
        return null;
    }
  };

  return (
    <div
      className="w-full bg-[#0e1729]/70 backdrop-blur-md border border-blue-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-600/30 hover:scale-[1.02] transition-all duration-300"
      data-aos="fade-up"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-y-4">
        <div className="flex items-center gap-4">
          <Image
            src={mentorImage}
            alt={mentorName}
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">{mentorName}</h3>
            <p className="text-sm text-gray-400">{subject}</p>
          </div>
        </div>

        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      {/* Details + Actions */}
      <div className="flex justify-between items-center flex-wrap gap-y-4 text-sm text-gray-300">
        <div className="flex flex-wrap gap-6">
          <p className="flex items-center gap-2">
            <FaCalendarAlt className="text-blue-400" />
            {dateTime}
          </p>
          <p className="flex items-center gap-2">
            <FaClock className="text-blue-400" />
            {duration}
          </p>
          <p className="flex items-center gap-2">
            {renderModeIcon()}
            {mode}
          </p>
        </div>

        <div className="flex items-center gap-3">{renderActionButton()}</div>
      </div>
    </div>
  );
}
