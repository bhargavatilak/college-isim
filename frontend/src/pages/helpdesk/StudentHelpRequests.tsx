import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Eye, CheckCircle, XCircle } from 'lucide-react';

interface HelpRequest {
    id: string;
    studentId: string;
    studentName: string;
    category: string;
    subject: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    date: string;
}

export const StudentHelpRequests: React.FC = () => {
    const [requests, setRequests] = useState<HelpRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Mock fetch from /api/helpdesk/requests
        const fetchRequests = async () => {
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 800));
                
                setRequests([
                    { id: 'REQ-1001', studentId: 'STU2021001', studentName: 'Rahul Kumar', category: 'IT Support', subject: 'ERP Login Issue', status: 'Open', date: '2026-10-24' },
                    { id: 'REQ-1002', studentId: 'STU2021045', studentName: 'Priya Singh', category: 'Infrastructure', subject: 'Classroom AC not working', status: 'In Progress', date: '2026-10-23' },
                    { id: 'REQ-1003', studentId: 'STU2022089', studentName: 'Amit Patel', category: 'Hostel', subject: 'Room Cleaning Request', status: 'Resolved', date: '2026-10-22' },
                    { id: 'REQ-1004', studentId: 'STU2023112', studentName: 'Neha Sharma', category: 'Academic', subject: 'Timetable Clash', status: 'Open', date: '2026-10-24' },
                    { id: 'REQ-1005', studentId: 'STU2021205', studentName: 'Vikram Singh', category: 'Transport', subject: 'Bus Pass Renewal', status: 'Closed', date: '2026-10-20' },
                ]);
            } catch (error) {
                console.error("Failed to fetch requests", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Open':
                return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Open</span>;
            case 'In Progress':
                return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>;
            case 'Resolved':
                return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Resolved</span>;
            case 'Closed':
                return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Closed</span>;
            default:
                return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const filteredRequests = requests.filter(req => 
        req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Student Help Requests</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and respond to student inquiries and issues</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Export Data
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by ID, name, or subject..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            <Filter size={16} className="mr-2" />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3">Request ID</th>
                                <th className="px-6 py-3">Student Info</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Subject</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center">
                                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Loading requests...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRequests.length > 0 ? (
                                filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{req.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{req.studentName}</div>
                                            <div className="text-xs text-gray-500">{req.studentId}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{req.category}</td>
                                        <td className="px-6 py-4 text-gray-900">{req.subject}</td>
                                        <td className="px-6 py-4 text-gray-600">{req.date}</td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(req.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Details">
                                                    <Eye size={18} />
                                                </button>
                                                {req.status === 'Open' && (
                                                    <button className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Mark Resolved">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No requests found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
                    <div>Showing 1 to {filteredRequests.length} of {filteredRequests.length} entries</div>
                    <div className="flex space-x-1">
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">1</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
