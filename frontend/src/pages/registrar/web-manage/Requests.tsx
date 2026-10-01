import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { MessageSquare, Check, X, Clock, AlertCircle } from 'lucide-react';

export const Requests: React.FC = () => {
    const { id } = useParams();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('student_requests')
                .select('*')
                .eq('student_id', id)
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchRequests();
    }, [id]);

    const handleAction = async (requestId: string, status: 'Approved' | 'Rejected') => {
        setActionLoading(requestId);
        try {
            const { error } = await supabase
                .from('student_requests')
                .update({ 
                    status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', requestId);

            if (error) throw error;
            await fetchRequests();
        } catch (error) {
            console.error('Error updating request status:', error);
            alert('Failed to update request status');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Approved':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Approved</span>;
            case 'Rejected':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Rejected</span>;
            case 'Pending':
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading requests...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Student Requests</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {requests.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                        <p>No requests found for this student.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 text-sm font-semibold text-gray-600">Request Type</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Description</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50/50">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{req.request_type || 'General'}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={req.description}>
                                            {req.description || 'No description provided'}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(req.status || 'Pending')}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {req.status === 'Pending' ? (
                                                    <>
                                                        <button 
                                                            onClick={() => handleAction(req.id, 'Approved')}
                                                            disabled={actionLoading === req.id}
                                                            className="px-3 py-1.5 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-1"
                                                        >
                                                            <Check className="w-4 h-4" /> Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleAction(req.id, 'Rejected')}
                                                            disabled={actionLoading === req.id}
                                                            className="px-3 py-1.5 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-1"
                                                        >
                                                            <X className="w-4 h-4" /> Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">No actions</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
