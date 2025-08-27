// import React from "react";

export default function ProfileBox() {
  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center px-4">
      <div className=" w-[450px] h-auto bg-[#181818] rounded-lg shadow-xl p-8 outline-[0.5px] border-white">
        <form className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Update your username
            </h1>
            <p className="text-gray-300 text-sm">
              Enter your new username below
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your new username"
                className="w-full px-3 mb-2 py-2 bg-[#292929] outline-[0.5px] border-gray-300 rounded-md placeholder:text-white  placeholder:opacity-35 text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                required
              />
            </div>
            <div className="space-y-3 pt-4">
              <button
                className="w-full mb-4 bg-white hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded-md transition-colors hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-black"
                type="submit"
              >
                Update Username
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
