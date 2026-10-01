import React, { useState, useEffect } from 'react';
import { Search, CreditCard, Printer, Check, X, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export const StudentIdCards = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [idCards, setIdCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIdCards();
  }, []);

  const fetchIdCards = async () => {
    try {
      setLoading(true);
      setError(null);
      // Querying id_cards and joined students
      const { data, error: fetchError } = await supabase
        .from('id_cards')
        .select(`
          id,
          status,
          issue_date,
          created_at,
          students (
            id,
            first_name,
            last_name,
            admission_number,
            program
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setIdCards(data || []);
    } catch (err: any) {
      console.error('Error fetching ID cards:', err);
      setError(err.message || 'Failed to load ID cards');
    } finally {
      setLoading(false);
    }
  };

  const generateCard = async (studentId: string) => {
    try {
      setError(null);
      // Example of generating a new ID card if needed (could be triggered differently)
      // Usually would check if they already have one, but for demo we just insert
      const { error: insertError } = await supabase
        .from('id_cards')
        .insert([{ student_id: studentId, status: 'PENDING' }]);
        
      if (insertError) throw insertError;
      fetchIdCards();
    } catch (err: any) {
      console.error('Error generating ID card:', err);
      setError(err.message || 'Failed to generate ID card');
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setError(null);
      const updateData: any = { status: newStatus };
      if (newStatus === 'PRINTED' || newStatus === 'Printed') {
        updateData.issue_date = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('id_cards')
        .update(updateData)
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      setIdCards(idCards.map(card => 
        card.id === id ? { ...card, ...updateData } : card
      ));
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError(err.message || 'Failed to update ID card status');
    }
  };

  const filteredCards = idCards.filter(card => {
    const searchString = `${card.students?.first_name} ${card.students?.last_name} ${card.students?.admission_number}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student ID Cards</h1>
          <p className="text-gray-500">Manage and track student identity cards</p>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <Printer className="w-4 h-4" />
          <span>Print Selected</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
          <AlertCircle className="shrink-0 w-5 h-5 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Error</h3>
            <p className="text-sm opacity-90">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between">
          <div className="relative w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search student..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-12 flex justify-center"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 w-12"><input type="checkbox" className="rounded text-indigo-600" /></th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Student</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Enrollment ID</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Course</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Issue Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.map((card) => (
                  <tr key={card.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4"><input type="checkbox" className="rounded text-indigo-600" /></td>
                    <td className="p-4 font-medium text-gray-800">{card.students?.first_name} {card.students?.last_name}</td>
                    <td className="p-4 text-gray-600">{card.students?.admission_number}</td>
                    <td className="p-4 text-gray-600">{card.students?.program || 'N/A'}</td>
                    <td className="p-4 text-gray-600">
                      {card.issue_date ? new Date(card.issue_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (card.status === 'Printed' || card.status === 'PRINTED') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {card.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {(card.status !== 'Printed' && card.status !== 'PRINTED') && (
                         <button 
                            onClick={() => updateStatus(card.id, 'PRINTED')}
                            className="mr-2 text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 font-medium"
                         >
                            Mark Printed
                         </button>
                      )}
                      <button className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Preview ID">
                        <CreditCard className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCards.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">No ID cards found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
