import React, { useState, useEffect } from 'react';
import { Search, Filter, XCircle, FileText, User, ArrowLeft, Eye, RefreshCw } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface RejectedDocItem {
  id: string;
  studentName: string;
  admissionNumber: string;
  department: string;
  course: string;
  documentType: string;
  originalFilename: string;
  filePath: string;
  rejectionReason: string;
  rejectedDate: string;
}

export const Rejected: React.FC = () => {
  const [rejectedDocs, setRejectedDocs] = useState<RejectedDocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchRejectedDocuments = async () => {
    try {
      setLoading(true);
      
      // Query all student_documents where status = 'Rejected'
      const { data: docsData, error: docsError } = await supabase
        .from('student_documents')
        .select('*')
        .eq('status', 'Rejected')
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;
      if (!docsData || docsData.length === 0) {
        setRejectedDocs([]);
        return;
      }

      // Fetch student details for admission numbers
      const admissionNumbers = [...new Set(docsData.map(d => d.admission_number))].filter(Boolean) as string[];
      const { data: studentsData } = await supabase
        .from('students')
        .select('admission_number, first_name, last_name, department_code, program_code')
        .in('admission_number', admissionNumbers);

      const studentMap = new Map<string, any>();
      studentsData?.forEach(s => studentMap.set(s.admission_number, s));

      const mapped: RejectedDocItem[] = docsData.map(doc => {
        const studentObj = studentMap.get(doc.admission_number);
        return {
          id: doc.id,
          studentName: studentObj ? `${studentObj.first_name || ''} ${studentObj.last_name || ''}`.trim() : 'Unknown Student',
          admissionNumber: doc.admission_number || '-',
          department: studentObj?.department_code || '-',
          course: studentObj?.program_code || '-',
          documentType: doc.document_type || 'Document',
          originalFilename: doc.original_filename || '-',
          filePath: doc.file_path || '',
          rejectionReason: doc.rejection_reason || doc.remarks || 'Rejected by Registrar',
          rejectedDate: doc.verified_at
            ? new Date(doc.verified_at).toLocaleDateString('en-IN')
            : new Date(doc.created_at).toLocaleDateString('en-IN'),
        };
      });

      setRejectedDocs(mapped);
    } catch (err) {
      console.error('Error fetching rejected documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedDocuments();
  }, []);

  const filtered = rejectedDocs.filter(doc =>
    doc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.rejectionReason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/registrar/overview')}
              className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <XCircle className="text-red-600" size={24} /> Rejected Documents
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">List of all student documents that were rejected during verification</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-red-50 text-red-700 px-3 py-1.5 rounded-full border border-red-200 text-xs font-bold">
            {rejectedDocs.length} Total Rejected
          </span>
          <button
            onClick={fetchRejectedDocuments}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by student name, admission number, or document type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
          <Filter className="h-4 w-4" /> Filters
        </button>
      </div>

      {/* Rejected Documents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Student Details</th>
                <th className="p-4">Admission ID</th>
                <th className="p-4">Dept / Course</th>
                <th className="p-4">Rejected Document</th>
                <th className="p-4">Rejection Reason</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Loading rejected documents...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="font-semibold text-slate-800 text-base">No rejected documents found</p>
                    <p className="text-xs text-slate-400 mt-1">All verified student documents are up to date.</p>
                  </td>
                </tr>
              ) : (
                filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-red-50/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">
                          <User size={16} />
                        </div>
                        <span className="font-semibold text-slate-900">{doc.studentName}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-700">{doc.admissionNumber}</td>
                    <td className="p-4 text-slate-600">
                      <div className="font-medium text-slate-800">{doc.course}</div>
                      <div className="text-xs text-slate-400">Dept: {doc.department}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-red-500 flex-shrink-0" />
                        <span className="font-medium text-slate-800">{doc.documentType}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-lg text-xs font-medium max-w-xs truncate">
                        {doc.rejectionReason}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-xs font-mono">{doc.rejectedDate}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate(`/registrar/verification/review/${doc.admissionNumber}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors shadow-xs"
                      >
                        <Eye size={14} /> Review Student Docs
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
