import React, { useState, useEffect } from 'react';
import { History, Search, FileText } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export const StructureHistory: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                // We fetch from audit_logs table, which was created for general auditing
                const { data, error } = await supabase
                    .from('audit_logs')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                setLogs(data || []);
            } catch (error) {
                console.error("Error fetching audit logs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Structure History</h1>
                    <p className="text-gray-500">Audit logs and historical changes to the academic structure</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search history logs..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>
                
                <table className="w-full">
                    <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 border-b">Date & Time</th>
                            <th className="px-6 py-4 border-b">Action</th>
                            <th className="px-6 py-4 border-b">Module</th>
                            <th className="px-6 py-4 border-b">Performed By</th>
                            <th className="px-6 py-4 border-b text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading logs...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan={5} className="p-6 text-center text-gray-500">No audit logs found.</td></tr>
                        ) : (
                            logs.map((log, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                            <History size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {new Date(log.created_at || new Date()).toLocaleString()}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        log.action === 'Created' ? 'bg-green-100 text-green-700' :
                                        log.action === 'Deleted' ? 'bg-red-100 text-red-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {log.action || 'Unknown'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-900">{log.module || log.entity_type || 'System'}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{log.user_id || log.performed_by || 'System Admin'}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-sm">
                                        <FileText size={14} /> View
                                    </button>
                                </td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
