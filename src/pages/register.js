import React from 'react';
import Header from '@/components/Header';
const RegistrationPage = () => {
  return (
  <>
   <Header/>
    <div className="flex h-screen w-full bg-black text-white overflow-hidden">
       
      {/* Left Section: Marketing */}
      <div className="w-1/2 bg-black flex items-center justify-center p-12 text-center">
        <div className="flex flex-col items-center justify-center h-full w-full space-y-6">
  

          <img
            src="/Illustration33.gif"
            alt="Marketing Illustration"
            className="w-3/4 max-w-md object-contain"
          />
        <h1 className="text-5xl font-extrabold text-blue-500 leading-tight">
            Empower Your Expertise
          </h1>
          <p className="text-lg text-gray-300 max-w-md">
            “Join a community where knowledge becomes influence. Transform your skills into impact.”
          </p>
        </div>
      </div>

      {/* Right Section: Login */}
      <div className="w-1/2 flex flex-col justify-center items-center relative p-10 bg-black">
        <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-sm">
          <h2 className="text-3xl font-bold text-blue-400 text-center mb-8">
            Expert Login
          </h2>
          <form className="flex flex-col space-y-5">
            <div>
              <label htmlFor="phone" className="block text-sm text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                placeholder="Enter phone number"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition duration-300"
            >
              Login
            </button>
          </form>
        </div>

        {/* Registration Status Button */}
        <button
          className="mt-6 text-sm text-blue-400 hover:text-blue-500 underline transition duration-200"
        >
          Check Registration Status
        </button>
      </div>
    </div>
  </>
  );
};

export default RegistrationPage;
