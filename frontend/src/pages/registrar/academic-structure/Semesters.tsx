import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, Settings } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export const Semesters: React.FC = () => {
    const [semesters, setSemesters] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSemesters();
    }, []);

    const fetchSemesters = async () => {
        try {
            const { data, error } = await supabase.from('semesters').select('*');
            if (error) throw error;
            
            // Map data or fallback if empty
            if (data && data.length > 0) {
                setSemesters(data);
            } else {
                setSemesters([
                    { id: '1', name: 'Fall 2026', type: 'Odd', status: 'Open', academic_year: '2026-2027' },
                    { id: '2', name: 'Spring 2026', type: 'Even', status: 'Closed', academic_year: '2025-2026' },
                    { id: '3', name: 'Fall 2025', type: 'Odd', status: 'Completed', academic_year: '2025-2026' },
                ]);
            }
        } catch (error) {
            console.error('Error fetching semesters:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSemesters = semesters.filter(sem =>
        (sem.name || sem.term || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Semester Configuration</h1>
                    <p className="text-gray-500">Manage semesters, terms, and their registration periods</p>
                </div>
                <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    <Plus size={20} />
                    <span>Create Semester</span>
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
                            placeholder="Search semesters..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>
                
                <table className="w-full">
                    <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 border-b">Semester Name</th>
                            <th className="px-6 py-4 border-b">Academic Year</th>
                            <th className="px-6 py-4 border-b">Type</th>
                            <th className="px-6 py-4 border-b">Registration Status</th>
                            <th className="px-6 py-4 border-b text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
                        ) : filteredSemesters.map((sem, index) => (
                            <tr key={sem.id || index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                        <Layers size={16} />
                                    </div>
                                    {sem.name || sem.term || 'Unnamed'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sem.academic_year_id || sem.academic_year || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sem.type || 'Standard'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                        sem.status === 'Open' || sem.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                        sem.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {sem.status || 'ACTIVE'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-gray-400 hover:text-purple-600"><Settings size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
