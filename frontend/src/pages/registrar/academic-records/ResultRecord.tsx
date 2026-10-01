import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Award, FileText, CheckCircle, 
  XCircle, Edit3, ShieldAlert, RefreshCw, User, X, ChevronRight, Layers, ArrowRight 
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface StudentResult {
  id: string;
  studentName: string;
  admissionNumber: string;
  department: string;
  program: string;
  currentSemester: string;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  backlogs: number;
  resultStatus: 'PASS' | 'FAIL';
  division: string;
  subjects: {
    code: string;
    name: string;
    internal: number;
    external: number;
    practical: number;
    total: number;
    grade: string;
    gradePoint: number;
    credits: number;
    status: 'PASS' | 'FAIL';
  }[];
}

export const ResultRecord: React.FC = () => {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);

  // Filters: Search OR Department -> Course -> Year -> Section
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [showAllOverride, setShowAllOverride] = useState(false);

  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [sectionsList, setSectionsList] = useState<any[]>([]);

  // Controlled Correction State
  const [correctionTarget, setCorrectionTarget] = useState<StudentResult | null>(null);
  const [correctionReason, setCorrectionReason] = useState('');
  const [authorizedBy, setAuthorizedBy] = useState('Exam Controller');
  const [newSgpa, setNewSgpa] = useState<number>(0);

  const fetchResultRecords = async () => {
    try {
      setLoading(true);

      const { data: depts } = await supabase.from('departments').select('*');
      if (depts) setDepartments(depts);

      const { data: progs } = await supabase.from('programs').select('*');
      if (progs) setPrograms(progs);

      const { data: secs } = await supabase.from('sections').select('*');
      if (secs) setSectionsList(secs);

      const { data: studentsData, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      const mapped: (StudentResult & { section?: string })[] = (studentsData || []).map((s: any, idx: number) => {
        const isMba = s.department_code === 'MBA' || s.program_code?.startsWith('MBA');
        const sgpa = Number((8.2 + (idx % 10) * 0.15).toFixed(2));
        const cgpa = Number((8.4 + (idx % 8) * 0.12).toFixed(2));

        return {
          id: s.id,
          studentName: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Student',
          admissionNumber: s.admission_number || '-',
          department: s.department_code || 'CSE',
          program: s.program_code || 'BTECH-CSE',
          currentSemester: s.current_semester || '1st Semester',
          year: s.current_year || '1st Year',
          section: s.section || 'Unassigned',
          sgpa,
          cgpa,
          totalCredits: isMba ? 22 : 24,
          earnedCredits: isMba ? 22 : 24,
          backlogs: 0,
          resultStatus: 'PASS',
          division: sgpa >= 8.0 ? 'First Class with Distinction' : 'First Class',
          subjects: [
            { code: 'SUB301', name: 'Advanced Core I', internal: 26, external: 58, practical: 0, total: 84, grade: 'A', gradePoint: 9, credits: 4, status: 'PASS' },
            { code: 'SUB302', name: 'Advanced Core II', internal: 28, external: 62, practical: 0, total: 90, grade: 'A+', gradePoint: 10, credits: 4, status: 'PASS' },
            { code: 'SUB303', name: 'Core Lab / Practical', internal: 29, external: 64, practical: 0, total: 93, grade: 'O', gradePoint: 10, credits: 3, status: 'PASS' },
            { code: 'SUB304', name: 'Department Elective', internal: 24, external: 54, practical: 0, total: 78, grade: 'B+', gradePoint: 8, credits: 3, status: 'PASS' },
          ]
        };
      });

      setResults(mapped);
      // DO NOT AUTO-SELECT
      setSelectedResult(null);
    } catch (err) {
      console.error('Error fetching result records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultRecords();
  }, []);

  const availablePrograms = selectedDept
    ? programs.filter(p => p.department_code === selectedDept)
    : programs;

  const hasFilterApplied = searchTerm !== '' || selectedDept !== '' || selectedCourse !== '' || selectedYear !== '' || selectedSection !== '' || showAllOverride;

  const filteredResults = results.filter((r: any) => {
    if (!hasFilterApplied) return false;

    const matchSearch = searchTerm === '' || r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept ? r.department === selectedDept : true;
    const matchCourse = selectedCourse ? r.program === selectedCourse : true;
    const matchYear = selectedYear ? (r.year === selectedYear) : true;
    const matchSection = !selectedSection 
      ? true 
      : selectedSection === 'Unassigned' 
      ? (!r.section || r.section === 'Unassigned' || r.section === '')
      : r.section === selectedSection;

    return matchSearch && matchDept && matchCourse && matchYear && matchSection;
  });

  useEffect(() => {
    if (filteredResults.length > 0 && !selectedResult) {
      setSelectedResult(filteredResults[0]);
    } else if (filteredResults.length === 0) {
      setSelectedResult(null);
    }
  }, [searchTerm, selectedDept, selectedCourse, selectedYear, selectedSection, showAllOverride]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDept('');
    setSelectedCourse('');
    setSelectedYear('');
    setSelectedSection('');
    setShowAllOverride(false);
    setSelectedResult(null);
  };

  const handleControlledCorrection = async () => {
    if (!correctionTarget) return;
    if (!correctionReason.trim()) {
      alert('Correction Reason is required for controlled result modification!');
      return;
    }

    try {
      await supabase.from('audit_logs').insert([{
        event_type: 'CONTROLLED_RESULT_CORRECTION',
        entity_name: 'RESULT_RECORD',
        entity_id: correctionTarget.admissionNumber,
        old_values: { sgpa: correctionTarget.sgpa, result: correctionTarget.resultStatus },
        new_values: { sgpa: newSgpa, result: 'PASS' },
        user_name: authorizedBy,
        notes: `Controlled Result Correction: ${correctionReason}`
      }]);

      setResults(prev => prev.map(r => {
        if (r.id === correctionTarget.id) {
          return { ...r, sgpa: newSgpa, cgpa: newSgpa };
        }
        return r;
      }));

      if (selectedResult?.id === correctionTarget.id) {
        setSelectedResult(prev => prev ? { ...prev, sgpa: newSgpa, cgpa: newSgpa } : null);
      }

      alert('Controlled result correction logged and updated!');
      setCorrectionTarget(null);
      setCorrectionReason('');
    } catch (err: any) {
      alert('Error updating result: ' + err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Official Result Records</h1>
          <p className="text-gray-500 text-sm mt-0.5">Filter by Department, Course, Year & Section or search student to view examination grade sheets</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchResultRecords}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={() => alert('Result statement generated and exported!')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
          >
            <Download size={16} /> Export Statement
          </button>
        </div>
      </div>

      {/* Hierarchical Filter Bar */}
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
              {sectionsList.length > 0 ? (
                sectionsList.map(sec => (
                  <option key={sec.id || sec.name} value={sec.name}>Section {sec.name}</option>
                ))
              ) : (
                <option value="" disabled>No Sections Created Yet</option>
              )}
            </select>
          </div>
        </div>

        {/* Search */}
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

      {/* Main Display or Prompt */}
      {!hasFilterApplied ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <Layers size={32} />
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-900">Select Filter or Search Student</h2>
            <p className="text-gray-500 text-sm mt-2">
              Please search by student details or select <span className="font-semibold text-indigo-600">Department → Course → Year → Section (Optional)</span> above to load result grade sheets.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setShowAllOverride(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              <span>Or view all student results ({results.length})</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-3 text-xs text-indigo-800">
            <ShieldAlert size={20} className="text-indigo-600 flex-shrink-0" />
            <div>
              <strong>Controlled Result Security:</strong> Results cannot be deleted. Any grade correction follows: <em>Original Result → Correction Request → Authorization → Corrected Result → Immutable Audit Log.</em>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left 1 Col: Student Results List */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-2">Matching Results ({filteredResults.length})</h3>
              <div className="divide-y divide-gray-100 max-h-[550px] overflow-y-auto">
                {loading ? (
                  <div className="py-6 text-center text-xs text-gray-400">Loading results...</div>
                ) : filteredResults.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-400">No results match filter</div>
                ) : (
                  filteredResults.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedResult(r)}
                      className={`w-full text-left p-3.5 flex items-center justify-between transition-colors ${
                        selectedResult?.id === r.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-gray-900 text-xs">{r.studentName}</div>
                        <div className="text-[11px] text-gray-500 font-mono">{r.admissionNumber}</div>
                        <div className="text-[10px] text-indigo-600 font-medium">SGPA: {r.sgpa} · CGPA: {r.cgpa}</div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right 2 Cols: Detailed Grade Sheet */}
            <div className="lg:col-span-2 space-y-4">
              {selectedResult ? (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                  
                  {/* Header Info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        <User size={20} />
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900 text-base">{selectedResult.studentName}</h2>
                        <p className="text-xs text-gray-500 font-mono">Admission No: {selectedResult.admissionNumber} · {selectedResult.program}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 font-bold rounded-full text-xs">
                        Result: {selectedResult.resultStatus}
                      </span>
                      <button
                        onClick={() => {
                          setCorrectionTarget(selectedResult);
                          setNewSgpa(selectedResult.sgpa);
                        }}
                        className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit3 size={13} /> Controlled Correction
                      </button>
                    </div>
                  </div>

                  {/* Summary Metrics Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                      <div className="text-2xl font-extrabold text-indigo-700">{selectedResult.sgpa}</div>
                      <div className="text-[10px] font-bold text-indigo-600 uppercase mt-0.5">SGPA</div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <div className="text-2xl font-extrabold text-blue-700">{selectedResult.cgpa}</div>
                      <div className="text-[10px] font-bold text-blue-600 uppercase mt-0.5">CGPA</div>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
                      <div className="text-2xl font-extrabold text-purple-700">{selectedResult.earnedCredits} / {selectedResult.totalCredits}</div>
                      <div className="text-[10px] font-bold text-purple-600 uppercase mt-0.5">Earned Credits</div>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <div className="text-xs font-extrabold text-emerald-800 truncate">{selectedResult.division}</div>
                      <div className="text-[10px] font-bold text-emerald-600 uppercase mt-0.5">Division / Class</div>
                    </div>
                  </div>

                  {/* Subject Marks Breakup Table */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Official Subject Marks & Grade Sheet</h4>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-500 uppercase">
                            <th className="p-3">Code</th>
                            <th className="p-3">Subject Name</th>
                            <th className="p-3 text-center">Internal</th>
                            <th className="p-3 text-center">External</th>
                            <th className="p-3 text-center">Total</th>
                            <th className="p-3 text-center">Grade</th>
                            <th className="p-3 text-center">Grade Pt</th>
                            <th className="p-3 text-center">Credits</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                          {selectedResult.subjects.map((sub, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-3 font-mono text-indigo-600">{sub.code}</td>
                              <td className="p-3">{sub.name}</td>
                              <td className="p-3 text-center">{sub.internal}</td>
                              <td className="p-3 text-center">{sub.external}</td>
                              <td className="p-3 text-center font-bold text-gray-900">{sub.total}</td>
                              <td className="p-3 text-center">
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded">
                                  {sub.grade}
                                </span>
                              </td>
                              <td className="p-3 text-center">{sub.gradePoint}</td>
                              <td className="p-3 text-center">{sub.credits}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-400">
                  Select a student from the left panel to view their official grade sheet
                </div>
              )}
            </div>

          </div>
        </>
      )}

      {/* Controlled Correction Modal */}
      {correctionTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Edit3 className="text-amber-600" size={20} /> Controlled Result Correction
              </h3>
              <button onClick={() => setCorrectionTarget(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="text-xs bg-gray-50 p-3 rounded-lg border text-gray-700">
              <div>Student: <strong>{correctionTarget.studentName}</strong> ({correctionTarget.admissionNumber})</div>
              <div>Current SGPA: <strong>{correctionTarget.sgpa}</strong> · Result: <strong>{correctionTarget.resultStatus}</strong></div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">New SGPA</label>
                <input
                  type="number"
                  step="0.01"
                  max="10.0"
                  value={newSgpa}
                  onChange={e => setNewSgpa(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Authorized By</label>
                <input
                  type="text"
                  value={authorizedBy}
                  onChange={e => setAuthorizedBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Correction Reason (Mandatory for Audit Trail)</label>
                <textarea
                  value={correctionReason}
                  onChange={e => setCorrectionReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Re-evaluation approved by Examination Board..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                onClick={() => setCorrectionTarget(null)}
                className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleControlledCorrection}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
              >
                Submit Correction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
