import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Bell, Mail, Clock, CheckCircle2, User } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const MissingDocuments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [missingDocs, setMissingDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissingDocuments();
  }, []);

  const fetchMissingDocuments = async () => {
    try {
      setLoading(true);

      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*');
      
      if (studentsError) throw studentsError;

      const { data: documents, error: docsError } = await supabase
        .from('student_documents')
        .select('*');

      if (docsError) throw docsError;

      // Primary required document list
      const requiredDocsList = [
        { key: 'photograph', label: 'Photograph' },
        { key: 'signature', label: 'Signature' },
        { key: '10th', label: '10th Marksheet' },
        { key: '12th', label: '12th Marksheet' },
        { key: 'aadhaar', label: 'Aadhaar Card' },
      ];

      const docsList = (students || []).map(student => {
        // MATCH BY admission_number
        const studentDocs = (documents || []).filter(
          d => d.admission_number && d.admission_number === student.admission_number
        );

        const uploadedTypes = studentDocs.map(d => (d.document_type || '').toLowerCase());

        // Find missing docs by matching key substring
        const missing = requiredDocsList.filter(req => {
          return !uploadedTypes.some(typeStr => {
            if (req.key === 'photograph') return typeStr.includes('photo');
            if (req.key === 'signature') return typeStr.includes('sign');
            if (req.key === '10th') return typeStr.includes('10th');
            if (req.key === '12th') return typeStr.includes('12th');
            if (req.key === 'aadhaar') return typeStr.includes('aadhaar') || typeStr.includes('aadhar') || typeStr.includes('adhar') || typeStr.includes('identity') || typeStr.includes('id');
            return typeStr.includes(req.key);
          });
        }).map(r => r.label);

        // Days pending from student admission date
        let daysPending = 1;
        if (student.created_at || student.admission_date) {
          const created = new Date(student.created_at || student.admission_date);
          const diffTime = Math.abs(new Date().getTime() - created.getTime());
          daysPending = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        return {
          id: student.id,
          name: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown',
          enrollment: student.admission_number || 'N/A',
          course: student.program_code || student.department_code || 'N/A',
          missing,
          uploadedCount: studentDocs.length,
          daysPending,
        };
      }).filter(doc => doc.missing.length > 0); // Only include students with AT LEAST ONE missing document

      setMissingDocs(docsList);
    } catch (error) {
      console.error('Error fetching missing documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = missingDocs.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.enrollment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Missing Documents</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track students with incomplete document uploads</p>
        </div>
        <button
          onClick={() => alert('Reminders sent to students with pending documents.')}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span>Remind All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-red-800 text-sm">Critical Pending (&gt; 15 Days)</h3>
            <div className="text-3xl font-extrabold text-red-700 mt-1">
              {missingDocs.filter(d => d.daysPending > 15).length}
            </div>
          </div>
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-yellow-800 text-sm font-medium">Students with Missing Docs</h3>
            <div className="text-3xl font-extrabold text-yellow-700 mt-1">{missingDocs.length}</div>
          </div>
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search student or enrollment..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Student</th>
                <th className="p-4">Admission ID</th>
                <th className="p-4">Missing Documents</th>
                <th className="p-4">Days Pending</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading missing documents list...</td></tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-3" />
                    <p className="font-bold text-gray-800 text-base">All students have uploaded their required documents!</p>
                    <p className="text-xs text-gray-400 mt-1">No missing documents detected.</p>
                  </td>
                </tr>
              ) : filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{doc.name}</div>
                    <div className="text-xs text-gray-500">{doc.course}</div>
                  </td>
                  <td className="p-4 font-mono font-medium text-gray-700">{doc.enrollment}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {doc.missing.map((m: string, i: number) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`font-semibold ${doc.daysPending > 15 ? 'text-red-600' : 'text-yellow-600'}`}>
                      {doc.daysPending} {doc.daysPending === 1 ? 'day' : 'days'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => alert(`Notification sent to ${doc.name} for missing documents.`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Notify</span>
                      </button>
                      <button
                        onClick={() => navigate(`/registrar/verification/review/${doc.enrollment}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
