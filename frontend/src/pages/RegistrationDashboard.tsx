import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import classNames from 'classnames';
import api from '../services/api';

interface Registration {
    referenceNo: string;
    student: string;
    semester: string;
    status: string;
    date: string;
}

export const RegistrationDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('PENDING');
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [error, setError] = useState<string | null>(null);

    const tabs = ['PENDING', 'APPROVED', 'REJECTED', 'ALL'];

    const fetchRegistrations = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/hod/registrations?status=${activeTab}`);
            setRegistrations(response.data);
        } catch (err: any) {
            console.error(err);
            setError('localhost:5173 says\nFailed to load registration data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, [activeTab]);

    return (
        <div className="p-6 bg-gray-50 flex-1 overflow-y-auto">
            {/* Header Banner */}
            <div className="bg-[#0f172a] rounded-xl p-6 text-white mb-6 relative overflow-hidden">
                <div className="relative z-10">
                    <span className="inline-block bg-blue-500/20 text-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                        HOD - SEMESTER REGISTRATION
                    </span>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileText /> Registration Dashboard
                    </h1>
                </div>
                {/* Decorative background circle */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-6 bg-white p-2 rounded-xl shadow-sm border">
                <div className="flex space-x-1 p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={classNames(
                                'px-4 py-2 text-sm font-semibold rounded-lg transition-colors',
                                activeTab === tab ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                
                <div className="flex items-center gap-2 px-2">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search student or ref number..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                    </div>
                    <button onClick={fetchRegistrations} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border bg-white shadow-sm">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase">
                            <tr>
                                <th className="px-6 py-4">REFERENCE NO.</th>
                                <th className="px-6 py-4">STUDENT</th>
                                <th className="px-6 py-4">SEMESTER</th>
                                <th className="px-6 py-4">STATUS</th>
                                <th className="px-6 py-4">DATE</th>
                                <th className="px-6 py-4 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-24 text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Loading registrations...
                                        </div>
                                    </td>
                                </tr>
                            ) : registrations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No registration data found for this status.
                                    </td>
                                </tr>
                            ) : (
                                registrations.map((reg, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-blue-600 text-xs">{reg.referenceNo}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{reg.student}</td>
                                        <td className="px-6 py-4 text-gray-600">{reg.semester}</td>
                                        <td className="px-6 py-4">
                                            <span className={classNames(
                                                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                                                reg.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                                reg.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            )}>
                                                {reg.status === 'APPROVED' ? <CheckCircle size={12} /> : 
                                                 reg.status === 'REJECTED' ? <XCircle size={12} /> : <Clock size={12} />}
                                                {reg.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{reg.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-3 py-1 border border-blue-200 rounded hover:bg-blue-50 transition-colors">
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Modal Alert (Simulated Browser Alert from Image) */}
            {error && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pointer-events-none">
                    <div className="bg-[#2b2b2b] text-white p-4 rounded-lg shadow-2xl w-80 pointer-events-auto border border-gray-700">
                        <h3 className="font-semibold mb-2">localhost:5173 says</h3>
                        <p className="text-sm mb-4">Failed to load registration data</p>
                        <div className="flex justify-end">
                            <button 
                                onClick={() => setError(null)}
                                className="bg-white text-black px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-200"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
