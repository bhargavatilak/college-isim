import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, Users, LayoutGrid, AlignJustify } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

interface Application {
    id: string;
    applicant_name: string;
    course: string;
    submission_date: string;
    status: 'Pending' | 'In Review' | 'Approved' | 'Rejected' | string;
    score: number;
}

export const Applications: React.FC = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data, error } = await supabase
                    .from('students')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) {
                    const formattedData = data.map(app => {
                        const statusLower = (app.status || '').toLowerCase();
                        let displayStatus = 'Pending';
                        if (statusLower === 'pending') displayStatus = 'Pending';
                        else if (statusLower === 'in review') displayStatus = 'In Review';
                        else if (statusLower === 'approved' || statusLower === 'active') displayStatus = 'Approved';
                        else if (statusLower === 'rejected') displayStatus = 'Rejected';
                        
                        return { 
                            id: app.id,
                            applicant_name: `${app.first_name || ''} ${app.last_name || ''}`.trim(),
                            course: app.program_code || 'N/A',
                            submission_date: app.created_at,
                            status: displayStatus,
                            score: 0 
                        } as Application;
                    });
                    setApplications(formattedData);
                }
            } catch (error: any) {
                console.error('Error fetching applications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const updateStatus = async (id: string, newStatus: Application['status']) => {
        try {
            // Map Approved back to Active for students table
            const dbStatus = newStatus === 'Approved' ? 'Active' : newStatus;
            const { error } = await supabase
                .from('students')
                .update({ status: dbStatus })
                .eq('id', id);
            
            if (error) throw error;
            setApplications(apps => apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === 'approved') return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Approved</span>;
        if (lowerStatus === 'pending') return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
        if (lowerStatus === 'in review') return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">In Review</span>;
        if (lowerStatus === 'rejected') return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Rejected</span>;
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
    };

    const columns = ['Pending', 'In Review', 'Approved', 'Rejected'];

    const renderKanban = () => (
        <div className="flex gap-6 overflow-x-auto pb-4 h-full min-h-[500px]">
            {columns.map(status => (
                <div key={status} className="flex-1 min-w-[300px] bg-slate-100/50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-700">{status}</h3>
                        <span className="bg-white text-slate-500 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            {applications.filter(a => a.status === status).length}
                        </span>
                    </div>
                    <div className="space-y-3">
                        {applications.filter(a => a.status === status).map(app => (
                            <div key={app.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-medium text-slate-800">{app.applicant_name}</div>
                                    <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Score: {app.score}</div>
                                </div>
                                <div className="text-sm text-slate-500 mb-1">{app.course}</div>
                                <div className="text-xs text-slate-400 mb-4">ID: {app.id} • {app.submission_date}</div>
                                
                                <div className="flex gap-2">
                                    {status !== 'In Review' && status !== 'Approved' && status !== 'Rejected' && (
                                        <button onClick={() => updateStatus(app.id, 'In Review')} className="flex-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 py-1.5 rounded font-medium transition-colors">Review</button>
                                    )}
                                    {status === 'In Review' && (
                                        <>
                                            <button onClick={() => updateStatus(app.id, 'Approved')} className="flex-1 text-xs bg-green-50 text-green-600 hover:bg-green-100 py-1.5 rounded font-medium transition-colors">Approve</button>
                                            <button onClick={() => updateStatus(app.id, 'Rejected')} className="flex-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 py-1.5 rounded font-medium transition-colors">Reject</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Users className="text-blue-600" />
                        Applications
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and track student admission applications.</p>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="flex bg-white rounded-lg border border-slate-300 p-1">
                        <button 
                            onClick={() => setViewMode('kanban')}
                            className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'kanban' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Kanban View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'table' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Table View"
                        >
                            <AlignJustify size={18} />
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {viewMode === 'kanban' ? (
                renderKanban()
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search applications..." 
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <select className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                <option value="">All Courses</option>
                                <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                                <option value="B.Tech Electronics">B.Tech Electronics</option>
                                <option value="BBA">BBA</option>
                            </select>
                            <select className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In Review">In Review</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm whitespace-nowrap">
                                <Filter size={18} />
                                More Filters
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-6 py-4 font-medium">Application ID</th>
                                    <th className="px-6 py-4 font-medium">Applicant Name</th>
                                    <th className="px-6 py-4 font-medium">Course</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Score</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                                            <p>Loading applications...</p>
                                        </td>
                                    </tr>
                                ) : applications.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                            No applications found.
                                        </td>
                                    </tr>
                                ) : (
                                    applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-blue-600">
                                                <button onClick={() => navigate(`/registrar/admissions/applications/${app.id}`)} className="hover:underline">{app.id}</button>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-800">
                                                <button onClick={() => navigate(`/registrar/admissions/applications/${app.id}`)} className="hover:text-blue-600 hover:underline">{app.applicant_name}</button>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{app.course}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{app.submission_date}</td>
                                            <td className="px-6 py-4 text-sm text-slate-800 font-semibold">{app.score}</td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(app.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                        <p className="text-sm text-slate-500">Showing {applications.length} applications</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-600 hover:bg-slate-50 text-sm disabled:opacity-50">Previous</button>
                            <button className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-600 hover:bg-slate-50 text-sm">Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

