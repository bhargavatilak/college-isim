import React, { useState, useEffect } from 'react';
import { Users, Plus, UserPlus, Filter } from 'lucide-react';
import api from '../../services/api';

export const SectionManagement: React.FC = () => {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const response = await api.get('/hod/sections');
            setSections(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSection = async () => {
        const year = prompt("Enter Year (e.g. 1, 2, 3, 4):");
        const name = prompt("Enter Section Name (e.g. A, B, C):");
        const coordinator = prompt("Enter Coordinator Name:");
        
        if (year && name && coordinator) {
            try {
                await api.post('/hod/sections', { year: parseInt(year), name, coordinator });
                fetchSections();
            } catch (error) {
                alert("Failed to create section");
            }
        }
    };

    return (
        <div className="p-6 bg-gray-50 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="text-blue-600" /> Section Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage department sections and assign unallocated students.</p>
                </div>
                <button 
                    onClick={handleCreateSection}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> New Section
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((sec, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                        Year {sec.year}
                                    </span>
                                    <h3 className="text-xl font-bold mt-2 text-gray-800">Section {sec.name}</h3>
                                </div>
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border">
                                    <Users size={18} className="text-gray-500" />
                                </div>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Coordinator:</span>
                                    <span className="font-medium text-gray-900">{sec.coordinator}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Total Students:</span>
                                    <span className="font-medium text-gray-900">{sec.studentCount} / 65</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full" 
                                        style={{ width: `${(sec.studentCount / 65) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                                <UserPlus size={16} /> Assign Students
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
