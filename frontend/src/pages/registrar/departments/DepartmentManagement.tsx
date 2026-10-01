import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  MoreVertical, 
  CheckCircle, 
  XCircle
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [faculty, setFaculty] = useState<any[]>([]);

  // Form State
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [hod, setHod] = useState('');

  useEffect(() => {
    fetchDepartments();
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*');
      if (error) throw error;
      if (data) setFaculty(data);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      alert('Failed to load departments from Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDept = async () => {
    if (!deptName || !deptCode) {
      alert('Please enter Department Name and Code');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('departments')
        .insert([
          {
            code: deptCode,
            name: deptName,
            hod: hod || 'Not Assigned',
            status: 'Active',
            faculty_count: 0,
            student_count: 0
          }
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setDepartments([data[0], ...departments]);
        setShowCreateModal(false);
        setDeptName('');
        setDeptCode('');
        setHod('');
      }
    } catch (error: any) {
      console.error('Error saving department:', error);
      alert(`Failed to save department: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-500 mt-1">Manage university departments and assign Head of Departments</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add Department</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="py-3 px-4 font-medium">Department</th>
                <th className="py-3 px-4 font-medium">Code</th>
                <th className="py-3 px-4 font-medium">Head of Department</th>
                <th className="py-3 px-4 font-medium">Stats</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departments.map(dept => (
                <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <Building2 size={20} />
                      </div>
                      <span className="font-medium text-gray-900">{dept.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-medium">{dept.code}</td>
                  <td className="py-3 px-4 text-gray-600">{dept.hod}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col text-sm text-gray-500">
                      <span>{dept.faculty_count} Faculty</span>
                      <span>{dept.student_count} Students</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      dept.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {dept.status === 'Active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {dept.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Add New Department</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input type="text" value={deptName} onChange={(e) => setDeptName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. Computer Science" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Code</label>
                <input type="text" value={deptCode} onChange={(e) => setDeptCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. CSE" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign HOD</label>
                <select value={hod} onChange={(e) => setHod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Select Faculty Member...</option>
                  {faculty.map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancel</button>
              <button onClick={handleSaveDept} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium">Save Department</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
