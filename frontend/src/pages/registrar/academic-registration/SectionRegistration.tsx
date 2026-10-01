import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Filter, Edit3, UserPlus, UserMinus, 
  CheckCircle, Download, RefreshCw, X, ShieldAlert, Layers, Eye 
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface SectionItem {
  id: string;
  name: string;
  section_code?: string;
  department_code: string;
  program_code: string;
  semester: string;
  academic_year: string;
  batch: string;
  student_count: number;
  capacity: number;
  class_advisor: string;
  status: 'Active' | 'Inactive';
  assigned_student_ids: string[];
}

export const SectionRegistration = () => {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [facultyList, setFacultyList] = useState<any[]>([]);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSectionData, setNewSectionData] = useState({
    name: 'A',
    department_code: '',
    program_code: '',
    semester: 'Semester 1',
    academic_year: '2026–27',
    batch: '2026-2030',
    capacity: 60,
    class_advisor: '',
  });

  const [assignModalSection, setAssignModalSection] = useState<SectionItem | null>(null);
  const [selectedStudentToAssign, setSelectedStudentToAssign] = useState('');

  const fetchSectionsAndStudents = async () => {
    try {
      setLoading(true);

      const { data: depts } = await supabase.from('departments').select('*');
      if (depts) setDepartments(depts);

      const { data: progs } = await supabase.from('programs').select('*');
      if (progs) setPrograms(progs);

      const { data: facs } = await supabase.from('faculty').select('*');
      if (facs) setFacultyList(facs);

      const { data: stds } = await supabase.from('students').select('*');
      if (stds) setAllStudents(stds || []);

      const { data, error } = await supabase.from('sections').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      if (data) {
        const mapped: SectionItem[] = data.map((sec: any, idx: number) => ({
          id: sec.id,
          name: sec.name || (sec.section_code ? sec.section_code.split('-').pop() : String.fromCharCode(65 + (idx % 26))),
          section_code: sec.section_code,
          department_code: sec.department_code || sec.department?.code || 'CSE',
          program_code: sec.program_code || sec.program?.code || 'BTECH-CSE',
          semester: sec.semester ? (String(sec.semester).startsWith('Semester') ? sec.semester : `Semester ${sec.semester}`) : 'Semester 1',
          academic_year: sec.academic_year || '2026–27',
          batch: sec.batch || '2026-2030',
          student_count: sec.student_count || sec.filled || 0,
          capacity: sec.capacity || 60,
          class_advisor: sec.class_advisor || sec.coordinator || 'Unassigned',
          status: sec.status === 'Inactive' ? 'Inactive' : 'Active',
          assigned_student_ids: [],
        }));
        setSections(mapped);
      } else {
        setSections([]);
      }
    } catch (err) {
      console.error('Error fetching sections:', err);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionsAndStudents();
  }, []);

  const availablePrograms = selectedDept
    ? programs.filter(p => p.department_code === selectedDept)
    : programs;

  const filteredSections = sections.filter(sec => {
    const term = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || (sec.name || '').toLowerCase().includes(term) || (sec.class_advisor || '').toLowerCase().includes(term);
    const matchDept = !selectedDept || sec.department_code === selectedDept;
    const matchProgram = !selectedProgram || sec.program_code === selectedProgram;
    const matchSemester = !selectedSemester || sec.semester === selectedSemester;

    return matchSearch && matchDept && matchProgram && matchSemester;
  });

  const handleCreateSection = async () => {
    try {
      const dept = newSectionData.department_code || (departments[0]?.code || 'CSE');
      const prog = newSectionData.program_code || (programs[0]?.program_code || 'BTECH-CSE');
      const secName = newSectionData.name || 'A';
      const generatedSectionCode = `${prog}-${secName}`;

      const fullPayload: any = {
        section_code: generatedSectionCode,
        name: secName,
        department_code: dept,
        program_code: prog,
        semester: newSectionData.semester?.replace('Semester ', ''),
        academic_year: newSectionData.academic_year,
        batch: newSectionData.batch,
        capacity: newSectionData.capacity || 60,
        class_advisor: newSectionData.class_advisor || 'Unassigned',
        status: 'Active',
      };

      let { error } = await supabase.from('sections').insert([fullPayload]);

      // If full insert fails because some schema columns are missing in Supabase, fallback to base existing columns including NOT NULL section_code
      if (error && (error.message?.includes('does not exist') || error.message?.includes('Could not find'))) {
        const basicPayload = {
          section_code: generatedSectionCode,
          department_code: dept,
          program_code: prog,
          capacity: fullPayload.capacity,
        };
        const res = await supabase.from('sections').insert([basicPayload]);
        error = res.error;
      }

      if (error) throw error;

      alert('Section created successfully!');
      setIsCreateModalOpen(false);
      fetchSectionsAndStudents();
    } catch (err: any) {
      alert('Error creating section: ' + err.message);
    }
  };

  const handleAssignStudent = () => {
    if (!assignModalSection || !selectedStudentToAssign) {
      alert('Please select a student to assign!');
      return;
    }

    const studentObj = allStudents.find(s => s.id === selectedStudentToAssign);
    const studentName = studentObj ? `${studentObj.first_name} ${studentObj.last_name}` : selectedStudentToAssign;

    // RULE: Check if student is already assigned to another active section in the same program & semester
    const isAlreadyAssigned = sections.some(sec => 
      sec.id !== assignModalSection.id &&
      sec.program_code === assignModalSection.program_code &&
      sec.semester === assignModalSection.semester &&
      sec.assigned_student_ids.includes(selectedStudentToAssign)
    );

    if (isAlreadyAssigned) {
      alert(`STRICT SECTION ASSIGNMENT RULE: ${studentName} is already assigned to another active section for ${assignModalSection.program_code} (${assignModalSection.semester}). A student cannot be in two active sections simultaneously!`);
      return;
    }

    setSections(prev => prev.map(sec => {
      if (sec.id === assignModalSection.id) {
        return {
          ...sec,
          student_count: sec.student_count + 1,
          assigned_student_ids: [...sec.assigned_student_ids, selectedStudentToAssign],
        };
      }
      return sec;
    }));

    // Log event in audit logs
    supabase.from('audit_logs').insert([{
      event_type: 'SECTION_STUDENT_ASSIGNED',
      entity_name: 'SECTION_REGISTRATION',
      entity_id: assignModalSection.name,
      user_name: 'Registrar Admin',
      notes: `Assigned student ${studentName} to Section ${assignModalSection.name} (${assignModalSection.program_code})`
    }]).then();

    alert(`Successfully assigned ${studentName} to Section ${assignModalSection.name}!`);
    setAssignModalSection(null);
    setSelectedStudentToAssign('');
  };

  const exportCSV = () => {
    const headers = ['Section Code', 'Section', 'Department', 'Program', 'Semester', 'Academic Year', 'Students', 'Capacity', 'Class Advisor', 'Status'];
    const rows = filteredSections.map(s => [
      s.section_code || `SEC-${s.name}`,
      `Section ${s.name}`,
      s.department_code,
      s.program_code,
      s.semester,
      s.academic_year,
      s.student_count,
      s.capacity,
      s.class_advisor,
      s.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Academic_Sections_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Section & Class Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage class sections, capacity limits, student allocation, and assigned Class Advisors</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setNewSectionData({
                name: 'A',
                department_code: departments[0]?.code || '',
                program_code: programs[0]?.program_code || '',
                semester: 'Semester 1',
                academic_year: '2026–27',
                batch: '2026-2030',
                capacity: 60,
                class_advisor: facultyList[0]?.name || '',
              });
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={16} /> Create Section
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-gray-700 font-medium transition-colors"
          >
            <Download size={16} /> Export Sections
          </button>
        </div>
      </div>

      {/* Strict Rule Info Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-xs text-amber-900">
        <ShieldAlert size={20} className="text-amber-600 flex-shrink-0" />
        <div>
          <strong>Strict Section Policy:</strong> A student cannot be assigned to two active sections simultaneously for the same program and semester. Any section transfer generates an audit log entry.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
            <Filter size={18} className="text-indigo-600" />
            <span>Filter Active Sections</span>
          </div>
          {(selectedDept || selectedProgram || selectedSemester || searchTerm) && (
            <button
              onClick={() => { setSelectedDept(''); setSelectedProgram(''); setSelectedSemester(''); setSearchTerm(''); }}
              className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
            >
              <X size={14} /> Clear Selection
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={e => { setSelectedDept(e.target.value); setSelectedProgram(''); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.code} value={d.code}>{d.code} ({d.name})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Program</label>
            <select
              value={selectedProgram}
              onChange={e => setSelectedProgram(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Programs</option>
              {availablePrograms.map(p => (
                <option key={p.program_code} value={p.program_code}>{p.program_code}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Semester</label>
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Semesters</option>
              {Array.from({ length: 8 }).map((_, i) => (
                <option key={i} value={`Semester ${i + 1}`}>Semester {i + 1}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Search Section / Advisor</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Section name or Advisor..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sections Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-gray-400">Loading section management data...</div>
        ) : filteredSections.length === 0 ? (
          <div className="col-span-3 bg-white rounded-2xl p-12 text-center text-gray-500 border border-gray-200">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-800 text-base">No sections found in database.</p>
            <p className="text-xs text-gray-400 mt-1">Click "+ Create Section" to add a new section record.</p>
          </div>
        ) : (
          filteredSections.map(sec => (
            <div key={sec.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-indigo-900">Section {sec.name}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full">{sec.program_code}</span>
                  </div>
                  <span className="text-xs text-gray-500 block mt-0.5">{sec.department_code} • {sec.semester} ({sec.academic_year})</span>
                </div>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${sec.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {sec.status}
                </span>
              </div>

              {/* Progress bar for capacity */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-600">Assigned Students:</span>
                  <span className="text-gray-900 font-bold">{sec.student_count} / {sec.capacity}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${
                      (sec.student_count / sec.capacity) >= 0.9 ? 'bg-amber-500' : 'bg-indigo-600'
                    }`} 
                    style={{ width: `${Math.min(100, (sec.student_count / sec.capacity) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 text-xs space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>Class Advisor:</span>
                  <span className="font-semibold text-gray-800">{sec.class_advisor || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Batch Cohort:</span>
                  <span className="font-semibold text-gray-800">{sec.batch}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => { setAssignModalSection(sec); setSelectedStudentToAssign(''); }}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserPlus size={14} /> Assign Student
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Section Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-lg">Create New Class Section</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Section Name / Code</label>
                  <input
                    type="text"
                    placeholder="e.g. A, B, C"
                    value={newSectionData.name}
                    onChange={e => setNewSectionData({ ...newSectionData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={newSectionData.capacity}
                    onChange={e => setNewSectionData({ ...newSectionData, capacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Department</label>
                  <select
                    value={newSectionData.department_code}
                    onChange={e => setNewSectionData({ ...newSectionData, department_code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="">Select Department...</option>
                    {departments.map(d => (
                      <option key={d.code} value={d.code}>{d.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Program</label>
                  <select
                    value={newSectionData.program_code}
                    onChange={e => setNewSectionData({ ...newSectionData, program_code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="">Select Program...</option>
                    {programs.map(p => (
                      <option key={p.program_code} value={p.program_code}>{p.program_code}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Class Advisor (Faculty)</label>
                <select
                  value={newSectionData.class_advisor}
                  onChange={e => setNewSectionData({ ...newSectionData, class_advisor: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="">Select Faculty Advisor...</option>
                  {facultyList.map(f => (
                    <option key={f.id} value={f.name || `${f.first_name || ''} ${f.last_name || ''}`}>
                      {f.name || `${f.first_name || ''} ${f.last_name || ''}`} ({f.faculty_id || 'FAC'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSection}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Create Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Student Modal */}
      {assignModalSection && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Assign Student to Section {assignModalSection.name}</h3>
                <p className="text-xs text-gray-500">{assignModalSection.program_code} • {assignModalSection.semester}</p>
              </div>
              <button onClick={() => setAssignModalSection(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Select Student</label>
                <select
                  value={selectedStudentToAssign}
                  onChange={e => setSelectedStudentToAssign(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="">Select Eligible Student...</option>
                  {allStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.first_name} {s.last_name} ({s.admission_number || '26CS001'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setAssignModalSection(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignStudent}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
