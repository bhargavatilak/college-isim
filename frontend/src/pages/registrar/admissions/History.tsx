import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Search, Filter, Calendar } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface HistoryRecord {
    id: string;
    studentName: string;
    actionType: string;
    actionDate: string;
    performedBy: string;
    details: string;
}

export const History: React.FC = () => {
    const [historyLogs, setHistoryLogs] = useState<HistoryRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch applications that have reached a final state
                const { data, error } = await supabase
                    .from('students')
                    .select('*')
                    .in('status', ['Active', 'Approved', 'Rejected', 'Inactive'])
                    .order('created_at', { ascending: false });

                if (error) throw error;
                
                if (data) {
                    const mappedData = data.map(app => ({
                        id: app.id,
                        studentName: `${app.first_name} ${app.last_name}`,
                        actionType: `Status set to ${app.status}`,
                        actionDate: new Date(app.created_at).toLocaleString(),
                        performedBy: 'Registrar',
                        details: `Program: ${app.program_code || 'N/A'}`
                    }));
                    setHistoryLogs(mappedData);
                }
            } catch (err) {
                console.error('Error fetching history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <HistoryIcon className="text-purple-600" />
                        Admission History
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Audit log of all admission-related actions.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search history logs..." 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm">
                            <Calendar size={18} />
                            Date Range
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm">
                            <Filter size={18} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                <th className="px-6 py-4 font-medium">Log ID</th>
                                <th className="px-6 py-4 font-medium">Student Name</th>
                                <th className="px-6 py-4 font-medium">Action Type</th>
                                <th className="px-6 py-4 font-medium">Date & Time</th>
                                <th className="px-6 py-4 font-medium">Performed By</th>
                                <th className="px-6 py-4 font-medium">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mb-2"></div>
                                        <p>Loading history records...</p>
                                    </td>
                                </tr>
                            ) : historyLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        No history records found.
                                    </td>
                                </tr>
                            ) : (
                                historyLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{log.id}</td>
                                        <td className="px-6 py-4 text-sm text-slate-800">{log.studentName}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">
                                                {log.actionType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{log.actionDate}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{log.performedBy}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-xs">{log.details}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <p className="text-sm text-slate-500">Showing {historyLogs.length} logs</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-600 hover:bg-slate-50 text-sm disabled:opacity-50">Previous</button>
                        <button className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-600 hover:bg-slate-50 text-sm">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
