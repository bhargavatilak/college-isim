import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Download, CheckCircle, User } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const Verified = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVerified = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('student_documents')
          .select('id, admission_number, document_type, status, verified_at')
          .eq('status', 'Verified')
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
            const stu = studentMap.get(admNo);
            return {
              admissionNumber: admNo,
              studentName: `${stu.first_name} ${stu.last_name}`,
              department: stu.department_code,
              program: stu.program_code,
              verifiedCount: docs.length,
              latestDate: docs[0].verified_at
                ? new Date(docs[0].verified_at).toLocaleDateString('en-IN')
                : 'N/A',
            };
          });

        setStudents(grouped);
      } catch (err) {
        console.error('Error fetching verified:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVerified();
  }, []);

  const filtered = students.filter(s =>
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verified Students</h1>
          <p className="text-gray-500">Students with verified documents</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" /><span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Download className="w-4 h-4" /><span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or admission no..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Admission No.</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Docs Verified</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified On</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-500">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    <FileText className="w-12 h-12 mx-auto opacity-30" />
                    <p className="text-lg font-medium text-gray-900">No verified students yet</p>
                    <p className="text-sm">Documents verified for students will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(s => (
                <tr key={s.admissionNumber} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <span className="font-semibold text-gray-900">{s.studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{s.admissionNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.department}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                      {s.verifiedCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{s.latestDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/registrar/verification/review/${s.admissionNumber}`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      <CheckCircle size={14} /> View Docs
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
