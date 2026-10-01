import React, { useState, useEffect } from 'react';
import { 
    Award, Filter, Download, Plus, CheckCircle, 
    XCircle, Clock, ChevronLeft, ChevronRight,
    Search, FileSpreadsheet, RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const MeritSelectionDashboard: React.FC = () => {
    const [meritRecords, setMeritRecords] = useState<any[]>([]);
    const [programs, setPrograms] = useState<any[]>([]);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const [stats, setStats] = useState({
        total: 0,
        selected: 0,
        waitlisted: 0,
        pending: 0
    });

    useEffect(() => {
        fetchPrograms();
    }, []);

    useEffect(() => {
        fetchMeritRecords();
    }, [selectedProgram]);

    const fetchPrograms = async () => {
        const { data } = await supabase.from('programs').select('program_code, program_name');
        if (data) setPrograms(data);
    };

    const fetchMeritRecords = async () => {
        setIsLoading(true);
        let query = supabase.from('admission_merit_records').select('*').order('merit_rank', { ascending: true });
        
        if (selectedProgram) {
            query = query.eq('program_code', selectedProgram);
        }

        const { data, error } = await query;
        if (!error && data) {
            setMeritRecords(data);
            calculateStats(data);
        }
        setIsLoading(false);
    };

    const calculateStats = (data: any[]) => {
        setStats({
            total: data.length,
            selected: data.filter(d => d.selection_status === 'Selected').length,
            waitlisted: data.filter(d => d.selection_status === 'Waitlisted').length,
            pending: data.filter(d => d.selection_status === 'Pending').length,
        });
    };

    const handleGenerateMeritList = async () => {
        if (!selectedProgram) {
            alert('Please select a program first to generate its merit list.');
            return;
        }

        setIsGenerating(true);
        
        try {
            // Mocking the generation logic
            // 1. Fetch students for this program who don't have a merit record yet (mocked)
            const { data: students } = await supabase.from('students')
                .select('first_name, last_name, admission_number, department_code, program_code')
                .eq('program_code', selectedProgram);
            
            if (students && students.length > 0) {
                const newRecords = students.map((s, index) => {
                    const entranceScore = (Math.random() * 40 + 60).toFixed(2); // 60-100
                    const academicScore = (Math.random() * 30 + 70).toFixed(2); // 70-100
                    const totalMeritScore = ((parseFloat(entranceScore) * 0.6) + (parseFloat(academicScore) * 0.4)).toFixed(2);
                    
                    return {
                        admission_number: s.admission_number,
                        student_name: `${s.first_name} ${s.last_name}`.trim(),
                        program_code: s.program_code,
                        department_code: s.department_code,
                        category: ['General', 'OBC', 'SC', 'ST'][Math.floor(Math.random() * 4)],
                        entrance_score: parseFloat(entranceScore),
                        academic_score: parseFloat(academicScore),
                        total_merit_score: parseFloat(totalMeritScore),
                        selection_status: 'Pending'
                    };
                });

                // Sort by total_merit_score desc to assign rank
                newRecords.sort((a, b) => b.total_merit_score - a.total_merit_score);
                
                const rankedRecords = newRecords.map((r, i) => ({
                    ...r,
                    merit_rank: i + 1,
                    selection_status: i < 50 ? 'Selected' : (i < 100 ? 'Waitlisted' : 'Rejected')
                }));

                // Upsert to admission_merit_records
                const { error } = await supabase
                    .from('admission_merit_records')
                    .upsert(rankedRecords, { onConflict: 'admission_number' });

                if (error) throw error;
                alert('Merit list generated successfully!');
                fetchMeritRecords();
            } else {
                alert('No students found for this program.');
            }
        } catch (error: any) {
            console.error('Error generating merit list:', error);
            alert(`Error generating merit list: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        const { error } = await supabase.from('admission_merit_records').update({ selection_status: status }).eq('id', id);
        if (!error) {
            fetchMeritRecords();
        }
    };

    const filteredRecords = meritRecords.filter(r => 
        r.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.admission_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Award className="text-blue-600" />
                        Merit &amp; Selection Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage merit lists, selection rounds, and admissions.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button onClick={fetchMeritRecords} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
                        <RefreshCw size={18} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <FileSpreadsheet size={18} />
                        Export
                    </button>
                    <button 
                        onClick={handleGenerateMeritList}
                        disabled={isGenerating || !selectedProgram}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                            isGenerating || !selectedProgram ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Award size={18} />}
                        {isGenerating ? 'Generating...' : 'Generate Merit List'}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Candidates</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Filter size={20} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Selected</p>
                        <h3 className="text-2xl font-bold text-green-600">{stats.selected}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <CheckCircle size={20} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Waitlisted</p>
                        <h3 className="text-2xl font-bold text-yellow-600">{stats.waitlisted}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                        <Clock size={20} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Pending/Rejected</p>
                        <h3 className="text-2xl font-bold text-red-600">{stats.total - stats.selected - stats.waitlisted}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                        <XCircle size={20} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex gap-4 w-full md:w-auto">
                    <select 
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
                    >
                        <option value="">All Programs</option>
                        {programs.map(p => (
                            <option key={p.program_code} value={p.program_code}>{p.program_name} ({p.program_code})</option>
                        ))}
                    </select>
                </div>
                <div className="relative w-full md:w-64">
                    <input 
                        type="text" 
                        placeholder="Search candidate..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-4">Rank</th>
                                <th className="py-3 px-4">Candidate Details</th>
                                <th className="py-3 px-4">Category</th>
                                <th className="py-3 px-4">Scores (Ent. / Acad.)</th>
                                <th className="py-3 px-4">Total Score</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan={7} className="py-8 text-center text-gray-500">Loading records...</td></tr>
                            ) : filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500">
                                        No merit records found. {selectedProgram ? "Click 'Generate Merit List' to create one." : "Select a program."}
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                                                #{record.merit_rank || '-'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-medium text-gray-900">{record.student_name}</div>
                                            <div className="text-xs text-gray-500">{record.admission_number}</div>
                                        </td>
                                        <td className="py-3 px-4">{record.category}</td>
                                        <td className="py-3 px-4">
                                            <div className="text-xs">Ent: {record.entrance_score}</div>
                                            <div className="text-xs">Acad: {record.academic_score}</div>
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-gray-900">
                                            {record.total_merit_score}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                record.selection_status === 'Selected' ? 'bg-green-100 text-green-700' :
                                                record.selection_status === 'Waitlisted' ? 'bg-yellow-100 text-yellow-700' :
                                                record.selection_status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {record.selection_status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <select 
                                                value={record.selection_status}
                                                onChange={(e) => handleUpdateStatus(record.id, e.target.value)}
                                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Selected">Select</option>
                                                <option value="Waitlisted">Waitlist</option>
                                                <option value="Rejected">Reject</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination (Visual) */}
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                    <p className="text-sm text-gray-600">Showing <span className="font-medium">{filteredRecords.length > 0 ? 1 : 0}</span> to <span className="font-medium">{filteredRecords.length}</span> of <span className="font-medium">{filteredRecords.length}</span> results</p>
                    <div className="flex gap-1">
                        <button className="p-1.5 border border-gray-300 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50" disabled><ChevronLeft size={16} /></button>
                        <button className="p-1.5 border border-gray-300 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-50" disabled><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};
