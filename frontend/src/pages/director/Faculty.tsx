import React, { useState, useEffect } from 'react';
import { Users, Search, Filter } from 'lucide-react';
import api from '../../services/api';

export const Faculty: React.FC = () => {
    const [faculty, setFaculty] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [designationFilter, setDesignationFilter] = useState('');

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        try {
            setLoading(true);
            const response = await api.get('/director/faculty');
            setFaculty(response.data);
        } catch (error) {
            console.error('Error fetching faculty:', error);
            // Fallback mock data if API fails
            setFaculty([
                { id: 1, name: 'Dr. John Doe', email: 'john.doe@isim.edu', department: 'Computer Science', designation: 'Professor', status: 'ACTIVE' },
                { id: 2, name: 'Jane Smith', email: 'jane.smith@isim.edu', department: 'Mathematics', designation: 'Assistant Professor', status: 'ACTIVE' },
                { id: 3, name: 'Dr. Robert Brown', email: 'robert.b@isim.edu', department: 'Physics', designation: 'Associate Professor', status: 'ON_LEAVE' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredFaculty = faculty.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              f.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter ? f.department === departmentFilter : true;
        const matchesDesig = designationFilter ? f.designation === designationFilter : true;
        return matchesSearch && matchesDept && matchesDesig;
    });

    const uniqueDepartments = Array.from(new Set(faculty.map(f => f.department)));
    const uniqueDesignations = Array.from(new Set(faculty.map(f => f.designation)));

    return (
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="text-indigo-600" /> Faculty Overview
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">View and monitor all institution faculty members.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-3 flex-wrap">
                        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
                            <Filter size={16} className="text-gray-400" />
                            <select 
                                className="text-sm outline-none bg-transparent"
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                            >
                                <option value="">All Departments</option>
                                {uniqueDepartments.map((dept: any) => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
                            <Filter size={16} className="text-gray-400" />
                            <select 
                                className="text-sm outline-none bg-transparent"
                                value={designationFilter}
                                onChange={(e) => setDesignationFilter(e.target.value)}
                            >
                                <option value="">All Designations</option>
                                {uniqueDesignations.map((desig: any) => (
                                    <option key={desig} value={desig}>{desig}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Designation</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFaculty.map((f, idx) => (
                                    <tr key={f.id || idx} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{f.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{f.email}</td>
                                        <td className="px-6 py-4">{f.department}</td>
                                        <td className="px-6 py-4">{f.designation}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold 
                                                ${f.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 
                                                  f.status === 'ON_LEAVE' ? 'bg-yellow-50 text-yellow-700' : 
                                                  'bg-gray-100 text-gray-700'}`}>
                                                {f.status || 'ACTIVE'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredFaculty.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No faculty members found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
