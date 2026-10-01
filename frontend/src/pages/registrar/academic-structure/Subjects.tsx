import React, { useState, useEffect } from 'react';
import { Book, Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Subject {
    id: string;
    subject_code: string;
    subject_name: string;
    department_code: string;
    program_code: string;
    credits: number;
    semester: number;
    type: string;
    status: string;
}

export const Subjects: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [newSubject, setNewSubject] = useState<Partial<Subject>>({
        subject_code: '',
        subject_name: '',
        department_code: '',
        program_code: '',
        credits: 3,
        semester: 1,
        type: 'Core',
        status: 'Active'
    });

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('subjects').select('*');
            if (error) {
                console.error(error);
                alert('Error fetching subjects');
            } else {
                setSubjects(data || []);
            }
        } catch (err) {
            console.error(err);
            alert('Error fetching subjects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleAddSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('subjects').insert([newSubject]);
            if (error) {
                alert('Error adding subject: ' + error.message);
            } else {
                setIsAddModalOpen(false);
                setNewSubject({
                    subject_code: '',
                    subject_name: '',
                    department_code: '',
                    program_code: '',
                    credits: 3,
                    semester: 1,
                    type: 'Core',
                    status: 'Active'
                });
                fetchSubjects();
            }
        } catch (err: any) {
            alert('Error adding subject: ' + err.message);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Subjects Management</h1>
                    <p className="text-gray-500">Manage curriculum subjects across departments</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Subject</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>
                
                <table className="w-full">
                    <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 border-b">Subject Code</th>
                            <th className="px-6 py-4 border-b">Name</th>
                            <th className="px-6 py-4 border-b">Department</th>
                            <th className="px-6 py-4 border-b">Program</th>
                            <th className="px-6 py-4 border-b">Credits</th>
                            <th className="px-6 py-4 border-b">Status</th>
                            <th className="px-6 py-4 border-b text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
                        ) : subjects.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">No subjects found</td></tr>
                        ) : (
                            subjects.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.subject_code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                            <Book size={16} />
                                        </div>
                                        <span>{item.subject_name}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.department_code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.program_code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.credits}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-400 hover:text-purple-600 mr-3"><Edit2 size={16} /></button>
                                        <button className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Subject Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-900">Add New Subject</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubject} className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                                    <input 
                                        required 
                                        type="text" 
                                        value={newSubject.subject_code}
                                        onChange={e => setNewSubject({...newSubject, subject_code: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                                    <input 
                                        required 
                                        type="text" 
                                        value={newSubject.subject_name}
                                        onChange={e => setNewSubject({...newSubject, subject_name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Code</label>
                                    <input 
                                        required 
                                        type="text" 
                                        value={newSubject.department_code}
                                        onChange={e => setNewSubject({...newSubject, department_code: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Code</label>
                                    <input 
                                        required 
                                        type="text" 
                                        value={newSubject.program_code}
                                        onChange={e => setNewSubject({...newSubject, program_code: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                                    <input 
                                        required 
                                        type="number" 
                                        value={newSubject.credits}
                                        onChange={e => setNewSubject({...newSubject, credits: parseInt(e.target.value)})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                    <input 
                                        required 
                                        type="number" 
                                        value={newSubject.semester}
                                        onChange={e => setNewSubject({...newSubject, semester: parseInt(e.target.value)})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select 
                                        required
                                        value={newSubject.type}
                                        onChange={e => setNewSubject({...newSubject, type: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="Core">Core</option>
                                        <option value="Elective">Elective</option>
                                        <option value="Lab">Lab</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select 
                                        required
                                        value={newSubject.status}
                                        onChange={e => setNewSubject({...newSubject, status: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Add Subject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
