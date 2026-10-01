import React, { useState, useEffect } from 'react';
import { GraduationCap, Search, Filter } from 'lucide-react';
import api from '../../services/api';

export const Students: React.FC = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/director/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            // Fallback mock data if API fails
            setStudents([
                { id: 1, enrollmentNo: 'EN2024001', name: 'Alice Williams', email: 'alice.w@isim.edu', course: 'B.Tech CS', year: '1st Year', semester: 'Sem 1', section: 'A', status: 'ACTIVE' },
                { id: 2, enrollmentNo: 'EN2024002', name: 'Bob Johnson', email: 'bob.j@isim.edu', course: 'B.Tech IT', year: '2nd Year', semester: 'Sem 3', section: 'B', status: 'ACTIVE' },
                { id: 3, enrollmentNo: 'EN2024003', name: 'Charlie Davis', email: 'charlie.d@isim.edu', course: 'BBA', year: '3rd Year', semester: 'Sem 5', section: 'A', status: 'SUSPENDED' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              s.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = courseFilter ? s.course === courseFilter : true;
        const matchesYear = yearFilter ? s.year === yearFilter : true;
        const matchesSem = semesterFilter ? s.semester === semesterFilter : true;
        return matchesSearch && matchesCourse && matchesYear && matchesSem;
    });

    const uniqueCourses = Array.from(new Set(students.map(s => s.course)));
    const uniqueYears = Array.from(new Set(students.map(s => s.year)));
    const uniqueSemesters = Array.from(new Set(students.map(s => s.semester)));

    return (
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="text-indigo-600" /> Students Overview
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">View and monitor all enrolled students.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 min-w-[250px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name, email or enrollment no..." 
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
                                value={courseFilter}
                                onChange={(e) => setCourseFilter(e.target.value)}
                            >
                                <option value="">All Courses</option>
                                {uniqueCourses.map((c: any) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
                            <Filter size={16} className="text-gray-400" />
                            <select 
                                className="text-sm outline-none bg-transparent"
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                            >
                                <option value="">All Years</option>
                                {uniqueYears.map((y: any) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
                            <Filter size={16} className="text-gray-400" />
                            <select 
                                className="text-sm outline-none bg-transparent"
                                value={semesterFilter}
                                onChange={(e) => setSemesterFilter(e.target.value)}
                            >
                                <option value="">All Semesters</option>
                                {uniqueSemesters.map((s: any) => (
                                    <option key={s} value={s}>{s}</option>
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
                                    <th className="px-6 py-4">Enrollment No</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Course</th>
                                    <th className="px-6 py-4">Year/Sem</th>
                                    <th className="px-6 py-4">Section</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((s, idx) => (
                                    <tr key={s.id || idx} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{s.enrollmentNo}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{s.name}</div>
                                            <div className="text-xs text-gray-500">{s.email}</div>
                                        </td>
                                        <td className="px-6 py-4">{s.course}</td>
                                        <td className="px-6 py-4">{s.year} - {s.semester}</td>
                                        <td className="px-6 py-4">{s.section}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold 
                                                ${s.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 
                                                  s.status === 'SUSPENDED' ? 'bg-red-50 text-red-700' : 
                                                  'bg-gray-100 text-gray-700'}`}>
                                                {s.status || 'ACTIVE'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No students found.</td>
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
