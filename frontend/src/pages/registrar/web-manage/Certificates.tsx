import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { FileBadge, Download, Ban, Plus } from 'lucide-react';

export const Certificates: React.FC = () => {
    const { id } = useParams();
    const [certificates, setCertificates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchCertificates = async () => {
        try {
            const { data, error } = await supabase
                .from('student_certificates')
                .select('*')
                .eq('student_id', id)
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            setCertificates(data || []);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchCertificates();
    }, [id]);

    const handleGenerate = async () => {
        const type = prompt("Enter certificate type (e.g., Bonafide, Character, Transcript):");
        if (!type) return;

        try {
            const { error } = await supabase
                .from('student_certificates')
                .insert([{
                    student_id: id,
                    certificate_type: type,
                    status: 'Active',
                    issue_date: new Date().toISOString()
                }]);

            if (error) throw error;
            await fetchCertificates();
        } catch (error) {
            console.error('Error generating certificate:', error);
            alert('Failed to generate certificate');
        }
    };

    const handleRevoke = async (certId: string) => {
        if (!confirm('Are you sure you want to revoke this certificate?')) return;
        
        setActionLoading(certId);
        try {
            const { error } = await supabase
                .from('student_certificates')
                .update({ 
                    status: 'Revoked',
                    updated_at: new Date().toISOString()
                })
                .eq('id', certId);

            if (error) throw error;
            await fetchCertificates();
        } catch (error) {
            console.error('Error revoking certificate:', error);
            alert('Failed to revoke certificate');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Certificates</h2>
                <button 
                    onClick={handleGenerate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Generate New
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading certificates...</div>
                ) : certificates.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <FileBadge className="w-12 h-12 text-gray-300 mb-3" />
                        <p>No certificates issued for this student.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 text-sm font-semibold text-gray-600">Certificate Type</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Issue Date</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Reference No</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {certificates.map((cert) => (
                                    <tr key={cert.id} className="hover:bg-gray-50/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <FileBadge className="w-5 h-5 text-blue-500" />
                                                <span className="font-medium text-gray-900">{cert.certificate_type}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-4 text-sm font-mono text-gray-600">
                                            {cert.reference_number || cert.id.substring(0, 8).toUpperCase()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                cert.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                                cert.status === 'Revoked' ? 'bg-red-100 text-red-700' : 
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {cert.status || 'Issued'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                {cert.status !== 'Revoked' && (
                                                    <button 
                                                        onClick={() => handleRevoke(cert.id)}
                                                        disabled={actionLoading === cert.id}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Revoke Certificate"
                                                    >
                                                        <Ban className="w-4 h-4" />
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
