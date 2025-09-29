import React from "react";

const PulsingAdminDashboard = () => {
  return (
    <div className="flex-grow bg-gradient-to-br from-cyan-100 via-blue-50 to-blue-100">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="h-12 w-80 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-lg mb-2 animate-pulse"></div>
          <div className="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="space-y-6">
          {/* Tabs List */}
          <div className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm rounded-lg p-1">
            <div className="h-10 bg-gradient-to-r from-cyan-300 to-blue-300 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded mx-1 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="h-8 w-48 bg-cyan-200 rounded animate-pulse"></div>
              <div className="h-10 w-32 bg-gradient-to-r from-cyan-200 to-blue-200 rounded animate-pulse"></div>
            </div>

            {/* Content List */}
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex-grow space-y-3">
                    <div className="h-6 w-48 bg-gray-300 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <div className="h-8 w-16 bg-blue-200 rounded"></div>
                    <div className="h-8 w-16 bg-red-200 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex-grow space-y-3">
                    <div className="h-6 w-56 bg-gray-300 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <div className="h-8 w-16 bg-blue-200 rounded"></div>
                    <div className="h-8 w-16 bg-red-200 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex-grow space-y-3">
                    <div className="h-6 w-40 bg-gray-300 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <div className="h-8 w-16 bg-blue-200 rounded"></div>
                    <div className="h-8 w-16 bg-red-200 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex-grow space-y-3">
                    <div className="h-6 w-52 bg-gray-300 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/5 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <div className="h-8 w-16 bg-blue-200 rounded"></div>
                    <div className="h-8 w-16 bg-red-200 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Item 5 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-gray-200 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex-grow space-y-3">
                    <div className="h-6 w-44 bg-gray-300 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <div className="h-8 w-16 bg-blue-200 rounded"></div>
                    <div className="h-8 w-16 bg-red-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Loading Indicator */}
        <div className="fixed bottom-8 right-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg border border-cyan-200">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-cyan-700 font-medium">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PulsingAdminDashboard;
