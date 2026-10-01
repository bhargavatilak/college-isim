import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, CheckCircle, Clock, X, User, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AdmissionCellDashboard: React.FC = () => {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const fetchRegistrations = async () => {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);
                
            if (error) {
                console.error('Supabase error:', error);
            } else if (data) {
                setRegistrations(data);
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStudent = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // prevent modal opening
        if (confirm('Are you sure you want to completely delete this record from the database? This cannot be undone.')) {
            try {
                const { error } = await supabase.from('students').delete().eq('id', id);
                if (error) throw error;
                fetchRegistrations(); // refresh
            } catch (error: any) {
                console.error('Failed to delete:', error);
                alert('Failed to delete student: ' + error.message);
            }
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    // UI rendered below

    return (
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto relative">
            {/* Student Details Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <User className="text-blue-600" /> Student Profile
                            </h2>
                            <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto space-y-6">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-center">
                                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">Official Admission Number</p>
                                <h3 className="text-3xl font-black text-gray-900 font-mono tracking-tight">{selectedStudent.admission_number || 'N/A'}</h3>
                                <p className="text-xs text-gray-500 mt-2">This is the unique ID used for ERP Login & Identification</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">First Name</label>
                                    <p className="font-medium text-gray-900">{selectedStudent.first_name}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Last Name</label>
                                    <p className="font-medium text-gray-900">{selectedStudent.last_name}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                                    <p className="font-medium text-gray-900">{selectedStudent.email || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Mobile Number</label>
                                    <p className="font-medium text-gray-900">{selectedStudent.phone || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Department</label>
                                    <p className="font-medium text-gray-900">{selectedStudent.department_code || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Program / Course</label>
                                    <p className="font-medium text-gray-900">{selectedStudent.program_code || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Date of Birth</label>
                                    <p className="font-medium text-gray-900">{selectedStudent.dob || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Gender</label>
                                    <p className="font-medium text-gray-900">{selectedStudent.gender || 'N/A'}</p>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Address</label>
                                    <p className="font-medium text-gray-900">{selectedStudent.address || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <LayoutDashboard className="text-blue-600" /> Admission Cell Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">Manage new student registrations and track application status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Registrations</p>
                        <h3 className="text-2xl font-bold text-gray-900">{registrations.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Clock size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Pending Review</p>
                        <h3 className="text-2xl font-bold text-gray-900">{registrations.filter(r => r.status === 'Pending').length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Approved Admissions</p>
                        <h3 className="text-2xl font-bold text-gray-900">{registrations.filter(r => r.status === 'Active').length}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Users size={20} className="text-emerald-600" /> Recent Registrations
                    </h2>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-medium">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">ID</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((reg) => (
                                <tr key={reg.id} onClick={() => setSelectedStudent(reg)} className="border-b border-gray-50 hover:bg-blue-50/50 cursor-pointer transition-colors group">
                                    <td className="px-4 py-3 font-medium text-blue-600">{reg.admission_number || `#${reg.id.slice(0,6)}`}</td>
                                    <td className="px-4 py-3 font-bold text-gray-800">{reg.first_name} {reg.last_name}</td>
                                    <td className="px-4 py-3">{reg.email || 'N/A'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1 ${
                                            reg.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {reg.status === 'Active' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                                            {reg.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{reg.admission_date || reg.created_at?.split('T')[0]}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button 
                                            onClick={(e) => handleDeleteStudent(e, reg.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Student"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {registrations.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                        No recent registrations found.
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
