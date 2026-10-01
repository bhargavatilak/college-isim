import React from 'react';
import { Calendar, Plus, Search, CheckCircle } from 'lucide-react';

export const AcademicYears: React.FC = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Academic Years</h1>
                    <p className="text-gray-500">Configure and manage academic years</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    <Plus size={20} />
                    <span>New Academic Year</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
                    <h3 className="text-sm font-medium text-gray-500">Current Academic Year</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">2026-2027</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Total Years Configured</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Upcoming Year Status</h3>
                    <p className="text-2xl font-bold text-amber-600 mt-1">Drafting</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search academic years..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>
                
                <table className="w-full">
                    <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 border-b">Academic Year</th>
                            <th className="px-6 py-4 border-b">Start Date</th>
                            <th className="px-6 py-4 border-b">End Date</th>
                            <th className="px-6 py-4 border-b">Status</th>
                            <th className="px-6 py-4 border-b text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {['2026-2027', '2025-2026', '2024-2025'].map((year, index) => (
                            <tr key={year} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${index === 0 ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <Calendar size={16} />
                                    </div>
                                    {year}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Aug 01, {year.split('-')[0]}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Jul 31, {year.split('-')[1]}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {index === 0 ? (
                                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center gap-1 w-max">
                                            <CheckCircle size={12} /> Active
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                            Completed
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-purple-600 hover:text-purple-900">Manage Terms</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
