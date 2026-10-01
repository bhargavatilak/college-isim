import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { History, Shield, Calendar, Building, LogOut } from 'lucide-react';

export const HodManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, [activeTab]);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const statusFilter = activeTab === 'active' ? 'ACTIVE' : 'INACTIVE';
            
            const { data, error } = await supabase
                .from('hod_assignments')
                .select(`
                    *,
                    faculty (
                        name,
                        faculty_id
                    )
                `)
                .eq('status', statusFilter);

            if (error) throw error;
            setAssignments(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (id: string) => {
        if (!confirm('Are you sure you want to revoke this HOD assignment?')) return;
        
        try {
            await supabase
                .from('hod_assignments')
                .update({ status: 'INACTIVE', end_date: new Date().toISOString().split('T')[0] })
                .eq('id', id);
            
            fetchAssignments();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">HOD Management</h1>
                    <p className="text-gray-500">View active Heads of Department and historical records.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200 bg-gray-50/50">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'active' 
                                ? 'border-purple-600 text-purple-700 bg-white' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Shield size={18} />
                            Active HODs
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'history' 
                                ? 'border-purple-600 text-purple-700 bg-white' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <History size={18} />
                            HOD History
                        </div>
                    </button>
                </div>

                <div className="p-0">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                                <th className="p-4 font-medium">HOD Details</th>
                                <th className="p-4 font-medium">Department</th>
                                <th className="p-4 font-medium">Tenure</th>
                                {activeTab === 'active' && <th className="p-4 font-medium text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading records...</td></tr>
                            ) : assignments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-500">
                                        <Shield className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p>No {activeTab} HOD records found.</p>
                                    </td>
                                </tr>
                            ) : (
                                assignments.map((assignment) => (
                                    <tr key={assignment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${activeTab === 'active' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {assignment.faculty?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{assignment.faculty?.name}</div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs text-gray-500">HOD ID: <span className="font-mono text-purple-700">{assignment.hod_id}</span></span>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-xs text-gray-500">Fac ID: <span className="font-mono">{assignment.faculty?.faculty_id}</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Building size={16} className="text-gray-400" />
                                                {assignment.department}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    Start: {assignment.start_date}
                                                </div>
                                                {assignment.end_date && (
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Calendar size={14} className="text-gray-400" />
                                                        End: {assignment.end_date}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        {activeTab === 'active' && (
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={() => handleRevoke(assignment.id)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <LogOut size={16} />
                                                    Revoke Role
                                                </button>
                                            </td>
                                        )}
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
