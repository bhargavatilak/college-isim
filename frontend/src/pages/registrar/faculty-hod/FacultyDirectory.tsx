import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, BadgeCheck, XCircle, Shield } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export const FacultyDirectory: React.FC = () => {
    const [faculty, setFaculty] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('faculty')
                .select(`
                    *,
                    hod_assignments (
                        hod_id,
                        status
                    )
                `);

            if (error) {
                console.error("Error fetching faculty", error);
            } else {
                setFaculty(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredFaculty = faculty.filter(f => 
        f.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        f.faculty_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Faculty Directory</h1>
                <p className="text-gray-500">Manage faculty members and view their roles.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by name or Faculty ID..." 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                                <th className="p-4 font-medium">Faculty Member</th>
                                <th className="p-4 font-medium">Faculty ID</th>
                                <th className="p-4 font-medium">Department</th>
                                <th className="p-4 font-medium">Roles</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">Loading directory...</td>
                                </tr>
                            ) : filteredFaculty.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">No faculty members found.</td>
                                </tr>
                            ) : (
                                filteredFaculty.map((f, i) => {
                                    const activeHod = f.hod_assignments?.find((a: any) => a.status === 'ACTIVE');
                                    
                                    return (
                                        <tr key={f.id || i} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                                                        {f.name?.charAt(0) || 'F'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{f.name || 'Unknown'}</div>
                                                        <div className="text-gray-500 text-xs">{f.email || 'No email provided'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium text-gray-700">{f.faculty_id || 'N/A'}</td>
                                            <td className="p-4 text-gray-600">{f.department || 'N/A'}</td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                        Faculty
                                                    </span>
                                                    {activeHod && (
                                                        <span className="inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                                            <Shield size={12} /> HOD ({activeHod.hod_id})
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {f.status === 'ACTIVE' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                        <BadgeCheck size={14} /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                        <XCircle size={14} /> Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
