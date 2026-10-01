import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Activity } from 'lucide-react';
import api from '../../services/api';

export const DirectorDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalActive: 1240,
        dailyActions: 84,
        systemStatus: 'Online'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/director/dashboard');
                if (response.data) {
                    setStats({
                        totalActive: response.data.totalActive ?? 1240,
                        dailyActions: response.data.dailyActions ?? 84,
                        systemStatus: response.data.systemStatus ?? 'Online'
                    });
                }
            } catch (error) {
                console.error('Error fetching director dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <LayoutDashboard className="text-blue-600" /> Director Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">High-level overview of institution performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Users size={24}/></div>
                    <div><p className="text-sm text-gray-500 font-medium">Total Active</p><p className="text-2xl font-bold">{stats.totalActive}</p></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center"><Activity size={24}/></div>
                    <div><p className="text-sm text-gray-500 font-medium">Daily Actions</p><p className="text-2xl font-bold">{stats.dailyActions}</p></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center"><LayoutDashboard size={24}/></div>
                    <div><p className="text-sm text-gray-500 font-medium">System Status</p><p className="text-2xl font-bold text-green-600">{stats.systemStatus}</p></div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                <p>Welcome to the Director Dashboard. Use the sidebar to navigate to specific modules.</p>
            </div>
        </div>
    );
};
