import React, { useState, useEffect } from 'react';
import { Search, FileText, Filter, X, RefreshCw, ChevronDown, ChevronUp, User, Layers, ArrowRight, Eye } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface Department {
  code: string;
  name: string;
}

interface Program {
  program_code: string;
  program_name: string;
  department_code: string;
}

interface StudentDocumentRecord {
  id: string;
  name: string;
  enrollment: string;
  department: string;
  course: string;
  year: string;
  section: string;
  totalDocs: number;
  uploadedDocs: number;
  status: 'Complete' | 'Incomplete';
  documentList: any[];
}

export const StudentDocuments: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  // Cascading Filter states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [sectionsList, setSectionsList] = useState<any[]>([]);

  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [showAllWithoutFilter, setShowAllWithoutFilter] = useState(false);

  const [students, setStudents] = useState<StudentDocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Department, Program & Section options on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const { data: depts } = await supabase.from('departments').select('code, name');
        if (depts) setDepartments(depts);

        const { data: progs } = await supabase.from('programs').select('program_code, program_name, department_code');
        if (progs) setPrograms(progs);

        const { data: secs } = await supabase.from('sections').select('*');
        if (secs) setSectionsList(secs);
      } catch (err) {
        console.error('Error fetching filter metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // 2. Fetch Students & Documents data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all students
      const { data: studentsData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (studentError) throw studentError;

      // Fetch all documents
      const { data: docsData, error: docsError } = await supabase
        .from('student_documents')
        .select('*');

      if (docsError) throw docsError;

      // Map documents by admission_number
      const docsMap = new Map<string, any[]>();
      if (docsData) {
        docsData.forEach(doc => {
          if (doc.admission_number) {
            const list = docsMap.get(doc.admission_number) || [];
            list.push(doc);
            docsMap.set(doc.admission_number, list);
          }
        });
      }

      const TOTAL_REQUIRED_DOCS = 5;

      const mappedData: StudentDocumentRecord[] = (studentsData || []).map((student: any) => {
        const userDocs = docsMap.get(student.admission_number) || [];
        const uploadedDocsCount = userDocs.length;

        // Determine year from admission date or default to 1st Year
        let yearText = '1st Year';
        if (student.admission_date) {
          const admYear = new Date(student.admission_date).getFullYear();
          const currentYear = new Date().getFullYear();
          const diff = currentYear - admYear + 1;
          if (diff === 2) yearText = '2nd Year';
          else if (diff === 3) yearText = '3rd Year';
          else if (diff >= 4) yearText = '4th Year';
        }

        return {
          id: student.id,
          name: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown',
          enrollment: student.admission_number || '-',
          department: student.department_code || '-',
          course: student.program_code || '-',
          year: yearText,
          section: student.section || student.section_code || 'Unassigned',
          totalDocs: TOTAL_REQUIRED_DOCS,
          uploadedDocs: uploadedDocsCount,
          status: uploadedDocsCount >= TOTAL_REQUIRED_DOCS ? 'Complete' : 'Incomplete',
          documentList: userDocs,
        };
      });

      setStudents(mappedData);
    } catch (err) {
      console.error('Error fetching student documents data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter programs based on selected Department
  const availablePrograms = selectedDept
    ? programs.filter(p => p.department_code === selectedDept)
    : programs;

  // Check if any filter is active
  const hasFilterApplied = selectedDept !== '' || selectedCourse !== '' || selectedYear !== '' || selectedSection !== '' || searchTerm !== '' || showAllWithoutFilter;

  // Apply all cascading filters + search term
  const filteredStudents = students.filter(student => {
    if (!hasFilterApplied) return false;

    // Search query
    const matchesSearch = searchTerm === '' ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());

    // Department Filter
    const matchesDept = selectedDept ? student.department === selectedDept : true;

    // Course / Program Filter
    const matchesCourse = selectedCourse ? student.course === selectedCourse : true;

    // Year Filter
    const matchesYear = selectedYear ? student.year === selectedYear : true;

    // Section Filter
    const matchesSection = !selectedSection 
      ? true 
      : selectedSection === 'Unassigned' 
      ? (!student.section || student.section === 'Unassigned' || student.section === '' || student.section === '-')
      : student.section === selectedSection;

    return matchesSearch && matchesDept && matchesCourse && matchesYear && matchesSection;
  });

  const activeFiltersCount =
    (selectedDept ? 1 : 0) +
    (selectedCourse ? 1 : 0) +
    (selectedYear ? 1 : 0) +
    (selectedSection ? 1 : 0);

  const resetFilters = () => {
    setSelectedDept('');
    setSelectedCourse('');
    setSelectedYear('');
    setSelectedSection('');
    setSearchTerm('');
    setShowAllWithoutFilter(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Documents</h1>
          <p className="text-gray-500 text-sm mt-1">Select Department, Course, Year & Section (Optional) to view student document records</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Cascading Filter Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
            <Filter size={18} className="text-indigo-600" />
            <span>Filter Hierarchy</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {activeFiltersCount} selected
              </span>
            )}
          </div>
          {(hasFilterApplied) && (
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
            >
              <X size={14} /> Clear Selection
            </button>
          )}
        </div>

        {/* Cascading Dropdowns Grid: Department -> Course -> Year -> Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* 1. Department */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              1. Select Department
            </label>
            <select
              value={selectedDept}
              onChange={e => {
                setSelectedDept(e.target.value);
                setSelectedCourse(''); // Reset course when dept changes
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Choose Department...</option>
              {departments.map(dept => (
                <option key={dept.code} value={dept.code}>
                  {dept.code} ({dept.name})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Course / Program */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              2. Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              disabled={!selectedDept && availablePrograms.length === 0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">{selectedDept ? 'All Courses in Dept' : 'Choose Course...'}</option>
              {availablePrograms.map(prog => (
                <option key={prog.program_code} value={prog.program_code}>
                  {prog.program_code} - {prog.program_name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Year */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              3. Select Year
            </label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* 4. Section */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              4. Select Section (Optional)
            </label>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All / Unassigned (Default)</option>
              <option value="Unassigned">Not Assigned Only</option>
              {sectionsList.length > 0 ? (
                sectionsList.map(sec => (
                  <option key={sec.id || sec.name} value={sec.name}>
                    Section {sec.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No Sections Created Yet</option>
              )}
            </select>
          </div>
        </div>

        {/* Realtime Search Bar */}
        <div className="relative pt-2">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Or search directly by student name, admission number, or course code..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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
            <h2 className="text-xl font-bold text-gray-900">Select Filters to View Documents</h2>
            <p className="text-gray-500 text-sm mt-2">
              Please choose a <span className="font-semibold text-indigo-600">Department</span>, <span className="font-semibold text-indigo-600">Course</span>, <span className="font-semibold text-indigo-600">Year</span>, or <span className="font-semibold text-indigo-600">Section</span> from the filters above to load the student document records.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setShowAllWithoutFilter(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              <span>Or view all student records ({students.length})</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Table View when Filters are active */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Student</th>
                  <th className="p-4">Admission ID</th>
                  <th className="p-4">Department / Course</th>
                  <th className="p-4">Year / Section</th>
                  <th className="p-4">Uploaded Progress</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      <div className="flex justify-center items-center gap-2">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading student documents...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="font-semibold text-gray-800 text-base">No students match the selected filter hierarchy</p>
                      <p className="text-xs text-gray-400 mt-1">Try selecting a different Department, Course, Year, or Section.</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => {
                    const isExpanded = expandedStudent === student.id;
                    const progressPct = Math.min(100, Math.round((student.uploadedDocs / student.totalDocs) * 100));

                    return (
                      <React.Fragment key={student.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                <User size={16} />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{student.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono font-medium text-gray-700">{student.enrollment}</td>
                          <td className="p-4 text-gray-600">
                            <div className="font-medium text-gray-900">{student.course}</div>
                            <div className="text-xs text-gray-400">Dept: {student.department}</div>
                          </td>
                          <td className="p-4 text-gray-600">
                            <span className="font-medium text-gray-800">{student.year}</span>
                            <div className="text-xs text-gray-400">{student.section}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3 max-w-[140px]">
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    student.status === 'Complete' ? 'bg-green-500' : 'bg-yellow-500'
                                  }`}
                                  style={{ width: `${progressPct}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                                {student.uploadedDocs}/{student.totalDocs}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                student.status === 'Complete'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => navigate(`/registrar/verification/review/${student.enrollment}`)}
                                className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                              >
                                Verify Docs
                              </button>
                              <button
                                onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Toggle Details"
                              >
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded View */}
                        {isExpanded && (
                          <tr className="bg-indigo-50/40 border-b border-gray-200">
                            <td colSpan={7} className="p-4">
                              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm ml-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                  Uploaded Files for {student.name} ({student.enrollment})
                                </h4>
                                {student.documentList.length === 0 ? (
                                  <p className="text-sm text-gray-400 italic">No files uploaded yet for this student.</p>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {student.documentList.map((file: any) => (
                                      <div
                                        key={file.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm"
                                      >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                          <FileText size={16} className="text-indigo-600 flex-shrink-0" />
                                          <div className="truncate">
                                            <div className="font-medium text-gray-800 truncate">
                                              {file.document_type || 'Document'}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                              {file.status || 'Pending'}
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          onClick={async () => {
                                            if (file.file_path) {
                                              const { data: urlData } = await supabase.storage
                                                .from('student_documents')
                                                .createSignedUrl(file.file_path, 60);
                                              if (urlData?.signedUrl) {
                                                window.open(urlData.signedUrl, '_blank');
                                              }
                                            }
                                          }}
                                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 ml-2 flex-shrink-0"
                                        >
                                          <Eye size={12} /> View
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
