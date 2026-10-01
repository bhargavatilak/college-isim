import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, FileText, CheckCircle, XCircle, 
  ArrowRight, ShieldCheck, UserCheck, Building2, RefreshCw, 
  FileCheck, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalApplications: number;
  rejectedDocuments: number;
  approvedToday: number;
  totalEnrolled: number;
}

interface DeptCount {
  dept: string;
  count: number;
}

export const RegistrarDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    rejectedDocuments: 0,
    approvedToday: 0,
    totalEnrolled: 0,
  });
  const [deptCounts, setDeptCounts] = useState<DeptCount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Total Registered Students
      const { count: totalStudentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      // 2. Fetch Active Enrolled Students
      const { count: activeEnrolledCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Active');

      // 3. Fetch Rejected Documents Count
      const { count: rejectedDocsCount } = await supabase
        .from('student_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Rejected');

      // 4. Fetch Verified Documents Count
      const { count: verifiedDocsCount } = await supabase
        .from('student_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Verified');

      setStats({
        totalApplications: totalStudentsCount || 0,
        rejectedDocuments: rejectedDocsCount || 0,
        approvedToday: verifiedDocsCount || 0,
        totalEnrolled: activeEnrolledCount || 0,
      });

      // 5. Fetch Department distribution
      const { data: allStudents } = await supabase
        .from('students')
        .select('department_code');

      if (allStudents) {
        const counts: { [key: string]: number } = {};
        allStudents.forEach(s => {
          const dept = s.department_code || 'Unassigned';
          counts[dept] = (counts[dept] || 0) + 1;
        });

        const sortedDepts = Object.keys(counts).map(d => ({
          dept: d,
          count: counts[d],
        })).sort((a, b) => b.count - a.count);

        setDeptCounts(sortedDepts);
      }

    } catch (err) {
      console.error('Error fetching registrar dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <LayoutDashboard size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Registrar Dashboard</h1>
              <p className="text-slate-500 text-sm mt-0.5">Live overview of student admissions, document verifications, and academic operations</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Supabase Sync Active
          </span>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Applications */}
        <div
          onClick={() => navigate('/registrar/students/directory')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
              <FileText size={24} />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
              View All
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered Students</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{loading ? '...' : stats.totalApplications}</p>
          </div>
        </div>

        {/* Card 2: Rejected Documents */}
        <div
          onClick={() => navigate('/registrar/verification/rejected')}
          className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/50 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold">
              <XCircle size={24} />
            </div>
            <span className="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-full group-hover:bg-red-600 group-hover:text-white transition-colors">
              View Rejected
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected Documents</p>
            <p className="text-3xl font-extrabold text-red-600 mt-1">{loading ? '...' : stats.rejectedDocuments}</p>
          </div>
        </div>

        {/* Card 3: Verified Documents */}
        <div
          onClick={() => navigate('/registrar/verification/verified')}
          className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/50 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              <CheckCircle size={24} />
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              Verified Log
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Documents</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{loading ? '...' : stats.approvedToday}</p>
          </div>
        </div>

        {/* Card 4: Total Enrolled Active */}
        <div
          onClick={() => navigate('/registrar/students/directory')}
          className="bg-white p-6 rounded-2xl border border-purple-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold">
              <Users size={24} />
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors">
              Active List
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Enrolled Students</p>
            <p className="text-3xl font-extrabold text-purple-700 mt-1">{loading ? '...' : stats.totalEnrolled}</p>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers size={16} className="text-indigo-600" /> Quick Administrative Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/registrar/verification/pending')}
            className="flex items-center justify-between p-4 bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/80 rounded-xl transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-amber-600" size={20} />
              <span className="font-semibold text-slate-800 text-sm">Verify Documents</span>
            </div>
            <ArrowRight size={16} className="text-amber-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/registrar/students/directory')}
            className="flex items-center justify-between p-4 bg-blue-50/60 hover:bg-blue-100/80 border border-blue-200/80 rounded-xl transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <UserCheck className="text-blue-600" size={20} />
              <span className="font-semibold text-slate-800 text-sm">Student Directory</span>
            </div>
            <ArrowRight size={16} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/registrar/documents/student-documents')}
            className="flex items-center justify-between p-4 bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-200/80 rounded-xl transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <FileCheck className="text-indigo-600" size={20} />
              <span className="font-semibold text-slate-800 text-sm">Document Management</span>
            </div>
            <ArrowRight size={16} className="text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/registrar/institution/programs')}
            className="flex items-center justify-between p-4 bg-purple-50/60 hover:bg-purple-100/80 border border-purple-200/80 rounded-xl transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <Building2 className="text-purple-600" size={20} />
              <span className="font-semibold text-slate-800 text-sm">Program Master</span>
            </div>
            <ArrowRight size={16} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Department Enrollment Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-slate-100">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Department Enrollment Breakdown</h2>
            <p className="text-xs text-slate-400">Total active registered student count grouped by department</p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading department counts...</div>
        ) : deptCounts.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">No department data found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deptCounts.map(item => {
              const total = stats.totalApplications || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.dept} className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-800">{item.dept}</span>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {item.count} {item.count === 1 ? 'Student' : 'Students'} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
