import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, ChevronRight, FileText, User } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface StudentPending {
  admissionNumber: string;
  studentName: string;
  pendingCount: number;
  latestDate: string;
}

export const Pending: React.FC = () => {
  const [students, setStudents] = useState<StudentPending[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchPending = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('student_documents')
        .select('id, admission_number, document_type, created_at, status')
        .eq('status', 'Pending Verification')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) { setStudents([]); return; }

      // Group by student
      const admissionNumbers = [...new Set(data.map(d => d.admission_number))].filter(Boolean);
      const { data: studentsData } = await supabase
        .from('students')
        .select('admission_number, first_name, last_name')
        .in('admission_number', admissionNumbers);

      const studentMap = new Map<string, string>();
      studentsData?.forEach(s => {
        studentMap.set(s.admission_number, `${s.first_name} ${s.last_name}`);
      });

      const grouped = admissionNumbers
        .filter(admNo => studentMap.has(admNo)) // Only show students that exist in students table
        .map(admNo => {
          const docs = data.filter(d => d.admission_number === admNo);
          return {
            admissionNumber: admNo,
            studentName: studentMap.get(admNo)!,
            pendingCount: docs.length,
            latestDate: new Date(docs[0].created_at).toLocaleDateString('en-IN'),
          };
        });

      setStudents(grouped);
    } catch (err) {
      console.error('Error fetching pending:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const filtered = students.filter(s =>
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDocs = students.reduce((sum, s) => sum + s.pendingCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Verification</h1>
          <p className="text-gray-500 text-sm mt-1">Review and verify student documents</p>
        </div>
        <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg border border-yellow-200 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">{totalDocs} documents pending from {students.length} students</span>
        </div>
      </div>

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
          <Filter className="h-5 w-5" />
          Filters
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Admission No.</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Documents</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Submitted</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <FileText className="h-10 w-10" />
                    <p className="font-medium">All caught up! No pending verifications.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(student => (
                <tr key={student.admissionNumber} className="hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/registrar/verification/review/${student.admissionNumber}`)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                        <User size={16} />
                      </div>
                      <span className="font-semibold text-gray-900">{student.studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{student.admissionNumber}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 font-bold text-sm">
                      {student.pendingCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.latestDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/registrar/verification/review/${student.admissionNumber}`)}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Review Documents <ChevronRight size={16} />
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
