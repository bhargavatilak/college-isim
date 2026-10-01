import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export const CertificateRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('certificate_requests')
        .select(`
          *,
          students (
            first_name,
            last_name
          )
        `)
        .order('requested_date', { ascending: false });
        
      if (error) {
        alert(`Error fetching requests: ${error.message}`);
        return;
      }
      setRequests(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (id: string) => {
    try {
      const { error } = await supabase
        .from('certificate_requests')
        .update({ 
          status: 'ISSUED', 
          issued_date: new Date().toISOString() 
        })
        .eq('id', id);
        
      if (error) throw error;
      
      setRequests(requests.map(req => 
        req.id === id 
          ? { ...req, status: 'ISSUED', issued_date: new Date().toISOString() } 
          : req
      ));
    } catch (error: any) {
      alert(`Error updating status: ${error.message}`);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('certificate_requests')
        .update({ status: 'REJECTED' })
        .eq('id', id);
        
      if (error) throw error;
      
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: 'REJECTED' } : req
      ));
    } catch (error: any) {
      alert(`Error updating status: ${error.message}`);
    }
  };

  const filteredRequests = requests.filter(record => {
    const searchString = `${record.students?.first_name} ${record.students?.last_name} ${record.admission_number}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Certificate Requests</h1>
        <p className="text-gray-500">Manage student requests for bonafide, transcripts, and migrations.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by student name or admission no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredRequests.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-700 font-medium">{record.students?.first_name?.charAt(0) || '-'}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{record.students?.first_name} {record.students?.last_name}</div>
                        <div className="text-sm text-gray-500">{record.admission_number}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{record.certificate_type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{record.purpose || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{record.requested_date ? new Date(record.requested_date).toLocaleDateString() : 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'ISSUED' ? 'bg-green-100 text-green-800' : 
                      record.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {record.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                            <button 
                                onClick={() => handleIssue(record.id)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Issue"
                            >
                                <CheckCircle size={18} />
                            </button>
                            <button 
                                onClick={() => handleReject(record.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Reject"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
