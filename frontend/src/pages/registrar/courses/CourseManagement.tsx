import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  MoreVertical, 
  CheckCircle, 
  XCircle,
  Filter
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [duration, setDuration] = useState('4 Years');
  const [pattern, setPattern] = useState('Semester');
  const [intake, setIntake] = useState('120');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`*, departments ( code )`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async () => {
    if (!courseName || !courseCode) {
      alert('Please enter Course Name and Code');
      return;
    }
    
    try {
      // Very naive lookup to get a department ID from the department code for now
      // Assuming 'CSE' or 'ME' is the code
      const { data: deptData } = await supabase.from('departments').select('id').eq('code', department).single();
      const department_id = deptData ? deptData.id : null;

      const { data, error } = await supabase
        .from('courses')
        .insert([
          {
            code: courseCode,
            name: courseName,
            department_id: department_id,
            pattern: pattern,
            intake: parseInt(intake) || 0,
            duration: duration,
            status: 'Active'
          }
        ])
        .select(`*, departments ( code )`);

      if (error) throw error;

      if (data && data.length > 0) {
        setCourses([data[0], ...courses]);
        setShowCreateModal(false);
        setCourseName('');
        setCourseCode('');
      }
    } catch (error: any) {
      console.error('Error saving course:', error);
      alert(`Failed to save course: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-500 mt-1">Manage academic courses, intake limits and curriculum patterns</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add Course</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="py-3 px-4 font-medium">Course</th>
                <th className="py-3 px-4 font-medium">Code</th>
                <th className="py-3 px-4 font-medium">Department</th>
                <th className="py-3 px-4 font-medium">Details</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <BookOpen size={20} />
                      </div>
                      <span className="font-medium text-gray-900">{course.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-medium">{course.code}</td>
                  <td className="py-3 px-4 text-gray-600">{course.departments?.code || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col text-sm text-gray-500">
                      <span>{course.duration} • {course.pattern}</span>
                      <span>Intake: {course.intake}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      course.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {course.status === 'Active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {course.status}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Add New Course</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                  <input type="text" value={courseName} onChange={e => setCourseName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. B.Tech in Computer Science" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                  <input type="text" value={courseCode} onChange={e => setCourseCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. BTECH-CS" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="CSE">Computer Science (CSE)</option>
                    <option value="ME">Mechanical (ME)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="4 Years">4 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="2 Years">2 Years</option>
                    <option value="1 Year">1 Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Pattern</label>
                  <select value={pattern} onChange={e => setPattern(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="Semester">Semester</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Intake Capacity</label>
                  <input type="number" value={intake} onChange={e => setIntake(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. 120" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancel</button>
              <button onClick={handleSaveCourse} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium">Save Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
