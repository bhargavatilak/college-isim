import React, { useState, useEffect } from 'react';
import { Search, Download, Printer, Edit } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export const Bonafide: React.FC = () => {
  const [issued, setIssued] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*');

      if (error) throw error;

      // Mock certificate data mapped to real students
      const mapped = (data || []).map((s: any, idx: number) => ({
        id: s.id,
        student: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown',
        rollNo: s.admission_number || 'N/A',
        certNo: `BON/2023/${(idx + 1).toString().padStart(3, '0')}`,
        issueDate: new Date().toISOString().split('T')[0],
        issuedBy: 'Registrar Office'
      }));
      setIssued(mapped);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const filteredIssued = issued.filter(cert =>
    cert.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bonafide Certificates</h1>
          <p className="text-gray-500 text-sm mt-1">Issue and manage Bonafide certificates</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center">
          <Edit className="h-4 w-4 mr-2" />
          Issue New Certificate
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="relative w-96">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, roll no or cert no..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssued.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-700 font-medium">{cert.student.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{cert.student}</div>
                        <div className="text-sm text-gray-500">{cert.rollNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{cert.certNo}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{cert.issueDate}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{cert.issuedBy}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button className="text-indigo-600 hover:text-indigo-900 flex items-center">
                        <Download className="h-4 w-4 mr-1" /> PDF
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 flex items-center">
                        <Printer className="h-4 w-4 mr-1" /> Print
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
