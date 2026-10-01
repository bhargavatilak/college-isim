import React, { useState, useEffect } from 'react';
import { 
  Search, User, Filter, MoreVertical, Edit, Eye, Trash2, 
  ChevronRight, Check, X, RefreshCw, Download, Globe, Layers 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  admission_number: string;
  department_code: string;
  program_code: string;
  current_year?: string;
  current_semester?: string;
  section?: string;
  status: string;
}

export const Directory: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Metadata States
  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [sectionsList, setSectionsList] = useState<any[]>([]);

  const fetchMetadataAndStudents = async () => {
    try {
      setLoading(true);

      const { data: depts } = await supabase.from('departments').select('*');
      if (depts) setDepartments(depts);

      const { data: progs } = await supabase.from('programs').select('*');
      if (progs) setPrograms(progs);

      const { data: secs } = await supabase.from('sections').select('*');
      if (secs) setSectionsList(secs);

      const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      const mapped = (data || []).map((s: any) => ({
        ...s,
        current_year: s.current_year || '1st Year',
        current_semester: s.current_semester || '1st Semester',
        section: s.section || 'Unassigned',
      }));
      setStudents(mapped);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadataAndStudents();
  }, []);

  const availablePrograms = selectedDept
    ? programs.filter(p => p.department_code === selectedDept)
    : programs;

  const hasActiveFilters = searchTerm !== '' || selectedDept !== '' || selectedCourse !== '' || selectedYear !== '' || selectedSection !== '' || selectedStatus !== '';

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
    const admNo = (student.admission_number || '').toLowerCase();
    const email = (student.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchSearch = !searchTerm || fullName.includes(term) || admNo.includes(term) || email.includes(term);
    const matchDept = !selectedDept || student.department_code === selectedDept;
    const matchCourse = !selectedCourse || student.program_code === selectedCourse;
    const studentYear = student.current_year || '1st Year';
    const matchYear = !selectedYear || (studentYear === selectedYear);
    const matchSection = !selectedSection 
      ? true 
      : selectedSection === 'Unassigned'
      ? (!student.section || student.section === 'Unassigned' || student.section === '')
      : student.section === selectedSection;
    const matchStatus = !selectedStatus || student.status === selectedStatus;

    return matchSearch && matchDept && matchCourse && matchYear && matchSection && matchStatus;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDept('');
    setSelectedCourse('');
    setSelectedYear('');
    setSelectedSection('');
    setSelectedStatus('');
  };

  const toggleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const toggleSelectStudent = (id: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudents(newSelected);
  };

  const exportCSV = () => {
    const headers = ['Admission No', 'First Name', 'Last Name', 'Email', 'Department', 'Program', 'Year', 'Section', 'Status'];
    const rows = filteredStudents.map(s => [
      s.admission_number || '',
      s.first_name || '',
      s.last_name || '',
      s.email || '',
      s.department_code || '',
      s.program_code || '',
      s.current_year || '1st Year',
      s.section || 'Unassigned',
      s.status || 'Active'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage, filter, and view all registered student profiles</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchMetadataAndStudents}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm text-gray-700 font-medium transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
          >
            <Download size={16} />
            Export Directory
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedStudents.size > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex justify-between items-center animate-in slide-in-from-top-2 fade-in">
          <div className="flex items-center gap-4">
            <span className="text-indigo-700 font-medium bg-white px-3 py-1 rounded-full shadow-sm text-sm border border-indigo-100">
              {selectedStudents.size} selected
            </span>
            <div className="h-6 w-px bg-indigo-200"></div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/registrar/status-movement/promotion')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors"
              >
                Bulk Promote
              </button>
              <button 
                onClick={exportCSV}
                className="px-4 py-2 bg-white text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50 text-sm font-medium shadow-sm transition-colors"
              >
                Export Selected
              </button>
            </div>
          </div>
          <button onClick={() => setSelectedStudents(new Set())} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            Clear Selection
          </button>
        </div>
      )}

      {/* Cascading Filter Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
            <Filter size={18} className="text-indigo-600" />
            <span>Search & Filter Directory</span>
            {hasActiveFilters && (
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Filtered: {filteredStudents.length} of {students.length}
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
            >
              <X size={14} /> Clear Filters
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">1. Department</label>
            <select
              value={selectedDept}
              onChange={e => { setSelectedDept(e.target.value); setSelectedCourse(''); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.code} value={d.code}>{d.code} ({d.name})</option>
              ))}
            </select>
          </div>

          {/* Program / Course */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">2. Course / Program</label>
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Courses</option>
              {availablePrograms.map(p => (
                <option key={p.program_code} value={p.program_code}>{p.program_code} - {p.program_name}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">3. Year</label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">4. Section (Optional)</label>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All / Unassigned (Default)</option>
              <option value="Unassigned">Not Assigned Only</option>
              {sectionsList.length > 0 ? (
                sectionsList.map(sec => (
                  <option key={sec.id || sec.name} value={sec.name}>Section {sec.name}</option>
                ))
              ) : (
                <option value="" disabled>No Sections Created Yet</option>
              )}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">5. Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative pt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by student name, admission number, email, or course..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    checked={filteredStudents.length > 0 && selectedStudents.size === filteredStudents.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4">Student</th>
                <th className="p-4">Admission No</th>
                <th className="p-4">Department</th>
                <th className="p-4">Program / Course</th>
                <th className="p-4">Year</th>
                <th className="p-4">Section</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading student directory...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-gray-500">
                    <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-semibold text-gray-800 text-base">No students match the selected filter criteria</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your Department, Course, Year, or Search term.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className={`hover:bg-gray-50/80 transition-colors ${selectedStudents.has(student.id) ? 'bg-indigo-50/40' : ''}`}>
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        checked={selectedStudents.has(student.id)}
                        onChange={() => toggleSelectStudent(student.id)}
                      />
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                          {(student.first_name?.[0] || 'S').toUpperCase()}
                        </div>
                        <div>
                          <button 
                            onClick={() => navigate(`/registrar/students/profile/${student.id}`)} 
                            className="font-bold text-indigo-600 hover:text-indigo-900 text-left block"
                          >
                            {student.first_name} {student.last_name}
                          </button>
                          <span className="text-xs text-gray-400 block">{student.email || 'No email registered'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap font-mono text-xs text-gray-700 font-semibold">{student.admission_number || '-'}</td>
                    <td className="p-4 whitespace-nowrap text-xs font-semibold text-gray-700">{student.department_code || '-'}</td>
                    <td className="p-4 whitespace-nowrap text-xs font-medium text-indigo-700">{student.program_code || '-'}</td>
                    <td className="p-4 whitespace-nowrap text-xs text-gray-600">{student.current_year || '1st Year'}</td>
                    <td className="p-4 whitespace-nowrap text-xs text-gray-600">{student.section || 'Unassigned'}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {student.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/registrar/students/profile/${student.id}`)} 
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                          title="View Full Profile"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/registrar/students/web-manage/${student.id}`)} 
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                          title="Web Manage Portal"
                        >
                          <Globe className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
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
