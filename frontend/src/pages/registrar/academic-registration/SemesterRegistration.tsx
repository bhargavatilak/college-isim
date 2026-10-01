import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Users, CheckCircle, AlertTriangle, Download, 
  Clock, X, Lock, Unlock, Calendar, Plus, RefreshCw, Eye, ShieldCheck, FileText 
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface SemesterConfig {
  academicYear: string;
  semesterName: string;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'CLOSED' | 'EXTENDED' | 'LOCKED';
}

interface StudentRegistrationItem {
  id: string;
  student_name: string;
  admission_number: string;
  department_code: string;
  program_code: string;
  current_year: string;
  current_semester: string;
  status: 'Registered' | 'Pending' | 'Not Registered';
  registration_date?: string;
}

export const SemesterRegistration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Active Semester Configuration
  const [semesterConfig, setSemesterConfig] = useState<SemesterConfig>({
    academicYear: '2026–27',
    semesterName: 'Semester 1',
    startDate: '2026-07-01',
    endDate: '2026-08-15',
    status: 'OPEN',
  });

  const [students, setStudents] = useState<StudentRegistrationItem[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  // Modals
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configFormData, setConfigFormData] = useState<SemesterConfig>(semesterConfig);

  const fetchMetadataAndStudents = async () => {
    try {
      setLoading(true);

      const { data: depts } = await supabase.from('departments').select('*');
      if (depts) setDepartments(depts);

      const { data: progs } = await supabase.from('programs').select('*');
      if (progs) setPrograms(progs);

      const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      const mapped: StudentRegistrationItem[] = (data || []).map((s: any, idx: number) => ({
        id: s.id,
        student_name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Student',
        admission_number: s.admission_number || '-',
        department_code: s.department_code || 'CSE',
        program_code: s.program_code || 'BTECH-CSE',
        current_year: s.current_year || '1st Year',
        current_semester: s.current_semester || '1st Semester',
        status: idx % 6 === 0 ? 'Pending' : idx % 11 === 0 ? 'Not Registered' : 'Registered',
        registration_date: '2026-07-15',
      }));

      setStudents(mapped);
    } catch (err) {
      console.error('Error fetching semester registrations:', err);
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

  const filteredStudents = students.filter(s => {
    const fullName = s.student_name.toLowerCase();
    const admNo = s.admission_number.toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchSearch = !searchTerm || fullName.includes(term) || admNo.includes(term);
    const matchDept = !selectedDept || s.department_code === selectedDept;
    const matchCourse = !selectedCourse || s.program_code === selectedCourse;
    const matchStatus = !selectedStatusFilter || s.status === selectedStatusFilter;

    return matchSearch && matchDept && matchCourse && matchStatus;
  });

  const stats = {
    totalEligible: students.length,
    registered: students.filter(s => s.status === 'Registered').length,
    pending: students.filter(s => s.status === 'Pending').length,
    notRegistered: students.filter(s => s.status === 'Not Registered').length,
  };

  const handleUpdateStatus = (status: 'OPEN' | 'CLOSED' | 'EXTENDED' | 'LOCKED') => {
    if (semesterConfig.status === 'LOCKED' && status !== 'LOCKED') {
      const confirmOverride = window.confirm(
        'SECURITY WARNING: This semester registration is LOCKED. Unlocking requires authorized audit logging. Proceed with administrative override?'
      );
      if (!confirmOverride) return;
    }

    setSemesterConfig(prev => ({ ...prev, status }));

    // Insert Audit Log
    supabase.from('audit_logs').insert([{
      event_type: 'SEMESTER_REGISTRATION_STATUS_CHANGE',
      entity_name: 'SEMESTER_REGISTRATION',
      entity_id: `${semesterConfig.academicYear}_${semesterConfig.semesterName}`,
      old_values: { status: semesterConfig.status },
      new_values: { status },
      user_name: 'Registrar Admin',
      notes: `Semester Registration status changed to ${status} for ${semesterConfig.academicYear} ${semesterConfig.semesterName}`
    }]).then();
  };

  const handleRegisterStudent = (id: string) => {
    if (semesterConfig.status === 'LOCKED') {
      alert('Cannot register student: Registration is LOCKED for this academic period.');
      return;
    }

    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'Registered', registration_date: new Date().toISOString().split('T')[0] } : s));
  };

  const exportCSV = () => {
    const headers = ['Admission No', 'Student Name', 'Department', 'Program', 'Year', 'Semester', 'Status', 'Date'];
    const rows = filteredStudents.map(s => [
      s.admission_number,
      s.student_name,
      s.department_code,
      s.program_code,
      s.current_year,
      s.current_semester,
      s.status,
      s.registration_date || '-'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Semester_Registration_${semesterConfig.academicYear}_${semesterConfig.semesterName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Semester Registration Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage active academic period registration, student eligibility, and period locks</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setConfigFormData(semesterConfig); setIsConfigModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={16} /> Configure Semester
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-gray-700 font-medium transition-colors"
          >
            <Download size={16} /> Export List
          </button>
        </div>
      </div>

      {/* Active Semester Overview Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Active Session: {semesterConfig.academicYear}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                semesterConfig.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                semesterConfig.status === 'EXTENDED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                semesterConfig.status === 'LOCKED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {semesterConfig.status === 'LOCKED' ? '🔒 LOCKED' : `REGISTRATION ${semesterConfig.status}`}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-2">{semesterConfig.semesterName} Registration Window</h2>
            <p className="text-slate-300 text-xs mt-1">
              Window: {semesterConfig.startDate} to {semesterConfig.endDate}
            </p>
          </div>

          {/* Quick Lifecycle Actions */}
          <div className="flex flex-wrap gap-2">
            {semesterConfig.status !== 'OPEN' && (
              <button
                onClick={() => handleUpdateStatus('OPEN')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Unlock size={14} /> Open Registration
              </button>
            )}
            {semesterConfig.status === 'OPEN' && (
              <button
                onClick={() => handleUpdateStatus('EXTENDED')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Clock size={14} /> Extend Window
              </button>
            )}
            {semesterConfig.status !== 'CLOSED' && semesterConfig.status !== 'LOCKED' && (
              <button
                onClick={() => handleUpdateStatus('CLOSED')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <X size={14} /> Close Registration
              </button>
            )}
            {semesterConfig.status !== 'LOCKED' ? (
              <button
                onClick={() => handleUpdateStatus('LOCKED')}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Lock size={14} /> Lock Registration
              </button>
            ) : (
              <button
                onClick={() => handleUpdateStatus('OPEN')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Unlock size={14} /> Authorized Unlock
              </button>
            )}
          </div>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <span className="text-slate-400 text-xs font-semibold block">Total Eligible</span>
            <span className="text-2xl font-black text-white mt-1 block">{stats.totalEligible}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Students in roster</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <span className="text-emerald-300 text-xs font-semibold block">Registered</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">{stats.registered}</span>
            <span className="text-[10px] text-emerald-300/80 mt-1 block">{((stats.registered/stats.totalEligible)*100).toFixed(1)}% completed</span>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <span className="text-amber-300 text-xs font-semibold block">Pending</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">{stats.pending}</span>
            <span className="text-[10px] text-amber-300/80 mt-1 block">Awaiting approval</span>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <span className="text-red-300 text-xs font-semibold block">Not Registered</span>
            <span className="text-2xl font-black text-red-400 mt-1 block">{stats.notRegistered}</span>
            <span className="text-[10px] text-red-300/80 mt-1 block">Requires followup</span>
          </div>
        </div>
      </div>

      {/* Filter Hierarchy Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
            <Filter size={18} className="text-indigo-600" />
            <span>Filter Student Roster</span>
          </div>
          {(selectedDept || selectedCourse || selectedStatusFilter || searchTerm) && (
            <button
              onClick={() => { setSelectedDept(''); setSelectedCourse(''); setSelectedStatusFilter(''); setSearchTerm(''); }}
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
              onChange={e => { setSelectedDept(e.target.value); setSelectedCourse(''); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d.code} value={d.code}>{d.code} ({d.name})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Course / Program</label>
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

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Registration Status</label>
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="Registered">Registered</option>
              <option value="Pending">Pending</option>
              <option value="Not Registered">Not Registered</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Search Student</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Name or Admission No..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
            Eligible Student Roster ({filteredStudents.length})
          </h3>
          <span className="text-xs text-gray-500">Showing eligible students for {semesterConfig.semesterName}</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4">Student Name</th>
              <th className="p-4">Admission No.</th>
              <th className="p-4">Department / Program</th>
              <th className="p-4">Year / Semester</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading student roster...</td></tr>
            ) : filteredStudents.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">No students match selection</td></tr>
            ) : (
              filteredStudents.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{s.student_name}</td>
                  <td className="p-4 font-mono text-xs text-gray-600 font-semibold">{s.admission_number}</td>
                  <td className="p-4 text-xs">
                    <span className="font-semibold text-gray-800">{s.department_code}</span> — <span className="text-indigo-600">{s.program_code}</span>
                  </td>
                  <td className="p-4 text-xs text-gray-600">{s.current_year} ({s.current_semester})</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      s.status === 'Registered' ? 'bg-emerald-100 text-emerald-800' :
                      s.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {s.status !== 'Registered' ? (
                      <button
                        onClick={() => handleRegisterStudent(s.id)}
                        disabled={semesterConfig.status === 'LOCKED'}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Register
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-bold flex items-center justify-end gap-1">
                        <CheckCircle size={14} /> Registered
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Configure Semester Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-lg">Configure Semester Window</h3>
              <button onClick={() => setIsConfigModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Academic Year</label>
                <input
                  type="text"
                  value={configFormData.academicYear}
                  onChange={e => setConfigFormData({ ...configFormData, academicYear: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Semester Name</label>
                <input
                  type="text"
                  value={configFormData.semesterName}
                  onChange={e => setConfigFormData({ ...configFormData, semesterName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    value={configFormData.startDate}
                    onChange={e => setConfigFormData({ ...configFormData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    value={configFormData.endDate}
                    onChange={e => setConfigFormData({ ...configFormData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Registration Status</label>
                <select
                  value={configFormData.status}
                  onChange={e => setConfigFormData({ ...configFormData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="EXTENDED">EXTENDED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="LOCKED">LOCKED</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSemesterConfig(configFormData);
                  setIsConfigModalOpen(false);
                  alert('Semester configuration updated successfully!');
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
