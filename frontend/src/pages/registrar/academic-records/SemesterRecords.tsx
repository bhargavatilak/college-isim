import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, BookOpen, ChevronRight, CheckCircle, 
  Clock, FileText, Layers, Calendar, Award, User, RefreshCw, X, ArrowRight 
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface StudentInfo {
  id: string;
  admission_number: string;
  first_name: string;
  last_name: string;
  department_code: string;
  program_code: string;
  current_year?: string;
  section?: string;
}

interface SubjectMark {
  code: string;
  name: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

interface SemesterData {
  semesterName: string;
  yearName: string;
  academicYear: string;
  registrationStatus: string;
  totalCredits: number;
  creditsEarned: number;
  sgpa: number;
  resultStatus: 'PASS' | 'FAIL';
  backlogs: number;
  startDate: string;
  endDate: string;
  subjects: SubjectMark[];
}

export const SemesterRecords: React.FC = () => {
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters: Search OR Department -> Course -> Year -> Section
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [showAllOverride, setShowAllOverride] = useState(false);

  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  const [activeSemIndex, setActiveSemIndex] = useState<number>(0);

  useEffect(() => {
    fetchMetadataAndStudents();
  }, []);

  const fetchMetadataAndStudents = async () => {
    try {
      setLoading(true);
      
      const { data: depts } = await supabase.from('departments').select('*');
      if (depts) setDepartments(depts);

      const { data: progs } = await supabase.from('programs').select('*');
      if (progs) setPrograms(progs);

      const { data: secs } = await supabase.from('sections').select('*');
      if (secs) setSections(secs);

      const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      const mapped = (data || []).map((s: any) => ({
        ...s,
        current_year: s.current_year || '1st Year',
        current_semester: s.current_semester || '1st Semester',
        section: s.section || 'Unassigned',
      }));
      setStudents(mapped);
      // DO NOT AUTO-SELECT STUDENT (User rule: Only show when searched or filtered)
      setSelectedStudent(null);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const isMba = selectedStudent?.department_code === 'MBA' || selectedStudent?.program_code?.startsWith('MBA');

  const availablePrograms = selectedDept
    ? programs.filter(p => p.department_code === selectedDept)
    : programs;

  // Check if search or filter is applied
  const hasFilterApplied = searchTerm !== '' || selectedDept !== '' || selectedCourse !== '' || selectedYear !== '' || selectedSection !== '' || showAllOverride;

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

    return matchSearch && matchDept && matchCourse && matchYear && matchSection;
  });

  // Automatically select the first matching student if filtering is active and none is selected
  useEffect(() => {
    if (filteredStudents.length > 0 && !selectedStudent) {
      setSelectedStudent(filteredStudents[0]);
    } else if (filteredStudents.length === 0) {
      setSelectedStudent(null);
    }
  }, [searchTerm, selectedDept, selectedCourse, selectedYear, selectedSection, showAllOverride]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDept('');
    setSelectedCourse('');
    setSelectedYear('');
    setSelectedSection('');
    setShowAllOverride(false);
    setSelectedStudent(null);
  };

  // Build semester structure for B.Tech (8 sems) or MBA (4 sems)
  const generateSemesters = (): SemesterData[] => {
    if (!selectedStudent) return [];

    if (isMba) {
      return [
        {
          semesterName: 'Semester 1',
          yearName: 'Year 1',
          academicYear: '2026-2027',
          registrationStatus: 'COMPLETED',
          totalCredits: 22,
          creditsEarned: 22,
          sgpa: 8.50,
          resultStatus: 'PASS',
          backlogs: 0,
          startDate: '2026-08-01',
          endDate: '2026-12-20',
          subjects: [
            { code: 'MBA101', name: 'Management Fundamentals', credits: 4, grade: 'A', gradePoint: 9 },
            { code: 'MBA102', name: 'Managerial Economics', credits: 4, grade: 'A', gradePoint: 9 },
            { code: 'MBA103', name: 'Financial Accounting', credits: 4, grade: 'B+', gradePoint: 8 },
            { code: 'MBA104', name: 'Organizational Behavior', credits: 4, grade: 'A+', gradePoint: 10 },
            { code: 'MBA105', name: 'Marketing Management', credits: 4, grade: 'B', gradePoint: 7 },
            { code: 'MBA106', name: 'Business Communication', credits: 2, grade: 'A', gradePoint: 9 },
          ]
        },
        {
          semesterName: 'Semester 2',
          yearName: 'Year 1',
          academicYear: '2026-2027',
          registrationStatus: 'COMPLETED',
          totalCredits: 22,
          creditsEarned: 22,
          sgpa: 8.75,
          resultStatus: 'PASS',
          backlogs: 0,
          startDate: '2027-01-10',
          endDate: '2027-05-30',
          subjects: [
            { code: 'MBA201', name: 'Financial Management', credits: 4, grade: 'A+', gradePoint: 10 },
            { code: 'MBA202', name: 'Human Resource Management', credits: 4, grade: 'A', gradePoint: 9 },
            { code: 'MBA203', name: 'Operations Research', credits: 4, grade: 'B+', gradePoint: 8 },
            { code: 'MBA204', name: 'Research Methodology', credits: 4, grade: 'A', gradePoint: 9 },
            { code: 'MBA205', name: 'Specialization Core I', credits: 4, grade: 'A', gradePoint: 9 },
            { code: 'MBA206', name: 'Corporate Governance', credits: 2, grade: 'A+', gradePoint: 10 },
          ]
        },
        {
          semesterName: 'Semester 3',
          yearName: 'Year 2',
          academicYear: '2027-2028',
          registrationStatus: 'REGISTERED',
          totalCredits: 20,
          creditsEarned: 20,
          sgpa: 8.40,
          resultStatus: 'PASS',
          backlogs: 0,
          startDate: '2027-08-01',
          endDate: '2027-12-20',
          subjects: [
            { code: 'MBA301', name: 'Strategic Management', credits: 4, grade: 'A', gradePoint: 9 },
            { code: 'MBA302', name: 'Advanced Specialization I', credits: 4, grade: 'A+', gradePoint: 10 },
            { code: 'MBA303', name: 'Advanced Specialization II', credits: 4, grade: 'B+', gradePoint: 8 },
            { code: 'MBA304', name: 'Business Analytics & BI', credits: 4, grade: 'A', gradePoint: 9 },
            { code: 'MBA305', name: 'Summer Internship Project', credits: 4, grade: 'A+', gradePoint: 10 },
          ]
        },
        {
          semesterName: 'Semester 4',
          yearName: 'Year 2',
          academicYear: '2027-2028',
          registrationStatus: 'UPCOMING',
          totalCredits: 18,
          creditsEarned: 0,
          sgpa: 0.00,
          resultStatus: 'PASS',
          backlogs: 0,
          startDate: '2028-01-10',
          endDate: '2028-05-30',
          subjects: [
            { code: 'MBA401', name: 'Dissertation / Capstone Project', credits: 8, grade: 'PENDING', gradePoint: 0 },
            { code: 'MBA402', name: 'International Business Strategy', credits: 4, grade: 'PENDING', gradePoint: 0 },
            { code: 'MBA403', name: 'Entrepreneurship & Innovation', credits: 4, grade: 'PENDING', gradePoint: 0 },
            { code: 'MBA404', name: 'Comprehensive Viva', credits: 2, grade: 'PENDING', gradePoint: 0 },
          ]
        }
      ];
    }

    // Default B.Tech 8 Semesters
    return Array.from({ length: 8 }).map((_, i) => {
      const semNum = i + 1;
      const yrNum = Math.ceil(semNum / 2);
      return {
        semesterName: `Semester ${semNum}`,
        yearName: `Year ${yrNum}`,
        academicYear: `${2026 + yrNum - 1}-${2027 + yrNum - 1}`,
        registrationStatus: semNum <= 4 ? 'COMPLETED' : semNum === 5 ? 'REGISTERED' : 'UPCOMING',
        totalCredits: 24,
        creditsEarned: semNum <= 4 ? 24 : 0,
        sgpa: semNum <= 4 ? Number((8.1 + semNum * 0.15).toFixed(2)) : 0.0,
        resultStatus: 'PASS',
        backlogs: 0,
        startDate: `${2026 + yrNum - 1}-08-01`,
        endDate: `${2026 + yrNum - 1}-12-20`,
        subjects: [
          { code: `CS${semNum}01`, name: `Core Subject ${semNum}.1`, credits: 4, grade: semNum <= 4 ? 'A' : 'PENDING', gradePoint: semNum <= 4 ? 9 : 0 },
          { code: `CS${semNum}02`, name: `Core Subject ${semNum}.2`, credits: 4, grade: semNum <= 4 ? 'B+' : 'PENDING', gradePoint: semNum <= 4 ? 8 : 0 },
          { code: `CS${semNum}03`, name: `Lab / Practical ${semNum}`, credits: 3, grade: semNum <= 4 ? 'A+' : 'PENDING', gradePoint: semNum <= 4 ? 10 : 0 },
          { code: `CS${semNum}04`, name: `Elective ${semNum}`, credits: 3, grade: semNum <= 4 ? 'A' : 'PENDING', gradePoint: semNum <= 4 ? 9 : 0 },
        ]
      };
    });
  };

  const semestersList = generateSemesters();
  const currentSem = semestersList[activeSemIndex] || semestersList[0];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Semester Academic Records</h1>
          <p className="text-gray-500 text-sm mt-0.5">Filter by Department, Course, Year & Section or search student to view semester history</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchMetadataAndStudents}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={() => alert('Semester record exported!')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
          >
            <Download size={16} /> Export Record
          </button>
        </div>
      </div>

      {/* Hierarchical Filter Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
            <Filter size={18} className="text-indigo-600" />
            <span>Search or Filter Student Hierarchy</span>
          </div>
          {hasFilterApplied && (
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
            >
              <X size={14} /> Clear Filter
            </button>
          )}
        </div>

        {/* Cascading Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
              {sections.length > 0 ? (
                sections.map(sec => (
                  <option key={sec.id || sec.name} value={sec.name}>Section {sec.name}</option>
                ))
              ) : (
                <option value="" disabled>No Sections Created Yet</option>
              )}
            </select>
          </div>
        </div>

        {/* Real-time Search Input */}
        <div className="relative pt-2">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Or search by student name or admission number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Display Container */}
      {!hasFilterApplied ? (
        /* Empty / Select Filter Prompt View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <Layers size={32} />
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-900">Select Filter or Search Student</h2>
            <p className="text-gray-500 text-sm mt-2">
              Please search by student details or select <span className="font-semibold text-indigo-600">Department → Course → Year → Section (Optional)</span> above to load semester academic records.
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
        /* Main Layout: Left Student List + Right Semester Structure Viewer */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left Col: Student Selector */}
          <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Matching Students ({filteredStudents.length})</h3>

            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="py-6 text-center text-xs text-gray-400">Loading...</div>
              ) : filteredStudents.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">No students match filter</div>
              ) : (
                filteredStudents.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedStudent(s); setActiveSemIndex(0); }}
                    className={`w-full text-left p-3 flex items-center justify-between transition-colors ${
                      selectedStudent?.id === s.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-gray-900 text-xs">{s.first_name} {s.last_name}</div>
                      <div className="text-[11px] text-gray-500 font-mono">{s.admission_number}</div>
                      <div className="text-[10px] text-gray-400">{s.program_code}</div>
                    </div>
                    <ChevronRight size={14} className="text-gray-400" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right 3 Cols: Semester Structure & Marks */}
          <div className="lg:col-span-3 space-y-5">

            {selectedStudent ? (
              <>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <User size={20} />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 text-base">{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                      <p className="text-xs text-gray-500 font-mono">Admission No: {selectedStudent.admission_number} · Dept: {selectedStudent.department_code} · {selectedStudent.program_code}</p>
                    </div>
                  </div>
                  <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs px-3 py-1 rounded-full font-bold">
                    {isMba ? 'MBA (2 Years / 4 Semesters)' : 'B.Tech (4 Years / 8 Semesters)'}
                  </span>
                </div>

                {/* Semester Tabs */}
                <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex gap-2 overflow-x-auto">
                  {semestersList.map((sem, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSemIndex(idx)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                        activeSemIndex === idx
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{sem.semesterName}</span>
                      <span className="text-[10px] opacity-75">({sem.yearName})</span>
                    </button>
                  ))}
                </div>

                {/* Active Semester Details Card */}
                {currentSem && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{currentSem.semesterName} ({currentSem.yearName})</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Academic Session: {currentSem.academicYear} · {currentSem.startDate} to {currentSem.endDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          currentSem.registrationStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          currentSem.registrationStatus === 'REGISTERED' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {currentSem.registrationStatus}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Result: {currentSem.resultStatus}
                        </span>
                      </div>
                    </div>

                    {/* Semester KPI Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <div className="text-2xl font-extrabold text-indigo-700">{currentSem.sgpa.toFixed(2)}</div>
                        <div className="text-[10px] font-bold text-indigo-600 uppercase mt-0.5">Semester SGPA</div>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <div className="text-2xl font-extrabold text-blue-700">{currentSem.creditsEarned} / {currentSem.totalCredits}</div>
                        <div className="text-[10px] font-bold text-blue-600 uppercase mt-0.5">Credits Earned</div>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
                        <div className="text-2xl font-extrabold text-green-700">{currentSem.subjects.length}</div>
                        <div className="text-[10px] font-bold text-green-600 uppercase mt-0.5">Registered Subjects</div>
                      </div>
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                        <div className="text-2xl font-extrabold text-amber-700">{currentSem.backlogs}</div>
                        <div className="text-[10px] font-bold text-amber-600 uppercase mt-0.5">Active Backlogs</div>
                      </div>
                    </div>

                    {/* Registered Subjects Table */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Subject Performance & Grades</h4>
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-500 uppercase">
                              <th className="p-3">Subject Code</th>
                              <th className="p-3">Subject Name</th>
                              <th className="p-3 text-center">Credits</th>
                              <th className="p-3 text-center">Grade</th>
                              <th className="p-3 text-center">Grade Point</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium">
                            {currentSem.subjects.map((sub, sIdx) => (
                              <tr key={sIdx} className="hover:bg-gray-50">
                                <td className="p-3 font-mono text-indigo-600">{sub.code}</td>
                                <td className="p-3 text-gray-900">{sub.name}</td>
                                <td className="p-3 text-center text-gray-700">{sub.credits}</td>
                                <td className="p-3 text-center">
                                  <span className="px-2 py-0.5 rounded font-bold bg-indigo-50 text-indigo-700">
                                    {sub.grade}
                                  </span>
                                </td>
                                <td className="p-3 text-center text-gray-700">{sub.gradePoint}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-400">
                Select a student from the left panel to view their semester record
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
