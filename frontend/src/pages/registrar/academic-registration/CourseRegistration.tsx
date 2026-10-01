import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Search, Filter, Edit3, Trash2, CheckCircle, 
  XCircle, Download, Users, RefreshCw, X, Layers, UserCheck, ShieldCheck, Eye 
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface CourseSubject {
  id: string;
  subject_code: string;
  subject_name: string;
  department_code: string;
  program_code: string;
  semester: string;
  credits: number;
  type: 'Core' | 'Elective' | 'Open Elective' | 'Practical' | 'Laboratory' | 'Project' | 'Internship' | 'Seminar';
  faculty_name?: string;
  capacity?: number;
  registered_count?: number;
  status: 'Active' | 'Inactive';
}

export const CourseRegistration = () => {
  const [courses, setCourses] = useState<CourseSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourseProgram, setSelectedCourseProgram] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [facultyList, setFacultyList] = useState<any[]>([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCourseForView, setSelectedCourseForView] = useState<CourseSubject | null>(null);
  const [isViewStudentsModalOpen, setIsViewStudentsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<CourseSubject>>({
    subject_code: '',
    subject_name: '',
    department_code: '',
    program_code: '',
    semester: 'Semester 1',
    credits: 4,
    type: 'Core',
    faculty_name: '',
    capacity: 60,
    status: 'Active',
  });

  const fetchCoursesAndMetadata = async () => {
    try {
      setLoading(true);

      const { data: depts } = await supabase.from('departments').select('*');
      if (depts) setDepartments(depts);

      const { data: progs } = await supabase.from('programs').select('*');
      if (progs) setPrograms(progs);

      const { data: facs } = await supabase.from('faculty').select('*');
      if (facs) setFacultyList(facs);

      const { data, error } = await supabase.from('subjects').select('*').order('subject_code', { ascending: true });
      if (error) throw error;

      if (data) {
        const mapped: CourseSubject[] = data.map((s: any) => ({
          id: s.id,
          subject_code: s.subject_code || s.code || 'N/A',
          subject_name: s.subject_name || s.name || 'Untitled Subject',
          department_code: s.department_code || 'N/A',
          program_code: s.program_code || 'N/A',
          semester: s.semester ? (String(s.semester).startsWith('Semester') ? s.semester : `Semester ${s.semester}`) : 'Semester 1',
          credits: s.credits || 0,
          type: (s.type as any) || 'Core',
          faculty_name: s.faculty_name || 'Unassigned',
          capacity: s.capacity || 60,
          registered_count: s.registered_count || 0,
          status: s.status === 'Inactive' ? 'Inactive' : 'Active',
        }));
        setCourses(mapped);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndMetadata();
  }, []);

  const availablePrograms = selectedDept
    ? programs.filter(p => p.department_code === selectedDept)
    : programs;

  const filteredCourses = courses.filter(c => {
    const code = (c.subject_code || '').toLowerCase();
    const name = (c.subject_name || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchSearch = !searchTerm || code.includes(term) || name.includes(term);
    const matchDept = !selectedDept || c.department_code === selectedDept;
    const matchCourse = !selectedCourseProgram || c.program_code === selectedCourseProgram;
    const matchSem = !selectedSemester || c.semester === selectedSemester;
    const matchType = !selectedType || c.type === selectedType;

    return matchSearch && matchDept && matchCourse && matchSem && matchType;
  });

  const handleAddCourse = async () => {
    if (!formData.subject_code || !formData.subject_name) {
      alert('Please fill in Course Code and Course Name!');
      return;
    }

    try {
      const { error } = await supabase.from('subjects').insert([{
        subject_code: formData.subject_code,
        subject_name: formData.subject_name,
        department_code: formData.department_code || (departments[0]?.code || 'CSE'),
        program_code: formData.program_code || (programs[0]?.program_code || 'BTECH-CSE'),
        semester: formData.semester?.replace('Semester ', ''),
        credits: formData.credits || 4,
        type: formData.type || 'Core',
        faculty_name: formData.faculty_name || 'Unassigned',
        capacity: formData.capacity || 60,
        status: formData.status || 'Active',
      }]);

      if (error) throw error;

      alert('New subject added successfully!');
      setIsAddModalOpen(false);
      fetchCoursesAndMetadata();
    } catch (err: any) {
      alert('Error adding subject: ' + err.message);
    }
  };

  const exportCSV = () => {
    const headers = ['Code', 'Name', 'Department', 'Program', 'Semester', 'Credits', 'Type', 'Faculty', 'Capacity', 'Registered', 'Status'];
    const rows = filteredCourses.map(c => [
      c.subject_code,
      c.subject_name,
      c.department_code,
      c.program_code,
      c.semester,
      c.credits,
      c.type,
      c.faculty_name || 'Unassigned',
      c.capacity,
      c.registered_count || 0,
      c.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Academic_Subject_Offerings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Subject Registration & Offerings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage subject offerings, credit allocations, core/elective designations, and faculty assignments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFormData({
                subject_code: '',
                subject_name: '',
                department_code: departments[0]?.code || '',
                program_code: programs[0]?.program_code || '',
                semester: 'Semester 1',
                credits: 4,
                type: 'Core',
                faculty_name: facultyList[0]?.name || '',
                capacity: 60,
                status: 'Active',
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={16} /> Add Subject
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-gray-700 font-medium transition-colors"
          >
            <Download size={16} /> Export Offerings
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
            <Filter size={18} className="text-indigo-600" />
            <span>Search & Filter Offered Subjects</span>
          </div>
          {(selectedDept || selectedCourseProgram || selectedSemester || selectedType || searchTerm) && (
            <button
              onClick={() => { setSelectedDept(''); setSelectedCourseProgram(''); setSelectedSemester(''); setSelectedType(''); setSearchTerm(''); }}
              className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
            >
              <X size={14} /> Clear Selection
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={e => { setSelectedDept(e.target.value); setSelectedCourseProgram(''); }}
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
              value={selectedCourseProgram}
              onChange={e => setSelectedCourseProgram(e.target.value)}
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
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subject Type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Types</option>
              <option value="Core">Core</option>
              <option value="Elective">Elective</option>
              <option value="Open Elective">Open Elective</option>
              <option value="Practical">Practical</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Project">Project</option>
              <option value="Internship">Internship</option>
              <option value="Seminar">Seminar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Search Subject</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Code or Name..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Master Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
            Offered Subject Roster ({filteredCourses.length})
          </h3>
          <span className="text-xs text-gray-500">Active subjects & credit assignments</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4">Subject Code & Name</th>
              <th className="p-4">Dept / Program</th>
              <th className="p-4">Semester</th>
              <th className="p-4">Credits</th>
              <th className="p-4">Type</th>
              <th className="p-4">Assigned Faculty</th>
              <th className="p-4">Capacity / Enrolled</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {loading ? (
              <tr><td colSpan={9} className="p-8 text-center text-gray-500">Loading offered subjects...</td></tr>
            ) : filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-12 text-center text-gray-500">
                  <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-medium">No offered subjects found in database.</p>
                  <p className="text-xs text-gray-400 mt-1">Click "+ Add Subject" to create a new subject record.</p>
                </td>
              </tr>
            ) : (
              filteredCourses.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-indigo-600 block">{c.subject_code}</span>
                    <span className="font-semibold text-gray-900 text-xs">{c.subject_name}</span>
                  </td>
                  <td className="p-4 text-xs">
                    <span className="font-semibold text-gray-800">{c.department_code}</span>
                    <span className="text-gray-400 block">{c.program_code}</span>
                  </td>
                  <td className="p-4 text-xs text-gray-600">{c.semester}</td>
                  <td className="p-4 text-xs font-bold text-gray-900">{c.credits} Credits</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                      c.type === 'Core' ? 'bg-indigo-100 text-indigo-700' :
                      c.type === 'Elective' ? 'bg-purple-100 text-purple-700' :
                      c.type === 'Laboratory' || c.type === 'Practical' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-700 font-medium">{c.faculty_name || 'Unassigned'}</td>
                  <td className="p-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{c.registered_count || 0} / {c.capacity || 60}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full" 
                          style={{ width: `${Math.min(100, ((c.registered_count || 0) / (c.capacity || 60)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => { setSelectedCourseForView(c); setIsViewStudentsModalOpen(true); }}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Registered Students"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-lg">Add New Subject Offering</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subject Code</label>
                <input
                  type="text"
                  placeholder="e.g. CS301"
                  value={formData.subject_code}
                  onChange={e => setFormData({ ...formData, subject_code: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Credits</label>
                <input
                  type="number"
                  value={formData.credits}
                  onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures & Algorithms"
                  value={formData.subject_name}
                  onChange={e => setFormData({ ...formData, subject_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Department</label>
                <select
                  value={formData.department_code}
                  onChange={e => setFormData({ ...formData, department_code: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="">Select Department...</option>
                  {departments.map(d => (
                    <option key={d.code} value={d.code}>{d.code} ({d.name})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Program</label>
                <select
                  value={formData.program_code}
                  onChange={e => setFormData({ ...formData, program_code: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="">Select Program...</option>
                  {programs.map(p => (
                    <option key={p.program_code} value={p.program_code}>{p.program_code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Semester</label>
                <select
                  value={formData.semester}
                  onChange={e => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <option key={i} value={`Semester ${i + 1}`}>Semester {i + 1}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subject Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Core">Core</option>
                  <option value="Elective">Elective</option>
                  <option value="Open Elective">Open Elective</option>
                  <option value="Practical">Practical</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Project">Project</option>
                  <option value="Internship">Internship</option>
                  <option value="Seminar">Seminar</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Assigned Faculty</label>
                <select
                  value={formData.faculty_name}
                  onChange={e => setFormData({ ...formData, faculty_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="">Select Faculty (Optional)...</option>
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
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Create Subject Offering
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Registered Students Modal */}
      {isViewStudentsModalOpen && selectedCourseForView && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{selectedCourseForView.subject_code}: {selectedCourseForView.subject_name}</h3>
                <p className="text-xs text-gray-500">Enrolled roster: {selectedCourseForView.registered_count || 0} / {selectedCourseForView.capacity} Capacity</p>
              </div>
              <button onClick={() => setIsViewStudentsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto text-xs p-4 text-center text-gray-500">
              No registered students logged for this subject yet.
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                onClick={() => setIsViewStudentsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
