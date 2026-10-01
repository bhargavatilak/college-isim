import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, FileText, Activity, Shield, Award, Search, Key, Save } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

import { Users } from 'lucide-react';

export const Profile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [student, setStudent] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  const [totalStudents, setTotalStudents] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const fetchStudentOrStats = async () => {
      try {
        if (!id) {
            const { count, error } = await supabase.from('students').select('*', { count: 'exact', head: true });
            if (!error && count !== null) setTotalStudents(count);
            return;
        }
        const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
        if (error) throw error;
        setStudent(data);

        // Fetch this student's documents
        if (data?.admission_number) {
          const { data: docs } = await supabase
            .from('student_documents')
            .select('*')
            .eq('admission_number', data.admission_number)
            .order('created_at', { ascending: false });
          setDocuments(docs || []);
        }
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentOrStats();
  }, [id]);

  const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      
      setSearchError('');
      try {
          const { data, error } = await supabase
              .from('students')
              .select('id')
              .ilike('admission_number', `%${searchQuery.trim()}%`)
              .limit(1)
              .single();
              
          if (error || !data) {
              setSearchError('Student not found. Please check the Admission Number.');
              return;
          }
          
          navigate(`/registrar/students/profile/${data.id}`);
      } catch (err) {
          setSearchError('Student not found. Please check the Admission Number.');
      }
  };

  const toggleStatus = async () => {
      if (!student) return;
      const newStatus = student.status === 'Active' ? 'Inactive' : 'Active';
      try {
          const { error } = await supabase
              .from('students')
              .update({ status: newStatus })
              .eq('id', student.id);
          if (error) throw error;
          setStudent({ ...student, status: newStatus });
      } catch (err: any) {
          alert('Error updating status: ' + err.message);
      }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          Loading student profile...
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Users size={32} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Student Profiles</h2>
                <p className="text-gray-500 mt-1">Total registered students: <span className="font-bold text-blue-600">{totalStudents}</span></p>
            </div>
            
            <form onSubmit={handleSearch} className="max-w-md mx-auto pt-4 space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter Admission Number..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    />
                </div>
                {searchError && <p className="text-red-500 text-sm text-left">{searchError}</p>}
                <button type="submit" className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition">
                    Find Student Profile
                </button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Detailed information and academic record</p>
        </div>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Admission No."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
          <button 
            onClick={() => navigate(`/registrar/students/web-manage/${student.id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap font-medium shadow-sm"
          >
            Web Manage (Portal)
          </button>
          <button 
            onClick={() => navigate('/registrar/students/directory')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 whitespace-nowrap"
          >
            Back to Directory
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Key Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-blue-600 h-24"></div>
            <div className="px-6 pb-6 relative">
              <div className="absolute -top-12 bg-white p-1 rounded-full">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250&h=250" 
                  alt={student.first_name} 
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-sm"
                />
              </div>
              <div className="pt-16">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{student.first_name} {student.last_name}</h2>
                    <p className="text-gray-500">{student.admission_number || '-'}</p>
                  </div>
                  <button 
                    onClick={toggleStatus}
                    className={`px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider transition-colors hover:opacity-80 shadow-sm border ${
                      student.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                    }`}
                    title="Click to toggle status"
                  >
                    {student.status || 'Unknown'} (Toggle)
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 divide-y divide-gray-200">
              <div className="py-3 flex justify-between">
                <span className="text-gray-500 text-sm">Department</span>
                <span className="font-medium text-gray-900 text-sm">{student.department_code || '-'}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-gray-500 text-sm">Program</span>
                <span className="font-medium text-gray-900 text-sm">{student.program_code || '-'}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-gray-500 text-sm">Current Year</span>
                <span className="font-medium text-gray-900 text-sm">1st Year</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-gray-500 text-sm">Admission Date</span>
                <span className="font-medium text-gray-900 text-sm">{student.admission_date || '-'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-400" />
              Academic Snapshot
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">8.5</div>
                <div className="text-xs text-blue-800 uppercase tracking-wide mt-1">CGPA</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">92%</div>
                <div className="text-xs text-green-800 uppercase tracking-wide mt-1">Attendance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <User className="h-5 w-5 text-gray-400" />
              Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Email Address</div>
                  <div className="font-medium text-gray-900">{student.email || '-'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Phone Number</div>
                  <div className="font-medium text-gray-900">{student.phone || '-'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Date of Birth</div>
                  <div className="font-medium text-gray-900">{student.dob || '-'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="font-medium text-gray-900">{student.address || '-'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-400" />
                Documents & Verification
              </h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">No documents uploaded yet.</div>
              ) : (
                documents.map((doc: any) => {
                  const isVerified = doc.status === 'Verified' || doc.status === 'Verified';
                  const isRejected = doc.status === 'Rejected' || doc.status === 'Rejected';
                  return (
                    <div
                      key={doc.id}
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        isVerified ? 'border-gray-100 bg-gray-50' :
                        isRejected ? 'border-red-200 bg-red-50' :
                        'border-yellow-200 bg-yellow-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className={`h-5 w-5 ${isVerified ? 'text-gray-400' : isRejected ? 'text-red-400' : 'text-yellow-500'}`} />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{doc.document_type || doc.document_name || 'Document'}</div>
                          <div className={`text-xs font-medium ${isVerified ? 'text-green-600' : isRejected ? 'text-red-600' : 'text-yellow-600'}`}>
                            {isVerified ? 'Verified' : isRejected ? 'Rejected' : doc.status || 'Pending Review'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          if (doc.file_path) {
                            const { data: signedUrl } = await supabase.storage.from('student_documents').createSignedUrl(doc.file_path, 60);
                            if (signedUrl?.signedUrl) window.open(signedUrl.signedUrl, '_blank');
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <Key className="h-5 w-5 text-gray-400" />
              Account Security
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Student Login Password</div>
                {password ? (
                  <div className="font-medium text-gray-900 mt-1">••••••••</div>
                ) : (
                  <div className="text-sm text-red-500 mt-1">No password set</div>
                )}
              </div>
              <div>
                {isEditingPassword ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      onClick={() => { setPassword(newPassword); setIsEditingPassword(false); }}
                      className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditingPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {password ? 'Reset Password' : 'Set Password'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
