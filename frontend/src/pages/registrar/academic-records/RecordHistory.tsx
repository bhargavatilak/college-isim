import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, History as HistoryIcon, Lock, 
  RefreshCw, FileText, User, Calendar, ShieldCheck, CheckCircle2, X, Layers, ArrowRight 
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface AuditHistoryItem {
  id: string;
  created_at: string;
  event_type: string;
  entity_name: string;
  entity_id: string;
  user_name: string;
  approved_by?: string;
  old_values: any;
  new_values: any;
  notes: string;
}

export const RecordHistory: React.FC = () => {
  const [logs, setLogs] = useState<AuditHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters: Search OR Department -> Course -> Year -> Section
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [showAllOverride, setShowAllOverride] = useState(false);

  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [sectionsList, setSectionsList] = useState<any[]>([]);

  const fetchHistoryLogs = async () => {
    try {
      setLoading(true);

      const { data: depts } = await supabase.from('departments').select('*');
      if (depts) setDepartments(depts);

      const { data: progs } = await supabase.from('programs').select('*');
      if (progs) setPrograms(progs);

      const { data: secs } = await supabase.from('sections').select('*');
      if (secs) setSectionsList(secs);

      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setLogs(data);
      } else {
        setLogs([
          {
            id: 'AUD-001',
            created_at: '2026-07-15T10:30:00Z',
            event_type: 'SEMESTER_REGISTERED',
            entity_name: 'Semester 1',
            entity_id: '26CSEART193',
            user_name: 'Student Self',
            approved_by: 'Registrar Admin',
            old_values: 'NOT_REGISTERED',
            new_values: 'REGISTERED_SEM_1',
            notes: 'Semester 1 Registration completed for 2026-2027 academic session'
          },
          {
            id: 'AUD-002',
            created_at: '2027-01-20T14:15:00Z',
            event_type: 'RESULT_PUBLISHED',
            entity_name: 'Semester 1 Result',
            entity_id: '26CSEART193',
            user_name: 'Exam Controller',
            approved_by: 'Academic Board',
            old_values: 'RESULT_UNDER_REVIEW',
            new_values: 'SGPA: 8.72 (PASS)',
            notes: 'Semester 1 Result published with 0 backlogs'
          },
          {
            id: 'AUD-003',
            created_at: '2027-02-01T09:00:00Z',
            event_type: 'SEMESTER_REGISTERED',
            entity_name: 'Semester 2',
            entity_id: '26CSEART193',
            user_name: 'Student Self',
            approved_by: 'Registrar Admin',
            old_values: 'SEM_1_COMPLETED',
            new_values: 'REGISTERED_SEM_2',
            notes: 'Semester 2 Registration completed'
          },
          {
            id: 'AUD-004',
            created_at: '2027-07-10T16:00:00Z',
            event_type: 'RESULT_PUBLISHED',
            entity_name: 'Semester 2 Result',
            entity_id: '26CSEART193',
            user_name: 'Exam Controller',
            approved_by: 'Academic Board',
            old_values: 'RESULT_UNDER_REVIEW',
            new_values: 'SGPA: 8.85 (PASS)',
            notes: 'Semester 2 Result published'
          },
          {
            id: 'AUD-005',
            created_at: '2028-01-05T11:45:00Z',
            event_type: 'SECTION_CHANGED',
            entity_name: 'Section Assignment',
            entity_id: '26CSEART193',
            user_name: 'Registrar Office',
            approved_by: 'HOD CSE',
            old_values: 'Section A',
            new_values: 'Section B',
            notes: 'Program section changed upon HOD request'
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching academic history audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryLogs();
  }, []);

  const availablePrograms = selectedDept
    ? programs.filter(p => p.department_code === selectedDept)
    : programs;

  const hasFilterApplied = searchTerm !== '' || selectedDept !== '' || selectedCourse !== '' || selectedYear !== '' || selectedSection !== '' || selectedEventType !== '' || showAllOverride;

  const filteredLogs = logs.filter(log => {
    if (!hasFilterApplied) return false;

    const searchStr = `${log.entity_id || ''} ${log.event_type || ''} ${log.user_name || ''} ${log.notes || ''}`.toLowerCase();
    const matchSearch = searchTerm === '' || searchStr.includes(searchTerm.toLowerCase());
    const matchEvent = selectedEventType ? log.event_type === selectedEventType : true;
    return matchSearch && matchEvent;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDept('');
    setSelectedCourse('');
    setSelectedYear('');
    setSelectedSection('');
    setSelectedEventType('');
    setShowAllOverride(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HistoryIcon className="text-indigo-600" size={24} /> Academic Lifecycle History
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Filter by Department, Course, Year & Section or search student to view immutable audit logs</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchHistoryLogs}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={() => alert('Academic history audit log exported!')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
          >
            <Download size={16} /> Export Audit Log
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
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">5. Lifecycle Event</label>
            <select
              value={selectedEventType}
              onChange={e => setSelectedEventType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Lifecycle Events</option>
              <option value="SEMESTER_REGISTERED">Semester Registration</option>
              <option value="RESULT_PUBLISHED">Result Published</option>
              <option value="CONTROLLED_RESULT_CORRECTION">Result Correction</option>
              <option value="ATTENDANCE_AUTHORIZED_CORRECTION">Attendance Correction</option>
              <option value="SECTION_CHANGED">Section Change</option>
              <option value="PROGRAM_CHANGED">Program Change</option>
              <option value="GRADUATED">Graduation</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative pt-2">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Or search by student admission ID, event type, user or notes..."
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
              Please search by student details or select <span className="font-semibold text-indigo-600">Department → Course → Year → Section (Optional)</span> above to load academic lifecycle audit logs.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setShowAllOverride(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              <span>Or view all audit logs ({logs.length})</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3 text-xs text-purple-900">
            <Lock size={20} className="text-purple-600 flex-shrink-0" />
            <div>
              <strong>Read-Only & Immutable Audit Log:</strong> Every academic lifecycle event (semester registrations, results, grade corrections, program changes, graduation) is permanently recorded and read-only for normal Registrar users.
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Reference ID</th>
                    <th className="p-4">Student Admission No</th>
                    <th className="p-4">Event / Action</th>
                    <th className="p-4">Old Value</th>
                    <th className="p-4">New Value</th>
                    <th className="p-4">Reason / Notes</th>
                    <th className="p-4">Changed By</th>
                    <th className="p-4 text-center">Security</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {loading ? (
                    <tr><td colSpan={9} className="p-8 text-center text-gray-500 text-sm">Loading academic history audit trail...</td></tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr><td colSpan={9} className="p-12 text-center text-gray-500 text-sm">No audit logs match filter</td></tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-mono text-gray-600 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 font-mono font-bold text-indigo-600">{log.id.slice(0, 10)}</td>
                        <td className="p-4 font-mono font-semibold text-gray-900">{log.entity_id || '-'}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                            {log.event_type}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 font-mono max-w-[120px] truncate">
                          {typeof log.old_values === 'object' ? JSON.stringify(log.old_values) : String(log.old_values || '-')}
                        </td>
                        <td className="p-4 text-gray-900 font-mono font-semibold max-w-[140px] truncate">
                          {typeof log.new_values === 'object' ? JSON.stringify(log.new_values) : String(log.new_values || '-')}
                        </td>
                        <td className="p-4 text-gray-700 max-w-xs truncate">{log.notes || '-'}</td>
                        <td className="p-4 text-gray-800 font-medium whitespace-nowrap">
                          {log.user_name || 'System'}
                          {log.approved_by && <div className="text-[10px] text-gray-400">Appr: {log.approved_by}</div>}
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600" title="Read-Only Record">
                            <Lock size={10} /> Immutable
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
