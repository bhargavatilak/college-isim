import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, CheckCircle, Clock, Eye, RefreshCw, User, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface StudentVerificationGroup {
  admissionNumber: string;
  studentName: string;
  department: string;
  course: string;
  pendingCount: number;
  verifiedCount: number;
  totalCount: number;
  latestDate: string;
}

export const DocumentVerification: React.FC = () => {
  const navigate = useNavigate();
  const [studentsGroup, setStudentsGroup] = useState<StudentVerificationGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED'>('ALL');

  const fetchVerificationQueue = async () => {
    try {
      setLoading(true);

      const { data: docsData, error: docsError } = await supabase
        .from('student_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;
      if (!docsData || docsData.length === 0) {
        setStudentsGroup([]);
        return;
      }

      // Group by student admission_number
      const admissionNumbers = [...new Set(docsData.map(d => d.admission_number))].filter(Boolean) as string[];
      const { data: studentsData } = await supabase
        .from('students')
        .select('admission_number, first_name, last_name, department_code, program_code')
        .in('admission_number', admissionNumbers);

      const studentMap = new Map<string, any>();
      studentsData?.forEach(s => studentMap.set(s.admission_number, s));

      const grouped: StudentVerificationGroup[] = admissionNumbers
        .filter(admNo => studentMap.has(admNo))
        .map(admNo => {
          const userDocs = docsData.filter(d => d.admission_number === admNo);
          const pendingCount = userDocs.filter(d => d.status === 'Pending Verification').length;
          const verifiedCount = userDocs.filter(d => d.status === 'Verified').length;
          const stu = studentMap.get(admNo);
          const latestDoc = userDocs[0];

          return {
            admissionNumber: admNo,
            studentName: `${stu.first_name || ''} ${stu.last_name || ''}`.trim() || 'Unknown Student',
            department: stu.department_code || '-',
            course: stu.program_code || '-',
            pendingCount,
            verifiedCount,
            totalCount: userDocs.length,
            latestDate: latestDoc?.created_at
              ? new Date(latestDoc.created_at).toLocaleDateString('en-IN')
              : 'N/A',
          };
        });

      setStudentsGroup(grouped);
    } catch (err) {
      console.error('Error fetching document verification queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationQueue();
  }, []);

  const filtered = studentsGroup.filter(student => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'PENDING') {
      return matchesSearch && student.pendingCount > 0;
    }
    if (statusFilter === 'VERIFIED') {
      return matchesSearch && student.pendingCount === 0 && student.verifiedCount > 0;
    }
    return matchesSearch;
  });

  const totalPendingDocs = studentsGroup.reduce((sum, s) => sum + s.pendingCount, 0);
  const totalVerifiedDocs = studentsGroup.reduce((sum, s) => sum + s.verifiedCount, 0);
  const totalDocsCount = studentsGroup.reduce((sum, s) => sum + s.totalCount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Verification</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage and verify student uploaded document queues grouped by student</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchVerificationQueue}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div
          onClick={() => setStatusFilter('ALL')}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'ALL'
              ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Documents</span>
            <FileText size={18} className="text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{totalDocsCount}</div>
          <p className="text-xs text-gray-400 mt-1">{studentsGroup.length} Students</p>
        </div>

        {/* Need Verification -> GREEN Badge */}
        <div
          onClick={() => setStatusFilter('PENDING')}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'PENDING'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-emerald-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Need Verification (Pending)</span>
            <Clock size={18} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">{totalPendingDocs}</div>
          <p className="text-xs text-emerald-600 mt-1">
            {studentsGroup.filter(s => s.pendingCount > 0).length} Students Pending
          </p>
        </div>

        {/* Verified -> BLUE Badge */}
        <div
          onClick={() => setStatusFilter('VERIFIED')}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'VERIFIED'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20'
              : 'bg-white border-blue-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Verified Documents</span>
            <CheckCircle size={18} className="text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-700">{totalVerifiedDocs}</div>
          <p className="text-xs text-blue-600 mt-1">Verified & Complete</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search student by name, admission ID, or course..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Students</option>
            <option value="PENDING">With Pending Verification</option>
            <option value="VERIFIED">Fully Verified</option>
          </select>
        </div>
      </div>

      {/* Table Grouped by Student */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Student</th>
                <th className="p-4">Admission ID</th>
                <th className="p-4">Dept / Course</th>
                <th className="p-4 text-center">Need Verification</th>
                <th className="p-4 text-center">Verified</th>
                <th className="p-4 text-center">Total Files</th>
                <th className="p-4">Last Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    Loading student document verification queues...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-semibold text-gray-800 text-base">No student records match the filter</p>
                  </td>
                </tr>
              ) : (
                filtered.map(student => (
                  <tr key={student.admissionNumber} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                          <User size={16} />
                        </div>
                        <span className="font-semibold text-gray-900">{student.studentName}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-medium text-gray-700">{student.admissionNumber}</td>
                    <td className="p-4 text-gray-600">
                      <div className="font-medium text-gray-800">{student.course}</div>
                      <div className="text-xs text-gray-400">Dept: {student.department}</div>
                    </td>
                    <td className="p-4 text-center">
                      {student.pendingCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <Clock size={12} /> {student.pendingCount} Pending
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">0</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {student.verifiedCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                          <CheckCircle size={12} /> {student.verifiedCount} Verified
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">0</span>
                      )}
                    </td>
                    <td className="p-4 text-center font-semibold text-gray-700">
                      {student.totalCount}
                    </td>
                    <td className="p-4 text-gray-600 text-xs font-mono">{student.latestDate}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate(`/registrar/verification/review/${student.admissionNumber}`)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                      >
                        <span>Review Docs</span>
                        <ChevronRight size={14} />
                      </button>
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
