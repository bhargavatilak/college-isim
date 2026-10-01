import React, { useState } from 'react';
import { FileText, Send, User, Calendar, CheckCircle, Search, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  admission_number: string;
}

export const Transfer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      
      setIsSearching(true);
      setSearchError('');
      setSelectedStudent(null);
      
      try {
          const { data, error } = await supabase
              .from('students')
              .select('id, first_name, last_name, admission_number')
              .ilike('admission_number', `%${searchQuery.trim()}%`)
              .limit(1)
              .single();
              
          if (error || !data) {
              setSearchError('Student not found. Please check the Admission Number.');
          } else {
              setSelectedStudent(data);
          }
      } catch (err) {
          setSearchError('Student not found. Please check the Admission Number.');
      } finally {
          setIsSearching(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !details) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('status_history').insert([{
        student_id: selectedStudent.id,
        action_type: 'TRANSFER',
        details: details,
        action_date: new Date().toISOString()
      }]);
      
      if (error) throw error;
      setSuccessMessage('Transfer record added successfully.');
      setSelectedStudent(null);
      setSearchQuery('');
      setDetails('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding transfer record:', err);
      alert('Failed to add transfer record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Student Transfer</h1>
          <p className="text-slate-500">Record a student transfer to another institution or branch</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl">
        <div className="p-6">
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 border border-green-200">
              <CheckCircle size={20} />
              {successMessage}
            </div>
          )}
          
          <div className="space-y-6">
            {!selectedStudent ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Find Student by Admission Number</label>
                  <form onSubmit={handleSearch} className="flex gap-2">
                      <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="e.g. 26CSAIM111"
                              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                      </div>
                      <button 
                          type="submit" 
                          disabled={isSearching}
                          className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 font-medium"
                      >
                          {isSearching ? 'Searching...' : 'Search'}
                      </button>
                  </form>
                  {searchError && <p className="text-red-500 text-sm mt-2">{searchError}</p>}
                </div>
            ) : (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Selected Student</p>
                        <p className="font-bold text-slate-900 text-lg">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                        <p className="text-sm text-slate-600 font-mono mt-0.5">{selectedStudent.admission_number}</p>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => { setSelectedStudent(null); setSearchQuery(''); }}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition"
                        title="Clear Selection"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Transfer Details / Reason</label>
                <textarea 
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="Enter details about the transfer (e.g. Transferred to XYZ College, Branch change to ECE)..."
                ></textarea>
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !selectedStudent}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                >
                  <Send size={18} />
                  {isSubmitting ? 'Recording...' : 'Record Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
