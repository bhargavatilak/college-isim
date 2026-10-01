import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export const Sections: React.FC = () => {
    const [sections, setSections] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const { data, error } = await supabase.from('sections').select(`
                *,
                departments (name),
                programs (name)
            `);
            if (error) throw error;
            
            if (data) {
                setSections(data);
            } else {
                setSections([]);
            }
        } catch (error) {
            console.error('Error fetching sections:', error);
            setSections([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredSections = sections.filter(sec => 
        (sec.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Section & Batch Management</h1>
                    <p className="text-gray-500">Manage student sections and course batches</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    <Plus size={20} />
                    <span>Create Section</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search sections..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                </div>
                
                <table className="w-full">
                    <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 border-b">Section Code</th>
                            <th className="px-6 py-4 border-b">Department</th>
                            <th className="px-6 py-4 border-b">Program</th>
                            <th className="px-6 py-4 border-b">Capacity</th>
                            <th className="px-6 py-4 border-b">Coordinator</th>
                            <th className="px-6 py-4 border-b text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading sections...</td></tr>
                        ) : filteredSections.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No sections found in database.</td></tr>
                        ) : (
                            filteredSections.map((sec) => (
                                <tr key={sec.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 flex items-center gap-3">
                                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                            <Users size={16} />
                                        </div>
                                        Section {sec.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sec.department_code || sec.departments?.name || sec.department?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sec.program_code || sec.programs?.name || sec.program?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2 max-w-[4rem]">
                                                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${((sec.filled || sec.student_count || 0) / (sec.capacity || 1)) * 100}%` }}></div>
                                            </div>
                                            <span>{sec.filled || sec.student_count || 0}/{sec.capacity || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sec.class_advisor || sec.coordinator || 'Unassigned'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-purple-600 hover:text-purple-900">Edit</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
