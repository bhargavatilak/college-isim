import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search } from 'lucide-react';
import axios from 'axios';

interface Course {
    id: string;
    courseCode: string;
    courseName: string;
    credits: number;
    department: string;
}

export const Academics: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    
    const [newCourse, setNewCourse] = useState({
        courseCode: '',
        courseName: '',
        credits: 3,
        department: ''
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/director/courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            // Fallback for development
            setCourses([
                { id: '1', courseCode: 'CS101', courseName: 'Introduction to Computer Science', credits: 4, department: 'Computer Science' },
                { id: '2', courseCode: 'MATH201', courseName: 'Advanced Calculus', credits: 3, department: 'Mathematics' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/director/courses', newCourse);
            setShowAddModal(false);
            fetchCourses();
        } catch (error) {
            console.error('Error adding course:', error);
            // Simulate add for development
            setCourses([...courses, { id: Date.now().toString(), ...newCourse }]);
            setShowAddModal(false);
        }
    };

    const filteredCourses = courses.filter(course => 
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Academic Management</h1>
                    <p className="text-gray-500">Manage courses and academic years</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Course</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                                <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-500">Loading...</td>
                                </tr>
                            ) : filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-500">No courses found</td>
                                </tr>
                            ) : (
                                filteredCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-6">
                                            <div className="flex items-center">
                                                <BookOpen size={16} className="text-indigo-500 mr-2" />
                                                <span className="font-medium text-gray-900">{course.courseCode}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-gray-700">{course.courseName}</td>
                                        <td className="py-3 px-6 text-gray-700">{course.department}</td>
                                        <td className="py-3 px-6 text-gray-700">{course.credits}</td>
                                        <td className="py-3 px-6 text-right">
                                            <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Course Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Course</h2>
                        <form onSubmit={handleAddCourse}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={newCourse.courseCode}
                                        onChange={(e) => setNewCourse({...newCourse, courseCode: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={newCourse.courseName}
                                        onChange={(e) => setNewCourse({...newCourse, courseName: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={newCourse.department}
                                        onChange={(e) => setNewCourse({...newCourse, department: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="6"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={newCourse.credits}
                                        onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value)})}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Save Course
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
