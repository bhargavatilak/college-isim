import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, FileText, User, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const History: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('student_documents')
          .select('id, admission_number, document_type, status, verified_at, created_at')
          .in('status', ['Verified', 'Rejected'])
          .order('verified_at', { ascending: false });

        if (error) throw error;
        if (!data || data.length === 0) { setStudents([]); return; }

        // Group by student
        const admissionNumbers = [...new Set(data.map(d => d.admission_number))].filter(Boolean) as string[];
        const { data: studentsData } = await supabase
          .from('students')
          .select('admission_number, first_name, last_name, department_code, program_code')
          .in('admission_number', admissionNumbers);

        const studentMap = new Map<string, any>();
        studentsData?.forEach(s => studentMap.set(s.admission_number, s));

        const grouped = admissionNumbers
          .filter(admNo => studentMap.has(admNo))
          .map(admNo => {
            const docs = data.filter(d => d.admission_number === admNo);
            const verified = docs.filter(d => d.status === 'Verified');
            const rejected = docs.filter(d => d.status === 'Rejected');
            const stu = studentMap.get(admNo);
            const latestDoc = docs[0];
            return {
              admissionNumber: admNo,
              studentName: `${stu.first_name} ${stu.last_name}`,
              department: stu.department_code,
              program: stu.program_code,
              verifiedCount: verified.length,
              rejectedCount: rejected.length,
              totalCount: docs.length,
              latestDate: latestDoc.verified_at
                ? new Date(latestDoc.verified_at).toLocaleDateString('en-IN')
                : new Date(latestDoc.created_at).toLocaleDateString('en-IN'),
            };
          });

        setStudents(grouped);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = students.filter(s =>
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalVerified = students.reduce((sum, s) => sum + s.verifiedCount, 0);
  const totalRejected = students.reduce((sum, s) => sum + s.rejectedCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verification History</h1>
          <p className="text-gray-500 text-sm mt-1">Summary of all document verification actions</p>
        </div>
        {/* Summary cards */}
        <div className="flex gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold text-green-700">{totalVerified}</div>
            <div className="text-xs text-green-600 font-medium">Total Verified</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold text-red-700">{totalRejected}</div>
            <div className="text-xs text-red-600 font-medium">Total Rejected</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-center">
            <div className="text-2xl font-bold text-blue-700">{students.length}</div>
            <div className="text-xs text-blue-600 font-medium">Students</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by student name or admission number..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          <Filter className="h-5 w-5" /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Admission No.</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span className="text-green-600">✓ Approved</span>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span className="text-red-600">✗ Rejected</span>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Action</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-500">Loading history...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <FileText className="h-10 w-10 opacity-30" />
                    <p className="font-medium text-gray-600">No verification history found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(s => (
                <tr key={s.admissionNumber} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                        <User size={15} />
                      </div>
                      <span className="font-semibold text-gray-900">{s.studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{s.admissionNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.department}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-semibold">
                      <CheckCircle size={13} /> {s.verifiedCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {s.rejectedCount > 0 ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm font-semibold">
                        <XCircle size={13} /> {s.rejectedCount}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-700">{s.totalCount}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.latestDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/registrar/verification/review/${s.admissionNumber}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 rounded-lg"
                    >
                      View <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
