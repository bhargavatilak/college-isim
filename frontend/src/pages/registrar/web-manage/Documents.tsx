import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { FileText, CheckCircle, XCircle, Eye, AlertCircle, Clock } from 'lucide-react';

export const Documents: React.FC = () => {
    const { id } = useParams();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchDocuments = async () => {
        try {
            const { data, error } = await supabase
                .from('student_documents')
                .select('*')
                .eq('student_id', id)
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            setDocuments(data || []);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDocuments();
    }, [id]);

    const handleAction = async (docId: string, status: 'Verified' | 'Rejected') => {
        setActionLoading(docId);
        try {
            const { error } = await supabase
                .from('student_documents')
                .update({ 
                    status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', docId);

            if (error) throw error;
            await fetchDocuments();
        } catch (error) {
            console.error('Error updating document status:', error);
            alert('Failed to update document status');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Verified':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3" /> Verified</span>;
            case 'Rejected':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"><XCircle className="w-3 h-3" /> Rejected</span>;
            case 'Pending':
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium"><Clock className="w-3 h-3" /> Pending</span>;
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading documents...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Uploaded Documents</h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {documents.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-300 mb-3" />
                        <p>No documents found for this student.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 text-sm font-semibold text-gray-600">Document Type</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">File Name</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Upload Date</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-gray-400" />
                                                <span className="font-medium text-gray-900">{doc.document_type || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {doc.file_name || 'document.pdf'}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(doc.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(doc.status || 'Pending')}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Document"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {doc.status !== 'Verified' && (
                                                    <button 
                                                        onClick={() => handleAction(doc.id, 'Verified')}
                                                        disabled={actionLoading === doc.id}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Verify"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {doc.status !== 'Rejected' && (
                                                    <button 
                                                        onClick={() => handleAction(doc.id, 'Rejected')}
                                                        disabled={actionLoading === doc.id}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
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
