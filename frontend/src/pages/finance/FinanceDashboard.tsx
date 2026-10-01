import React from 'react';
import { LayoutDashboard, Users, Activity } from 'lucide-react';

export const FinanceDashboard: React.FC = () => {
    return (
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <LayoutDashboard className="text-blue-600" /> Finance Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">Overview of revenue, dues, and fee collection.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Users size={24}/></div>
                    <div><p className="text-sm text-gray-500 font-medium">Total Active</p><p className="text-2xl font-bold">1,240</p></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center"><Activity size={24}/></div>
                    <div><p className="text-sm text-gray-500 font-medium">Daily Actions</p><p className="text-2xl font-bold">84</p></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center"><LayoutDashboard size={24}/></div>
                    <div><p className="text-sm text-gray-500 font-medium">System Status</p><p className="text-2xl font-bold text-green-600">Online</p></div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                <p>Welcome to the Finance Dashboard. Use the sidebar to navigate to specific modules.</p>
            </div>
        </div>
    );
};
