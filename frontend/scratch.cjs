const fs = require('fs');
const path = require('path');

const components = [
    ['src/pages/registrar/students/Status.tsx', 'Status', 'Student Status', 'student status records'],
    ['src/pages/registrar/students/Transfer.tsx', 'Transfer', 'Student Transfer', 'student transfer requests'],
    ['src/pages/registrar/verification/Verified.tsx', 'Verified', 'Verified Students', 'verified student records'],
    ['src/pages/registrar/documents/DocumentVerification.tsx', 'DocumentVerification', 'Document Verification', 'document verification queues'],
    ['src/pages/registrar/documents/Archive.tsx', 'Archive', 'Document Archive', 'archived documents'],
    ['src/pages/registrar/id-cards/Replacement.tsx', 'Replacement', 'ID Card Replacement', 'ID card replacement requests'],
    ['src/pages/registrar/id-cards/History.tsx', 'IdHistory', 'ID Generation History', 'ID generation history logs'],
    ['src/pages/registrar/academic-records/StudentRecord.tsx', 'StudentRecord', 'Student Academic Record', 'student academic records'],
    ['src/pages/registrar/academic-records/ResultRecord.tsx', 'ResultRecord', 'Result Record', 'student result records'],
    ['src/pages/registrar/academic-records/RecordHistory.tsx', 'RecordHistory', 'Academic Record History', 'academic record history'],
    ['src/pages/registrar/academic-registration/CourseRegistration.tsx', 'CourseRegistration', 'Course Registration', 'course registration data'],
    ['src/pages/registrar/academic-registration/SectionRegistration.tsx', 'SectionRegistration', 'Section Registration', 'section registration data'],
    ['src/pages/registrar/academic-registration/RegistrationHistory.tsx', 'RegistrationHistory', 'Registration History', 'registration history'],
    ['src/pages/registrar/status-movement/YearChange.tsx', 'YearChange', 'Year/Semester Change', 'year and semester changes'],
    ['src/pages/registrar/status-movement/InternalTransfer.tsx', 'InternalTransfer', 'Internal Transfer', 'internal transfers'],
    ['src/pages/registrar/status-movement/Withdrawal.tsx', 'Withdrawal', 'Student Withdrawal', 'student withdrawals'],
    ['src/pages/registrar/status-movement/Readmission.tsx', 'Readmission', 'Student Re-admission', 'student re-admissions'],
    ['src/pages/registrar/certificates/CharacterCertificate.tsx', 'CharacterCertificate', 'Character Certificate', 'character certificate requests'],
    ['src/pages/registrar/certificates/TransferCertificate.tsx', 'TransferCertificate', 'Transfer Certificate', 'transfer certificate requests'],
    ['src/pages/registrar/certificates/MigrationCertificate.tsx', 'MigrationCertificate', 'Migration Certificate', 'migration certificate requests'],
    ['src/pages/registrar/certificates/ProvisionalCertificate.tsx', 'ProvisionalCertificate', 'Provisional Certificate', 'provisional certificate requests'],
    ['src/pages/registrar/certificates/Transcript.tsx', 'Transcript', 'Transcript', 'transcript requests'],
    ['src/pages/registrar/certificates/CertificateHistory.tsx', 'CertificateHistory', 'Certificate History', 'certificate issuance history'],
    ['src/pages/registrar/Reports.tsx', 'Reports', 'Reports & Analytics', 'reports and analytics'],
    ['src/pages/registrar/Recovery.tsx', 'Recovery', 'Account Recovery', 'account recovery requests'],
    ['src/pages/registrar/AskAI.tsx', 'AskAI', 'AI Assistant', 'AI assistant conversations']
];

const template = (name, title, desc) => `import React from 'react';
import { FileText, Search, Filter, Download } from 'lucide-react';

export const ${name} = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">${title}</h1>
          <p className="text-gray-500">Manage and view ${desc}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="p-8 text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-1">No data available yet</p>
          <p className="text-sm">Data for ${desc} will appear here.</p>
        </div>
      </div>
    </div>
  );
};
`;

for (const [filepath, name, title, desc] of components) {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, template(name, title, desc));
    console.log('Created ' + filepath);
}
