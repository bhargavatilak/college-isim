import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/auth/Login';
import { HODLayout } from './layouts/HODLayout';
import { RegistrationDashboard } from './pages/RegistrationDashboard';
import { StudentLayout } from './layouts/StudentLayout';
import { FacultyLayout } from './layouts/FacultyLayout';
import { ExaminationLayout } from './layouts/ExaminationLayout';
import { DirectorLayout } from './layouts/DirectorLayout';
import { FinanceLayout } from './layouts/FinanceLayout';
import { SectionManagement } from './pages/hod/SectionManagement';
import { ClassCoordinators } from './pages/hod/ClassCoordinators';
import { LibrarianLayout } from './layouts/LibrarianLayout';
import { RegistrarLayout } from './layouts/RegistrarLayout';
import { SmartAttendance } from './pages/faculty/SmartAttendance';
import { AdmitCard } from './pages/student/AdmitCard';
import { PaymentTerminal } from './pages/finance/PaymentTerminal';
import { Applications } from './pages/registrar/admissions/Applications';
import { ApplicationDetails } from './pages/registrar/admissions/ApplicationDetails';
import { Approval } from './pages/registrar/admissions/Approval';
import { History } from './pages/registrar/admissions/History';
import { DirectorDashboard } from './pages/director/DirectorDashboard';
import { ExamDashboard } from './pages/exam/ExamDashboard';
import { FinanceDashboard } from './pages/finance/FinanceDashboard';
import { LibrarianDashboard } from './pages/library/LibrarianDashboard';
import { RegistrarDashboard } from './pages/registrar/RegistrarDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ISBNScanner } from './pages/library/ISBNScanner';
import { HODDashboard } from './pages/hod/HODDashboard';
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { Departments } from './pages/director/Departments';
import { HODs } from './pages/director/HODs';
import { Faculty } from './pages/director/Faculty';
import { Students } from './pages/director/Students';
import { UniversityDetails } from './pages/registrar/university-affiliation/UniversityDetails';
import { EligibleStudents } from './pages/registrar/convocation/EligibleStudents';
import { Academics } from './pages/director/Academics';
import { AttendanceOverview } from './pages/director/AttendanceOverview';
import { ExaminationOverview } from './pages/director/ExaminationOverview';
import { PolicyDocuments } from './pages/director/PolicyDocuments';
import { Announcements } from './pages/director/Announcements';
import { Notifications } from './pages/director/Notifications';
import { FinanceOverview } from './pages/director/FinanceOverview';
import { LibraryOverview } from './pages/director/LibraryOverview';
import { AdmissionOverview } from './pages/director/AdmissionOverview';
import { Reports } from './pages/director/Reports';
import { Settings } from './pages/director/Settings';
import { AskAI } from './pages/director/AskAI';
import { AdmissionCellLayout } from './layouts/AdmissionCellLayout';
import { AdmissionCellDashboard } from './pages/admission-cell/Dashboard';
import { NewRegistration } from './pages/admission-cell/NewRegistration';
import { ResumeRegistration } from './pages/admission-cell/ResumeRegistration';
import { MeritSelectionDashboard } from './pages/admission-cell/MeritSelectionDashboard';
import { StudentDocuments } from './pages/registrar/documents/StudentDocuments';
import { MissingDocuments } from './pages/registrar/documents/MissingDocuments';
import { StudentIdCards } from './pages/registrar/id-cards/StudentIdCards';
import { GenerateId } from './pages/registrar/id-cards/GenerateId';
import { SemesterRecords } from './pages/registrar/academic-records/SemesterRecords';
import { AttendanceRecords } from './pages/registrar/academic-records/AttendanceRecords';
import { SemesterRegistration } from './pages/registrar/academic-registration/SemesterRegistration';
import { Directory as StudentDirectory } from './pages/registrar/students/Directory';
import { Registration as StudentRegistration } from './pages/registrar/students/Registration';
import { Profile as StudentProfile } from './pages/registrar/students/Profile';
import { Pending as PendingVerification } from './pages/registrar/verification/Pending';
import { History as VerificationHistory } from './pages/registrar/verification/History';
import { Announcements as RegistrarAnnouncements } from './pages/registrar/Announcements';
import { Notifications as RegistrarNotifications } from './pages/registrar/Notifications';
import { Settings as RegistrarSettings } from './pages/registrar/Settings';
import { Promotion } from './pages/registrar/status-movement/Promotion';
import { StatusHistory } from './pages/registrar/status-movement/StatusHistory';
import { CertificateRequests } from './pages/registrar/certificates/CertificateRequests';
import { Bonafide } from './pages/registrar/certificates/Bonafide';
import { Status } from './pages/registrar/students/Status';
import { Transfer } from './pages/registrar/students/Transfer';
import { Verified } from './pages/registrar/verification/Verified';
import { Rejected as RejectedVerification } from './pages/registrar/verification/Rejected';
import { StudentDocumentReview } from './pages/registrar/verification/StudentDocumentReview';
import { DocumentVerification } from './pages/registrar/documents/DocumentVerification';
import { Archive } from './pages/registrar/documents/Archive';
import { Replacement } from './pages/registrar/id-cards/Replacement';
import { IdHistory } from './pages/registrar/id-cards/History';
import { StudentRecord } from './pages/registrar/academic-records/StudentRecord';
import { ResultRecord } from './pages/registrar/academic-records/ResultRecord';
import { RecordHistory } from './pages/registrar/academic-records/RecordHistory';
import { CourseRegistration } from './pages/registrar/academic-registration/CourseRegistration';
import { SectionRegistration } from './pages/registrar/academic-registration/SectionRegistration';
import { RegistrationHistory } from './pages/registrar/academic-registration/RegistrationHistory';
import { YearChange } from './pages/registrar/status-movement/YearChange';
import { InternalTransfer } from './pages/registrar/status-movement/InternalTransfer';
import { Withdrawal } from './pages/registrar/status-movement/Withdrawal';
import { Readmission } from './pages/registrar/status-movement/Readmission';
import { CharacterCertificate } from './pages/registrar/certificates/CharacterCertificate';
import { TransferCertificate } from './pages/registrar/certificates/TransferCertificate';
import { MigrationCertificate } from './pages/registrar/certificates/MigrationCertificate';
import { ProvisionalCertificate } from './pages/registrar/certificates/ProvisionalCertificate';
import { Transcript } from './pages/registrar/certificates/Transcript';
import { CertificateHistory } from './pages/registrar/certificates/CertificateHistory';
import { Reports as RegistrarReports } from './pages/registrar/Reports';
import { Recovery } from './pages/registrar/Recovery';
import { AskAI as RegistrarAskAI } from './pages/registrar/AskAI';
import { DepartmentManagement } from './pages/registrar/departments/DepartmentManagement';
import { ProgramManagement } from './pages/registrar/programs/ProgramManagement';
import { Subjects } from './pages/registrar/academic-structure/Subjects';
import { AcademicYears } from './pages/registrar/academic-structure/AcademicYears';
import { Semesters } from './pages/registrar/academic-structure/Semesters';
import { Sections } from './pages/registrar/academic-structure/Sections';
import { Calendar } from './pages/registrar/academic-structure/Calendar';
import { StructureHistory } from './pages/registrar/academic-structure/StructureHistory';
import { OfficeHelpDeskLayout } from './layouts/OfficeHelpDeskLayout';
import { HelpDeskDashboard } from './pages/helpdesk/Dashboard';
import { StudentHelpRequests } from './pages/helpdesk/StudentHelpRequests';

import { FacultyDirectory } from './pages/registrar/faculty-hod/FacultyDirectory';
import { FacultyRegistration } from './pages/registrar/faculty-hod/FacultyRegistration';
import { HodManagement } from './pages/registrar/faculty-hod/HodManagement';
import { AssignHod } from './pages/registrar/faculty-hod/AssignHod';

import { WebManageLayout } from './layouts/WebManageLayout';
import { Overview as WebManageOverview } from './pages/registrar/web-manage/Overview';
import { Personal as WebManagePersonal } from './pages/registrar/web-manage/Personal';
import { Academic as WebManageAcademic } from './pages/registrar/web-manage/Academic';
import { Documents as WebManageDocuments } from './pages/registrar/web-manage/Documents';
import { Requests as WebManageRequests } from './pages/registrar/web-manage/Requests';
import { Certificates as WebManageCertificates } from './pages/registrar/web-manage/Certificates';
import { IdCard as WebManageIdCard } from './pages/registrar/web-manage/IdCard';
import { PortalMgmt as WebManagePortalMgmt } from './pages/registrar/web-manage/PortalMgmt';
import { Permissions as WebManagePermissions } from './pages/registrar/web-manage/Permissions';
import { Notifications as WebManageNotifications } from './pages/registrar/web-manage/Notifications';
import { Activity as WebManageActivity } from './pages/registrar/web-manage/Activity';
import { Audit as WebManageAudit } from './pages/registrar/web-manage/Audit';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode, requiredRole?: string }> = ({ children, requiredRole }) => {
    const { isAuthenticated, hasRole } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && !hasRole(requiredRole as any)) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const PlaceholderRoute: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-full">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-500">This module is currently under development.</p>
        </div>
    </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/director" element={<ProtectedRoute requiredRole="ROLE_DIRECTOR"><DirectorLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DirectorDashboard />} />
            <Route path="departments" element={<Departments />} />
            <Route path="hods" element={<HODs />} />
            <Route path="faculty" element={<Faculty />} />
            <Route path="students" element={<Students />} />
            <Route path="academics" element={<Academics />} />
            <Route path="attendance" element={<AttendanceOverview />} />
            <Route path="examinations" element={<ExaminationOverview />} />
            <Route path="finance" element={<FinanceOverview />} />
            <Route path="library" element={<LibraryOverview />} />
            <Route path="admission" element={<AdmissionOverview />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="ai" element={<AskAI />} />
            <Route path="policies" element={<PolicyDocuments />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="*" element={<DirectorDashboard />} />
          </Route>

          <Route path="/hod" element={<ProtectedRoute requiredRole="ROLE_HOD"><HODLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<HODDashboard />} />
            <Route path="registrations" element={<RegistrationDashboard />} />
            <Route path="sections" element={<SectionManagement />} />
            <Route path="coordinators" element={<ClassCoordinators />} />
            <Route path="*" element={<HODDashboard />} />
          </Route>

          <Route path="/student" element={<ProtectedRoute requiredRole="ROLE_STUDENT"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="admit-card" element={<AdmitCard />} />
            <Route path="*" element={<StudentDashboard />} />
          </Route>

          <Route path="/faculty" element={<ProtectedRoute requiredRole="ROLE_FACULTY"><FacultyLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<FacultyDashboard />} />
            <Route path="attendance" element={<SmartAttendance />} />
            <Route path="*" element={<FacultyDashboard />} />
          </Route>

          <Route path="/examination" element={<ProtectedRoute requiredRole="ROLE_EXAM_ADMIN"><ExaminationLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ExamDashboard />} />
            <Route path="*" element={<ExamDashboard />} />
          </Route>

          <Route path="/finance" element={<ProtectedRoute requiredRole="ROLE_FINANCE"><FinanceLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<FinanceDashboard />} />
            <Route path="payment" element={<PaymentTerminal />} />
            <Route path="*" element={<FinanceDashboard />} />
          </Route>

          <Route path="/librarian" element={<ProtectedRoute requiredRole="ROLE_LIBRARIAN"><LibrarianLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<LibrarianDashboard />} />
            <Route path="scanner" element={<ISBNScanner />} />
            <Route path="*" element={<LibrarianDashboard />} />
          </Route>

          <Route path="/registrar" element={<ProtectedRoute requiredRole="ROLE_REGISTRAR"><RegistrarLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RegistrarDashboard />} />
            
            {/* Admissions */}
            <Route path="admissions" element={<Navigate to="applications" replace />} />
            <Route path="admissions/applications" element={<Applications />} />
            <Route path="admissions/applications/:id" element={<ApplicationDetails />} />
            <Route path="admissions/approval" element={<Approval />} />
            <Route path="admissions/history" element={<History />} />
            
            {/* Student Management */}
            <Route path="students" element={<Navigate to="directory" replace />} />
            <Route path="students/directory" element={<StudentDirectory />} />
            <Route path="students/registration" element={<StudentRegistration />} />
            <Route path="students/profile/:id" element={<StudentProfile />} />
            <Route path="students/profile" element={<Navigate to="directory" replace />} />
            <Route path="students/status" element={<Status />} />
            <Route path="students/transfer" element={<Transfer />} />
            
            {/* Student Verification */}
            <Route path="verification" element={<Navigate to="pending" replace />} />
            <Route path="verification/pending" element={<PendingVerification />} />
            <Route path="verification/review/:admissionNumber" element={<StudentDocumentReview />} />
            <Route path="verification/verified" element={<Verified />} />
            <Route path="verification/rejected" element={<RejectedVerification />} />
            <Route path="verification/history" element={<VerificationHistory />} />
            
            {/* Document Management */}
            <Route path="documents" element={<Navigate to="student" replace />} />
            <Route path="documents/student" element={<StudentDocuments />} />
            <Route path="documents/verification" element={<DocumentVerification />} />
            <Route path="documents/missing" element={<MissingDocuments />} />
            <Route path="documents/archive" element={<Archive />} />
            
            {/* ID & Identity */}
            <Route path="identity" element={<Navigate to="card" replace />} />
            <Route path="identity/card" element={<StudentIdCards />} />
            <Route path="identity/bulk" element={<GenerateId />} />
            <Route path="identity/replacement" element={<Replacement />} />
            <Route path="identity/history" element={<IdHistory />} />
            
            {/* Academic Records */}
            <Route path="academic-records" element={<Navigate to="semester" replace />} />
            <Route path="academic-records/student" element={<StudentRecord />} />
            <Route path="academic-records/semester" element={<SemesterRecords />} />
            <Route path="academic-records/attendance" element={<AttendanceRecords />} />
            <Route path="academic-records/result" element={<ResultRecord />} />
            <Route path="academic-records/history" element={<RecordHistory />} />
            
            {/* Academic Registration */}
            <Route path="academic-registration" element={<Navigate to="semester" replace />} />
            <Route path="academic-registration/semester" element={<SemesterRegistration />} />
            <Route path="academic-registration/subject" element={<CourseRegistration />} />
            <Route path="academic-registration/course" element={<CourseRegistration />} />
            <Route path="academic-registration/section" element={<SectionRegistration />} />
            <Route path="academic-registration/history" element={<RegistrationHistory />} />
            
            {/* Status & Movement */}
            <Route path="movement" element={<Navigate to="promotion" replace />} />
            <Route path="movement/promotion" element={<Promotion />} />
            <Route path="movement/change" element={<YearChange />} />
            <Route path="movement/transfer" element={<InternalTransfer />} />
            <Route path="movement/withdrawal" element={<Withdrawal />} />
            <Route path="movement/readmission" element={<Readmission />} />
            <Route path="movement/history" element={<StatusHistory />} />
            
            {/* Certificates */}
            <Route path="certificates" element={<Navigate to="requests" replace />} />
            <Route path="certificates/requests" element={<CertificateRequests />} />
            <Route path="certificates/bonafide" element={<Bonafide />} />
            <Route path="certificates/character" element={<CharacterCertificate />} />
            <Route path="certificates/transfer" element={<TransferCertificate />} />
            <Route path="certificates/migration" element={<MigrationCertificate />} />
            <Route path="certificates/provisional" element={<ProvisionalCertificate />} />
            <Route path="certificates/transcript" element={<Transcript />} />
            <Route path="certificates/history" element={<CertificateHistory />} />
            
            {/* Institution Management */}
            <Route path="institution" element={<Navigate to="departments" replace />} />
            <Route path="institution/departments" element={<DepartmentManagement />} />
            <Route path="institution/programs" element={<ProgramManagement />} />
            <Route path="institution/subjects" element={<Subjects />} />
            <Route path="institution/academic-years" element={<AcademicYears />} />
            <Route path="institution/semesters" element={<Semesters />} />
            <Route path="institution/sections" element={<Sections />} />
            <Route path="institution/calendar" element={<Calendar />} />
            <Route path="institution/history" element={<StructureHistory />} />

            {/* Faculty & HOD Management */}
            <Route path="faculty-hod" element={<Navigate to="directory" replace />} />
            <Route path="faculty-hod/directory" element={<FacultyDirectory />} />
            <Route path="faculty-hod/registration" element={<FacultyRegistration />} />
            <Route path="faculty-hod/hod-management" element={<HodManagement />} />
            <Route path="faculty-hod/assign-hod" element={<AssignHod />} />

            {/* Other routes */}
            <Route path="university" element={<UniversityDetails />} />
            <Route path="convocation" element={<EligibleStudents />} />
            <Route path="reports" element={<RegistrarReports />} />
            <Route path="announcements" element={<RegistrarAnnouncements />} />
            <Route path="notifications" element={<RegistrarNotifications />} />
            <Route path="recovery" element={<Recovery />} />
            <Route path="settings" element={<RegistrarSettings />} />
            <Route path="ai" element={<RegistrarAskAI />} />

            <Route path="*" element={<RegistrarDashboard />} />
          </Route>

          <Route path="/registrar/students/web-manage/:id" element={<ProtectedRoute requiredRole="ROLE_REGISTRAR"><WebManageLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<WebManageOverview />} />
            <Route path="personal" element={<WebManagePersonal />} />
            <Route path="academic" element={<WebManageAcademic />} />
            <Route path="documents" element={<WebManageDocuments />} />
            <Route path="requests" element={<WebManageRequests />} />
            <Route path="certificates" element={<WebManageCertificates />} />
            <Route path="id-card" element={<WebManageIdCard />} />
            <Route path="portal-mgmt" element={<WebManagePortalMgmt />} />
            <Route path="permissions" element={<WebManagePermissions />} />
            <Route path="notifications" element={<WebManageNotifications />} />
            <Route path="activity" element={<WebManageActivity />} />
            <Route path="audit" element={<WebManageAudit />} />
          </Route>

          <Route path="/admission-cell" element={<ProtectedRoute requiredRole="ROLE_ADMISSION_CELL"><AdmissionCellLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdmissionCellDashboard />} />
            <Route path="new-registration" element={<NewRegistration />} />
            <Route path="resume" element={<ResumeRegistration />} />
            <Route path="merit-selection" element={<MeritSelectionDashboard />} />
            <Route path="*" element={<AdmissionCellDashboard />} />
          </Route>

          <Route path="/helpdesk" element={<ProtectedRoute requiredRole="ROLE_OFFICE_HELP_DESK"><OfficeHelpDeskLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<HelpDeskDashboard />} />
            <Route path="student-requests" element={<StudentHelpRequests />} />
            {/* Additional help desk routes would go here */}
            <Route path="*" element={<PlaceholderRoute title="Help Desk Module" />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;



