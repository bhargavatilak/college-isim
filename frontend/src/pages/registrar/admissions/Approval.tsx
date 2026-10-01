import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

interface VerificationPending {
    id: string;
    first_name: string;
    last_name: string;
    program_code: string;
    applied_date: string;
    status: string;
}

export const Approval: React.FC = () => {
    const navigate = useNavigate();
    const [pendingItems, setPendingItems] = useState<VerificationPending[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            const mappedData = (data || []).map(student => ({
                id: student.id,
                first_name: student.first_name,
                last_name: student.last_name,
                program_code: student.program_code,
                applied_date: student.created_at,
                status: student.status || 'Pending'
            }));
            
            setPendingItems(mappedData);
        } catch (error: any) {
            alert(`Error fetching applications: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('students')
                .update({ status: newStatus })
                .eq('id', id);
                
            if (error) throw error;
            fetchApplications();
        } catch (error: any) {
            alert(`Error updating status: ${error.message}`);
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <ClipboardCheck className="text-amber-500" />
                        Approvals & Verification
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Review and verify student admission documents.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search pending verifications..." 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                <th className="px-6 py-4 font-medium">Task ID</th>
                                <th className="px-6 py-4 font-medium">Student Name</th>
                                <th className="px-6 py-4 font-medium">Document Type</th>
                                <th className="px-6 py-4 font-medium">Submitted On</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                                </tr>
                            ) : pendingItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No applications found.</td>
                                </tr>
                            ) : (
                                pendingItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                                            {item.id.substring(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-800">
                                            {item.first_name} {item.last_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{item.program_code}</td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(item.applied_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                item.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                item.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {item.status || 'Pending Verification'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {(item.status !== 'APPROVED' && item.status !== 'REJECTED') && (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => updateStatus(item.id, 'APPROVED')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button onClick={() => updateStatus(item.id, 'REJECTED')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
