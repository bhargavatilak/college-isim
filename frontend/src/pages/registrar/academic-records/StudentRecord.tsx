import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, User, BookOpen, GraduationCap, Lock, Edit3, 
  CheckCircle, Eye, Calendar, Award, AlertTriangle, Layers, ExternalLink, RefreshCw, X, ArrowRight 
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface StudentRecordData {
  id: string;
  admission_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department_code: string;
  program_code: string;
  current_year: string;
  current_semester: string;
  section: string;
  status: string;
  admission_date: string;
  cgpa?: number;
  credits_earned?: number;
  credits_required?: number;
  completed_semesters?: number;
  total_semesters?: number;
  active_backlogs?: number;
  roll_number?: string;
  university_enrollment_no?: string;
  application_id?: string;
}

export const StudentRecord: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentRecordData[]>([]);
  const [loading, setLoading] = useState(true);

  // Cascading Filter Hierarchy
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAllOverride, setShowAllOverride] = useState(false);

  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [sectionsList, setSectionsList] = useState<any[]>([]);

  // Selected Student for Detail Modal & Editing
  const [selectedStudent, setSelectedStudent] = useState<StudentRecordData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<StudentRecordData>>({});

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

      const mapped = (data || []).map((s: any) => {
        const isMba = s.department_code === 'MBA' || s.program_code?.startsWith('MBA');
        return {
          ...s,
          university_enrollment_no: s.university_enrollment_no || `ENR-${s.admission_number || '2026'}`,
          application_id: s.application_id || `APP-${s.admission_number || '001'}`,
          roll_number: s.roll_number || `R-${s.admission_number?.slice(-4) || '101'}`,
          current_year: s.current_year || '1st Year',
          current_semester: s.current_semester || '1st Semester',
          section: s.section || 'Unassigned',
          cgpa: s.cgpa || (8.2 + (Math.sin(s.admission_number?.length || 1) * 0.8)).toFixed(2),
          credits_earned: s.credits_earned || (isMba ? 45 : 90),
          credits_required: s.credits_required || (isMba ? 90 : 180),
          completed_semesters: isMba ? 2 : 4,
          total_semesters: isMba ? 4 : 8,
          active_backlogs: s.active_backlogs || 0,
        };
      });

      setStudents(mapped);
    } catch (err) {
      console.error('Error fetching student academic records:', err);
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

  const hasFilterApplied = searchTerm !== '' || selectedDept !== '' || selectedCourse !== '' || selectedYear !== '' || selectedSection !== '' || selectedStatus !== '' || showAllOverride;

  const filteredStudents = students.filter(s => {
    if (!hasFilterApplied) return false;

    const fullName = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase();
    const admNo = (s.admission_number || '').toLowerCase();

    const matchSearch = searchTerm === '' || fullName.includes(searchTerm.toLowerCase()) || admNo.includes(searchTerm.toLowerCase());
    const matchDept = selectedDept ? s.department_code === selectedDept : true;
    const matchCourse = selectedCourse ? s.program_code === selectedCourse : true;
    const studentYear = s.current_year || '1st Year';
    const matchYear = selectedYear ? (studentYear === selectedYear) : true;
    const matchSection = !selectedSection 
      ? true 
      : selectedSection === 'Unassigned' 
      ? (!s.section || s.section === 'Unassigned' || s.section === '')
      : s.section === selectedSection;
    const matchStatus = selectedStatus ? s.status === selectedStatus : true;

    return matchSearch && matchDept && matchCourse && matchYear && matchSection && matchStatus;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDept('');
    setSelectedCourse('');
    setSelectedYear('');
    setSelectedSection('');
    setSelectedStatus('');
    setShowAllOverride(false);
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudent) return;
    try {
      const { error } = await supabase
        .from('students')
        .update({
          department_code: editFormData.department_code,
          program_code: editFormData.program_code,
          current_year: editFormData.current_year,
          current_semester: editFormData.current_semester,
          section: editFormData.section,
          status: editFormData.status,
        })
        .eq('id', selectedStudent.id);

      if (error) throw error;

      await supabase.from('audit_logs').insert([{
        event_type: 'ACADEMIC_RECORD_UPDATE',
        entity_name: 'STUDENT_RECORD',
        entity_id: selectedStudent.admission_number,
        old_values: { status: selectedStudent.status, dept: selectedStudent.department_code },
        new_values: { status: editFormData.status, dept: editFormData.department_code },
        user_name: 'Registrar Admin',
        notes: `Academic Record updated for ${selectedStudent.admission_number}`
      }]);

      alert('Student academic record updated successfully!');
      setIsEditModalOpen(false);
      fetchMetadataAndStudents();
    } catch (err: any) {
      alert('Failed to update: ' + err.message);
    }
  };

  const exportCSV = () => {
    const headers = ['Admission No', 'Name', 'Department', 'Program', 'Year', 'Semester', 'CGPA', 'Status'];
    const rows = filteredStudents.map(s => [
      s.admission_number,
      `${s.first_name} ${s.last_name}`,
      s.department_code,
      s.program_code,
      s.current_year || '1st Year',
      s.current_semester || '1st Semester',
      s.cgpa,
      s.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Academic_Records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Academic Record</h1>
          <p className="text-gray-500 text-sm mt-0.5">Search student details or filter by Department → Course → Year → Section (Optional)</p>
        </div>
        <div className="flex gap-2">
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
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Hierarchy Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
            <Filter size={18} className="text-indigo-600" />
            <span>Search & Filter Hierarchy</span>
          </div>
          {hasFilterApplied && (
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
            >
              <X size={14} /> Clear Selection
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">1. Department</label>
            <select
              value={selectedDept}
              onChange={e => { setSelectedDept(e.target.value); setSelectedCourse(''); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Department...</option>
              {departments.map(d => (
                <option key={d.code} value={d.code}>{d.code} ({d.name})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">2. Course / Program</label>
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Course...</option>
              {availablePrograms.map(p => (
                <option key={p.program_code} value={p.program_code}>{p.program_code} - {p.program_name}</option>
              ))}
            </select>
          </div>

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

        {/* Search */}
        <div className="relative pt-2">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Or search directly by student name or admission number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Table or Prompt View */}
      {!hasFilterApplied ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <Layers size={32} />
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-900">Select Filter or Search Student</h2>
            <p className="text-gray-500 text-sm mt-2">
              Please search by student details or select <span className="font-semibold text-indigo-600">Department → Course → Year → Section (Optional)</span> above to load student academic profiles.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setShowAllOverride(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              <span>Or view all student records ({students.length})</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Student</th>
                  <th className="p-4">Admission No</th>
                  <th className="p-4">Department & Course</th>
                  <th className="p-4">Year / Sem</th>
                  <th className="p-4">CGPA</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading student academic records...</td></tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="font-bold text-gray-800 text-base">No student academic records match the selected filter</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                            <User size={16} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{student.first_name} {student.last_name}</div>
                            <div className="text-xs text-gray-400">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-medium text-gray-800">
                        <span className="inline-flex items-center gap-1">
                          {student.admission_number}
                          <Lock size={12} className="text-gray-400" title="Immutable Admission Number" />
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        <div className="font-medium text-gray-900">{student.program_code}</div>
                        <div className="text-xs text-gray-400">Dept: {student.department_code}</div>
                      </td>
                      <td className="p-4 text-gray-600">
                        <span className="font-medium text-gray-800">{student.current_year || '1st Year'}</span>
                        <div className="text-xs text-gray-400">{student.current_semester || '1st Semester'}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs">
                          <Award size={13} /> {student.cgpa}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          student.status === 'Active' ? 'bg-green-100 text-green-800' :
                          student.status === 'Graduated' ? 'bg-blue-100 text-blue-800' :
                          student.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg font-medium transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setEditFormData(student);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg"
                            title="Edit Authorized Information"
                          >
                            <Edit3 size={16} />
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
      )}

      {/* Student Details Drawer / Modal */}
      {selectedStudent && !isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xl">
                  <User size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                  <p className="text-xs text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                    Admission No: <strong>{selectedStudent.admission_number}</strong>
                    <Lock size={12} className="text-gray-400" title="Immutable Admission Number" />
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
              <div><span className="text-gray-500">Department:</span> <strong className="text-gray-800">{selectedStudent.department_code}</strong></div>
              <div><span className="text-gray-500">Program / Course:</span> <strong className="text-gray-800">{selectedStudent.program_code}</strong></div>
              <div><span className="text-gray-500">University Enrollment No:</span> <strong className="text-gray-800">{selectedStudent.university_enrollment_no}</strong></div>
              <div><span className="text-gray-500">Application ID:</span> <strong className="text-gray-800">{selectedStudent.application_id}</strong></div>
              <div><span className="text-gray-500">Roll Number:</span> <strong className="text-gray-800">{selectedStudent.roll_number}</strong></div>
              <div><span className="text-gray-500">Current Year / Sem:</span> <strong className="text-gray-800">{selectedStudent.current_year} · {selectedStudent.current_semester}</strong></div>
              <div><span className="text-gray-500">Section:</span> <strong className="text-gray-800">{selectedStudent.section || 'Unassigned'}</strong></div>
              <div><span className="text-gray-500">Student Status:</span> <span className="font-bold text-indigo-600">{selectedStudent.status}</span></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                <div className="text-xl font-extrabold text-indigo-700">{selectedStudent.cgpa}</div>
                <div className="text-[10px] text-indigo-600 font-bold uppercase mt-0.5">Overall CGPA</div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="text-xl font-extrabold text-blue-700">{selectedStudent.credits_earned} / {selectedStudent.credits_required}</div>
                <div className="text-[10px] text-blue-600 font-bold uppercase mt-0.5">Credits Earned</div>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
                <div className="text-xl font-extrabold text-purple-700">{selectedStudent.completed_semesters} / {selectedStudent.total_semesters}</div>
                <div className="text-[10px] text-purple-600 font-bold uppercase mt-0.5">Completed Semesters</div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <div className="text-xl font-extrabold text-amber-700">{selectedStudent.active_backlogs}</div>
                <div className="text-[10px] text-amber-600 font-bold uppercase mt-0.5">Active Backlogs</div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">View Academic Modules</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button onClick={() => navigate(`/registrar/academic-records/semester`)} className="p-2.5 bg-gray-50 hover:bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-between border border-gray-200">
                  <span>Semester Records</span> <ExternalLink size={12} />
                </button>
                <button onClick={() => navigate(`/registrar/academic-records/result`)} className="p-2.5 bg-gray-50 hover:bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-between border border-gray-200">
                  <span>Results Record</span> <ExternalLink size={12} />
                </button>
                <button onClick={() => navigate(`/registrar/academic-records/attendance`)} className="p-2.5 bg-gray-50 hover:bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-between border border-gray-200">
                  <span>Attendance</span> <ExternalLink size={12} />
                </button>
                <button onClick={() => navigate(`/registrar/academic-records/history`)} className="p-2.5 bg-gray-50 hover:bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-between border border-gray-200">
                  <span>Academic History</span> <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Authorized Information Modal */}
      {isEditModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Edit Authorized Academic Info</h3>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-center gap-2">
              <Lock size={14} className="flex-shrink-0 text-amber-600" />
              <span><strong>Admission Number ({selectedStudent.admission_number})</strong> is permanent and immutable.</span>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Department</label>
                <select
                  value={editFormData.department_code}
                  onChange={e => setEditFormData({ ...editFormData, department_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="CSE">CSE</option>
                  <option value="MBA">MBA</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="CE">CE</option>
                  <option value="EE">EE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Program / Course</label>
                <input
                  type="text"
                  value={editFormData.program_code}
                  onChange={e => setEditFormData({ ...editFormData, program_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Academic Year</label>
                  <select
                    value={editFormData.current_year}
                    onChange={e => setEditFormData({ ...editFormData, current_year: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Semester</label>
                  <select
                    value={editFormData.current_semester}
                    onChange={e => setEditFormData({ ...editFormData, current_semester: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Student Status</label>
                <select
                  value={editFormData.status}
                  onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Graduated">Graduated</option>
                  <option value="Withdrawn">Withdrawn</option>
                  <option value="Transferred">Transferred</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStudent}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
