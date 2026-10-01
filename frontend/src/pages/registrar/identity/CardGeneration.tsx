import React, { useState, useEffect } from 'react';
import { Download, CreditCard, Printer, Shield, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface IDCardData {
  id: string;
  name: string;
  enrollmentNo: string;
  course: string;
  bloodGroup: string;
  dob: string;
  validUntil: string;
  photoUrl: string;
}

export const CardGeneration = () => {
  const [generating, setGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [cards, setCards] = useState<IDCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const { data: students, error } = await supabase
        .from('students')
        .select('*');

      if (error) throw error;

      const cardData = (students || []).map(student => ({
        id: student.id,
        name: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown',
        enrollmentNo: student.admission_number || 'N/A',
        course: student.program || 'N/A',
        bloodGroup: student.blood_group || 'O+',
        dob: student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'N/A',
        validUntil: '2028',
        photoUrl: student.profile_picture_url || `https://ui-avatars.com/api/?name=${student.first_name}+${student.last_name}&background=random&size=150`
      }));

      setCards(cardData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAll = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setCompleted(true);
    }, 2000);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="text-blue-600" />
            ID Card Generation
          </h1>
          <p className="text-sm text-slate-500 mt-1">Preview and generate smart ID cards for approved students.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Printer size={18} />
            Print Settings
          </button>
          <button 
            onClick={handleGenerateAll}
            disabled={generating || completed || loading}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white transition-all shadow-sm ${
              completed ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-70`}
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : completed ? (
              <>
                <CheckCircle size={18} />
                Generated Successfully
              </>
            ) : (
              <>
                <Download size={18} />
                Generate All ({cards.length})
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow">
              
              {/* Front Card */}
              <div className="flex-1 p-0 border-b md:border-b-0 md:border-r border-slate-200 relative bg-gradient-to-br from-white to-slate-50">
                <div className="bg-blue-800 text-white p-3 text-center flex justify-between items-center">
                  <Shield size={20} className="opacity-80" />
                  <div className="font-bold tracking-wider text-sm">ISIM COLLEGE</div>
                  <div className="w-5"></div>
                </div>
                <div className="p-5 flex gap-4">
                  <div className="w-24 flex flex-col items-center gap-2">
                    <div className="w-20 h-24 bg-slate-200 border-2 border-slate-300 overflow-hidden shadow-sm rounded-sm">
                      <img src={card.photoUrl} alt={card.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium text-slate-600">STUDENT</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-lg text-slate-800 uppercase leading-tight">{card.name}</h3>
                    <p className="text-blue-600 font-semibold text-sm mb-2">{card.enrollmentNo}</p>
                    
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div className="flex">
                        <span className="text-slate-500 w-16">Course:</span>
                        <span className="font-medium text-slate-700 truncate">{card.course}</span>
                      </div>
                      <div className="flex">
                        <span className="text-slate-500 w-16">DOB:</span>
                        <span className="font-medium text-slate-700">{card.dob}</span>
                      </div>
                      <div className="flex">
                        <span className="text-slate-500 w-16">Blood:</span>
                        <span className="font-medium text-red-600">{card.bloodGroup}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-100 p-2 text-center text-[10px] text-slate-500 font-medium">
                  Valid until: {card.validUntil}
                </div>
              </div>

              {/* Back Card */}
              <div className="flex-1 p-5 bg-slate-100 flex flex-col justify-between relative">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-300 pb-1 mb-1">Emergency Contact</h4>
                    <p className="text-xs text-slate-700">+91 98765 43210</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-300 pb-1 mb-1">Campus Address</h4>
                    <p className="text-xs text-slate-700 leading-tight">ISIM Knowledge Park,<br/>University Road,<br/>City Campus - 400001</p>
                  </div>
                  <div>
                     <h4 className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-300 pb-1 mb-1">Instructions</h4>
                     <ul className="text-[9px] text-slate-600 list-disc pl-3 space-y-0.5">
                       <li>This card is non-transferable.</li>
                       <li>Must be worn at all times on campus.</li>
                       <li>If found, please return to the registrar office.</li>
                     </ul>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col items-center gap-1">
                  <div className="w-full h-8 bg-slate-300 flex items-center justify-center rounded overflow-hidden">
                     {/* Mock Barcode */}
                     <div className="flex gap-0.5 h-6">
                        {Array.from({ length: 40 }).map((_, i) => (
                          <div key={i} className={`h-full bg-slate-800 ${Math.random() > 0.5 ? 'w-1' : 'w-0.5'}`}></div>
                        ))}
                     </div>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono tracking-widest">{card.enrollmentNo}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
