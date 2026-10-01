import React, { useState } from 'react';
import { Download, BarChart2, PieChart, TrendingUp, Filter, FileText } from 'lucide-react';

export function Reports() {
  const [reportType, setReportType] = useState('academic');
  const [dateRange, setDateRange] = useState('this-semester');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Institutional Reports</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filters:</span>
        </div>
        
        <select 
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="academic">Academic Performance</option>
          <option value="attendance">Attendance Analytics</option>
          <option value="financial">Financial Reports</option>
          <option value="admissions">Admission Trends</option>
        </select>

        <select 
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="this-semester">This Semester</option>
          <option value="last-semester">Last Semester</option>
          <option value="this-year">Academic Year 2023-24</option>
          <option value="custom">Custom Range...</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mock Chart 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Performance Over Time</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 pb-4">
            {/* Fake bars */}
            {[40, 70, 55, 90, 85, 60, 100, 75].map((height, i) => (
              <div key={i} className="w-full bg-blue-100 rounded-t-md relative group">
                <div 
                  className="absolute bottom-0 w-full bg-blue-500 rounded-t-md transition-all duration-300"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 px-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
            <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
          </div>
        </div>

        {/* Mock Chart 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Department Distribution</h3>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="h-64 flex items-center justify-center relative">
            <div className="w-48 h-48 rounded-full border-8 border-purple-500 border-t-purple-200 border-r-indigo-500 border-b-blue-400"></div>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-800">4.2k</span>
              <span className="text-sm text-gray-500">Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { name: 'End Semester Results Summary', date: 'Oct 24, 2026', type: 'Academic', size: '2.4 MB' },
            { name: 'Monthly Attendance Defaulters', date: 'Oct 22, 2026', type: 'Attendance', size: '1.1 MB' },
            { name: 'Fee Collection Status Q3', date: 'Oct 15, 2026', type: 'Financial', size: '3.8 MB' }
          ].map((report, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 text-gray-500 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <div className="flex gap-3 text-sm text-gray-500 mt-1">
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 hidden sm:block">{report.size}</span>
                <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
