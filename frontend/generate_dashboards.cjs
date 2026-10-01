const fs = require('fs');
const path = require('path');

const dashboards = {
    "director/DirectorDashboard.tsx": ["Director Dashboard", "High-level overview of institution performance."],
    "exam/ExamDashboard.tsx": ["Examination Dashboard", "Manage exam schedules, seating, and results."],
    "finance/FinanceDashboard.tsx": ["Finance Dashboard", "Overview of revenue, dues, and fee collection."],
    "library/LibrarianDashboard.tsx": ["Librarian Dashboard", "Library inventory and circulation summary."],
    "registrar/RegistrarDashboard.tsx": ["Registrar Dashboard", "Admissions and enrollment statistics."],
    "student/StudentDashboard.tsx": ["Student Dashboard", "Your academic progress and recent updates."]
};

const template = `import React from 'react';
import { LayoutDashboard, Users, Activity } from 'lucide-react';

export const {Component}: React.FC = () => {
    return (
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <LayoutDashboard className="text-blue-600" /> {Title}
                </h1>
                <p className="text-sm text-gray-500 mt-1">{Desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Users size={24}/></div>
                    <div><p className="text-sm text-gray-500 font-medium">Total Active</p><p className="text-2xl font-bold">1,240</p></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center"><Activity size={24}/></div>
                    <div><p className="text-sm text-gray-500 font-medium">Daily Actions</p><p className="text-2xl font-bold">84</p></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center"><LayoutDashboard size={24}/></div>
                    <div><p className="text-sm text-gray-500 font-medium">System Status</p><p className="text-2xl font-bold text-green-600">Online</p></div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                <p>Welcome to the {Title}. Use the sidebar to navigate to specific modules.</p>
            </div>
        </div>
    );
};
`;

for (const [filePath, [title, desc]] of Object.entries(dashboards)) {
    const compName = path.basename(filePath, '.tsx');
    const content = template.replace(/{Component}/g, compName).replace(/{Title}/g, title).replace(/{Desc}/g, desc);
    const fullPath = path.join(__dirname, 'src', 'pages', filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
}
