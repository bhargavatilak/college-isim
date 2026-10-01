import React from 'react';
import { Users, FileImage, Settings, Play } from 'lucide-react';

export const GenerateId = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Generate ID Cards</h1>
        <p className="text-gray-500">Bulk generate identity cards for new students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Generation Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch / Year</label>
              <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border">
                <option>2023-2024</option>
                <option>2022-2023</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
              <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border">
                <option>All Programs</option>
                <option>B.Tech Computer Science</option>
                <option>MBA</option>
              </select>
            </div>

            <div className="pt-4">
              <button className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
                <Play className="w-4 h-4" />
                <span>Start Generation Process</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status & Progress</h3>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Students Selected</p>
                <p className="text-2xl font-bold text-gray-800">145</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <FileImage className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Templates Ready</p>
                <p className="text-2xl font-bold text-gray-800">Standard Modern</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Settings className="w-4 h-4" />
                <span>System ready for generation</span>
              </div>
              <p className="text-xs text-gray-500">
                Ensure printer settings are configured correctly before initiating bulk print.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
