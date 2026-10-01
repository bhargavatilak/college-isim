import React from 'react';
import { 
    Users, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    TrendingUp,
    FileText
} from 'lucide-react';

export const HelpDeskDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Help Desk Overview</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Generate Report
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Total Active Requests</h3>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <FileText size={20} className="text-blue-600" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-3xl font-bold text-gray-800">248</p>
                            <p className="text-sm text-green-600 flex items-center mt-1">
                                <TrendingUp size={14} className="mr-1" /> +12% this week
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Pending Resolution</h3>
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <Clock size={20} className="text-yellow-600" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-3xl font-bold text-gray-800">56</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Requires attention
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Resolved Today</h3>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <CheckCircle size={20} className="text-green-600" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-3xl font-bold text-gray-800">42</p>
                            <p className="text-sm text-green-600 flex items-center mt-1">
                                <TrendingUp size={14} className="mr-1" /> +5% vs yesterday
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">Escalated Tickets</h3>
                        <div className="p-2 bg-red-50 rounded-lg">
                            <AlertCircle size={20} className="text-red-600" />
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-3xl font-bold text-gray-800">7</p>
                            <p className="text-sm text-red-500 flex items-center mt-1">
                                High priority
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity & Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Tickets by Category</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500">Chart rendering area</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                                    <Users size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">New request from Student {item}0{item}</p>
                                    <p className="text-xs text-gray-500">Hostel Wi-Fi issue • {item * 10} mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
