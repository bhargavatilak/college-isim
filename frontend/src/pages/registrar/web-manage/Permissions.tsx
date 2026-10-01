import React, { useEffect, useState } from 'react';
import { Key } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface PortalPermission {
    id: string;
    student_id: string;
    can_register_courses: boolean;
    can_view_grades: boolean;
    can_access_library: boolean;
    can_book_facilities: boolean;
}

export const Permissions: React.FC = () => {
    const [permissions, setPermissions] = useState<PortalPermission[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPermissions = async () => {
        const { data, error } = await supabase
            .from('student_portal_permissions')
            .select('*')
            .order('student_id', { ascending: true });
        
        if (data) {
            setPermissions(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const togglePermission = async (id: string, field: keyof PortalPermission, currentValue: boolean) => {
        const { error } = await supabase
            .from('student_portal_permissions')
            .update({ [field]: !currentValue })
            .eq('id', id);
            
        if (!error) {
            setPermissions(permissions.map(p => 
                p.id === id ? { ...p, [field]: !currentValue } : p
            ));
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Portal Permissions</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading permissions...</div>
                ) : permissions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Key className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No permissions data found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Register Courses</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">View Grades</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Access Library</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Book Facilities</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {permissions.map((perm) => (
                                    <tr key={perm.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {perm.student_id}
                                        </td>
                                        {(['can_register_courses', 'can_view_grades', 'can_access_library', 'can_book_facilities'] as const).map(field => (
                                            <td key={field} className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => togglePermission(perm.id, field, perm[field])}
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                                                        perm[field] ? 'bg-indigo-600' : 'bg-gray-200'
                                                    }`}
                                                    role="switch"
                                                    aria-checked={perm[field]}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                            perm[field] ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </button>
                                            </td>
                                        ))}
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
