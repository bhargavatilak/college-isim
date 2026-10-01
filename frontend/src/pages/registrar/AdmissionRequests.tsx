import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle, XCircle, Clock } from 'lucide-react';

export const AdmissionRequests: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/registrar/registrations');
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            } else {
                // Mock data
                setRequests([
                    { id: 101, name: 'Alice Walker', email: 'alice@example.com', tenth: 85, twelfth: 88, score: 92, status: 'Pending', date: '2023-10-05' },
                    { id: 102, name: 'Bob Harris', email: 'bob@example.com', tenth: 78, twelfth: 81, score: 75, status: 'Pending', date: '2023-10-06' }
                ]);
            }
        } catch (error) {
            console.error(error);
            setRequests([
                { id: 101, name: 'Alice Walker', email: 'alice@example.com', tenth: 85, twelfth: 88, score: 92, status: 'Pending', date: '2023-10-05' },
                { id: 102, name: 'Bob Harris', email: 'bob@example.com', tenth: 78, twelfth: 81, score: 75, status: 'Pending', date: '2023-10-06' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        try {
            const res = await fetch(`/api/registrar/registrations/${id}/${action}`, {
                method: 'POST'
            });
            if (res.ok) {
                alert(`Request ${action}d successfully`);
                fetchRequests();
            } else {
                // Mock success
                alert(`Mock Request ${action}d successfully`);
                setRequests(prev => prev.filter(req => req.id !== id));
            }
        } catch (error) {
            console.error(error);
            alert(`Mock Request ${action}d successfully`);
            setRequests(prev => prev.filter(req => req.id !== id));
        }
    };

    return (
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <UserCheck className="text-purple-600" /> Admission Requests
                </h1>
                <p className="text-sm text-gray-500 mt-1">Review and approve or reject new student registrations.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-medium">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">ID</th>
                                <th className="px-4 py-3">Applicant Info</th>
                                <th className="px-4 py-3">Academics</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="px-4 py-4 align-top">#{req.id}</td>
                                    <td className="px-4 py-4 align-top">
                                        <p className="font-medium text-gray-800">{req.name}</p>
                                        <p className="text-xs text-gray-500">{req.email}</p>
                                        <p className="text-xs text-gray-400 mt-1">Applied: {req.date}</p>
                                    </td>
                                    <td className="px-4 py-4 align-top">
                                        <div className="text-xs grid grid-cols-2 gap-x-4 gap-y-1">
                                            <span className="text-gray-500">10th:</span> <span className="font-medium">{req.tenth}%</span>
                                            <span className="text-gray-500">12th:</span> <span className="font-medium">{req.twelfth}%</span>
                                            <span className="text-gray-500">Score:</span> <span className="font-medium">{req.score}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 align-top">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1 bg-yellow-100 text-yellow-700`}>
                                            <Clock size={12} /> {req.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 align-top">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleAction(req.id, 'approve')}
                                                className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors border border-green-200"
                                                title="Approve"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleAction(req.id, 'reject')}
                                                className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors border border-red-200"
                                                title="Reject"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                        {loading ? 'Loading requests...' : 'No pending requests.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
